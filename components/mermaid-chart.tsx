"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"

interface MermaidChartProps {
  chart: string
  width?: number
  height?: number
  style?: string
  direction?: "TD" | "LR" | "RL" | "BT"
}

// Define supported diagram types
type DiagramType = 'flowchart' | 'sequence' | 'gantt' | 'class' | 'state' | 'pie' | 'er' | 'journey' | 'requirement' | 'git' | 'c4';

const getDiagramType = (chart: string): DiagramType => {
  const chartLower = chart.trim().toLowerCase();
  
  if (chartLower.startsWith('graph') || chartLower.startsWith('flowchart')) {
    return 'flowchart';
  } else if (chartLower.startsWith('sequence')) {
    return 'sequence';
  } else if (chartLower.startsWith('gantt')) {
    return 'gantt';
  } else if (chartLower.startsWith('class')) {
    return 'class';
  } else if (chartLower.startsWith('state')) {
    return 'state';
  } else if (chartLower.startsWith('pie')) {
    return 'pie';
  } else if (chartLower.startsWith('er')) {
    return 'er';
  } else if (chartLower.startsWith('journey')) {
    return 'journey';
  } else if (chartLower.startsWith('requirement')) {
    return 'requirement';
  } else if (chartLower.startsWith('git')) {
    return 'git';
  } else if (chartLower.startsWith('c4')) {
    return 'c4';
  } else {
    return 'flowchart'; // default to flowchart
  }
};

