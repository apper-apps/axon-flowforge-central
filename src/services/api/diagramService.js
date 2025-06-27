const diagramService = {
  async generateDiagram(prompt) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate occasional errors for testing
    if (Math.random() < 0.1) {
      throw new Error('Failed to connect to AI service. Please try again.')
    }
    
    // Generate mock diagram based on prompt
    const mockDiagram = this.createMockDiagram(prompt)
    return mockDiagram
  },

  createMockDiagram(prompt) {
    const nodes = []
    const connections = []
    
    // Parse prompt to identify process steps
    const steps = this.extractStepsFromPrompt(prompt)
    
    // Create nodes based on steps
    steps.forEach((step, index) => {
      const nodeId = `node-${index + 1}`
      const nodeType = this.determineNodeType(step, index, steps.length)
      
      nodes.push({
        id: nodeId,
        type: nodeType,
        label: step.label,
        description: step.description,
        position: {
          x: 200 + (index % 3) * 250,
          y: 150 + Math.floor(index / 3) * 150
        },
        style: {
          backgroundColor: '#ffffff',
          borderColor: this.getNodeColor(nodeType)
        }
      })
      
      // Create connections between sequential nodes
      if (index > 0) {
        connections.push({
          id: `connection-${index}`,
          sourceId: `node-${index}`,
          targetId: nodeId,
          label: step.condition || '',
          type: 'flow'
        })
      }
    })
    
    return {
      id: `diagram-${Date.now()}`,
      prompt,
      nodes,
      connections,
      style: 'standard',
      createdAt: new Date().toISOString()
    }
  },

  extractStepsFromPrompt(prompt) {
    // Simple prompt parsing - in a real app, this would use AI/NLP
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    const steps = sentences.map((sentence, index) => {
      const trimmed = sentence.trim()
      
      // Identify decision points
      const isDecision = /\b(if|whether|decide|check|verify|confirm|approve|reject)\b/i.test(trimmed)
      
      // Identify start/end points
      const isStart = index === 0 || /\b(start|begin|initiate|create|submit)\b/i.test(trimmed)
      const isEnd = index === sentences.length - 1 || /\b(end|complete|finish|deliver|send|notify)\b/i.test(trimmed)
      
      return {
        label: this.simplifyStep(trimmed),
        description: trimmed,
        type: isStart ? 'start' : isEnd ? 'end' : isDecision ? 'decision' : 'process',
        condition: isDecision ? this.extractCondition(trimmed) : null
      }
    })
    
    return steps.length > 0 ? steps : this.getDefaultSteps()
  },

  simplifyStep(step) {
    // Simplify step text for node labels
    const simplified = step
      .replace(/^(then|next|after that|finally)\s*/i, '')
      .replace(/\b(the|a|an)\b/g, '')
      .trim()
    
    return simplified.length > 30 ? simplified.substring(0, 30) + '...' : simplified
  },

  extractCondition(step) {
    // Extract condition text from decision steps
    const conditionMatch = step.match(/\b(if|whether)\s+(.+?)(?:\s+then|\s*,|\s*$)/i)
    return conditionMatch ? conditionMatch[2] : null
  },

  determineNodeType(step, index, totalSteps) {
    if (step.type !== 'process') return step.type
    
    // First step is typically start
    if (index === 0) return 'start'
    
    // Last step is typically end
    if (index === totalSteps - 1) return 'end'
    
    // Check for data-related keywords
    if (/\b(data|database|record|store|save|retrieve)\b/i.test(step.description)) {
      return 'data'
    }
    
    return 'process'
  },

  getNodeColor(nodeType) {
    const colorMap = {
      start: '#10b981',
      end: '#ef4444',
      process: '#3b82f6',
      decision: '#f59e0b',
      data: '#8b5cf6',
      connector: '#6b7280'
    }
    return colorMap[nodeType] || colorMap.process
  },

  getDefaultSteps() {
    return [
      {
        label: 'Start Process',
        description: 'Begin the workflow',
        type: 'start'
      },
      {
        label: 'Process Input',
        description: 'Handle the incoming request',
        type: 'process'
      },
      {
        label: 'Make Decision',
        description: 'Evaluate conditions and decide next step',
        type: 'decision'
      },
      {
        label: 'Complete Task',
        description: 'Finish the process',
        type: 'end'
      }
    ]
  }
}

export default diagramService