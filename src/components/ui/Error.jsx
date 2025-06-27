import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while generating your diagram. Please try again.", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <motion.div 
      className="flex items-center justify-center min-h-[400px] bg-red-50/50 rounded-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center max-w-md mx-auto p-6">
        <motion.div
          className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-500" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
          
          {showRetry && onRetry && (
            <motion.button
              onClick={onRetry}
              className="btn-primary inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="RefreshCw" className="w-4 h-4" />
              <span>Try Again</span>
            </motion.button>
          )}
        </motion.div>
        
        <motion.div
          className="mt-8 p-4 bg-red-50 rounded-lg border border-red-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-2 text-sm text-red-700">
            <ApperIcon name="Info" className="w-4 h-4" />
            <span className="font-medium">Tip:</span>
          </div>
          <p className="text-sm text-red-600 mt-1">
            Try describing your process with more specific steps or check your internet connection.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Error