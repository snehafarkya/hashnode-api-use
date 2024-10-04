"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { IoIosBowtie } from "react-icons/io";
// Define interfaces for the data structure
interface CoverImage {
  url: string;
}

interface BlogPost {
  title: string;
  brief: string;
  url: string;
  featured?: boolean; // Added featured property
  coverImage?: CoverImage; // Optional since it might not be present
}

interface PostsResponse {
  edges: {
    node: BlogPost;
  }[];
}

interface PublicationResponse {
  publication: {
    isTeam: boolean;
    title: string;
    posts: PostsResponse;
  };
}

interface GraphQLResponse {
  data: PublicationResponse;
}

const Home: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string>('');
  const [username, setUsername] = useState<string>(''); // State for the username input
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSearched, setIsSearched] = useState<boolean>(false); // New state to track search initiation
  const postsPerPage = 5; // Number of posts to display per page

  const fetchBlogs = async () => {
    if (username.trim() === '') {
      // If the username is empty, clear the blogs and error
      setBlogs([]);
      setError('');
      setIsSearched(false); // Reset search state
      return;
    }

    const query = `
      query {
        publication(host: "${username}") {
          isTeam
          title
          posts(first: 10) {
            edges {
              node {
                title
                brief
                url
                featured
                coverImage {
                  url
                }
              }
            }
          }
        }
      }
    `;

    const url = 'https://gql.hashnode.com/';

    try {
      const response = await axios.post<GraphQLResponse>(
        url,
        { query: query },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Log the response to debug
      console.log(response.data);

      // Check if data exists and map to the fetched blogs
      if (response.data.data && response.data.data.publication) {
        const fetchedBlogs = response.data.data.publication.posts.edges.map(edge => edge.node);
        
        // Sort blogs: featured first
        const sortedBlogs = fetchedBlogs.sort((a, b) => {
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        });

        setBlogs(sortedBlogs);
        setError(''); // Clear error if successful
        setIsSearched(true); // Mark as searched
      } else {
        setBlogs([]); // Clear blogs if no data found
        setError('No data found for this hostname. Please check the host url.');
        setIsSearched(true); // Mark as searched
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Error fetching blogs. Please check the username and try again.');
      setIsSearched(true); // Mark as searched
    }
  };

  // Calculate the current posts to display
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogs.slice(indexOfFirstPost, indexOfLastPost);

  // Calculate total pages
  const totalPages = Math.ceil(blogs.length / postsPerPage);
  
  return (
    <div className="flex justify-center flex-col items-center relative justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        
        <div className='flex flex-col justify-center gap-8 items-center '>
          <h1 className='text-3xl font-bold uppercase text-center text-white drop-shadow-lg'>Find Hashnode blogs of any host url.</h1>
 
          <input
            type="text"
            placeholder="Enter Hashnode host url"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='border-2 border-yellow-950 text-yellow-900 p-2 rounded-md'
          />
          <p className='text-gray-300'>Example: snehafarkya.hashnode.dev</p>
          <button 
            onClick={() => {
              setCurrentPage(1); // Reset to page 1 on new search
              fetchBlogs(); // Fetch blogs when button is clicked
            }} 
            className="mt-2 px-4 py-2 bg-yellow-950 hover:bg-yellow-900 text-white rounded shadow-sm"
          >
            Search
          </button>

          {/* Error Message Display */}
          {error && <p className="text-white">{error}</p>}

          <div className='flex md:flex-row flex-col flex-wrap gap-6 justify-center items-center md:mx-24'>
            {currentPosts.map((blog, index) => (
              <a href={blog.url} key={index} target="_blank" rel="noopener noreferrer">
                <div className="h-auto rounded-lg shadow-lg bg-yellow-950 md:w-[360px] flex flex-wrap gap-2 justify-normal items-start relative">
                {blog.featured && (
                    <div className="absolute top-0 right-0 bg-pink-600 text-white text-xs font-semibold py-1 px-2 rounded-bl-lg">
                      
                      <IoIosBowtie size={18} className='-top-[7px] absolute -right-[7px] rotate-45 z-20' /> Featured Blog
                    </div>
                  )}
                  {blog.coverImage?.url ? (
                    <img
                      src={blog.coverImage.url}
                      alt={blog.title}
                      className='rounded-t-lg h-[200px] w-[400px] object-cover '
                    />
                  ) : (
                    <img 
                      className="h-[200px] rounded-t-lg object-cover bg-gray-300 w-[400px]" 
                      src='https://i.seadn.io/gae/OGpebYaykwlc8Tbk-oGxtxuv8HysLYKqw-FurtYql2UBd_q_-ENAwDY82PkbNB68aTkCINn6tOhpA8pF5SAewC2auZ_44Q77PcOo870?auto=format&dpr=1&w=1000' 
                      alt='dummy'
                    />
                  )}
                  <div className="p-4 flex flex-col gap-2 ">
                    <h2 className='text-xl line-clamp-1 text-ellipsis font-bold'>{blog.title}</h2> 
                    <p className='text-gray-300 text-sm text-ellipsis line-clamp-3'>{blog.brief}</p>
                    <a href={blog.url} target="_blank" rel="noopener noreferrer" className='hover:underline hover:text-yellow-500'>Read more</a>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Pagination Controls: Only show if search has been initiated and if pagination is required */}
          {isSearched && blogs.length > postsPerPage && (
            <div className="flex justify-center items-center mt-4">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-4 py-2 bg-yellow-950 disabled:cursor-not-allowed hover:bg-yellow-900 text-white rounded disabled:bg-gray-700 shadow-sm"
              >
                Previous
              </button>
              <span className="mx-4">{`Page ${currentPage} of ${totalPages}`}</span>
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 bg-yellow-950 disabled:cursor-not-allowed hover:bg-yellow-900 text-white rounded disabled:bg-gray-700 shadow-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
      <footer>
        <div className="  bottom-0 md:left-[45%]  left-24 absolute pb-6 ">
          <p className="text-gray-200 text-sm ">Made with 🤎 by Sneha Farkya </p>
           <p className="text-gray-300 text-sm text-center"> Copyright 2024</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
