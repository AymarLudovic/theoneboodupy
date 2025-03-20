
import { motion } from "framer-motion";

import { Paperclip, Send, Mic, Stars } from "lucide-react"
const Home = () => {
  const text1 = "Your Dreaming app";
  const text2 = "In minutes with AI.";

  const reveal = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
        staggerChildren: 0.05,
      },
    },
  };

  const child = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  const buttonReveal = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
        delay: text1.length * 0.05 + text2.length * 0.05 + 0.1,
      },
    },
  };

  const cardHover = {
    initial: {
      skew: "8deg",
    },
    hover: {
      scale: 1.05,
      zIndex: 1,
      y: -20, // Déplacer la carte vers le haut
      skew: "8deg", // Remettre à 0 lors du survol
      transition: { duration: 0.3 },
    },
    exit: {
      skew: "-8deg", // Remettre à la position initiale
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <section className="w-full h-[100vh] flex items-center justify-center">
        <div className="w-1/2 h-full p-6">
        <div className="flex items-center justify-center">
        <div className='flex items-center gap-1   rounded-full bg-[#fafafa]'>
                    <div className='p-1 px-2 py-[6px] bg-[#eee] cursor-pointer rounded-full'>
                    <svg width="20" className='h-[20px] w-[20px]' height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 10.0196C14.6358 10.3431 10.3431 14.6358 10.0196 20H9.98042C9.65687 14.6358 5.36425 10.3431 0 10.0196V9.98043C5.36425 9.65688 9.65687 5.36424 9.98042 0H10.0196C10.3431 5.36424 14.6358 9.65688 20 9.98043V10.0196Z" fill="url(#paint0_radial_809_11874)" />
  <defs>
    <radialGradient id="paint0_radial_809_11874" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-6.13727 9.97493) scale(21.6266 172.607)">
      <stop offset="0.385135" stop-color="#9E72BA" />
      <stop offset="0.734299" stop-color="#D65C67" />
      <stop offset="0.931035" stop-color="#D6635C" />
    </radialGradient>
  </defs>
</svg>
                    </div>
                    <div  className='p-1 px-2 py-[6px] cursor-pointer rounded-full'>
                    <svg xmlns="http://www.w3.org/2000/svg" className='h-[20px] w-[20px]' viewBox="0 0 28 28" fill="#000">
          <path d="M 6 2 L 24 2 L 24 11 L 15 11 Z M 6 11 L 15 11 L 24 20 L 15 20 L 15 29 L 6 20 Z"></path>
      </svg>
                    </div>
                </div>
        </div>
          <div className="h-full flex items-center">
            <h1 className="font-semibold text-8xl leading-35">
              Your Dreaming app in Minutes With AI.
            </h1>
          </div>
        </div>
        <div className="w-1/2 h-full bg-[#fafafa]">
          f
        </div>
      </section>
      <section className="h-[auto] mt-44 w-full overflow-x-hidden flex-wrap flex items-center justify-center">
        <div className="flex flex-col items-center gap-1">
          <motion.h1 className="md:text-5xl font-bold" variants={reveal} initial="hidden" animate="show">
            {text1.split("").map((char, index) => (
              <motion.span key={index} variants={child}>
                {char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.h1 className="md:text-5xl font-bold" variants={reveal} initial="hidden" animate="show">
            {text2.split("").map((char, index) => (
              <motion.span key={index} variants={child}>
                {char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.a href="/signup" className="py-3 px-6 bg-black text-[#E4E4E4] rounded-full" variants={buttonReveal} initial="hidden" animate="show">
            Let's start
          </motion.a>
        </div>
        <section className="h-[100vh] mt-22 w-full flex justify-center relative">
          <motion.div className="w-[85%] -skew-y-[8deg] absolute h-[80%] border border-[#EEE] bg-[#fff] rounded-[25px] "
            initial="initial"
            whileHover="hover"
            exit="exit"
            variants={cardHover}>
            Fallon
          </motion.div>
          <motion.div className="w-[85%] mt-6 ml-6 -skew-y-[8deg] absolute h-[80%] border border-[#EEE] bg-[#fff] rounded-[25px] "
            initial="initial"
            whileHover="hover"
            exit="exit"
            variants={cardHover}>
            Jean
          </motion.div>
          <motion.div className="w-[85%] mt-12 ml-14 -skew-y-[8deg] absolute h-[80%] border border-[#EEE] bg-[#fff] rounded-[25px] "
            initial="initial"
            whileHover="hover"
            exit="exit"
            variants={cardHover}>
            Ludovic
          </motion.div>
        </section>
      </section>
      <section className="w-full h-[90vh] flex items-center justify-center">
            <div className="h-full md:w-[30%] bg-[#FFF] p-3">
                <div>
                <div className="flex items-center justify-between">
                <div className="py-[4px] px-[8px] bg-[#000] text-[#E4E4E4] rounded-[10px] text-sm select-none w-auto">Prompt and Edit</div>
                <div></div>
                </div>
                <h1 className="text-4xl font-semibold p-1">Step 1</h1>
                </div>
                <div className="flex w-full relative justify-center items-center p-1">
                    <div className="w-full h-[180px] mt-22 relative border border-[#EEE] rounded-[25px]">
                        <div></div>
                        <div className=" bottom-1 p-2 w-full absolute flex items-center justify-between">
                           <div className="items-center gap-1 flex">
                           <div className="px-1 py-1 rounded-[12px]">
                           <Paperclip size={22}></Paperclip>
                           </div>
                           <div className="px-1 py-1 rounded-[12px]">
                           <Stars size={22}></Stars>
                           </div>
                           <div className="px-1 py-1 rounded-[12px]">
                           <Mic size={22}></Mic>
                           </div>
                           </div>
                           <div className="px-2 py-2 rounded-[12px] bg-[#fafafa]">
                           <Send size={22}></Send>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-full md:w-[40%] bg-[#FAFAFA] p-3">
            <div>
                <div className="flex items-center justify-between">
                <div className="py-[4px] px-[8px] bg-[#EEE] font-semibold rounded-[10px] text-sm select-none w-auto">Get your app</div>
                <div></div>
                </div>
                <h1 className="text-4xl font-semibold p-1">Step 2</h1>
                </div>
                <div className="flex items-center justify-center relative h-full w-full -mt-12 -mr-2">
                <motion.div className="w-[290px] -skew-y-[8deg] absolute h-[85%] border border-[#EEE] bg-[#fff] rounded-[25px] "
            initial="initial"
            whileHover="hover"
            exit="exit"
            variants={cardHover}>
            <div className="w-full flex items-center p-2 justify-center">
                <div className="w-[70px] h-[20px] bg-[#0A0A0A] rounded-full"></div>
            </div>
          </motion.div>
          <motion.div className="w-[290px] mt-6 ml-6 -skew-y-[8deg] absolute h-[85%] border border-[#EEE] bg-[#fff] rounded-[25px] "
            initial="initial"
            whileHover="hover"
            exit="exit"
            variants={cardHover}>
            <div className="w-full flex items-center p-2 justify-center">
                <div className="w-[70px] h-[20px] bg-[#0A0A0A] rounded-full"></div>
            </div>
          </motion.div>
          <motion.div className="w-[290px] mt-12 ml-14 -skew-y-[8deg] absolute h-[85%] border border-[#EEE] bg-[#fff] rounded-[25px] "
            initial="initial"
            whileHover="hover"
            exit="exit"
            variants={cardHover}>
            <div className="w-full flex items-center p-2 justify-center">
                <div className="w-[70px] h-[20px] bg-[#0A0A0A] rounded-full"></div>
            </div>
          </motion.div>
                </div>
            </div>
            <div className="h-full md:w-[30%] bg-[#FFF] p-3">
                <div>
                <div className="flex items-center justify-between">
                <div className="py-[4px] px-[8px] bg-[#000] text-[#E4E4E4] rounded-[10px] text-sm select-none w-auto">Deploy and Download</div>
                <div></div>
                </div>
                <h1 className="text-4xl font-semibold p-1">Step 3</h1>
                </div>
                <div className="flex flex-col gap-1">
               
                
                <div className="w-[290px]  h-[500px] border border-[#FAFAFA] bg-[#fff] rounded-[15px] "
            >
           
          </div>
                </div>
            </div>
      </section>
    </>
  );
}

export default Home;