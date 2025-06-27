import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  icon,
  className = '',
  required = false,
  disabled = false,
  ...props 
}) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            input-field
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

export default Input