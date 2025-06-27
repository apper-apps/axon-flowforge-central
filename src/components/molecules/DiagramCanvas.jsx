import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { snapToGrid } from "@/utils/diagramUtils";
import ApperIcon from "@/components/ApperIcon";

const DiagramCanvas = ({ 
  diagram, 
  onNodeSelect, 
  selectedNode, 
  selectedNodes = [],
  onCanvasClick,
  onNodePositionUpdate,
  onMultiSelect,
  onClearSelection 
}) => {
  const canvasRef = useRef(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [draggedNode, setDraggedNode] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
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

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedNodes.length > 0) {
        e.preventDefault()
        // Trigger bulk delete through parent component
        if (window.confirm(`Delete ${selectedNodes.length} selected node(s)?`)) {
          selectedNodes.forEach(node => {
            onNodeSelect({ ...node, _bulkDelete: true })
          })
        }
      } else if (e.key === 'Escape') {
        onClearSelection?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedNodes, onNodeSelect, onClearSelection])

  // Handle drag end for node repositioning
  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return

    const { draggableId } = result
    const node = diagram?.nodes?.find(n => n.id === draggableId)
    if (!node) return

    // Calculate new position based on drag result
    // This is a simplified position update - in a real implementation,
    // you'd calculate based on the actual drag coordinates
    const newPosition = snapToGrid({
      x: node.position.x + (result.destination.index - result.source.index) * 20,
      y: node.position.y
    })

    onNodePositionUpdate?.(draggableId, newPosition)
  }, [diagram, onNodePositionUpdate])
