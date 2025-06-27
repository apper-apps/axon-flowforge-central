import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon = null, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-gradient-primary text-white hover:brightness-110 hover:scale-105 focus:ring-primary-500 disabled:opacity-50",
    secondary: "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-50 hover:scale-105 focus:ring-gray-300",
    outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 hover:scale-105 focus:ring-primary-500",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:scale-105 focus:ring-red-500",
  }
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }
  
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  const isDisabled = disabled || loading

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className={`${iconSizes[size]} animate-spin ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`} 
        />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} className={`${iconSizes[size]} mr-2`} />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} className={`${iconSizes[size]} ml-2`} />
      )}
    </motion.button>
  )
}

export default Button