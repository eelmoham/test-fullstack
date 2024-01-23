
'use client';
import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation';

const AllPosts = () => {
    const router = useRouter()
    const { data, isLoading, error, status } = useQuery({
        queryKey: 'posts',
        queryFn: async () => {
           return await axios.get('http://localhost:5000/posts')
                .then(res => {
                    console.log(res.data.posts)
                    return res.data.posts
                })
                .catch(err => {
                    if (err.response.status === 403)
                        router.push('/')
                    else
                    console.log(err)
                })
        }
    })

    if (error) {
        return <div>There was an error</div>
    }
    useEffect(() => {

    }
    ), [data]
    if (!data || isLoading)
        return <div className=' w-full flex m-auto justify-center items-center'>Loading...</div>
    return (
        <div className='w-full flex flex-col'>
            <div>
                {
                    data && data.length === 0 ? <h1 className='text-center text-2xl font-bold'>No Posts</h1>: <h1 className='text-center text-2xl font-bold'>All Posts</h1>
                }
            </div>
            {
                data && data.map((post: any, index: number) => {
                    return (
                        <div key={index} className="flex gap-2 justify-center items-center">
                            <h1 className=' text-red-500'>{post.username} : </h1>
                            <h1 className=' font-bold'>{post.post}</h1>
                        </div>
                    )
                })
            }
        </div>
    )

}

export default AllPosts