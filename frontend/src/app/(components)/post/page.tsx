'use client';
import React from 'react';
import CreatePost from './create';
import AllPosts from './posts';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();
const Post = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <div className=' w-full h-full flex flex-col gap-2'>
                <AllPosts />
                <CreatePost />
            </div>
        </QueryClientProvider>
    );
}

export default Post;