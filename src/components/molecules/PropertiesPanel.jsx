import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SketchPicker } from 'react-color'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
const PropertiesPanel = ({ selectedNode, onNodeUpdate, onClose }) => {
  const [nodeData, setNodeData] = useState({
    label: '',
    type: 'process',
    description: '',
    color: '#3b82f6'
  })
  const [showColorPicker, setShowColorPicker] = useState(false)
  const nodeTypes = [
    { value: 'start', label: 'Start/End', icon: 'Play', color: '#10b981' },
    { value: 'process', label: 'Process', icon: 'Box', color: '#3b82f6' },
    { value: 'decision', label: 'Decision', icon: 'GitBranch', color: '#f59e0b' },
    { value: 'data', label: 'Data', icon: 'Database', color: '#8b5cf6' },
    { value: 'connector', label: 'Connector', icon: 'Circle', color: '#6b7280' }
  ]

useEffect(() => {
    if (selectedNode) {
      setNodeData({
        label: selectedNode.label || '',
        type: selectedNode.type || 'process',
        description: selectedNode.description || '',
        color: selectedNode.color || '#3b82f6'
      })
    }
  }, [selectedNode])

  const handleSave = () => {
    if (selectedNode && nodeData.label.trim()) {
      onNodeUpdate(selectedNode.id, nodeData)
      onClose()
    }
  }

const handleDelete = () => {
    if (selectedNode && window.confirm('Are you sure you want to delete this node?')) {
      onNodeUpdate(selectedNode.id, { ...selectedNode, _delete: true })
      onClose()
    }
  }

  const handleColorChange = (color) => {
    setNodeData(prev => ({ ...prev, color: color.hex }))
  }

  if (!selectedNode) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed right-4 top-1/2 transform -translate-y-1/2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Settings" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Node Properties</h3>
                <p className="text-sm text-gray-600">Edit node details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <Input
              label="Node Label"
              value={nodeData.label}
              onChange={(e) => setNodeData(prev => ({ ...prev, label: e.target.value }))}
              placeholder="Enter node text"
              required
            />

            <div>
              <label className="label">Node Type</label>
              <div className="grid grid-cols-1 gap-2">
                {nodeTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    type="button"
                    onClick={() => setNodeData(prev => ({ ...prev, type: type.value }))}
                    className={`
                      flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-150
                      ${nodeData.type === type.value 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center"
                      style={{ backgroundColor: type.color + '20' }}
                    >
                      <ApperIcon 
                        name={type.icon} 
                        className="w-4 h-4" 
                        style={{ color: type.color }} 
                      />
                    </div>
                    <span className="font-medium text-gray-700">{type.label}</span>
                    {nodeData.type === type.value && (
                      <ApperIcon name="Check" className="w-4 h-4 text-primary-500 ml-auto" />
                    )}
                  </motion.button>
                ))}
</div>
            </div>

            <div>
              <label className="label">Shape Color</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: nodeData.color }}
                    />
                    <span className="text-gray-700">{nodeData.color.toUpperCase()}</span>
                  </div>
                  <ApperIcon name="Palette" className="w-4 h-4 text-gray-500" />
                </button>
                
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-2 z-50">
                    <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
                    <div className="relative">
                      <SketchPicker
                        color={nodeData.color}
                        onChange={handleColorChange}
                        disableAlpha
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="label">Description (Optional)</label>
              <textarea
                id="description"
                value={nodeData.description}
                onChange={(e) => setNodeData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add additional details about this step"
                rows={3}
                className="input-field resize-none"
              />
            </div>
            <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
              <Button
                onClick={handleSave}
                disabled={!nodeData.label.trim()}
                className="flex-1"
                icon="Save"
              >
                Save Changes
              </Button>
              
              <Button
                onClick={handleDelete}
                variant="danger"
                icon="Trash2"
                className="px-4"
              >
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PropertiesPanel