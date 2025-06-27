import { useState, useCallback } from 'react'
import diagramService from '@/services/api/diagramService'
import { validateDiagram, optimizeLayout } from '@/utils/diagramUtils'

export const useDiagram = () => {
  const [diagram, setDiagram] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateDiagram = useCallback(async (prompt) => {
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      setError('Please provide a valid process description')
      return
    }

    setLoading(true)
    setError('')

    try {
      const generatedDiagram = await diagramService.generateDiagram(prompt)
      
      // Validate the generated diagram
      const validationErrors = validateDiagram(generatedDiagram)
      if (validationErrors.length > 0) {
        throw new Error(`Invalid diagram: ${validationErrors.join(', ')}`)
      }

      // Optimize layout
      const optimizedDiagram = optimizeLayout(generatedDiagram)
      
      setDiagram(optimizedDiagram)
      setError('')
    } catch (err) {
      const errorMessage = err.message || 'Failed to generate diagram. Please try again.'
      setError(errorMessage)
      console.error('Diagram generation error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateNode = useCallback((nodeId, nodeData) => {
    if (!diagram || !nodeId || !nodeData) return

    setDiagram(prevDiagram => {
      const updatedNodes = prevDiagram.nodes.map(node =>
        node.id === nodeId ? { ...node, ...nodeData } : node
      )

      return {
        ...prevDiagram,
        nodes: updatedNodes
      }
    })
  }, [diagram])

  const deleteNode = useCallback((nodeId) => {
    if (!diagram || !nodeId) return

    setDiagram(prevDiagram => {
      // Remove the node
      const updatedNodes = prevDiagram.nodes.filter(node => node.id !== nodeId)
      
      // Remove connections that reference the deleted node
      const updatedConnections = prevDiagram.connections.filter(
        connection => connection.sourceId !== nodeId && connection.targetId !== nodeId
      )

      return {
        ...prevDiagram,
        nodes: updatedNodes,
        connections: updatedConnections
      }
    })
  }, [diagram])

  const clearDiagram = useCallback(() => {
    setDiagram(null)
    setError('')
  }, [])

  const retryGeneration = useCallback(() => {
    if (diagram?.prompt) {
      generateDiagram(diagram.prompt)
    }
  }, [diagram?.prompt, generateDiagram])

  return {
    diagram,
    loading,
    error,
    generateDiagram,
    updateNode,
    deleteNode,
    clearDiagram,
    retryGeneration
  }
}

export default useDiagram