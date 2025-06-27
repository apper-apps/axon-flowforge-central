import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Textarea from '@/components/atoms/Textarea'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const PromptInput = ({ onGenerate, loading = false }) => {
  const [prompt, setPrompt] = useState('')
  const [error, setError] = useState('')

  const examplePrompts = [
    "Employee onboarding process from application to first day",
    "Customer support ticket resolution workflow",
    "Online order fulfillment process from cart to delivery",
    "Project approval workflow with stakeholder reviews"
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (!prompt.trim()) {
      setError('Please describe your process before generating a diagram')
      return
    }
    
    if (prompt.trim().length < 10) {
      setError('Please provide a more detailed description (at least 10 characters)')
      return
    }
    
    onGenerate(prompt.trim())
  }

  const handleExampleClick = (example) => {
    setPrompt(example)
    setError('')
  }

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <ApperIcon name="Sparkles" className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Describe Your Process</h2>
          <p className="text-sm text-gray-600">AI will transform your description into a flowchart</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Textarea
          label="Process Description"
          placeholder="Describe your process step by step. For example: 'Customer places order, payment is processed, inventory is checked, order is fulfilled, customer receives confirmation...'"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value)
            setError('')
          }}
          error={error}
          rows={6}
          required
        />

        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Try these examples:</p>
          <div className="grid gap-2">
            {examplePrompts.map((example, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => handleExampleClick(example)}
                className="text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors duration-150 text-sm text-gray-700 hover:text-blue-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ApperIcon name="Lightbulb" className="w-4 h-4 inline mr-2 text-gray-400" />
                {example}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ApperIcon name="Info" className="w-4 h-4" />
            <span>More detail = better diagrams</span>
          </div>
          
          <Button
            type="submit"
            loading={loading}
            disabled={loading || !prompt.trim()}
            icon="Zap"
            size="lg"
          >
            {loading ? 'Generating...' : 'Generate Diagram'}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}

export default PromptInput