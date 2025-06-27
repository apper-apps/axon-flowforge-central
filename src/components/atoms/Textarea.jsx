import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Textarea = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  error, 
  rows = 4,
  className = '',
  required = false,
  disabled = false,
  ...props 
}) => {
  const textareaId = `textarea-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={textareaId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        className={`
          input-field resize-none
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

export default Textarea