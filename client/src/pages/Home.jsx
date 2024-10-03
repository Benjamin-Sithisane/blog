import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className='flex items-center gap-6 p-28 px-23 max-w-6xl min-h-bigo'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-3xl font-bold lg:text-6xl mb-3'>Welcome to my Blog</h1>
          <p className='text-gray-500 text-xs sm:text-sm mb-2'>
            Posuere consectetur proin convallis ad lacus dictum nascetur nostra. 
            Purus metus maximus massa ut; ligula condimentum pretium elit. Pulvinar 
            dictum hendrerit convallis ac sed amet? Lacus ullamcorper fusce; facilisi 
            ultricies velit ligula sociosqu. Laoreet molestie praesent nostra et conubia 
            cras primis. Vel velit penatibus conubia libero parturient donec aliquet lorem. 
            Ac viverra nam elementum gravida eleifend odio accumsan vel. Platea ad aliquam 
            pharetra libero gravida ex.
          </p>
          <Link
            to='/search'
            className='text-xs sm:text-sm text-blue-600 dark:text-gray-400 font-bold hover:underline a'
          >
            View all posts
          </Link>
        </div>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-blue-600 dark:text-gray-400 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}