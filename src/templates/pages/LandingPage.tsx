import {  PlusCircle } from 'lucide-react';


{/* Header */}
import Navbar1 from '../Mobile/Navbar/Navbar1';

import Navbar4 from './navbar/Navbar4';
{/* Header */}

{/* Mainhero */}

import Mainhero2 from './Mainhero/Mainhero2';

{/* Mainhero */}

{/* Footer */}

import Footer1 from './Footer/Footer1';

{/* Footer */}


import Homescreen1 from '../Mobile/Socialmedia/Homescreen/Homescreen1';
export default function LandingPage() {
  return (
    <div className=" h-full w-full flex flex-col items-center justify-center px-6">
      {/* Header */}
      <Navbar4></Navbar4>
      
      {/* <Navbar2></Navbar2> */}

      {/* Main Content */}

      <div className='h-[550px] w-[320px] overflow-y-auto py-4 px-1 flex flex-col relative border border-[#EEE] rounded-[30px]'>
            {/* <div className='p-2'>
                <img className='w-full' src="/icons/topbaricons/phonebar.png" alt="" />
            </div> */}
          <div className="p-2 flex flex-col gap-1">
            <h1 className="font-semibold text-2xl">Amand.</h1>
            
          </div>
          <Homescreen1></Homescreen1>
          <Navbar1></Navbar1>
        </div>
        <PlusCircle></PlusCircle>
        <Mainhero2></Mainhero2>

        

      {/* <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold leading-tight">
          Explore the world, <br /> become popular and
          <motion.span 
            className="text-green-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            earn
          </motion.span>{' '}
          coins by your art
        </h1>
      </div> */}
      
      {/* Stats */}
      {/* <div className="mt-8 flex flex-wrap justify-center gap-4">
        {[
          { label: "1921", icon: "❤️" },
          { label: "2869", icon: "👁️" },
          { label: "2414", icon: "🔥" },
          { label: "2994", icon: "💰" },
          { label: "1113", icon: "🚶" },
          { label: "2302", icon: "⭐" },
        ].map((stat, index) => (
          <motion.div 
            key={index}
            className="bg-[#0A0A0A] px-4 py-2 rounded-full flex items-center gap-2 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {stat.icon} {stat.label}
          </motion.div>
        ))}
      </div> */}
      <Footer1></Footer1>
    </div>
  );
}