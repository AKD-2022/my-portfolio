"use client";
import React from 'react';
import Nav from '@/components/Helper/Home/NavBar/Nav';
import MobileNav from '@/components/Helper/Home/NavBar/MobileNav';
import { useState } from 'react';

const ResponsiveNav = () => {

const [showNav, setShowNav] = useState(false);

const showNavHandler = () => setShowNav(true);
const closeNavHandler = () => setShowNav(false);



    return <div>
    <Nav openNav={showNavHandler} />
    <MobileNav showNav={showNav} closeNav={closeNavHandler} />
</div>
}
 export default ResponsiveNav;