import { Sidebar } from 'flowbite-react'
import { 
    IoPeopleOutline, 
    IoPersonOutline, 
    IoExitOutline, 
    IoCreateOutline, 
    IoDocumentOutline,
    IoChatboxEllipsesOutline,
    IoAnalyticsOutline 
} from "react-icons/io5";
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { signOutSuccess } from '../redux/user/userSlice'

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search])

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
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className='mt-10 pt-3 w-full md:w-56'>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
            {currentUser && currentUser.isAdmin && (
              <Link to='/dashboard?tab=dash'>
                <Sidebar.Item
                  active={tab === 'dash' || !tab}
                  icon={IoAnalyticsOutline }
                  as='div'
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
            )}
            <Link to='/dashboard?tab=profile'>
                <Sidebar.Item active={tab === 'profile'} icon={IoPersonOutline} label={currentUser.isAdmin ? 'Admin' : "User"} labelColor="dark" as='div'>
                    Profile
                </Sidebar.Item>
            </Link>
            { currentUser.isAdmin && (
                <Link to='/create-post'>
                    <Sidebar.Item 
                      icon={IoCreateOutline} 
                      labelColor="dark" 
                      as='div'
                    >
                      Create Post
                    </Sidebar.Item>
                </Link>
            )}
            { currentUser.isAdmin && (
                <Link to='/dashboard?tab=posts'>
                    <Sidebar.Item 
                      active={tab === 'posts'}
                      icon={IoDocumentOutline} 
                      labelColor="dark" 
                      as='div'
                    >
                      Posts
                    </Sidebar.Item>
                </Link>
            )}
            { currentUser.isAdmin && (
                <>
                  <Link to='/dashboard?tab=users'>
                      <Sidebar.Item icon={IoPeopleOutline} labelColor="dark" as='div'>
                        Users
                      </Sidebar.Item>
                  </Link>
                  <Link to='/dashboard?tab=comments'>
                  <Sidebar.Item
                    active={tab === 'comments'}
                    icon={IoChatboxEllipsesOutline }
                    as='div'
                  >
                    Comments
                  </Sidebar.Item>
                </Link>
              </>
            )}
            <Sidebar.Item 
              icon={IoExitOutline} 
              cursor="pointer"
              onClick={handleSignout}
            >
                Sign Out
            </Sidebar.Item>
        </Sidebar.ItemGroup>
    </Sidebar>
  )
}
