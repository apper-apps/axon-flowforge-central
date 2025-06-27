import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import DiagramCanvas from '@/components/molecules/DiagramCanvas'
import PropertiesPanel from '@/components/molecules/PropertiesPanel'
import ExportDialog from '@/components/molecules/ExportDialog'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const DiagramEditor = ({ diagram, loading, error, onRetry, onPromptFocus }) => {
  const [selectedNode, setSelectedNode] = useState(null)
  const [showProperties, setShowProperties] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)

  const handleNodeSelect = (node) => {
    setSelectedNode(node)
    setShowProperties(true)
  }

  const handleNodeUpdate = (nodeId, nodeData) => {
    // This would update the diagram state in the parent component
    toast.success('Node updated successfully')
  }

  const handleCanvasClick = () => {
    setSelectedNode(null)
    setShowProperties(false)
  }

  const handleExport = (options) => {
    // Simulate export functionality
    setTimeout(() => {
      toast.success(`Diagram exported as ${options.filename}`)
      setShowExportDialog(false)
    }, 1000)
  }

  const handleClearCanvas = () => {
    if (window.confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
      // This would clear the diagram in the parent component
      toast.info('Canvas cleared')
    }
  }

  if (loading) {
    return <Loading message="Generating your process flow diagram..." />
  }

  if (error) {
    return (
      <Error
        title="Generation Failed"
        message={error}
        onRetry={onRetry}
      />
    )
  }

  if (!diagram || !diagram.nodes || diagram.nodes.length === 0) {
    return (
      <Empty
        title="Ready to Create"
        message="Your process flow diagram will appear here once generated. Describe your process in the left panel to get started."
        actionText="Focus Input"
        onAction={onPromptFocus}
      />
    )
  }

  return (
    <div className="relative w-full h-full">
      {/* Toolbar */}
      <motion.div 
        className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-white rounded-lg shadow-md border border-gray-200 p-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={() => setShowExportDialog(true)}
          variant="secondary"
          size="sm"
          icon="Download"
        >
          Export
        </Button>
        
        <Button
          onClick={handleClearCanvas}
          variant="ghost"
          size="sm"
          icon="Trash2"
        >
          Clear
        </Button>
        
        <div className="border-l border-gray-200 pl-2 ml-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Layers" className="w-4 h-4" />
            <span>{diagram.nodes.length} nodes</span>
          </div>
        </div>
      </motion.div>

      {/* Canvas */}
      <DiagramCanvas
        diagram={diagram}
        selectedNode={selectedNode}
        onNodeSelect={handleNodeSelect}
        onCanvasClick={handleCanvasClick}
      />

      {/* Properties Panel */}
      {showProperties && selectedNode && (
        <PropertiesPanel
          selectedNode={selectedNode}
          onNodeUpdate={handleNodeUpdate}
          onClose={() => setShowProperties(false)}
        />
      )}

      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
        diagramName={diagram?.name || 'flowchart'}
      />

      {/* Diagram Info */}
      <motion.div 
        className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md border border-gray-200 p-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Clock" className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Generated {new Date().toLocaleTimeString()}
            </span>
          </div>
          
          {diagram.connections && (
            <div className="flex items-center space-x-1">
              <ApperIcon name="GitBranch" className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {diagram.connections.length} connections
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default DiagramEditor