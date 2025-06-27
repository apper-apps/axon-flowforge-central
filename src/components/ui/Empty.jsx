import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No diagram yet", 
  message = "Describe your process in the input panel to generate your first flowchart diagram.",
  actionText = "Get Started",
  onAction,
  showAction = true 
}) => {
  return (
    <motion.div 
      className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center max-w-md mx-auto p-6">
        <motion.div
          className="relative w-24 h-24 mx-auto mb-6"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-20"></div>
          <div className="relative w-full h-full bg-white rounded-2xl shadow-lg flex items-center justify-center">
            <ApperIcon name="Workflow" className="w-10 h-10 text-primary-500" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
          
          {showAction && onAction && (
            <motion.button
              onClick={onAction}
              className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Sparkles" className="w-5 h-5" />
              <span>{actionText}</span>
            </motion.button>
          )}
        </motion.div>
        
        <motion.div
          className="mt-8 grid grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { icon: "Bot", label: "AI-Powered" },
            { icon: "Zap", label: "Instant" },
            { icon: "Download", label: "Export Ready" }
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              className="flex flex-col items-center space-y-2 p-3 bg-white rounded-lg border border-gray-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <ApperIcon name={feature.icon} className="w-5 h-5 text-primary-500" />
              <span className="text-xs font-medium text-gray-600">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Empty