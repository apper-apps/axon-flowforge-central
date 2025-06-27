import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import PromptInput from '@/components/molecules/PromptInput'
import DiagramEditor from '@/components/organisms/DiagramEditor'
import ApperIcon from '@/components/ApperIcon'
import diagramService from '@/services/api/diagramService'

const DiagramGenerator = () => {
  const [diagram, setDiagram] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const promptRef = useRef(null)

  const handleGenerate = async (prompt) => {
    setLoading(true)
    setError('')
    
    try {
      const generatedDiagram = await diagramService.generateDiagram(prompt)
      setDiagram(generatedDiagram)
      toast.success('Diagram generated successfully!')
    } catch (err) {
      setError('Failed to generate diagram. Please try again with a different description.')
      toast.error('Failed to generate diagram')
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    if (diagram?.prompt) {
      handleGenerate(diagram.prompt)
    }
  }

  const handlePromptFocus = () => {
    // Focus on the prompt input (would need to be implemented with refs)
    toast.info('Enter your process description in the left panel')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        className="bg-white border-b border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Workflow" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FlowForge</h1>
                <p className="text-sm text-gray-600 hidden sm:block">AI-Powered Process Flow Diagram Generator</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Bot" className="w-4 h-4 text-blue-500" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Zap" className="w-4 h-4 text-yellow-500" />
                  <span>Instant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Download" className="w-4 h-4 text-green-500" />
                  <span>Export Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          {/* Input Panel */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <PromptInput
              ref={promptRef}
              onGenerate={handleGenerate}
              loading={loading}
            />
            
            {/* Tips Panel */}
            <motion.div 
              className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Lightbulb" className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Pro Tips</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Be Specific</p>
                    <p className="text-xs text-gray-600">Include decision points, conditions, and outcomes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Use Action Words</p>
                    <p className="text-xs text-gray-600">Start steps with verbs like "check", "send", "approve"</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Include Branches</p>
                    <p className="text-xs text-gray-600">Mention what happens when conditions are met or not met</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Canvas Panel */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-full">
              <DiagramEditor
                diagram={diagram}
                loading={loading}
                error={error}
                onRetry={handleRetry}
                onPromptFocus={handlePromptFocus}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer 
        className="bg-white border-t border-gray-200 mt-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Transform your processes into clear, professional flowcharts
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Sparkles" className="w-4 h-4 text-purple-500" />
                <span>Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default DiagramGenerator