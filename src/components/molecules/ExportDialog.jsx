import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const ExportDialog = ({ isOpen, onClose, onExport, diagramName = "flowchart" }) => {
  const [exportOptions, setExportOptions] = useState({
    format: 'png',
    quality: 'high',
    includeBackground: true,
    includeGrid: false
  })

  const formatOptions = [
    { value: 'png', label: 'PNG Image', icon: 'Image', description: 'High quality raster image' },
    { value: 'svg', label: 'SVG Vector', icon: 'FileImage', description: 'Scalable vector graphics' },
    { value: 'pdf', label: 'PDF Document', icon: 'FileText', description: 'Portable document format' }
  ]

  const qualityOptions = [
    { value: 'low', label: 'Low (72 DPI)', size: 'Small file size' },
    { value: 'medium', label: 'Medium (150 DPI)', size: 'Balanced quality' },
    { value: 'high', label: 'High (300 DPI)', size: 'Print quality' }
  ]

  const handleExport = () => {
    onExport({
      ...exportOptions,
      filename: `${diagramName}.${exportOptions.format}`
    })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Download" className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Export Diagram</h3>
                  <p className="text-sm text-gray-600">Choose your export settings</p>
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
              {/* Format Selection */}
              <div>
                <label className="label">Export Format</label>
                <div className="space-y-2">
                  {formatOptions.map((format) => (
                    <motion.button
                      key={format.value}
                      type="button"
                      onClick={() => setExportOptions(prev => ({ ...prev, format: format.value }))}
                      className={`
                        w-full flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-150
                        ${exportOptions.format === format.value 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                        }
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ApperIcon name={format.icon} className="w-6 h-6 text-primary-500" />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">{format.label}</div>
                        <div className="text-sm text-gray-600">{format.description}</div>
                      </div>
                      {exportOptions.format === format.value && (
                        <ApperIcon name="Check" className="w-5 h-5 text-primary-500" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quality Selection (for PNG/PDF) */}
              {(exportOptions.format === 'png' || exportOptions.format === 'pdf') && (
                <div>
                  <label className="label">Quality</label>
                  <div className="space-y-2">
                    {qualityOptions.map((quality) => (
                      <motion.button
                        key={quality.value}
                        type="button"
                        onClick={() => setExportOptions(prev => ({ ...prev, quality: quality.value }))}
                        className={`
                          w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-150
                          ${exportOptions.quality === quality.value 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                          }
                        `}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="text-left">
                          <div className="font-medium text-gray-900">{quality.label}</div>
                          <div className="text-sm text-gray-600">{quality.size}</div>
                        </div>
                        {exportOptions.quality === quality.value && (
                          <ApperIcon name="Check" className="w-5 h-5 text-primary-500" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Options */}
              <div>
                <label className="label">Additional Options</label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeBackground}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeBackground: e.target.checked }))}
                      className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Include Background</div>
                      <div className="text-sm text-gray-600">Add white background to the export</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeGrid}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeGrid: e.target.checked }))}
                      className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Include Grid</div>
                      <div className="text-sm text-gray-600">Show grid pattern in export</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* File Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="File" className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {diagramName}.{exportOptions.format}
                    </div>
                    <div className="text-sm text-gray-600">
                      {exportOptions.format.toUpperCase()} • {exportOptions.quality} quality
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-8 pt-6 border-t border-gray-100">
              <Button
                onClick={onClose}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                icon="Download"
                className="flex-1"
              >
                Export
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ExportDialog