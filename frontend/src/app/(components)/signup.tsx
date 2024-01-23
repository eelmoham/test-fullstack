'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Input from './tools/Input';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Signup = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confpassword, setconfPassword] = useState('');
    const [error, setError] = useState('');
    const [load, setLoad] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const router = useRouter();
    const signup = async () => {
        setLoad(true);
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post('http://localhost:5000/signup', { username: userName, email, password });

            if (res.data.error) {
                setError(res.data.error);
                setLoad(false);
            } else {
                setShowLogin(true);
                setLoad(false);
                router.push('/post');
            }
        } catch (error) {
            // Handle errors from the request
            console.error('Signup failed:');
            setLoad(false);
        }
    };
    return (
        <div className='my-5 px-10'>
            <form className='flex flex-col w-full items-center '>
                <div className='w-[85%] lg:w-1/2 '>
                    <h1 className='w-full text-center text-xl py-1'>TIME TO JOIN US</h1>
                </div>

                <div className='w-[100%] m-3'>
                    <Input defaultValue={userName} disabled={showLogin} tabIndex={6} type="text" id="NAME_signup" placeholder="NAME" seter={setUserName} />
                </div>
                <div className='w-[100%] m-3'>
                    <Input defaultValue={email} disabled={showLogin} tabIndex={7} type="text" id="EMAIL_signup" placeholder="EMAIL" seter={setEmail} />
                </div>
                <div className='w-[100%] m-3 flex gap-2'>
                    <Input defaultValue={password} disabled={showLogin} tabIndex={8} type="password" id="PASSWORD_signup" placeholder="PASSWORD" seter={setPassword} />
                    <Input defaultValue={confpassword} disabled={showLogin} tabIndex={9} type="password" id="PASSWORD_signup2" placeholder="CONF PASSWORD" seter={setconfPassword} />
                </div>
                {error && <div className=' text-red-500 h-6'>{error}</div>}
            </form>
            <button
                disabled={showLogin}
                tabIndex={10}
                onClick={() => {
                    if (!email || !password || !userName || !confpassword)
                        setError('email or password is empty');
                    // else if (password !== confpassword)
                    //     setError('password and conf password are not the same');
                    else
                        signup();
                }}
                className=' cursor-pointer my-3  flex items-center  w-[100%] justify-center bg-white py-3'>
                <div className='text-black font-bold text-sm px-2 py-1 flex gap-2'>
                    REGISTER
                    {
                        load ?
                            <div className=' animate-spin duration-75'>
                                <Image unoptimized width={20} height={20} alt='arrow' src='/load.svg' />
                            </div>
                            :
                            <div></div>
                    }
                </div>
            </button>
        </div>
    )
}
export default Signup;