const renderNode = (node, index) => {
    const config = nodeTypes[node.type] || nodeTypes.process
    const nodeColor = node.color || config.color
    const isSelected = selectedNode?.id === node.id
    const isMultiSelected = selectedNodes.some(n => n.id === node.id)
    const isHovered = hoveredNode === node.id

return (
      <Draggable key={node.id} draggableId={node.id} index={index}>
        {(provided, snapshot) => (
          <motion.div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: snapshot.isDragging ? 1.05 : (isHovered ? 1.02 : 1),
              boxShadow: snapshot.isDragging ? '0 8px 16px rgba(0,0,0,0.15)' : 'none'
            }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            style={{ 
              position: 'absolute',
              left: node.position.x,
              top: node.position.y,
              transform: 'translate(-50%, -50%)',
              cursor: snapshot.isDragging ? 'grabbing' : 'grab',
              zIndex: snapshot.isDragging ? 1000 : 1
            }}
            onClick={(e) => {
              e.stopPropagation()
              if (e.ctrlKey || e.metaKey) {
                onMultiSelect?.(node)
              } else {
                onNodeSelect(node)
              }
            }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <svg width="140" height="70" style={{ overflow: 'visible' }}>
              {config.shape === 'rectangle' && (
                <rect
                  x="10"
                  y="5"
                  width="120"
                  height="60"
                  rx={8}
                  fill={isSelected || isMultiSelected ? '#dbeafe' : (isHovered ? '#f8fafc' : '#ffffff')}
                  stroke={isSelected || isMultiSelected ? '#3b82f6' : (isHovered ? '#64748b' : nodeColor)}
                  strokeWidth={isSelected || isMultiSelected ? 3 : (isHovered ? 2.5 : 2)}
                  className="node-shape transition-all duration-200"
                  filter={snapshot.isDragging ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' : 'none'}
                />
              )}
              {config.shape === 'ellipse' && (
                <ellipse
                  cx="70"
                  cy="35"
                  rx={60}
                  ry={30}
                  fill={isSelected || isMultiSelected ? '#dbeafe' : (isHovered ? '#f8fafc' : '#ffffff')}
                  stroke={isSelected || isMultiSelected ? '#3b82f6' : (isHovered ? '#64748b' : nodeColor)}
                  strokeWidth={isSelected || isMultiSelected ? 3 : (isHovered ? 2.5 : 2)}
                  className="node-shape transition-all duration-200"
                  filter={snapshot.isDragging ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' : 'none'}
                />
              )}
              {config.shape === 'diamond' && (
                <polygon
                  points="70,0 140,35 70,70 0,35"
                  fill={isSelected || isMultiSelected ? '#dbeafe' : (isHovered ? '#f8fafc' : '#ffffff')}
                  stroke={isSelected || isMultiSelected ? '#3b82f6' : (isHovered ? '#64748b' : nodeColor)}
                  strokeWidth={isSelected || isMultiSelected ? 3 : (isHovered ? 2.5 : 2)}
                  className="node-shape transition-all duration-200"
                  filter={snapshot.isDragging ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' : 'none'}
                />
              )}
              {config.shape === 'parallelogram' && (
                <polygon
                  points="20,10 140,10 120,60 0,60"
                  fill={isSelected || isMultiSelected ? '#dbeafe' : (isHovered ? '#f8fafc' : '#ffffff')}
                  stroke={isSelected || isMultiSelected ? '#3b82f6' : (isHovered ? '#64748b' : nodeColor)}
                  strokeWidth={isSelected || isMultiSelected ? 3 : (isHovered ? 2.5 : 2)}
                  className="node-shape transition-all duration-200"
                  filter={snapshot.isDragging ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' : 'none'}
                />
              )}
              {config.shape === 'circle' && (
                <circle
                  cx="70"
                  cy="35"
                  r={25}
                  fill={isSelected || isMultiSelected ? '#dbeafe' : (isHovered ? '#f8fafc' : '#ffffff')}
                  stroke={isSelected || isMultiSelected ? '#3b82f6' : (isHovered ? '#64748b' : nodeColor)}
                  strokeWidth={isSelected || isMultiSelected ? 3 : (isHovered ? 2.5 : 2)}
                  className="node-shape transition-all duration-200"
                  filter={snapshot.isDragging ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' : 'none'}
                />
              )}
              <text
                x="70"
                y="35"
                textAnchor="middle"
                dy="0.35em"
                className={`text-sm font-medium pointer-events-none transition-all duration-200 ${
                  isSelected || isMultiSelected ? 'fill-blue-700' : 'fill-gray-800'
                }`}
                style={{ fontSize: '12px' }}
              >
                {node.label.length > 15 ? node.label.substring(0, 15) + '...' : node.label}
              </text>
              
              {/* Multi-selection indicator */}
              {isMultiSelected && !isSelected && (
                <g>
                  <circle
                    cx="115"
                    cy="10"
                    r={8}
                    fill="#3b82f6"
                    className="selection-indicator"
                  />
                  <text
                    x="115"
                    y="10"
                    textAnchor="middle"
                    dy="0.35em"
                    className="fill-white text-xs font-bold"
                    style={{ fontSize: '10px' }}
                  >
                    ✓
                  </text>
                </g>
              )}
            </svg>
          </motion.div>
        )}
      </Draggable>
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
<DragDropContext onDragEnd={handleDragEnd}>
        <svg
          ref={canvasRef}
          className="w-full h-full diagram-canvas cursor-grab active:cursor-grabbing"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onClick={(e) => {
            if (e.target === canvasRef.current || e.target.closest('svg')) {
              onCanvasClick?.()
            }
          }}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Render connections first (behind nodes) */}
            {diagram?.connections?.map((connection, index) => 
              renderConnection(connection, index)
            )}
            
            {/* Render nodes with drag and drop */}
<Droppable droppableId="diagram-canvas" type="NODE">
              {(provided) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                  style={{ 
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none'
                  }}
                >
                  <div style={{ pointerEvents: 'auto' }}>
                    {diagram?.nodes?.map((node, index) => 
                      renderNode(node, index)
                    )}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </g>
        </svg>
      </DragDropContext>
      
      {/* Multi-selection info */}
      {selectedNodes.length > 1 && (
        <motion.div 
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-2 text-sm text-blue-700">
            <ApperIcon name="MousePointer2" className="w-4 h-4" />
            <span>{selectedNodes.length} nodes selected</span>
            <span className="text-blue-500">•</span>
            <span className="text-xs">Press Delete to remove, Esc to clear selection</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default DiagramCanvas