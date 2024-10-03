import { Button, TextInput, Toast, Modal } from "flowbite-react"
import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { ref, getDownloadURL, getStorage, uploadBytesResumable } from 'firebase/storage'
import { HiX, HiCheck, HiOutlineExclamationCircle } from "react-icons/hi"
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';
import { 
    updateStart, 
    updateSuccess, 
    updateFailure, 
    deleteUserStart,
    deleteUserSuccess, 
    deleteUserFailure, 
    signOutSuccess,  
} from "../redux/user/userSlice"
import { useDispatch } from "react-redux"

export default function DashProfile() {
    const { currentUser, error, loading } = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({})
    const filePickerRef = useRef();
    const navigate = useNavigate()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if(file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }   
    }

    useEffect(() => {
        if(imageFile) {
            uploadImage()
        }
    }, [imageFile])

    const uploadImage = async () => {
        setImageFileUploadError(null)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = 
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageFileUploadProgress(progress.toFixed(0))
            },
            (error) => {
                setImageFileUploadError('Could not upload image (File must be less than 2MB')
                setImageFileUploadProgress(null)
                setImageFileUrl(null)

            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)  => {
                    setImageFileUrl(downloadUrl)
                    setFormData({ ...formData, profilePicture: downloadUrl })
                    setImageFileUploading(false)
                })
            },
        )
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if (Object.keys(formData).length === 0) {
          setUpdateUserError('No changes made');
          return;
        }
        if (imageFileUploading) {
          setUpdateUserError('Please wait for image to upload');
          return;
        }
        try {
          dispatch(updateStart());
          const res = await fetch(`/api/user/update/${currentUser._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (!res.ok) {
            dispatch(updateFailure(data.message));
            setUpdateUserError(data.message);
          } else {
            dispatch(updateSuccess(data));
            setUpdateUserSuccess("User's profile updated successfully");
          }
        } catch (error) {
          dispatch(updateFailure(error.message));
          setUpdateUserError(error.message);
          console.log(error.message)
        }
      };

      const handleDeleteUser = async () => {
        setShowModal(false);
        try {
          dispatch(deleteUserStart());
          const res = await fetch(`/api/user/delete/${currentUser._id}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (!res.ok) {
            dispatch(deleteUserFailure(data.message));
          } else {
            dispatch(deleteUserSuccess(data));
            await handleSignout();
          }
        } catch (error) {
          dispatch(deleteUserFailure(error.message));
        }
      };

      const handleSignout = async () => {
        try {
          const res = await fetch('/api/user/signout', {
            method: 'POST',
          });
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
          } else {
            dispatch(signOutSuccess());
            navigate('/');
          }
        } catch (error) {
          console.log(error.message);
        }
      };

    return (
        <div className="max-w-lg mt-10 mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    ref={filePickerRef}
                    hidden
                />
                <div
                className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
                onClick={() => filePickerRef.current.click()}
                >
                    {imageFileUploadProgress && (
                        <CircularProgressbar
                            value={imageFileUploadProgress || 0}
                            text={`${imageFileUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgba(62, 152, 199, ${
                                        imageFileUploadProgress / 100
                                    })`,
                                },
                            }}
                        />
                    )}
                    <img
                        src={imageFileUrl || currentUser.profilePicture}
                        alt='user'
                        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                        imageFileUploadProgress &&
                        imageFileUploadProgress < 100 &&
                        'opacity-60'
                        }`}
                    />
                </div>
                <TextInput 
                    type="text" 
                    id="username" 
                    placeholder="Username" 
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <TextInput 
                    type="email" 
                    id="email" 
                    placeholder="email" 
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput 
                    type="password" 
                    id="password" 
                    placeholder="Password" 
                    onChange={handleChange}
                />
                {imageFileUploadError && (
                    <Toast>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                            <HiX className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">{imageFileUploadError}</div>
                        <Toast.Toggle />
                    </Toast>
                )}
                
                {updateUserError && (
                    <Toast>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                            <HiX className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">{updateUserError}</div>
                        <Toast.Toggle />
                    </Toast>
                )}

                { updateUserSuccess && (
                    <Toast>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                            <HiCheck className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">{updateUserSuccess}</div>
                        <Toast.Toggle />
                    </Toast>
                )}
                <Button 
                    type="submit" 
                    gradientDuoTone={'purpleToBlue'} 
                    outline 
                    disabled={loading || imageFileUploading}
                >
                    {loading ? 'Loading' : 'Update'}
                </Button>
                {currentUser.isAdmin && (
                    <Link to={'/create-post'}>
                        <Button
                        type='button'
                        gradientDuoTone='purpleToPink'
                        className='w-full'
                        >
                            Create a post
                        </Button>
                    </Link>
                )}
            </form>
            <div className="text-red-500 mt-5 self-center">
                <span onClick={() => setShowModal(true)} className="cursor-pointer">Delete Account</span>
            </div>
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
            >
            <Modal.Header />
            <Modal.Body>
                <div className='text-center'>
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                        Are you sure you want to delete your account?
                    </h3>
                    <div className='flex justify-center gap-4'>
                        <Button color='failure' onClick={handleDeleteUser}>
                            Yes, I'm sure
                        </Button>
                        <Button color='gray' onClick={() => setShowModal(false)}>
                            No, cancel
                        </Button>
                    </div>
                </div>
            </Modal.Body>
            </Modal>
        </div>
    )
}
