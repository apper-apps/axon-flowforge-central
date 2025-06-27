import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const DiagramCanvas = ({ diagram, onNodeSelect, selectedNode, onCanvasClick }) => {
  const canvasRef = useRef(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Node type configurations
  const nodeTypes = {
    start: { shape: 'ellipse', color: '#10b981', icon: 'Play' },
    end: { shape: 'ellipse', color: '#ef4444', icon: 'Square' },
    process: { shape: 'rectangle', color: '#3b82f6', icon: 'Box' },
    decision: { shape: 'diamond', color: '#f59e0b', icon: 'GitBranch' },
    data: { shape: 'parallelogram', color: '#8b5cf6', icon: 'Database' },
    connector: { shape: 'circle', color: '#6b7280', icon: 'Circle' }
  }

  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)))
  }

  const handleMouseDown = (e) => {
    if (e.target === canvasRef.current) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

  const renderNode = (node, index) => {
    const config = nodeTypes[node.type] || nodeTypes.process
    const isSelected = selectedNode?.id === node.id

    return (
      <motion.g
        key={node.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation()
          onNodeSelect(node)
        }}
      >
        {config.shape === 'rectangle' && (
          <rect
            x={node.position.x - 60}
            y={node.position.y - 30}
            width={120}
            height={60}
            rx={8}
            fill={isSelected ? '#dbeafe' : '#ffffff'}
            stroke={isSelected ? '#3b82f6' : config.color}
            strokeWidth={isSelected ? 3 : 2}
            className="node-shape"
          />
        )}
        
        {config.shape === 'ellipse' && (
          <ellipse
            cx={node.position.x}
            cy={node.position.y}
            rx={60}
            ry={30}
            fill={isSelected ? '#dbeafe' : '#ffffff'}
            stroke={isSelected ? '#3b82f6' : config.color}
            strokeWidth={isSelected ? 3 : 2}
            className="node-shape"
          />
        )}
        
        {config.shape === 'diamond' && (
          <polygon
            points={`${node.position.x},${node.position.y - 35} ${node.position.x + 70},${node.position.y} ${node.position.x},${node.position.y + 35} ${node.position.x - 70},${node.position.y}`}
            fill={isSelected ? '#dbeafe' : '#ffffff'}
            stroke={isSelected ? '#3b82f6' : config.color}
            strokeWidth={isSelected ? 3 : 2}
            className="node-shape"
          />
        )}
        
        {config.shape === 'parallelogram' && (
          <polygon
            points={`${node.position.x - 50},${node.position.y - 25} ${node.position.x + 70},${node.position.y - 25} ${node.position.x + 50},${node.position.y + 25} ${node.position.x - 70},${node.position.y + 25}`}
            fill={isSelected ? '#dbeafe' : '#ffffff'}
            stroke={isSelected ? '#3b82f6' : config.color}
            strokeWidth={isSelected ? 3 : 2}
            className="node-shape"
          />
        )}
        
        {config.shape === 'circle' && (
          <circle
            cx={node.position.x}
            cy={node.position.y}
            r={25}
            fill={isSelected ? '#dbeafe' : '#ffffff'}
            stroke={isSelected ? '#3b82f6' : config.color}
            strokeWidth={isSelected ? 3 : 2}
            className="node-shape"
          />
        )}
        
        <text
          x={node.position.x}
          y={node.position.y}
          textAnchor="middle"
          dy="0.35em"
          className="text-sm font-medium fill-gray-800 pointer-events-none"
          style={{ fontSize: '12px' }}
        >
          {node.label.length > 15 ? node.label.substring(0, 15) + '...' : node.label}
        </text>
      </motion.g>
    )
  }

  const renderConnection = (connection, index) => {
    if (!diagram?.nodes) return null
    
    const sourceNode = diagram.nodes.find(n => n.id === connection.sourceId)
    const targetNode = diagram.nodes.find(n => n.id === connection.targetId)
    
    if (!sourceNode || !targetNode) return null

    const path = `M ${sourceNode.position.x} ${sourceNode.position.y} Q ${(sourceNode.position.x + targetNode.position.x) / 2} ${sourceNode.position.y - 50} ${targetNode.position.x} ${targetNode.position.y}`

    return (
      <motion.g
        key={connection.id}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: (diagram.nodes.length * 0.1) + (index * 0.2), duration: 0.5 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
          </marker>
        </defs>
        
        <path
          d={path}
          className="connection-line"
          markerEnd="url(#arrowhead)"
        />
        
        {connection.label && (
          <text
            x={(sourceNode.position.x + targetNode.position.x) / 2}
            y={sourceNode.position.y - 40}
            textAnchor="middle"
            className="text-xs fill-gray-600 font-medium"
            style={{ fontSize: '10px' }}
          >
            {connection.label}
          </text>
        )}
      </motion.g>
    )
  }

  const handleFitToScreen = () => {
    if (!diagram?.nodes || diagram.nodes.length === 0) return
    
    const padding = 100
    const minX = Math.min(...diagram.nodes.map(n => n.position.x)) - padding
    const maxX = Math.max(...diagram.nodes.map(n => n.position.x)) + padding
    const minY = Math.min(...diagram.nodes.map(n => n.position.y)) - padding
    const maxY = Math.max(...diagram.nodes.map(n => n.position.y)) + padding
    
    const contentWidth = maxX - minX
    const contentHeight = maxY - minY
    const canvasWidth = canvasRef.current?.clientWidth || 800
    const canvasHeight = canvasRef.current?.clientHeight || 600
    
    const scaleX = canvasWidth / contentWidth
    const scaleY = canvasHeight / contentHeight
    const newZoom = Math.min(scaleX, scaleY, 1)
    
    setZoom(newZoom)
    setPan({
      x: (canvasWidth - contentWidth * newZoom) / 2 - minX * newZoom,
      y: (canvasHeight - contentHeight * newZoom) / 2 - minY * newZoom
    })
  }

  return (
    <div className="relative w-full h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-white rounded-lg shadow-md border border-gray-200 p-2">
        <button
          onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          title="Zoom In"
        >
          <ApperIcon name="ZoomIn" className="w-4 h-4 text-gray-600" />
        </button>
        
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          title="Zoom Out"
        >
          <ApperIcon name="ZoomOut" className="w-4 h-4 text-gray-600" />
        </button>
        
        <button
          onClick={handleFitToScreen}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          title="Fit to Screen"
        >
          <ApperIcon name="Maximize2" className="w-4 h-4 text-gray-600" />
        </button>
        
        <div className="text-xs text-gray-500 px-2 border-l border-gray-200">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Canvas */}
      <svg
        ref={canvasRef}
        className="w-full h-full diagram-canvas cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onClick={onCanvasClick}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Render connections first (behind nodes) */}
          {diagram?.connections?.map((connection, index) => 
            renderConnection(connection, index)
          )}
          
          {/* Render nodes */}
          {diagram?.nodes?.map((node, index) => 
            renderNode(node, index)
          )}
        </g>
      </svg>
    </div>
  )
}

export default DiagramCanvas