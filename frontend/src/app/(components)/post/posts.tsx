
'use client';
import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'

const AllPosts = () => {
    const { data, isLoading, error, status } = useQuery({
        queryKey: 'posts',
        queryFn: async () => {
            const res = await axios.get('http://localhost:5000/posts')
            console.log(res.data.posts)
            return res.data.posts
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
        <div>
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