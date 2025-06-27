export const calculateNodePosition = (index, totalNodes, containerWidth = 1200, containerHeight = 800) => {
  const cols = Math.ceil(Math.sqrt(totalNodes))
  const rows = Math.ceil(totalNodes / cols)
  
  const col = index % cols
  const row = Math.floor(index / cols)
  
  const marginX = 100
  const marginY = 100
  const spacingX = (containerWidth - 2 * marginX) / Math.max(1, cols - 1)
  const spacingY = (containerHeight - 2 * marginY) / Math.max(1, rows - 1)
  
  return {
    x: marginX + col * spacingX,
    y: marginY + row * spacingY
  }
}

export const generateNodeId = (prefix = 'node') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

export const generateConnectionId = (prefix = 'connection') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

export const validateDiagram = (diagram) => {
  const errors = []
  
  if (!diagram) {
    errors.push('Diagram is required')
    return errors
  }
  
  if (!diagram.nodes || !Array.isArray(diagram.nodes)) {
    errors.push('Diagram must have nodes array')
  } else if (diagram.nodes.length === 0) {
    errors.push('Diagram must have at least one node')
  }
  
  if (!diagram.connections || !Array.isArray(diagram.connections)) {
    errors.push('Diagram must have connections array')
  }
  
  // Validate node structure
  diagram.nodes?.forEach((node, index) => {
    if (!node.id) errors.push(`Node ${index} is missing id`)
    if (!node.label) errors.push(`Node ${index} is missing label`)
    if (!node.position) errors.push(`Node ${index} is missing position`)
    if (!node.type) errors.push(`Node ${index} is missing type`)
  })
  
  // Validate connections
  diagram.connections?.forEach((connection, index) => {
    if (!connection.id) errors.push(`Connection ${index} is missing id`)
    if (!connection.sourceId) errors.push(`Connection ${index} is missing sourceId`)
    if (!connection.targetId) errors.push(`Connection ${index} is missing targetId`)
    
    // Check if referenced nodes exist
    const sourceExists = diagram.nodes?.some(n => n.id === connection.sourceId)
    const targetExists = diagram.nodes?.some(n => n.id === connection.targetId)
    
    if (!sourceExists) errors.push(`Connection ${index} references non-existent source node`)
    if (!targetExists) errors.push(`Connection ${index} references non-existent target node`)
  })
  
  return errors
}

export const getNodeTypeConfig = (nodeType) => {
  const configs = {
    start: {
      shape: 'ellipse',
      color: '#10b981',
      icon: 'Play',
      label: 'Start/End'
    },
    end: {
      shape: 'ellipse',
      color: '#ef4444',
      icon: 'Square',
      label: 'Start/End'
    },
    process: {
      shape: 'rectangle',
      color: '#3b82f6',
      icon: 'Box',
      label: 'Process'
    },
    decision: {
      shape: 'diamond',
      color: '#f59e0b',
      icon: 'GitBranch',
      label: 'Decision'
    },
    data: {
      shape: 'parallelogram',
      color: '#8b5cf6',
      icon: 'Database',
      label: 'Data'
    },
    connector: {
      shape: 'circle',
      color: '#6b7280',
      icon: 'Circle',
      label: 'Connector'
    }
  }
  
  return configs[nodeType] || configs.process
}

export const optimizeLayout = (diagram) => {
  if (!diagram?.nodes || diagram.nodes.length === 0) return diagram
  
  // Simple layout optimization - arrange nodes in a flow pattern
  const optimizedNodes = diagram.nodes.map((node, index) => ({
    ...node,
    position: calculateNodePosition(index, diagram.nodes.length)
  }))
  
  return {
    ...diagram,
    nodes: optimizedNodes
  }
}

export const getDiagramBounds = (diagram) => {
  if (!diagram?.nodes || diagram.nodes.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 }
  }
  
  const positions = diagram.nodes.map(n => n.position)
  const minX = Math.min(...positions.map(p => p.x)) - 100
  const maxX = Math.max(...positions.map(p => p.x)) + 100
  const minY = Math.min(...positions.map(p => p.y)) - 50
  const maxY = Math.max(...positions.map(p => p.y)) + 50
  
return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  }
}

export const updateNodePosition = (diagram, nodeId, newPosition) => {
  if (!diagram?.nodes || !nodeId || !newPosition) return diagram
  
  const updatedNodes = diagram.nodes.map(node =>
    node.id === nodeId 
      ? { ...node, position: { x: newPosition.x, y: newPosition.y } }
      : node
  )
  
  return {
    ...diagram,
    nodes: updatedNodes
  }
}

export const getNodeCenter = (node) => {
  if (!node?.position) return { x: 0, y: 0 }
  return {
    x: node.position.x,
    y: node.position.y
  }
}

export const snapToGrid = (position, gridSize = 20) => {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize
  }
}