const stylePresets = {
  // Soft, muted colors with rounded corners - ideal for presentations
  pastel: {
    primaryColor: "#d4c5b9",
    primaryTextColor: "#2c2c2c",
    primaryBorderColor: "#b8a89a",
    lineColor: "#8b7d6b",
    secondaryColor: "#b8c5b8",
    secondaryTextColor: "#2c2c2c",
    secondaryBorderColor: "#9aab9a",
    tertiaryColor: "#c5b5b8",
    tertiaryTextColor: "#2c2c2c",
    tertiaryBorderColor: "#ab9a9d",
    background: "#f5f1ed",
    mainBkg: "#d4c5b9",
    secondBkg: "#b8c5b8",
    tertiaryBkg: "#c5b5b8",
    textColor: "#2c2c2c",
    border1: "#b8a89a",
    border2: "#9aab9a",
    fontSize: "16px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    nodeBorder: "#b8a89a",
    clusterBkg: "#e8e4e0",
    clusterBorder: "#c5bdb5",
    defaultLinkColor: "#8b7d6b",
    titleColor: "#2c2c2c",
    edgeLabelBackground: "#f5f1ed",
    nodeTextColor: "#2c2c2c",
  },
  // Bright, saturated colors with smooth curves - eye-catching and modern
  vibrant: {
    primaryColor: "#3b82f6",
    primaryTextColor: "#ffffff",
    primaryBorderColor: "#2563eb",
    lineColor: "#60a5fa",
    secondaryColor: "#8b5cf6",
    secondaryTextColor: "#ffffff",
    secondaryBorderColor: "#7c3aed",
    tertiaryColor: "#10b981",
    tertiaryTextColor: "#ffffff",
    tertiaryBorderColor: "#059669",
    background: "#0f172a",
    mainBkg: "#3b82f6",
    secondBkg: "#8b5cf6",
    tertiaryBkg: "#10b981",
    textColor: "#ffffff",
    border1: "#2563eb",
    border2: "#7c3aed",
    fontSize: "18px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    nodeBorder: "#2563eb",
    clusterBkg: "#1e293b",
    clusterBorder: "#475569",
    defaultLinkColor: "#60a5fa",
    titleColor: "#f1f5f9",
    edgeLabelBackground: "#1e293b",
    nodeTextColor: "#ffffff",
  },
  // Clean, simple design with sharp edges - perfect for technical documentation
  minimal: {
    primaryColor: "#f8f9fa",
    primaryTextColor: "#212529",
    primaryBorderColor: "#dee2e6",
    lineColor: "#6c757d",
    secondaryColor: "#e9ecef",
    secondaryTextColor: "#212529",
    secondaryBorderColor: "#ced4da",
    tertiaryColor: "#f8f9fa",
    tertiaryTextColor: "#212529",
    tertiaryBorderColor: "#dee2e6",
    background: "#ffffff",
    mainBkg: "#f8f9fa",
    secondBkg: "#e9ecef",
    tertiaryBkg: "#f8f9fa",
    textColor: "#212529",
    border1: "#dee2e6",
    border2: "#ced4da",
    fontSize: "16px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    nodeBorder: "#dee2e6",
    clusterBkg: "#f8f9fa",
    clusterBorder: "#e9ecef",
    defaultLinkColor: "#6c757d",
    titleColor: "#212529",
    edgeLabelBackground: "#ffffff",
    nodeTextColor: "#212529",
  },
  // Cool blue tones with rounded corners - calming and professional
  ocean: {
    primaryColor: "#0ea5e9",
    primaryTextColor: "#ffffff",
    primaryBorderColor: "#0284c7",
    lineColor: "#38bdf8",
    secondaryColor: "#06b6d4",
    secondaryTextColor: "#ffffff",
    secondaryBorderColor: "#0891b2",
    tertiaryColor: "#14b8a6",
    tertiaryTextColor: "#ffffff",
    tertiaryBorderColor: "#0d9488",
    background: "#0c4a6e",
    mainBkg: "#0ea5e9",
    secondBkg: "#06b6d4",
    tertiaryBkg: "#14b8a6",
    textColor: "#ffffff",
    border1: "#0284c7",
    border2: "#0891b2",
    fontSize: "17px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    nodeBorder: "#0284c7",
    clusterBkg: "#075985",
    clusterBorder: "#0369a1",
    defaultLinkColor: "#38bdf8",
    titleColor: "#f0f9ff",
    edgeLabelBackground: "#0c4a6e",
    nodeTextColor: "#ffffff",
  },
  // Professional blue and purple tones with subtle rounded corners - ideal for business presentations
  corporate: {
    primaryColor: "#2563eb",
    primaryTextColor: "#ffffff",
    primaryBorderColor: "#1d4ed8",
    lineColor: "#93c5fd",
    secondaryColor: "#818cf8",
    secondaryTextColor: "#ffffff",
    secondaryBorderColor: "#4f46e5",
    tertiaryColor: "#0ea5e9",
    tertiaryTextColor: "#ffffff",
    tertiaryBorderColor: "#0284c7",
    background: "#f1f5f9",
    mainBkg: "#2563eb",
    secondBkg: "#818cf8",
    tertiaryBkg: "#0ea5e9",
    textColor: "#1e293b",
    border1: "#1d4ed8",
    border2: "#4f46e5",
    fontSize: "16px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    nodeBorder: "#1d4ed8",
    clusterBkg: "#e2e8f0",
    clusterBorder: "#cbd5e1",
    defaultLinkColor: "#93c5fd",
    titleColor: "#0f172a",
    edgeLabelBackground: "#f1f5f9",
    nodeTextColor: "#ffffff",
  },
  // Warm orange and yellow tones with moderate rounded corners - energetic and vibrant
  sunset: {
    primaryColor: "#f97316",
    primaryTextColor: "#ffffff",
    primaryBorderColor: "#ea580c",
    lineColor: "#fdba74",
    secondaryColor: "#eab308",
    secondaryTextColor: "#ffffff",
    secondaryBorderColor: "#ca8a04",
    tertiaryColor: "#84cc16",
    tertiaryTextColor: "#ffffff",
    tertiaryBorderColor: "#65a30d",
    background: "#fff7ed",
    mainBkg: "#f97316",
    secondBkg: "#eab308",
    tertiaryBkg: "#84cc16",
    textColor: "#431407",
    border1: "#ea580c",
    border2: "#ca8a04",
    fontSize: "16px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    nodeBorder: "#ea580c",
    clusterBkg: "#ffedd5",
    clusterBorder: "#fed7aa",
    defaultLinkColor: "#fdba74",
    titleColor: "#431407",
    edgeLabelBackground: "#fff7ed",
    nodeTextColor: "#ffffff",
  },
  // Green tones with rounded corners - natural and eco-friendly feel
  forest: {
    primaryColor: "#16a34a",
    primaryTextColor: "#ffffff",
    primaryBorderColor: "#15803d",
    lineColor: "#86efac",
    secondaryColor: "#22c55e",
    secondaryTextColor: "#ffffff",
    secondaryBorderColor: "#16a34a",
    tertiaryColor: "#a3a3a3",
    tertiaryTextColor: "#ffffff",
    tertiaryBorderColor: "#737373",
    background: "#f0fdf4",
    mainBkg: "#16a34a",
    secondBkg: "#22c55e",
    tertiaryBkg: "#a3a3a3",
    textColor: "#14532d",
    border1: "#15803d",
    border2: "#16a34a",
    fontSize: "16px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    nodeBorder: "#15803d",
    clusterBkg: "#dcfce7",
    clusterBorder: "#bbf7d0",
    defaultLinkColor: "#86efac",
    titleColor: "#14532d",
    edgeLabelBackground: "#f0fdf4",
    nodeTextColor: "#ffffff",
  },
  // Dark theme with contrasting colors - perfect for low-light environments
  dark: {
    primaryColor: "#7dd3fc",
    primaryTextColor: "#082f49",
    primaryBorderColor: "#0ea5e9",
    lineColor: "#0ea5e9",
    secondaryColor: "#c084fc",
    secondaryTextColor: "#3b0764",
    secondaryBorderColor: "#a855f7",
    tertiaryColor: "#f87171",
    tertiaryTextColor: "#7f1d1d",
    tertiaryBorderColor: "#ef4444",
    background: "#0f172a",
    mainBkg: "#7dd3fc",
    secondBkg: "#c084fc",
    tertiaryBkg: "#f87171",
    textColor: "#e2e8f0",
    border1: "#0ea5e9",
    border2: "#a855f7",
    fontSize: "16px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    nodeBorder: "#0ea5e9",
    clusterBkg: "#1e293b",
    clusterBorder: "#334155",
    defaultLinkColor: "#38bdf8",
    titleColor: "#f1f5f9",
    edgeLabelBackground: "#0f172a",
    nodeTextColor: "#082f49",
  }
}

