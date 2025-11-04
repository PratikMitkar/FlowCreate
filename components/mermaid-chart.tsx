"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"

interface MermaidChartProps {
  chart: string
  width?: number
  height?: number
  style?: string
  direction?: "TD" | "LR" | "RL" | "BT"
  customColors?: {
    primaryColor?: string
    secondaryColor?: string
    tertiaryColor?: string
    backgroundColor?: string
    textColor?: string // Text inside primary nodes
    secondaryTextColor?: string // Text inside secondary nodes
    tertiaryTextColor?: string // Text inside tertiary nodes
    labelTextColor?: string // Text outside nodes (labels, edge text)
    lineColor?: string
    accentColor?: string
    borderColor?: string
  }
  customStyles?: {
    nodeShape?: string
    nodeSize?: number
    lineStyle?: string
    lineThickness?: number
    cornerRadius?: number
    fontSize?: number
    fontFamily?: string
    fontWeight?: string
    nodeSpacing?: number
    levelSpacing?: number
    padding?: number
    shadow?: boolean
    gradient?: boolean
    animation?: boolean
  }
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
  customColors,
  customStyles,
}: MermaidChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  // Helper function to validate hex colors
  const isValidHexColor = (color: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
  }

  // Helper function to sanitize color values
  const sanitizeColor = (color: string | undefined, fallback: string): string => {
    if (!color) return fallback
    return isValidHexColor(color) ? color : fallback
  }

  useEffect(() => {
    // Determine curve style based on selected style
    let curveStyle: any = "basis";
    switch (style) {
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

    // Get base style preset
    const baseStyle = stylePresets[style as keyof typeof stylePresets] || stylePresets.pastel

    // Sanitize custom colors before applying
    const sanitizedPrimaryColor = sanitizeColor(customColors?.primaryColor, baseStyle.primaryColor)
    const sanitizedSecondaryColor = sanitizeColor(customColors?.secondaryColor, baseStyle.secondaryColor)
    const sanitizedTertiaryColor = sanitizeColor(customColors?.tertiaryColor, baseStyle.tertiaryColor)
    const sanitizedBackgroundColor = sanitizeColor(customColors?.backgroundColor, baseStyle.background)
    const sanitizedTextColor = sanitizeColor(customColors?.textColor, baseStyle.primaryTextColor)
    const sanitizedSecondaryTextColor = sanitizeColor(customColors?.secondaryTextColor, baseStyle.secondaryTextColor)
    const sanitizedTertiaryTextColor = sanitizeColor(customColors?.tertiaryTextColor, baseStyle.tertiaryTextColor)
    const sanitizedLabelTextColor = sanitizeColor(customColors?.labelTextColor, baseStyle.textColor)
    const sanitizedBorderColor = sanitizeColor(customColors?.borderColor, baseStyle.primaryBorderColor)

    // Sanitize additional colors
    const sanitizedLineColor = sanitizeColor(customColors?.lineColor, baseStyle.lineColor)
    const sanitizedAccentColor = sanitizeColor(customColors?.accentColor, baseStyle.primaryColor)

    // Override with custom colors if provided (using sanitized colors)
    const selectedStyle = {
      ...baseStyle,
      ...(customColors?.primaryColor && isValidHexColor(customColors.primaryColor) && {
        primaryColor: sanitizedPrimaryColor,
        mainBkg: sanitizedPrimaryColor,
        // Flowchart specific color mappings
        cScale0: sanitizedPrimaryColor,
        cScale1: sanitizedPrimaryColor,
        cScale2: sanitizedPrimaryColor,
        // Alternative flowchart color variables
        c0: sanitizedPrimaryColor,
        c1: sanitizedPrimaryColor,
        c2: sanitizedPrimaryColor,
      }),
      ...(customColors?.secondaryColor && isValidHexColor(customColors.secondaryColor) && {
        secondaryColor: sanitizedSecondaryColor,
        secondBkg: sanitizedSecondaryColor,
        // Flowchart specific color mappings
        cScale3: sanitizedSecondaryColor,
        cScale4: sanitizedSecondaryColor,
        cScale5: sanitizedSecondaryColor,
        // Alternative flowchart color variables
        c3: sanitizedSecondaryColor,
        c4: sanitizedSecondaryColor,
        c5: sanitizedSecondaryColor,
      }),
      ...(customColors?.tertiaryColor && isValidHexColor(customColors.tertiaryColor) && {
        tertiaryColor: sanitizedTertiaryColor,
        tertiaryBkg: sanitizedTertiaryColor,
        // Flowchart specific color mappings
        cScale6: sanitizedTertiaryColor,
        cScale7: sanitizedTertiaryColor,
        cScale8: sanitizedTertiaryColor,
        // Alternative flowchart color variables
        c6: sanitizedTertiaryColor,
        c7: sanitizedTertiaryColor,
        c8: sanitizedTertiaryColor,
      }),
      ...(customColors?.borderColor && isValidHexColor(customColors.borderColor) && {
        primaryBorderColor: sanitizedBorderColor,
        nodeBorder: sanitizedBorderColor,
        border1: sanitizedBorderColor,
        border2: sanitizedBorderColor,
      }),
      ...(customColors?.backgroundColor && isValidHexColor(customColors.backgroundColor) && {
        background: sanitizedBackgroundColor,
        edgeLabelBackground: sanitizedBackgroundColor,
      }),
      ...(customColors?.textColor && isValidHexColor(customColors.textColor) && {
        // Primary node text color
        primaryTextColor: sanitizedTextColor,
        nodeTextColor: sanitizedTextColor,
        // For class diagrams
        classText: sanitizedTextColor,
        // For state diagrams
        labelColor: sanitizedTextColor,
      }),
      ...(customColors?.secondaryTextColor && isValidHexColor(customColors.secondaryTextColor) && {
        // Secondary node text color
        secondaryTextColor: sanitizedSecondaryTextColor,
      }),
      ...(customColors?.tertiaryTextColor && isValidHexColor(customColors.tertiaryTextColor) && {
        // Tertiary node text color
        tertiaryTextColor: sanitizedTertiaryTextColor,
      }),
      ...(customColors?.labelTextColor && isValidHexColor(customColors.labelTextColor) && {
        // Label text color (text outside boxes - labels, edge text)
        textColor: sanitizedLabelTextColor,
        titleColor: sanitizedLabelTextColor,
        // For edge labels
        edgeLabelColor: sanitizedLabelTextColor,
        // For sequence diagrams
        actorTextColor: sanitizedLabelTextColor,
        // For pie charts
        pieLegendTextColor: sanitizedLabelTextColor,
      }),
      ...(customColors?.lineColor && isValidHexColor(customColors.lineColor) && {
        lineColor: sanitizedLineColor,
        defaultLinkColor: sanitizedLineColor,
      }),
      ...(customColors?.accentColor && isValidHexColor(customColors.accentColor) && {
        accentColor: sanitizedAccentColor,
      }),
      // Apply custom typography
      ...(customStyles?.fontSize && {
        fontSize: `${customStyles.fontSize}px`,
      }),
      ...(customStyles?.fontFamily && {
        fontFamily: customStyles.fontFamily,
      }),
    }

    try {
      mermaid.initialize({
        startOnLoad: true,
        theme: "base",
        themeVariables: selectedStyle,
        securityLevel: 'loose',
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: curveStyle,
          padding: customStyles?.padding || 30,
          nodeSpacing: customStyles?.nodeSpacing || (direction === "LR" || direction === "RL" ? 120 : 100),
          rankSpacing: customStyles?.levelSpacing || (direction === "LR" || direction === "RL" ? 150 : 100),
          diagramPadding: customStyles?.padding || 20,
        },
        sequence: {
          useMaxWidth: false,
          diagramMarginX: customStyles?.padding || 50,
          diagramMarginY: customStyles?.padding || 10,
          actorMargin: customStyles?.nodeSpacing || 50,
          width: customStyles?.nodeSize || 150,
          height: customStyles?.nodeSize || 65,
        },
        gantt: {
          useMaxWidth: false,
          leftPadding: customStyles?.padding || 75,
          gridLineStartPadding: customStyles?.padding || 35,
        },
        class: {
          useMaxWidth: false,
        },
        state: {
          useMaxWidth: false,
        },
        pie: {
          useMaxWidth: false,
          textPosition: 0.5,
        },
        er: {
          useMaxWidth: false,
          entityPadding: customStyles?.padding || 15,
        },
        journey: {
          useMaxWidth: false,
          diagramMarginX: customStyles?.padding || 50,
          diagramMarginY: customStyles?.padding || 10,
        },
      })
    } catch (error) {
      console.error("Mermaid initialization error:", error)
      // Fallback to base style if custom colors cause issues
      mermaid.initialize({
        startOnLoad: true,
        theme: "base",
        themeVariables: baseStyle,
        securityLevel: 'loose',
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
    }
  }, [style, direction, customColors, customStyles])
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

        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`
        const { svg } = await mermaid.render(id, transformedChart)

        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(svg, "image/svg+xml")
        const svgElement = svgDoc.querySelector("svg")

        if (svgElement) {
          // Get base style preset for fallback values
          const baseStyle = stylePresets[style as keyof typeof stylePresets] || stylePresets.pastel

          // Sanitize custom colors for manual application
          const sanitizedPrimaryColor = sanitizeColor(customColors?.primaryColor, baseStyle.primaryColor)
          const sanitizedSecondaryColor = sanitizeColor(customColors?.secondaryColor, baseStyle.secondaryColor)
          const sanitizedTertiaryColor = sanitizeColor(customColors?.tertiaryColor, baseStyle.tertiaryColor)
          const sanitizedTextColor = sanitizeColor(customColors?.textColor, baseStyle.primaryTextColor)
          const sanitizedSecondaryTextColor = sanitizeColor(customColors?.secondaryTextColor, baseStyle.secondaryTextColor)
          const sanitizedTertiaryTextColor = sanitizeColor(customColors?.tertiaryTextColor, baseStyle.tertiaryTextColor)
          const sanitizedLabelTextColor = sanitizeColor(customColors?.labelTextColor, baseStyle.textColor)
          const sanitizedBorderColor = sanitizeColor(customColors?.borderColor, baseStyle.primaryBorderColor)
          const sanitizedLineColor = sanitizeColor(customColors?.lineColor, baseStyle.lineColor)

          // Apply custom line styles based on diagram type
          if (diagramType === 'flowchart' || diagramType === 'sequence' || diagramType === 'state') {
            const paths = svgElement.querySelectorAll("path")
            paths.forEach((path) => {
              // Apply line thickness
              if (customStyles?.lineThickness) {
                path.setAttribute("stroke-width", customStyles.lineThickness.toString())
              }

              // Apply line style
              if (customStyles?.lineStyle) {
                switch (customStyles.lineStyle) {
                  case "dashed":
                    path.setAttribute("stroke-dasharray", "8,4")
                    break;
                  case "dotted":
                    path.setAttribute("stroke-dasharray", "2,2")
                    break;
                  case "solid":
                  default:
                    path.setAttribute("stroke-dasharray", "0")
                    break;
                }
              } else if (style === "pastel") {
                // Default pastel style
                path.setAttribute("stroke-dasharray", "5,5")
                path.setAttribute("stroke-width", "2")
              }
            })

            // Ensure markers don't inherit dash patterns
            const markers = svgElement.querySelectorAll("marker path")
            markers.forEach((marker) => {
              marker.setAttribute("stroke-dasharray", "0")
            })
          }

          // Apply custom corner radius and shapes based on diagram type
          if (diagramType === 'flowchart' || diagramType === 'class' || diagramType === 'er') {
            const rects = svgElement.querySelectorAll("rect")
            rects.forEach((rect) => {
              let rx = "12";
              let ry = "12";

              // Use custom corner radius if provided
              if (customStyles?.cornerRadius !== undefined) {
                rx = customStyles.cornerRadius.toString();
                ry = customStyles.cornerRadius.toString();
              } else {
                // Default corner radii based on style and diagram type
                switch (diagramType) {
                  case "class":
                    rx = "4";
                    ry = "4";
                    break;
                  case "er":
                    rx = "8";
                    ry = "8";
                    break;
                  default:
                    switch (style) {
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
                }
              }

              rect.setAttribute("rx", rx)
              rect.setAttribute("ry", ry)
            })
          }

          // Apply custom node shapes and sizes based on diagram type
          if (customStyles?.nodeShape || customStyles?.nodeSize) {
            const nodes = svgElement.querySelectorAll("g.node")
            nodes.forEach((node) => {
              const rect = node.querySelector("rect")
              if (rect) {
                const originalWidth = parseFloat(rect.getAttribute("width") || "0")
                const originalHeight = parseFloat(rect.getAttribute("height") || "0")
                const x = parseFloat(rect.getAttribute("x") || "0")
                const y = parseFloat(rect.getAttribute("y") || "0")

                // Calculate size based on nodeSize setting
                const sizeMultiplier = customStyles?.nodeSize ? customStyles.nodeSize / 100 : 1
                const width = originalWidth * sizeMultiplier
                const height = originalHeight * sizeMultiplier

                // Adjust position to keep node centered
                const newX = x - (width - originalWidth) / 2
                const newY = y - (height - originalHeight) / 2

                switch (customStyles?.nodeShape) {
                  case "circle":
                    if (diagramType === 'flowchart' || diagramType === 'state') {
                      // Use nodeSize to control circle radius
                      const baseRadius = Math.min(originalWidth, originalHeight) / 2
                      const radius = baseRadius * sizeMultiplier
                      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
                      circle.setAttribute("cx", (x + originalWidth / 2).toString())
                      circle.setAttribute("cy", (y + originalHeight / 2).toString())
                      circle.setAttribute("r", radius.toString())
                      circle.setAttribute("fill", rect.getAttribute("fill") || "")
                      circle.setAttribute("stroke", rect.getAttribute("stroke") || "")
                      circle.setAttribute("stroke-width", rect.getAttribute("stroke-width") || "")
                      rect.parentNode?.replaceChild(circle, rect)
                    }
                    break;
                  case "diamond":
                    if (diagramType === 'flowchart') {
                      const diamond = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
                      const centerX = x + originalWidth / 2
                      const centerY = y + originalHeight / 2
                      const halfWidth = width / 2
                      const halfHeight = height / 2
                      const points = `${centerX},${centerY - halfHeight} ${centerX + halfWidth},${centerY} ${centerX},${centerY + halfHeight} ${centerX - halfWidth},${centerY}`
                      diamond.setAttribute("points", points)
                      diamond.setAttribute("fill", rect.getAttribute("fill") || "")
                      diamond.setAttribute("stroke", rect.getAttribute("stroke") || "")
                      diamond.setAttribute("stroke-width", rect.getAttribute("stroke-width") || "")
                      rect.parentNode?.replaceChild(diamond, rect)
                    }
                    break;
                  case "hexagon":
                    if (diagramType === 'flowchart') {
                      const hexagon = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
                      const centerX = x + originalWidth / 2
                      const centerY = y + originalHeight / 2
                      const halfWidth = width / 2
                      const halfHeight = height / 2
                      const offset = halfWidth * 0.3
                      const points = `${centerX - offset},${centerY - halfHeight} ${centerX + offset},${centerY - halfHeight} ${centerX + halfWidth},${centerY} ${centerX + offset},${centerY + halfHeight} ${centerX - offset},${centerY + halfHeight} ${centerX - halfWidth},${centerY}`
                      hexagon.setAttribute("points", points)
                      hexagon.setAttribute("fill", rect.getAttribute("fill") || "")
                      hexagon.setAttribute("stroke", rect.getAttribute("stroke") || "")
                      hexagon.setAttribute("stroke-width", rect.getAttribute("stroke-width") || "")
                      rect.parentNode?.replaceChild(hexagon, rect)
                    }
                    break;
                  case "rectangle":
                  default:
                    // Apply size to rectangle
                    if (customStyles?.nodeSize) {
                      rect.setAttribute("width", width.toString())
                      rect.setAttribute("height", height.toString())
                      rect.setAttribute("x", newX.toString())
                      rect.setAttribute("y", newY.toString())
                    }
                    break;
                }
              }
            })
          }

          // FORCE APPLY CUSTOM COLORS - Simple and effective approach
          console.log("🎨 Applying custom colors:", customColors)
          console.log("🎨 Sanitized colors:", {
            primary: sanitizedPrimaryColor,
            secondary: sanitizedSecondaryColor,
            tertiary: sanitizedTertiaryColor,
            text: sanitizedTextColor,
            border: sanitizedBorderColor,
            line: sanitizedLineColor
          })

          // Apply colors to all shapes with smarter logic
          const allShapes = svgElement.querySelectorAll("rect, circle, polygon, ellipse")
          console.log(`🎨 Found ${allShapes.length} shapes`)

          // Separate shapes by type for better color assignment
          const rectangles = svgElement.querySelectorAll("rect")
          const diamonds = svgElement.querySelectorAll("polygon")
          const circles = svgElement.querySelectorAll("circle")
          const ellipses = svgElement.querySelectorAll("ellipse")

          console.log(`🎨 Shape breakdown: ${rectangles.length} rects, ${diamonds.length} polygons, ${circles.length} circles, ${ellipses.length} ellipses`)

          // Apply primary color to rectangles
          rectangles.forEach((shape, index) => {
            console.log(`🎨 Coloring rectangle ${index} with primary color ${sanitizedPrimaryColor}`)
            shape.setAttribute("fill", sanitizedPrimaryColor)
            const svgShape = shape as SVGElement
            if (svgShape.style) {
              svgShape.style.fill = sanitizedPrimaryColor
            }
            if (customColors?.borderColor) {
              shape.setAttribute("stroke", sanitizedBorderColor)
              if (svgShape.style) {
                svgShape.style.stroke = sanitizedBorderColor
              }
            }
          })

          // Apply secondary color to diamonds/polygons
          diamonds.forEach((shape, index) => {
            console.log(`🎨 Coloring diamond ${index} with secondary color ${sanitizedSecondaryColor}`)
            shape.setAttribute("fill", sanitizedSecondaryColor)
            const svgShape = shape as SVGElement
            if (svgShape.style) {
              svgShape.style.fill = sanitizedSecondaryColor
            }
            if (customColors?.borderColor) {
              shape.setAttribute("stroke", sanitizedBorderColor)
              if (svgShape.style) {
                svgShape.style.stroke = sanitizedBorderColor
              }
            }
          })

          // Apply tertiary color to circles
          circles.forEach((shape, index) => {
            console.log(`🎨 Coloring circle ${index} with tertiary color ${sanitizedTertiaryColor}`)
            shape.setAttribute("fill", sanitizedTertiaryColor)
            const svgShape = shape as SVGElement
            if (svgShape.style) {
              svgShape.style.fill = sanitizedTertiaryColor
            }
            if (customColors?.borderColor) {
              shape.setAttribute("stroke", sanitizedBorderColor)
              if (svgShape.style) {
                svgShape.style.stroke = sanitizedBorderColor
              }
            }
          })

          // Apply tertiary color to ellipses as well
          ellipses.forEach((shape, index) => {
            console.log(`🎨 Coloring ellipse ${index} with tertiary color ${sanitizedTertiaryColor}`)
            shape.setAttribute("fill", sanitizedTertiaryColor)
            const svgShape = shape as SVGElement
            if (svgShape.style) {
              svgShape.style.fill = sanitizedTertiaryColor
            }
            if (customColors?.borderColor) {
              shape.setAttribute("stroke", sanitizedBorderColor)
              if (svgShape.style) {
                svgShape.style.stroke = sanitizedBorderColor
              }
            }
          })

          // Apply colors to text based on parent shape type
          const allTexts = svgElement.querySelectorAll("text, tspan")
          console.log(`🎨 Found ${allTexts.length} text elements`)

          allTexts.forEach((text, index) => {
            const parentNode = text.closest("g")
            let textColor = sanitizedTextColor // default to primary text color

            if (parentNode) {
              // Check what type of shape this text belongs to
              const parentRect = parentNode.querySelector("rect")
              const parentPolygon = parentNode.querySelector("polygon")
              const parentCircle = parentNode.querySelector("circle")

              if (parentRect) {
                // Text inside rectangle - use primary text color
                textColor = sanitizedTextColor
                console.log(`🎨 Coloring rectangle text ${index} with primary text color ${textColor}`)
              } else if (parentPolygon) {
                // Text inside diamond/polygon - use secondary text color
                textColor = sanitizedSecondaryTextColor
                console.log(`🎨 Coloring diamond text ${index} with secondary text color ${textColor}`)
              } else if (parentCircle) {
                // Text inside circle - use tertiary text color
                textColor = sanitizedTertiaryTextColor
                console.log(`🎨 Coloring circle text ${index} with tertiary text color ${textColor}`)
              } else {
                // Text outside shapes (labels, edge text) - use label text color
                textColor = sanitizedLabelTextColor
                console.log(`🎨 Coloring label text ${index} with label text color ${textColor}`)
              }
            }

            text.setAttribute("fill", textColor)
            const svgText = text as SVGElement
            if (svgText.style) {
              svgText.style.fill = textColor
            }
          })

          // Apply colors to all paths
          const allPaths = svgElement.querySelectorAll("path")
          console.log(`🎨 Found ${allPaths.length} paths`)
          allPaths.forEach((path, index) => {
            if (customColors?.lineColor) {
              console.log(`🎨 Coloring path ${index} with ${sanitizedLineColor}`)
              path.setAttribute("stroke", sanitizedLineColor)

              // Cast to SVGElement to access style property
              const svgPath = path as SVGElement
              if (svgPath.style) {
                svgPath.style.stroke = sanitizedLineColor
              }
            }
          })

          // Apply custom font styles
          const textElements = svgElement.querySelectorAll("text, tspan")
          textElements.forEach((textElement) => {
            // Apply font styles
            if (customStyles?.fontSize) {
              textElement.setAttribute("font-size", `${customStyles.fontSize}px`)
            }
            if (customStyles?.fontFamily) {
              textElement.setAttribute("font-family", customStyles.fontFamily)
            }
            if (customStyles?.fontWeight) {
              textElement.setAttribute("font-weight", customStyles.fontWeight)
            }
          })

          // Apply shadow effect if enabled
          if (customStyles?.shadow) {
            const defs = svgElement.querySelector("defs") || document.createElementNS("http://www.w3.org/2000/svg", "defs")
            if (!svgElement.querySelector("defs")) {
              svgElement.insertBefore(defs, svgElement.firstChild)
            }

            const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter")
            filter.setAttribute("id", "drop-shadow")
            filter.innerHTML = `
              <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
            `
            defs.appendChild(filter)

            const nodes = svgElement.querySelectorAll("g.node rect, g.node circle, g.node polygon")
            nodes.forEach((node) => {
              node.setAttribute("filter", "url(#drop-shadow)")
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
  }, [chart, width, height, style, direction, customColors, customStyles])

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