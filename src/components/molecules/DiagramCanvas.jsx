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
    const node = diagram.nodes.find(n => n.id === draggableId)
    if (!node) return

    const newX = snapToGrid((result.destination.x / zoom) - pan.x)
    const newY = snapToGrid((result.destination.y / zoom) - pan.y)

    onNodePositionUpdate?.(draggableId, { x: newX, y: newY })
  }, [diagram.nodes, zoom, pan, onNodePositionUpdate])

// Render SVG node visualization (non-interactive)
  const renderSVGNode = (node, index) => {
    const config = nodeTypes[node.type] || nodeTypes.process
    const nodeColor = node.color || config.color
    const isSelected = selectedNode?.id === node.id
    const isMultiSelected = selectedNodes?.some(n => n.id === node.id)
    const isHovered = hoveredNode?.id === node.id

    return (
      <g key={`svg-${node.id}-${index}`} transform={`translate(${node.x}, ${node.y})`}>
        <rect
          width="120"
          height="60"
          rx="8"
          fill={nodeColor + '20'}
          stroke={isSelected ? '#3b82f6' : isMultiSelected ? '#8b5cf6' : nodeColor}
          strokeWidth={isSelected || isMultiSelected ? '3' : '2'}
          className={`transition-all duration-200 ${isHovered ? 'filter drop-shadow-md' : ''}`}
        />
        <text
          x="60"
          y="35"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm font-medium fill-gray-800 pointer-events-none"
          style={{ fontSize: '14px' }}
        >
          {node.label?.length > 12 ? node.label.substring(0, 12) + '...' : node.label || 'Node'}
        </text>
        
        {/* Multi-selection indicator */}
        {isMultiSelected && !isSelected && (
          <circle
            cx="110"
            cy="10"
            r="8"
            fill="#8b5cf6"
            className="drop-shadow-sm"
          />
        )}
      </g>
    )
  }

  // Render HTML draggable node (interactive layer)
  const renderDraggableNode = (node, index) => {
    const config = nodeTypes[node.type] || nodeTypes.process
    const nodeColor = node.color || config.color
    const isSelected = selectedNode?.id === node.id
    const isMultiSelected = selectedNodes?.some(n => n.id === node.id)
    const isHovered = hoveredNode?.id === node.id

    return (
      <Draggable
        key={`draggable-${node.id}-${index}`}
        draggableId={`node-${node.id}-${index}`}
        index={index}
      >
        {(dragProvided, dragSnapshot) => (
          <motion.div
            ref={dragProvided.innerRef}
            {...dragProvided.draggableProps}
            {...dragProvided.dragHandleProps}
            className={`absolute cursor-move select-none ${dragSnapshot.isDragging ? 'z-50' : 'z-10'}`}
            style={{
              position: 'absolute',
              left: (node.x + pan.x) * zoom,
              top: (node.y + pan.y) * zoom,
              width: 120 * zoom,
              height: 60 * zoom,
              pointerEvents: 'auto',
              transform: `scale(${dragSnapshot.isDragging ? 0.98 : 1})`,
              transformOrigin: 'center',
              ...dragProvided.draggableProps.style
            }}
            whileHover={{ scale: zoom * 1.02 }}
            onMouseEnter={() => setHoveredNode(node)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={(e) => {
              e.stopPropagation()
              if (e.ctrlKey || e.metaKey) {
                onMultiSelect?.(node)
              } else {
                onNodeSelect?.(node)
              }
            }}
          >
            <div
              className={`
                relative w-full h-full p-3 rounded-lg border-2 transition-all duration-200 min-w-[120px] text-center flex flex-col items-center justify-center
                ${isSelected ? 'border-blue-500 shadow-lg bg-blue-50' : 'border-gray-300 bg-white'}
                ${isMultiSelected ? 'border-purple-500 shadow-md bg-purple-50' : ''}
                ${isHovered ? 'shadow-md' : ''}
                ${dragSnapshot.isDragging ? 'shadow-xl rotate-1 bg-gray-50' : ''}
              `}
              style={{ 
                backgroundColor: dragSnapshot.isDragging ? '#f9fafb' : (nodeColor + '20'), 
                borderColor: isSelected ? '#3b82f6' : isMultiSelected ? '#8b5cf6' : nodeColor 
              }}
            >
              <div className="flex items-center justify-center mb-2">
                <ApperIcon
                  name={config.icon}
                  className="w-6 h-6"
                  style={{ color: nodeColor }}
                />
              </div>
              <div className="text-sm font-medium text-center text-gray-800">
                {node.label?.length > 15 ? node.label.substring(0, 15) + '...' : node.label || 'Node'}
              </div>

              {/* Multi-selection indicator */}
              {isMultiSelected && !isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </div>
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

    const path = `M ${sourceNode.x} ${sourceNode.y} Q ${(sourceNode.x + targetNode.x) / 2} ${sourceNode.y - 50} ${targetNode.x} ${targetNode.y}`

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
            x={(sourceNode.x + targetNode.x) / 2}
            y={sourceNode.y - 40}
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
    const minX = Math.min(...diagram.nodes.map(n => n.x)) - padding
    const maxX = Math.max(...diagram.nodes.map(n => n.x)) + padding
    const minY = Math.min(...diagram.nodes.map(n => n.y)) - padding
    const maxY = Math.max(...diagram.nodes.map(n => n.y)) + padding

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
<div className="relative w-full h-full">
        {/* SVG Canvas for rendering connections and static visual elements */}
        <svg
          ref={canvasRef}
          className="w-full h-full diagram-canvas cursor-grab active:cursor-grabbing absolute inset-0"
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

            {/* Render SVG nodes for visual reference only */}
            {diagram?.nodes?.map((node, index) =>
              renderSVGNode(node, index)
            )}
          </g>
        </svg>

        {/* HTML Layer for Drag and Drop - React 18 StrictMode compatible */}
        <DragDropContext 
          onDragEnd={handleDragEnd}
          // React 18 StrictMode compatibility
          enableDefaultSensors={false}
        >
          <div className="absolute inset-0 pointer-events-none">
            <Droppable droppableId="diagram-canvas-droppable" type="NODE">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-full h-full relative"
                  style={{ pointerEvents: 'none' }}
                >
                  {/* Interactive draggable nodes */}
                  {diagram?.nodes?.map((node, index) => {
                    // Ensure node has required properties
                    if (!node?.id) {
                      console.warn(`Node at index ${index} missing id:`, node)
                      return null
                    }
                    return renderDraggableNode(node, index)
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>

      {/* Multi-selection info */}
      {selectedNodes?.length > 1 && (
        <motion.div
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
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