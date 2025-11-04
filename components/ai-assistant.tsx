"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, CheckCircle } from "lucide-react"

// Lightweight chart templates for different diagram types
const CHART_TEMPLATES = {
  flowchart: `graph TD
    A[Start] --> B{Condition}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`,
  sequence: `sequenceDiagram
    participant User
    participant System
    User->>System: Request
    System-->>User: Response`,
  gantt: `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Section
    Task 1 :a1, 2024-01-01, 30d
    Task 2 :after a1  , 20d`,
  class: `classDiagram
    class ClassName {
      +property: type
      +method(): returnType
    }`,
  state: `stateDiagram-v2\n    [*] --> State1\n    State1 --> State2: Transition\n    State2 --> [*]`,
  pie: `pie title Distribution\n    "Category 1" : 40\n    "Category 2" : 30\n    "Category 3" : 30`,
  er: `erDiagram
    ENTITY1 ||--o{ ENTITY2 : has
    ENTITY1 {
        string name
    }
    ENTITY2 {
        string description
    }`,
  journey: `journey\n    title User Journey\n    section Section\n      Activity: 5: Actor`
}

// Simplified chart type detection keywords
const CHART_KEYWORDS = {
  flowchart: ['flow', 'process', 'workflow', 'step'],
  sequence: ['sequence', 'interaction', 'message'],
  gantt: ['timeline', 'schedule', 'project'],
  class: ['class', 'object', 'structure'],
  state: ['state', 'status', 'condition'],
  pie: ['distribution', 'proportion'],
  er: ['entity', 'relationship'],
  journey: ['journey', 'experience']
}

interface AIAssistantProps {
  onCodeGenerated: (code: string) => void
}

export default function AIAssistant({ onCodeGenerated }: AIAssistantProps) {
  const [userInput, setUserInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [detectedChartType, setDetectedChartType] = useState<string | null>(null)

  // Detect chart type based on user input
  const detectChartType = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    // Check for specific keywords
    for (const [chartType, keywords] of Object.entries(CHART_KEYWORDS)) {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        return chartType
      }
    }
    
    // Default to flowchart if no specific type detected
    return "flowchart"
  }

  // Generate Mermaid code based on user input
  const generateMermaidCode = (input: string) => {
    setIsLoading(true)
    setIsComplete(false)
    setDetectedChartType(null)
    
    try {
      // Detect the appropriate chart type
      const chartType = detectChartType(input)
      setDetectedChartType(chartType)
      
      // Use a template-based approach for lightweight generation
      const template = CHART_TEMPLATES[chartType as keyof typeof CHART_TEMPLATES] || CHART_TEMPLATES.flowchart
      
      // Simple transformation of template based on user input
      let generatedCode = template
      
      // Replace placeholder names with user concepts
      const concepts = input.match(/[a-zA-Z]+/g) || []
      if (concepts.length > 0) {
        // Replace generic names with user concepts
        const uniqueConcepts = [...new Set(concepts.map(c => c.charAt(0).toUpperCase() + c.slice(1)))]
        
        // For flowcharts, create a simple flow
        if (chartType === 'flowchart') {
          const nodes = uniqueConcepts.slice(0, 5) // Limit to 5 nodes
          if (nodes.length > 1) {
            let flowCode = "graph TD\n"
            for (let i = 0; i < nodes.length - 1; i++) {
              flowCode += `    ${String.fromCharCode(65 + i)}[${nodes[i]}] --> ${String.fromCharCode(66 + i)}[${nodes[i + 1]}]\n`
            }
            generatedCode = flowCode
          } else if (nodes.length === 1) {
            generatedCode = `graph TD\n    A[${nodes[0]}]`
          }
        }
        // For other chart types, do simple replacements
        else {
          generatedCode = template
          uniqueConcepts.forEach((concept, index) => {
            // Simple replacement strategy
            generatedCode = generatedCode.replace(new RegExp(`(Entity|Task|Activity|ClassName|Category|State|Participant|Action|Condition)\\s*${index === 0 ? '' : index}`, 'gi'), concept)
          })
        }
      }
      
      // Small delay to simulate processing
      setTimeout(() => {
        onCodeGenerated(generatedCode)
        setIsComplete(true)
        setIsLoading(false)
      }, 800)
    } catch (error) {
      console.error("Error generating code:", error)
      // Fallback to template
      const chartType = detectChartType(input)
      const template = CHART_TEMPLATES[chartType as keyof typeof CHART_TEMPLATES] || CHART_TEMPLATES.flowchart
      onCodeGenerated(template)
      setIsComplete(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userInput.trim() && !isLoading) {
      generateMermaidCode(userInput)
    }
  }

  // This component only renders on the client side
  if (typeof window === 'undefined') {
    return null
  }

  return (
    <div className="w-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-start" />
          <h3 className="text-lg font-semibold text-foreground">AI Assistant</h3>
        </div>
        {detectedChartType && (
          <Badge variant="secondary" className="animate-fade-in">
            {detectedChartType} chart
          </Badge>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Describe what you want to visualize and I'll generate the Mermaid code for you.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="e.g., Create a flowchart showing the user registration process with steps like signup, email verification, and profile setup"
            className="min-h-[100px] hover-lift"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {isComplete && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                Code generated successfully!
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || !userInput.trim()}
            className="gap-2 bg-gradient-to-r from-accent-start to-accent-end text-white hover:shadow-lg hover:translate-y-[-2px] transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Chart
              </>
            )}
          </Button>
        </div>
      </form>
      
      <div className="mt-4 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-2">Examples:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-auto py-2 px-3 text-left justify-start hover-lift"
            onClick={() => {
              setUserInput("Create a flowchart for a user login process with authentication and error handling")
              if (!isLoading) generateMermaidCode("Create a flowchart for a user login process with authentication and error handling")
            }}
          >
            User login flow
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-auto py-2 px-3 text-left justify-start hover-lift"
            onClick={() => {
              setUserInput("Show a sequence diagram of a user placing an order on an e-commerce website")
              if (!isLoading) generateMermaidCode("Show a sequence diagram of a user placing an order on an e-commerce website")
            }}
          >
            E-commerce sequence
          </Button>
        </div>
      </div>
    </div>
  )
}