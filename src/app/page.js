'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { 
  Activity, 
  Box, 
  Circle, 
  CloudLightning,
  Droplet,
  Maximize2, 
  Users,
  ZapOff,
  CheckCircle
} from "lucide-react";
import calculateCement from "../../utils/calculateCement";
import DrumVisualizer from "../../components/DrumVisualizer";
import './globals.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const cardVariants = {
  hover: { 
    y: -5, 
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
  },
  tap: { 
    y: 0, 
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
  }
};

const InputField = ({ icon, label, value, onChange, unit }) => {
  return (
    <motion.div
      className="space-y-2"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
    >
      <label className="flex items-center text-gray-700 font-medium">
        <span className="bg-indigo-100 p-2 rounded-lg mr-3">{icon}</span>
        <span className="text-gray-800">{label}</span>
      </label>
      <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-100 focus-within:border-indigo-400 transition-all duration-300">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(+e.target.value)}
          className="flex-1 px-4 py-3 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-800"
          placeholder="Enter value"
        />
        <span className="px-4 text-gray-500 font-medium">{unit}</span>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const [personHeight, setPersonHeight] = useState("");
  const [personWidth, setPersonWidth] = useState("");
  const [drumHeight, setDrumHeight] = useState("");
  const [drumDiameter, setDrumDiameter] = useState("");
  const [personCount, setPersonCount] = useState(1);
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");

  useEffect(() => {
    setIsClient(true);
    
    // Add subtle background animation
    if (typeof window !== "undefined") {
      const bg = document.querySelector('.animated-bg');
      if (bg) {
        gsap.to(bg, {
          backgroundPosition: '100% 100%',
          duration: 20,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!personHeight || !personWidth || !drumHeight || !drumDiameter) {
      // Show validation error
      return;
    }

    setIsCalculating(true);
    if (isClient) {
      gsap.to(".drum-container", {
        rotation: 720,
        duration: 1.5,
        ease: "back.inOut"
      });
    }

    setTimeout(() => {
      const res = calculateCement({ personHeight, personWidth, drumHeight, drumDiameter, personCount });
      setResult(res);
      setIsCalculating(false);

      // Handle overflow visuals
      if (res.percentFilled > 100) {
        const overflowElement = document.querySelector('.overflow-visual');
        if (overflowElement) {
          gsap.fromTo(overflowElement, 
            { opacity: 0, scale: 0.8 }, 
            { opacity: 1, scale: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
          );
        }
      }

      // Auto-scroll to results on mobile
      if (window.innerWidth < 1024) {
        const resultElement = document.getElementById('result-section');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 1200);
  };

  if (!isClient) return null;

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animated-bg flex flex-col justify-between"
      style={{ backgroundSize: "200% 200%", backgroundPosition: "0% 0%" }}
    >
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-600/10 to-purple-600/5 -z-10"></div>
      <div className="fixed bottom-0 right-0 w-full h-32 bg-gradient-to-l from-pink-600/10 to-purple-600/5 -z-10"></div>
      
      <div className="max-w-6xl mx-auto px-4 py-12 flex-grow">
        <motion.header 
          className="text-center mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 70, delay: 0.2 }}
        >
          <motion.div
            className="inline-block mb-3"
            animate={{ 
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          >
            <Box size={40} className="inline-block text-indigo-600" />
          </motion.div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Drum Fit Calculator
          </h1>
          <p className="text-gray-600 mt-3 text-lg max-w-lg mx-auto">
            Calculate precise cement measurements with our beautiful interface
          </p>
        </motion.header>

       
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div 
            className={`bg-white rounded-3xl shadow-xl p-8 backdrop-blur-xl bg-opacity-90 border border-gray-100 ${activeTab !== "calculator" && "hidden lg:block"}`}
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Input Dimensions</h2>
              <p className="text-gray-500">All measurements should be in centimeters</p>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  icon={<Maximize2 className="text-indigo-600 w-5 h-5" />}
                  label="Person Height"
                  value={personHeight}
                  onChange={setPersonHeight}
                  unit="cm"
                />
                <InputField
                  icon={<Circle className="text-indigo-600 w-5 h-5" />}
                  label="Person Width"
                  value={personWidth}
                  onChange={setPersonWidth}
                  unit="cm"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  icon={<Box className="text-indigo-600 w-5 h-5" />}
                  label="Drum Height"
                  value={drumHeight}
                  onChange={setDrumHeight}
                  unit="cm"
                />
                <InputField
                  icon={<Circle className="text-indigo-600 w-5 h-5" />}
                  label="Drum Diameter"
                  value={drumDiameter}
                  onChange={setDrumDiameter}
                  unit="cm"
                />
              </div>

              <div className="bg-indigo-50 rounded-2xl p-6">
                <label className="flex items-center text-gray-800 font-medium mb-4">
                  <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <Users className="text-indigo-600 w-5 h-5" />
                  </span>
                  <span>People Count</span>
                </label>
                <div className="flex items-center justify-between">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPersonCount(Math.max(1, personCount - 1))}
                    className="w-12 h-12 flex items-center justify-center bg-white text-indigo-600 rounded-full shadow-md text-xl font-semibold"
                  >
                    -
                  </motion.button>
                  
                  <div className="bg-white px-8 py-3 rounded-xl shadow-sm text-2xl font-bold text-indigo-600">
                    {personCount}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPersonCount(personCount + 1)}
                    className="w-12 h-12 flex items-center justify-center bg-white text-indigo-600 rounded-full shadow-md text-xl font-semibold"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.2), 0 10px 10px -5px rgba(79, 70, 229, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full py-4 rounded-xl font-bold text-lg text-white
                  ${isCalculating 
                    ? 'bg-gray-400' 
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 bg-pos-0 hover:bg-pos-100'
                  }
                  transition-all duration-300 flex items-center justify-center shadow-lg
                `}
                style={{ 
                  backgroundSize: '200% auto',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={handleSubmit}
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-3"
                  >
                    <Activity className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <CloudLightning className="mr-3 w-6 h-6" />
                )}
                {isCalculating ? "Calculating..." : "Calculate Results"}
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                id="result-section"
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`bg-white rounded-3xl shadow-xl p-8 backdrop-blur-xl bg-opacity-90 border border-gray-100 ${activeTab !== "results" && "hidden lg:block"}`}
                variants={cardVariants}
                whileHover="hover"
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 w-6 h-6 mr-2" />
                    <h2 className="text-2xl font-bold text-gray-800">Results</h2>
                  </div>
                  <div className="w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mt-2"></div>
                </div>
                
                <div className="bg-indigo-50 rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Calculation Summary</h3>
                  <p className="text-gray-700 text-lg">
                    {result.percentFilled > 100 
                      ? "Cannot fit the human. Drum overflow detected!" 
                      : result.percentFilled === 100 
                        ? "Drum is perfectly filled with the person included!" 
                        : `Cement needed to fill the drum: ${(result.cementVolume / 1000).toFixed(2)} liters`}
                  </p>
                  {result.percentFilled > 100 && (
                    <div className="overflow-visual text-red-500 text-lg font-bold mt-4">
                      Drum Overflow! Reduce the number of people or adjust dimensions.
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className={`bg-white rounded-3xl shadow-xl p-8 flex items-center justify-center backdrop-blur-xl bg-opacity-90 border border-gray-100 ${activeTab !== "results" && "hidden lg:block"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                variants={cardVariants}
                whileHover="hover"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    className="mb-6 mx-auto"
                  >
                    <ZapOff className="w-20 h-20 mx-auto text-gray-300" />
                  </motion.div>
                  <h3 className="text-xl font-medium text-gray-600 mb-3">No Results Yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Fill in the measurements and calculate to see your results here
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* DrumVisualizer at the bottom */}
      <div className="bg-gray-50 py-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Drum Fill Visualization</h3>
        <DrumVisualizer 
          percentFilled={result?.percentFilled || 0}
          drumHeight={drumHeight || 100}
          drumDiameter={drumDiameter || 60}
        />
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center text-gray-500"
      >
        <p>Drum Fit Calculator &copy; {new Date().getFullYear()}</p>
      </motion.footer>
    </motion.div>
  );
}