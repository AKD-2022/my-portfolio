'use client';

import React from 'react';
import Image from 'next/image';
import { navlinks } from '@/constants/constant';
import Link from 'next/link';
import { HiBars3BottomRight } from 'react-icons/hi2';
import { useState, useEffect } from 'react';
import { BaseInfo } from '@/Data/data';

//define prop types
type Props ={
    openNav:()=>void;
}

const Nav = ({openNav}:Props) => {

    const [navBg, setNavBg] = useState(false);

    useEffect(()=>{
     const Handler =() =>{
        if(window.scrollY >=90){
            setNavBg(true);
        }
        if(window.scrollY < 90){
            setNavBg(false);
        }
     };
     window.addEventListener("scroll", Handler)
     return() =>{
        window.removeEventListener("scroll", Handler);
     };
    },[])

    return  <div className={`fixed ${navBg ? 'bg-[#240b39]': 'fixed'} h-[12vh]  w-full transitio-all duration-200 z-50`}>
        <div className='flex items-center h-full justify-between w-[95%] sm:w-[90%] xl:w-[80%] mx-auto'>
            {/*Logo */}
            <h1 className=' text-white  sm:ml-0 text-1xl md:text-1xl lg:text-4xl mb-1 font-semibold'>
                        {BaseInfo.name}
                       </h1> 
            <div className='flex items-center space-x-10'>
               <div  className='hidden lg:flex items-center space-x-8'>
               {navlinks.map((navLink)=>{
                    return(
                        <Link key={navLink.id} href={navLink.url}>
                            <p className ="nav_link">{navLink.label}</p>
                        </Link>
                    )
                })}
               </div>
            {/* Buttons */}
            <div  className='flex items-center space-x-4'>
                <Link href='#contact'>
                <button className='md:px md:py-3 px-8 py-3 text-blue-800 font-semibold sm:text-base text-sm bg-white
                hover:bg-gray-200 tansition-all duration-200 rounded-lg'>
                    Hire Me
                </button>
                </Link>
                {/*Burger menu*/}
                <HiBars3BottomRight onClick={openNav} className='w-8 h-8 cursor-pointer text-white lg:hidden' />
            </div>
            </div>
        </div>
    </div>

}
export default Nav;