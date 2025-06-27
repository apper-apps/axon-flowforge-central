import React from 'react'
import { motion } from 'framer-motion'

const Loading = ({ message = "Generating your process flow diagram..." }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] bg-gray-50/50 rounded-lg">
      <div className="text-center">
        <motion.div
          className="relative w-16 h-16 mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </motion.div>
        
        <div className="space-y-4">
          <motion.h3 
            className="text-lg font-semibold text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.h3>
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span>Analyzing your process description</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span>Creating flowchart nodes</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <span>Connecting the workflow</span>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-8 space-y-2">
          <div className="w-64 h-3 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </div>
          <p className="text-xs text-gray-500">This may take a few moments</p>
        </div>
      </div>
    </div>
  )
}

export default Loading