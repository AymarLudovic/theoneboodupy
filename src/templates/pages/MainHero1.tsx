import { motion } from 'framer-motion';
const MainHero1 = () => {
  return (
    <div>
        <div className="text-center max-w-2xl">
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
      </div>
    </div>
  )
}

export default MainHero1