export default function MermaidChart({
  chart,
  width = 1920,
  height = 1080,
  style = "pastel",
  direction = "TD",
}: MermaidChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Determine curve style based on selected style
    let curveStyle: any = "basis";
    switch(style) {
      case "pastel":
        curveStyle = "linear";
        break;
      case "minimal":
        curveStyle = "linear";
        break;
      case "corporate":
        curveStyle = "basis";
        break;
      default:
        curveStyle = "basis";
    }
    
    const selectedStyle = stylePresets[style as keyof typeof stylePresets] || stylePresets.pastel

    mermaid.initialize({
      startOnLoad: true,
      theme: "base",
      themeVariables: selectedStyle,
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: curveStyle,
        padding: 30,
        nodeSpacing: direction === "LR" || direction === "RL" ? 120 : 100,
        rankSpacing: direction === "LR" || direction === "RL" ? 150 : 100,
        diagramPadding: 20,
      },
    })
  }, [style, direction])

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current || !chart.trim()) return

      try {
        setError(null)
        let transformedChart = chart;
        
        // Get diagram type
        const diagramType = getDiagramType(chart);
        
        // Only transform flowchart directions
        if (diagramType === 'flowchart') {
          transformedChart = chart.replace(/^graph\s+(TD|LR|RL|BT)/m, `graph ${direction}`)
        }

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        const { svg } = await mermaid.render(id, transformedChart)

        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(svg, "image/svg+xml")
        const svgElement = svgDoc.querySelector("svg")

        if (svgElement) {
          // Apply special styling only to flowcharts
          if (diagramType === 'flowchart' && style === "pastel") {
            const paths = svgElement.querySelectorAll("path.flowchart-link")
            paths.forEach((path) => {
              path.setAttribute("stroke-dasharray", "5,5")
              path.setAttribute("stroke-width", "2")
            })

            const markers = svgElement.querySelectorAll("marker path")
            markers.forEach((marker) => {
              marker.setAttribute("stroke-dasharray", "0")
            })
          }

          // Apply rounded corners only to flowcharts
          if (diagramType === 'flowchart') {
            const rects = svgElement.querySelectorAll("rect")
            rects.forEach((rect) => {
              // Different corner radii based on style
              let rx = "12";
              let ry = "12";
              
              switch(style) {
                case "corporate":
                  rx = "4";
                  ry = "4";
                  break;
                case "minimal":
                  rx = "0";
                  ry = "0";
                  break;
                case "dark":
                  rx = "8";
                  ry = "8";
                  break;
                default:
                  rx = "12";
                  ry = "12";
              }
              
              rect.setAttribute("rx", rx)
              rect.setAttribute("ry", ry)
            })
          }

          svgElement.setAttribute("width", "100%")
          svgElement.setAttribute("height", "100%")
          svgElement.setAttribute("style", "max-width: 100%; height: auto;")
          containerRef.current.innerHTML = new XMLSerializer().serializeToString(svgElement)
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err)
        setError(`Invalid ${getDiagramType(chart)} syntax. Please check your code.`)
        if (containerRef.current) {
          containerRef.current.innerHTML = ""
        }
      }
    }

    renderChart()
  }, [chart, width, height, style, direction])

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <p className="text-destructive font-medium mb-2">Rendering Error</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-container w-full flex items-center justify-center"
      style={{
        minHeight: "400px",
        aspectRatio: `${width} / ${height}`,
        maxWidth: "100%",
      }}
    />
  )
}
