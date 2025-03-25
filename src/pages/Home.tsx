
import { motion } from "framer-motion";

const Home = () => {
  const textX = "Your dreaming";
  const text1 = "Mobile app and Website";
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
        delay: textX.length * 0.05 + text1.length * 0.05 + text2.length * 0.05 + 0.1,
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
      skew: "0deg", // Remettre à 0 lors du survol
      transition: { duration: 0.1 },
    },
    exit: {
      skew: "-8deg", // Remettre à la position initiale
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <nav className="w-full p-4 flex items-center justify-center">
        <a href="/">
          <svg width="135.6" height="71.201" className="h-[18px] w-[42px]" viewBox="0 0 135.6 71.201" xmlns="http://www.w3.org/2000/svg"><g id="svgGroup" stroke-linecap="round" fill-rule="evenodd" font-size="9pt" stroke="#000" stroke-width="0.25mm" fill="#000" style={{stroke:"#000",strokeWidth:"0.25mm",fill:"#000"}} ><path d="M 28.4 70 L 0 70 L 0 0 L 27.4 0 A 39.521 39.521 0 0 1 32.605 0.324 Q 35.327 0.686 37.617 1.454 A 20.603 20.603 0 0 1 39.75 2.3 A 19.09 19.09 0 0 1 43.912 4.89 A 15.3 15.3 0 0 1 47.2 8.65 Q 49.7 12.7 49.7 18 Q 49.7 23.3 47.4 26.9 Q 45.1 30.5 41.35 32.4 Q 37.6 34.3 33.2 34.7 L 34.7 33.6 A 16.349 16.349 0 0 1 41.091 34.988 A 15.707 15.707 0 0 1 43.15 36.1 Q 46.9 38.5 49.1 42.35 Q 51.3 46.2 51.3 50.9 A 19.527 19.527 0 0 1 50.291 57.251 A 17.699 17.699 0 0 1 48.65 60.75 Q 46 65.1 40.9 67.55 A 23.353 23.353 0 0 1 35.42 69.349 Q 32.216 70 28.4 70 Z M 77.466 69.892 A 26.552 26.552 0 0 0 85.9 71.2 Q 93.1 71.2 98.85 67.85 Q 104.6 64.5 107.9 58.6 A 25.033 25.033 0 0 0 110.475 51.767 A 32.07 32.07 0 0 0 111.2 44.8 A 33.92 33.92 0 0 0 110.816 39.605 A 25.894 25.894 0 0 0 107.95 31 Q 104.7 25.1 98.95 21.75 A 23.995 23.995 0 0 0 94.434 19.709 A 26.552 26.552 0 0 0 86 18.4 Q 78.8 18.4 73.05 21.75 Q 67.3 25.1 64 31.05 A 25.314 25.314 0 0 0 61.499 37.596 A 31.991 31.991 0 0 0 60.7 44.9 A 33.311 33.311 0 0 0 60.957 49.093 A 26.486 26.486 0 0 0 63.95 58.55 Q 67.2 64.5 72.95 67.85 A 23.995 23.995 0 0 0 77.466 69.892 Z M 85.9 60.9 Q 89.5 60.9 92.45 59.1 A 11.92 11.92 0 0 0 95.963 55.775 A 15.656 15.656 0 0 0 97.2 53.7 Q 98.797 50.506 98.977 45.974 A 29.565 29.565 0 0 0 99 44.8 A 26.683 26.683 0 0 0 98.754 41.071 Q 98.472 39.076 97.867 37.404 A 14.25 14.25 0 0 0 97.25 35.95 A 14.259 14.259 0 0 0 95.273 32.922 A 11.481 11.481 0 0 0 92.55 30.6 Q 89.6 28.8 86 28.8 Q 82.5 28.8 79.5 30.6 A 12.114 12.114 0 0 0 75.691 34.26 A 15.514 15.514 0 0 0 74.7 35.95 Q 73.139 39.029 72.932 43.423 A 29.227 29.227 0 0 0 72.9 44.8 Q 72.9 50.1 74.7 53.7 A 14.826 14.826 0 0 0 76.64 56.68 A 11.598 11.598 0 0 0 79.45 59.1 Q 82.4 60.9 85.9 60.9 Z M 12 38.7 L 12 60.2 L 26.6 60.2 Q 30.89 60.2 33.805 58.72 A 10.223 10.223 0 0 0 35.8 57.4 A 9.152 9.152 0 0 0 38.964 51.542 A 13.318 13.318 0 0 0 39.1 49.6 A 11.866 11.866 0 0 0 38.581 46.007 A 9.444 9.444 0 0 0 35.7 41.65 A 11.434 11.434 0 0 0 31.159 39.285 Q 29.431 38.811 27.378 38.721 A 22.373 22.373 0 0 0 26.4 38.7 L 12 38.7 Z M 12 9.7 L 12 29.6 L 25.7 29.6 A 20.28 20.28 0 0 0 29.032 29.345 Q 30.785 29.052 32.184 28.425 A 9.087 9.087 0 0 0 34.5 26.95 A 8.682 8.682 0 0 0 37.33 21.724 A 12.684 12.684 0 0 0 37.5 19.6 A 11.341 11.341 0 0 0 37.079 16.426 A 8.491 8.491 0 0 0 34.5 12.35 Q 32.167 10.289 28.079 9.831 A 22.291 22.291 0 0 0 25.6 9.7 L 12 9.7 Z M 125.597 70.167 A 8.948 8.948 0 0 0 128.1 70.5 A 9.621 9.621 0 0 0 129.017 70.458 A 7.089 7.089 0 0 0 133.5 68.4 A 8.541 8.541 0 0 0 133.565 68.334 A 6.815 6.815 0 0 0 135.6 63.4 A 9.082 9.082 0 0 0 135.599 63.304 A 7.046 7.046 0 0 0 133.5 58.2 A 6.898 6.898 0 0 0 130.671 56.474 A 8.466 8.466 0 0 0 128.1 56.1 A 9.827 9.827 0 0 0 126.748 56.19 A 7.068 7.068 0 0 0 122.6 58.2 Q 120.5 60.3 120.5 63.4 A 6.976 6.976 0 0 0 120.909 65.805 A 7.084 7.084 0 0 0 122.6 68.4 A 6.884 6.884 0 0 0 125.597 70.167 Z" vector-effect="non-scaling-stroke"/></g></svg>
        </a>
      </nav>
      <section className="w-full sr-only min-h-screen flex items-center justify-center flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-1 rounded-full bg-[#fafafa]">
              <div className="p-1 px-2 py-[6px] bg-[#eee] cursor-pointer rounded-full">
                <svg width="20" className="h-[20px] w-[20px]" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <div className="p-1 px-2 py-[6px] cursor-pointer rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px]" viewBox="0 0 28 28" fill="#000">
                  <path d="M 6 2 L 24 2 L 24 11 L 15 11 Z M 6 11 L 15 11 L 24 20 L 15 20 L 15 29 L 6 20 Z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="h-full flex items-center justify-center md:justify-start">
            <h1 className="font-semibold text-4xl md:text-8xl leading-tight text-center md:text-left">
              Your Dreaming app in Minutes With AI.
            </h1>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-[#fafafa] h-64 md:h-full">
          {/* Contenu de la deuxième moitié de la section */}
          
        </div>
      </section>
      <section className="mt-20 md:mt-44 w-full overflow-x-hidden overflow-hidden mb-4 flex-wrap flex items-center justify-center">
        <div className="flex flex-col items-center gap-1">
          <motion.h1 className="md:text-7xl text-3xl font-bold text-center" variants={reveal} initial="hidden" animate="show">
            {textX.split("").map((char, index) => (
              <motion.span key={index} variants={child}>
                {char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.h1 className="md:text-7xl text-3xl font-bold text-center" variants={reveal} initial="hidden" animate="show">
            {text1.split("").map((char, index) => (
              <motion.span key={index} variants={child}>
                {char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.h1 className="md:text-7xl text-3xl font-bold text-center" variants={reveal} initial="hidden" animate="show">
            {text2.split("").map((char, index) => (
              <motion.span key={index} variants={child}>
                {char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.a href="/signup" className="py-3 px-6 border-black border rounded-full" variants={buttonReveal} initial="hidden" animate="show">
            Let's start
          </motion.a>
        </div>
        <section className="h-[70vh] md:h-[100vh] mt-10 md:mt-42 md:ml-42 w-full flex justify-center relative">
          <div className="md:h-full md:w-full relative flex justify-center items-center">
            <motion.div className="md:w-[85%] w-[300px] -mt-32 md:-mt-64 -ml-16 md:-ml-24 -skew-y-[8deg] absolute h-auto rounded-[25px]"
              initial="initial"
              whileHover="hover"
              exit="exit"
              variants={cardHover}>
              <div className="w-full h-full rounded">
                <img src="/images/Spotify Page.png" alt="" className="h-[300px] md:h-[500px] md:w-[1000px] w-[300px] rounded-[12px]" />
              </div>
            </motion.div>
            <motion.div className="md:w-[85%] w-[300px] -mt-24 md:-mt-54 ml-6 md:ml-6 -skew-y-[8deg] absolute h-auto rounded-[25px]"
              initial="initial"
              whileHover="hover"
              exit="exit"
              variants={cardHover}>
              <div className="w-full h-full rounded">
                <img src="/images/Spotify Page.png" alt="" className="h-[300px] md:h-[500px] md:w-[1000px] w-[300px] rounded-[12px]" />
              </div>
            </motion.div>
            <motion.div className="md:w-[85%] w-[300px] -mt-16 md:-mt-34 ml-32 md:ml-54 -skew-y-[8deg] absolute h-auto rounded-[25px]"
              initial="initial"
              whileHover="hover"
              exit="exit"
              variants={cardHover}>
              <div className="w-full h-full rounded">
                <img src="/images/Spotify Page.png" alt="" className="h-[300px] md:h-[500px] md:w-[1000px] w-[300px] rounded-[12px]" />
              </div>
            </motion.div>
          </div>
        </section>
      </section>
      {/* Masquer la section BuilderExample sur mobile */}
      <div className="md:block hidden">
        <div className="w-full flex items-center justify-center mb-12">
          <h1 className="md:text-5xl font-extrabold">
          How it Works
          </h1>
        </div>
      <section className="h-[95vh] w-full flex items-center justify-center mb-10 md:mb-34">
        <div className="flex items-center justify-center h-[100%] w-[90%] border border-[#EEE] p-2 rounded-[15px] md:flex-row flex-col">
          <div className="w-full md:w-1/2 h-1/2 md:h-full relative  flex items-center justify-center">
          <h1 className="md:text-2xl text-[#888] font-extrabold absolute top-2 left-3">
          Step 1: Prompt & Edit
          </h1>
          
          </div>
          <div className="w-full md:w-1/2 h-1/2 md:h-full relative flex items-center justify-center">
          <h1 className="md:text-2xl text-[#888] font-extrabold absolute bottom-2 right-3">
          Step 2: Get your app
          </h1>
            <img src="/imageapp/Airbnb iOS 15~2.png" className="h-[250px] md:h-[400px] border border-[#EEE] max-w-[150px] md:max-w-[200px] object-cover rounded-[20px]" alt="" />
          </div>
        </div>
      </section>
      </div>
      <footer className="w-full h-auto p-2 px-3 py-2 mb-2 border-t border-[#EEE]  flex items-center justify-center flex-col">
        <h2 className="p-2">
          <svg width="135.6" height="71.201" className="h-[18px] w-[42px]" viewBox="0 0 135.6 71.201" xmlns="http://www.w3.org/2000/svg"><g id="svgGroup" stroke-linecap="round" fill-rule="evenodd" font-size="9pt" stroke="#000" stroke-width="0.25mm" fill="#000" style={{stroke:"#000",strokeWidth:"0.25mm",fill:"#000"}} ><path d="M 28.4 70 L 0 70 L 0 0 L 27.4 0 A 39.521 39.521 0 0 1 32.605 0.324 Q 35.327 0.686 37.617 1.454 A 20.603 20.603 0 0 1 39.75 2.3 A 19.09 19.09 0 0 1 43.912 4.89 A 15.3 15.3 0 0 1 47.2 8.65 Q 49.7 12.7 49.7 18 Q 49.7 23.3 47.4 26.9 Q 45.1 30.5 41.35 32.4 Q 37.6 34.3 33.2 34.7 L 34.7 33.6 A 16.349 16.349 0 0 1 41.091 34.988 A 15.707 15.707 0 0 1 43.15 36.1 Q 46.9 38.5 49.1 42.35 Q 51.3 46.2 51.3 50.9 A 19.527 19.527 0 0 1 50.291 57.251 A 17.699 17.699 0 0 1 48.65 60.75 Q 46 65.1 40.9 67.55 A 23.353 23.353 0 0 1 35.42 69.349 Q 32.216 70 28.4 70 Z M 77.466 69.892 A 26.552 26.552 0 0 0 85.9 71.2 Q 93.1 71.2 98.85 67.85 Q 104.6 64.5 107.9 58.6 A 25.033 25.033 0 0 0 110.475 51.767 A 32.07 32.07 0 0 0 111.2 44.8 A 33.92 33.92 0 0 0 110.816 39.605 A 25.894 25.894 0 0 0 107.95 31 Q 104.7 25.1 98.95 21.75 A 23.995 23.995 0 0 0 94.434 19.709 A 26.552 26.552 0 0 0 86 18.4 Q 78.8 18.4 73.05 21.75 Q 67.3 25.1 64 31.05 A 25.314 25.314 0 0 0 61.499 37.596 A 31.991 31.991 0 0 0 60.7 44.9 A 33.311 33.311 0 0 0 60.957 49.093 A 26.486 26.486 0 0 0 63.95 58.55 Q 67.2 64.5 72.95 67.85 A 23.995 23.995 0 0 0 77.466 69.892 Z M 85.9 60.9 Q 89.5 60.9 92.45 59.1 A 11.92 11.92 0 0 0 95.963 55.775 A 15.656 15.656 0 0 0 97.2 53.7 Q 98.797 50.506 98.977 45.974 A 29.565 29.565 0 0 0 99 44.8 A 26.683 26.683 0 0 0 98.754 41.071 Q 98.472 39.076 97.867 37.404 A 14.25 14.25 0 0 0 97.25 35.95 A 14.259 14.259 0 0 0 95.273 32.922 A 11.481 11.481 0 0 0 92.55 30.6 Q 89.6 28.8 86 28.8 Q 82.5 28.8 79.5 30.6 A 12.114 12.114 0 0 0 75.691 34.26 A 15.514 15.514 0 0 0 74.7 35.95 Q 73.139 39.029 72.932 43.423 A 29.227 29.227 0 0 0 72.9 44.8 Q 72.9 50.1 74.7 53.7 A 14.826 14.826 0 0 0 76.64 56.68 A 11.598 11.598 0 0 0 79.45 59.1 Q 82.4 60.9 85.9 60.9 Z M 12 38.7 L 12 60.2 L 26.6 60.2 Q 30.89 60.2 33.805 58.72 A 10.223 10.223 0 0 0 35.8 57.4 A 9.152 9.152 0 0 0 38.964 51.542 A 13.318 13.318 0 0 0 39.1 49.6 A 11.866 11.866 0 0 0 38.581 46.007 A 9.444 9.444 0 0 0 35.7 41.65 A 11.434 11.434 0 0 0 31.159 39.285 Q 29.431 38.811 27.378 38.721 A 22.373 22.373 0 0 0 26.4 38.7 L 12 38.7 Z M 12 9.7 L 12 29.6 L 25.7 29.6 A 20.28 20.28 0 0 0 29.032 29.345 Q 30.785 29.052 32.184 28.425 A 9.087 9.087 0 0 0 34.5 26.95 A 8.682 8.682 0 0 0 37.33 21.724 A 12.684 12.684 0 0 0 37.5 19.6 A 11.341 11.341 0 0 0 37.079 16.426 A 8.491 8.491 0 0 0 34.5 12.35 Q 32.167 10.289 28.079 9.831 A 22.291 22.291 0 0 0 25.6 9.7 L 12 9.7 Z M 125.597 70.167 A 8.948 8.948 0 0 0 128.1 70.5 A 9.621 9.621 0 0 0 129.017 70.458 A 7.089 7.089 0 0 0 133.5 68.4 A 8.541 8.541 0 0 0 133.565 68.334 A 6.815 6.815 0 0 0 135.6 63.4 A 9.082 9.082 0 0 0 135.599 63.304 A 7.046 7.046 0 0 0 133.5 58.2 A 6.898 6.898 0 0 0 130.671 56.474 A 8.466 8.466 0 0 0 128.1 56.1 A 9.827 9.827 0 0 0 126.748 56.19 A 7.068 7.068 0 0 0 122.6 58.2 Q 120.5 60.3 120.5 63.4 A 6.976 6.976 0 0 0 120.909 65.805 A 7.084 7.084 0 0 0 122.6 68.4 A 6.884 6.884 0 0 0 125.597 70.167 Z" vector-effect="non-scaling-stroke"/></g></svg>
        </h2>
        <div className="w-full p-2 px-3 py-2 mb-2 border-t border-[#EEE] flex justify-center items-center">
          <h2 className="text-5xl md:text-[204px] select-none pointer-events-none style">
            Boodupy AI.
          </h2>
        </div>
      </footer>
    </>
  );
}

export default Home;