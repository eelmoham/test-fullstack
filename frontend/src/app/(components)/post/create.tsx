'use client';
import axios from "axios"
import React, { useState } from 'react'
import { QueryClient, useQuery, useQueryClient } from 'react-query'
const CreatePost = () => {
    const [content, setContent] = useState('')
    const client = useQueryClient();
    const addPOst = async () => {
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:5000/create-post', { post: content })
            .then(res => {
                console.log(res)
                client.invalidateQueries('posts')
            }
            )
    }


    return (
        <div className="flex justify-center items-center w-full h-full">

            <div className="m-auto flex flex-col justify-center items-center">
                <div className="form-group flex flex-col gap-2 ">
                    <label htmlFor="content">write youre post here:</label>
                    <textarea id="w3review" name="w3review" value={content} onChange={e => setContent(e.target.value)} className="form-control text-black h-20" />
                </div>
                <button
                    onClick={addPOst}
                    className="">Create</button>
            </div>
        </div>
    )
}

export default CreatePost
