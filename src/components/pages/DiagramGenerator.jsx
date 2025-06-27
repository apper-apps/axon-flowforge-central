import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import diagramService from "@/services/api/diagramService";
import ApperIcon from "@/components/ApperIcon";
import PromptInput from "@/components/molecules/PromptInput";
import DiagramEditor from "@/components/organisms/DiagramEditor";
import Button from "@/components/atoms/Button";

const DiagramGenerator = () => {
  const [diagram, setDiagram] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [extractedSteps, setExtractedSteps] = useState([])
  const promptRef = useRef(null)
const handleGenerate = async (prompt) => {
    setCurrentPrompt(prompt)
    setLoading(true)
    setError('')
    
    try {
      // Extract steps for user confirmation
      const steps = diagramService.extractStepsFromPrompt(prompt)
      setExtractedSteps(steps)
      setShowConfirmation(true)
      setLoading(false)
    } catch (err) {
      setError('Failed to analyze your process description. Please try again.')
      toast.error('Failed to process description')
      setLoading(false)
    }
  }

  const handleConfirmGeneration = async () => {
    setShowConfirmation(false)
    setLoading(true)
    
    try {
      const generatedDiagram = await diagramService.generateDiagram(currentPrompt)
      setDiagram(generatedDiagram)
      toast.success('Diagram generated successfully!')
    } catch (err) {
      setError('Failed to generate diagram. Please try again with a different description.')
      toast.error('Failed to generate diagram')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
    setCurrentPrompt('')
    setExtractedSteps([])
  }

  const handleNodeUpdate = (nodeId, nodeData) => {
    if (nodeData._delete) {
      setDiagram(prevDiagram => ({
        ...prevDiagram,
        nodes: prevDiagram.nodes.filter(node => node.id !== nodeId),
        connections: prevDiagram.connections.filter(
          conn => conn.sourceId !== nodeId && conn.targetId !== nodeId
        )
      }))
    } else {
      setDiagram(prevDiagram => ({
        ...prevDiagram,
        nodes: prevDiagram.nodes.map(node =>
          node.id === nodeId ? { ...node, ...nodeData } : node
        )
      }))
    }
  }

  const handleClearCanvas = () => {
    setDiagram(null)
    setError('')
  }

  const handleRetry = () => {
    if (currentPrompt || diagram?.prompt) {
      handleGenerate(currentPrompt || diagram.prompt)
    }
  }

  const handlePromptFocus = () => {
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
                onNodeUpdate={handleNodeUpdate}
                onClearCanvas={handleClearCanvas}
              />
            </div>
          </motion.div>
</div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Confirm Process Steps</h3>
                  <p className="text-sm text-gray-600">Review the identified steps before generating your diagram</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>We identified {extractedSteps.length} key steps:</strong>
                </p>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {extractedSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900">{step.label}</h4>
                          <span className={`
                            px-2 py-1 text-xs font-medium rounded-full
                            ${step.type === 'start' ? 'bg-green-100 text-green-800' :
                              step.type === 'end' ? 'bg-red-100 text-red-800' :
                              step.type === 'decision' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'}
                          `}>
                            {step.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ApperIcon name="Info" className="w-4 h-4" />
                  <span>You can edit nodes after generation</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handleCancelConfirmation}
                    variant="ghost"
                    icon="X"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmGeneration}
                    icon="Zap"
                  >
                    Generate Diagram
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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