'use client'
// Import in _app.js
import 'intro.js/introjs.css';
import React from 'react'
import Navbar from '../Navbar';
import Card from '../Card/page';


const page = () => {
  return (
   <>
   <Navbar />
   <Card />

   </>
  )
}

export default page