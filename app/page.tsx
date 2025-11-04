"use client"

import { useState, useEffect } from "react"
import {
  Code2,
  Download,
  Share,
  Bell,
  Plus,
  Minus,
  ZoomOut,
  ChevronRight,
  Sparkles,
  GitBranch,
  BarChart3,
  Calendar,
  Boxes,
  Activity,
  PieChart,
  Database,
  Route,
  Palette,
  Settings,
  Square,
  Circle,
  Diamond,
  Hexagon,
  Type,
  Layout,
  Zap
} from "lucide-react"
import dynamic from "next/dynamic"

const MermaidChart = dynamic(() => import("@/components/mermaid-chart"), {
  ssr: false,
})

const defaultFlowchartCode = `graph TD
    A[Patient Logs into System] --> B{Upload New Data?}
    B -- Yes --> C[Patient Uploads Data to Database]
    B -- No --> D{Edit Existing Data?}
    D -- Yes --> E[Patient Edits Data in Database]
    D -- No --> F{View Data?}
    F -- Yes --> G[Patient Reads Data from Database]
    F -- No --> H{Share Data with Doctor?}
    H -- Yes --> I[Patient Provides Access to Doctor]
    H -- No --> J[No Action]
`

const getDefaultCode = (type: string) => {
  switch (type) {
    case 'sequence': return `sequenceDiagram
    participant P as Patient
    participant D as Database
    participant Doc as Doctor
    
    P->>D: Login
    D-->>P: Authentication
    P->>D: Upload Data
    P->>D: Edit Data
    P->>D: View Data
    P->>Doc: Share Access
    Doc->>D: Access Data`;

    case 'gantt': return `gantt
    title Medical Data Management Project
    dateFormat  YYYY-MM-DD
    section Design
    Design database schema          :done, des1, 2024-01-01, 2024-01-10
    Create UI mockups               :active, des2, 2024-01-05, 2024-01-15
    section Development
    Backend development             :crit, dev1, 2024-01-10, 2024-02-01
    Frontend development            :dev2, 2024-01-15, 2024-02-15
    section Testing
    QA testing                      :test1, 2024-02-15, 2024-03-01
    User acceptance testing         :test2, 2024-03-01, 2024-03-15`;

    case 'class': return `classDiagram
    class Patient {
        +String name
        +String email
        +String patientId
        +login()
        +uploadData()
        +editData()
        +viewData()
    }
    
    class Doctor {
        +String name
        +String email
        +String doctorId
        +accessPatientData()
    }
    
    class Database {
        +storeData()
        +retrieveData()
        +updateData()
        +deleteData()
    }
    
    Patient --> Database : uploads/edits
    Doctor --> Database : accesses
    Patient --> Doctor : shares access`;

    case 'state': return `stateDiagram-v2
    [*] --> LoggedOut
    LoggedOut --> LoggingIn : Enter credentials
    LoggingIn --> Authenticated : Valid credentials
    LoggingIn --> LoggedOut : Invalid credentials
    Authenticated --> Uploading : Upload data
    Authenticated --> Editing : Edit data
    Authenticated --> Viewing : View data
    Authenticated --> Sharing : Share with doctor
    Uploading --> Authenticated : Upload complete
    Editing --> Authenticated : Edit complete
    Viewing --> Authenticated : Finish viewing
    Sharing --> Authenticated : Sharing complete
    Authenticated --> LoggedOut : Logout`;

    case 'pie': return `%%{init: {"pie": {"textPosition": 0.5}, "themeVariables": {"pieOuterStrokeWidth": "5px"}} }%%
pie title Patient Activities Distribution
    "Data Upload" : 25
    "Data Editing" : 20
    "Data Viewing" : 35
    "Doctor Sharing" : 15
    "Other" : 5`;

    case 'er': return `erDiagram
    PATIENT ||--o{ MEDICAL_RECORD : has
    PATIENT ||--o{ ACCESS_PERMISSION : grants
    DOCTOR ||--o{ ACCESS_PERMISSION : receives
    MEDICAL_RECORD }|--|| DATABASE : stored_in
    
    PATIENT {
        string patientId
        string name
        string email
        date dateOfBirth
    }
    
    DOCTOR {
        string doctorId
        string name
        string email
        string specialization
    }
    
    MEDICAL_RECORD {
        string recordId
        string patientId
        date createdDate
        string data
    }`;

    case 'journey': return `journey
    title Patient Data Management Journey
    section Authentication
      Patient logs in : 5: Patient
    section Data Management
      Upload new data : 4: Patient
      Edit existing data : 3: Patient
      View data : 5: Patient
    section Sharing
      Share with doctor : 4: Patient
      Doctor accesses data : 5: Doctor`;

    default: return defaultFlowchartCode;
  }
}

export default function FlowchartConverter() {
  const [code, setCode] = useState(defaultFlowchartCode)
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [style, setStyle] = useState("pastel")
  const [actualDirection, setActualDirection] = useState<"TD" | "LR" | "RL" | "BT">("TD")
  const [diagramType, setDiagramType] = useState("flowchart")
  const [activeTab, setActiveTab] = useState<"types" | "styles">("types")

  // Comprehensive styling options
  // Output settings
  const [aspectRatio, setAspectRatio] = useState("16:9")
  const [outputDirection, setOutputDirection] = useState<"horizontal" | "vertical">("horizontal")

  // Zoom controls
  const [zoomLevel, setZoomLevel] = useState(100)
  const [downloadFormat, setDownloadFormat] = useState<"svg" | "png" | "png-hd" | "pdf">("svg")
  const [transparentBackground, setTransparentBackground] = useState(false)
  const [pngScale, setPngScale] = useState(2) // 2x = 2x resolution, 4x = 4x resolution, etc.

  const [currentStyles, setCurrentStyles] = useState({
    nodeColor: "#00A896",
    nodeBorderColor: "#0D1B2A",
    nodeTextColor: "#FFFFFF", // Text inside primary nodes
    secondaryNodeColor: "#FF6B6B", // Secondary node color
    secondaryNodeTextColor: "#FFFFFF", // Text inside secondary nodes
    tertiaryNodeColor: "#FFA500", // Tertiary node color  
    tertiaryNodeTextColor: "#FFFFFF", // Text inside tertiary nodes
    labelTextColor: "#0D1B2A", // Text outside boxes (labels, edge text)
    lineColor: "#0D1B2A",
    backgroundColor: "#F0F3F7",
    accentColor: "#FF6B6B",
    fontSize: 14,
    fontFamily: "Inter",
    fontWeight: "normal" as "normal" | "bold",
    nodeShape: "rectangle",
    nodeSize: 100,
    lineStyle: "solid",
    lineThickness: 2,
    cornerRadius: 8,
    nodeSpacing: 50,
    levelSpacing: 100,
    padding: 20,
    shadow: false,
    gradient: false,
    animation: false
  })

  const [appliedStyles, setAppliedStyles] = useState({ ...currentStyles })
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setCode(getDefaultCode(diagramType))
  }, [diagramType])

  useEffect(() => {
    const hasStyleChanges = JSON.stringify(currentStyles) !== JSON.stringify(appliedStyles)
    setHasChanges(hasStyleChanges)
  }, [currentStyles, appliedStyles])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const dropdown = document.getElementById('export-dropdown-portal')
      const button = document.getElementById('export-button')
      if (dropdown && button && !dropdown.contains(e.target as Node) && !button.contains(e.target as Node)) {
        dropdown.style.display = 'none'
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const applyChanges = () => {
    setAppliedStyles({ ...currentStyles })
    setHasChanges(false)
  }

  const resetChanges = () => {
    setCurrentStyles({ ...appliedStyles })
    setHasChanges(false)
  }

  const updateStyle = (key: string, value: any) => {
    setCurrentStyles(prev => ({ ...prev, [key]: value }))
  }

  const getDiagramSpecificOptions = (diagramType: string) => {
    const baseOptions = {
      colors: ['nodeColor', 'nodeTextColor', 'secondaryNodeColor', 'secondaryNodeTextColor', 'tertiaryNodeColor', 'tertiaryNodeTextColor', 'nodeBorderColor', 'labelTextColor', 'lineColor', 'backgroundColor'],
      shapes: ['rectangle', 'circle'],
      lines: ['solid', 'dashed', 'dotted']
    }

    switch (diagramType) {
      case 'flowchart':
        return {
          ...baseOptions,
          shapes: ['rectangle', 'circle', 'diamond', 'hexagon'],
          colors: [...baseOptions.colors, 'accentColor']
        }
      case 'sequence':
        return {
          ...baseOptions,
          shapes: ['rectangle', 'circle'],
          colors: ['nodeColor', 'nodeTextColor', 'secondaryNodeColor', 'secondaryNodeTextColor', 'labelTextColor', 'lineColor', 'backgroundColor', 'accentColor']
        }
      case 'gantt':
        return {
          ...baseOptions,
          shapes: ['rectangle'],
          colors: ['nodeColor', 'secondaryNodeColor', 'tertiaryNodeColor', 'labelTextColor', 'backgroundColor', 'accentColor', 'lineColor']
        }
      case 'class':
        return {
          ...baseOptions,
          shapes: ['rectangle'],
          colors: ['nodeColor', 'nodeTextColor', 'secondaryNodeColor', 'secondaryNodeTextColor', 'nodeBorderColor', 'labelTextColor', 'lineColor', 'backgroundColor']
        }
      case 'state':
        return {
          ...baseOptions,
          shapes: ['rectangle', 'circle'],
          colors: ['nodeColor', 'nodeTextColor', 'secondaryNodeColor', 'secondaryNodeTextColor', 'nodeBorderColor', 'labelTextColor', 'lineColor', 'backgroundColor']
        }
      case 'pie':
        return {
          ...baseOptions,
          shapes: ['circle'],
          colors: ['nodeColor', 'secondaryNodeColor', 'tertiaryNodeColor', 'nodeTextColor', 'labelTextColor', 'backgroundColor', 'accentColor']
        }
      case 'er':
        return {
          ...baseOptions,
          shapes: ['rectangle'],
          colors: ['nodeColor', 'nodeTextColor', 'secondaryNodeColor', 'secondaryNodeTextColor', 'nodeBorderColor', 'labelTextColor', 'lineColor', 'backgroundColor']
        }
      case 'journey':
        return {
          ...baseOptions,
          shapes: ['rectangle', 'circle'],
          colors: [...baseOptions.colors, 'accentColor']
        }
      default:
        return baseOptions
    }
  }

  const handleDownload = async () => {
    const svgElement = document.querySelector(".mermaid-container svg")
    if (!svgElement) return

    const svgClone = svgElement.cloneNode(true) as SVGElement

    // Get the actual content bounds from the original SVG
    const originalViewBox = svgElement.getAttribute("viewBox")
    const originalWidth = svgElement.getAttribute("width")
    const originalHeight = svgElement.getAttribute("height")

    // Use the original dimensions if they exist, otherwise use our settings
    let actualWidth = width
    let actualHeight = height
    let viewBox = `0 0 ${width} ${height}`

    if (originalViewBox) {
      viewBox = originalViewBox
      const viewBoxParts = originalViewBox.split(' ')
      if (viewBoxParts.length === 4) {
        actualWidth = parseInt(viewBoxParts[2]) || width
        actualHeight = parseInt(viewBoxParts[3]) || height
      }
    } else if (originalWidth && originalHeight) {
      actualWidth = parseInt(originalWidth) || width
      actualHeight = parseInt(originalHeight) || height
      viewBox = `0 0 ${actualWidth} ${actualHeight}`
    }

    // Set the dimensions to match the actual content
    svgClone.setAttribute("width", actualWidth.toString())
    svgClone.setAttribute("height", actualHeight.toString())
    svgClone.setAttribute("viewBox", viewBox)

    if (downloadFormat === "svg") {
      // Handle transparent background for SVG
      if (transparentBackground) {
        svgClone.style.backgroundColor = "transparent"
        // Remove any background rectangles
        const backgroundRects = svgClone.querySelectorAll("rect[fill='#f0f3f7'], rect[fill='#ffffff'], rect[fill='#0f172a']")
        backgroundRects.forEach(rect => {
          if (rect.getAttribute("width") === "100%" || rect.getAttribute("width") === width.toString()) {
            rect.remove()
          }
        })
      }

      const svgData = new XMLSerializer().serializeToString(svgClone)
      const blob = new Blob([svgData], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `flowchart-${actualWidth}x${actualHeight}${transparentBackground ? '-transparent' : ''}.svg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else if (downloadFormat === "pdf") {
      // Convert to PDF using jsPDF with proper SVG support
      try {
        // Dynamic imports to avoid SSR issues
        const { jsPDF } = await import('jspdf')

        // Create PDF with actual dimensions (convert px to mm for PDF)
        const pdfWidth = actualWidth * 0.264583 // px to mm conversion
        const pdfHeight = actualHeight * 0.264583

        const pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [pdfWidth, pdfHeight]
        })

        // Set background if not transparent
        if (!transparentBackground) {
          pdf.setFillColor(appliedStyles.backgroundColor)
          pdf.rect(0, 0, pdfWidth, pdfHeight, 'F')
        }

        // Convert SVG to canvas first, then to PDF (more reliable)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) throw new Error("Canvas not supported")

        canvas.width = actualWidth
        canvas.height = actualHeight

        const svgData = new XMLSerializer().serializeToString(svgClone)
        const encodedSvg = encodeURIComponent(svgData)
        const img = new Image()

        img.onload = () => {
          try {
            ctx.drawImage(img, 0, 0, actualWidth, actualHeight)

            const imgData = canvas.toDataURL('image/png')
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
            pdf.save(`flowchart-${actualWidth}x${actualHeight}${transparentBackground ? '-transparent' : ''}.pdf`)
          } catch (canvasError) {
            console.error("Canvas to PDF error:", canvasError)
            alert("PDF export failed. Please try SVG format instead.")
          }
        }

        img.onerror = () => {
          console.error("Image load error for PDF")
          alert("PDF export failed. Please try SVG format instead.")
        }

        img.src = `data:image/svg+xml;charset=utf-8,${encodedSvg}`

      } catch (error) {
        console.error("PDF export error:", error)
        alert("PDF export failed. Please try SVG format instead.")
      }
    } else if (downloadFormat === "png" || downloadFormat === "png-hd") {
      // Convert to PNG using a safer method with optional high resolution
      try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Calculate high resolution dimensions
        const scale = downloadFormat === "png-hd" ? pngScale : 1
        const canvasWidth = actualWidth * scale
        const canvasHeight = actualHeight * scale

        canvas.width = canvasWidth
        canvas.height = canvasHeight

        // Set background color for PNG (unless transparent)
        if (!transparentBackground) {
          ctx.fillStyle = appliedStyles.backgroundColor
          ctx.fillRect(0, 0, canvasWidth, canvasHeight)
        }

        // Clean the SVG data to avoid CORS issues
        let svgData = new XMLSerializer().serializeToString(svgClone)

        // Encode SVG data properly to avoid tainted canvas
        svgData = svgData.replace(/\n/g, '').replace(/\r/g, '')

        const img = new Image()
        img.crossOrigin = "anonymous"

        img.onload = () => {
          try {
            ctx.drawImage(img, 0, 0, actualWidth, actualHeight)

            // Use a try-catch for toBlob to handle tainted canvas
            try {
              canvas.toBlob((blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  const suffix = downloadFormat === "png-hd" ? `-${scale}x` : ''
                  a.download = `flowchart-${canvasWidth}x${canvasHeight}${suffix}${transparentBackground ? '-transparent' : ''}.png`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }
              }, "image/png")
            } catch (blobError) {
              console.error("Canvas toBlob error:", blobError)
              // Fallback: try using toDataURL instead
              try {
                const dataURL = canvas.toDataURL("image/png")
                const a = document.createElement("a")
                a.href = dataURL
                const suffix = downloadFormat === "png-hd" ? `-${scale}x` : ''
                a.download = `flowchart-${canvasWidth}x${canvasHeight}${suffix}${transparentBackground ? '-transparent' : ''}.png`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              } catch (dataURLError) {
                console.error("Canvas toDataURL error:", dataURLError)
                alert("PNG export failed due to browser security restrictions. Please try SVG format instead.")
              }
            }
          } catch (drawError) {
            console.error("Canvas draw error:", drawError)
            alert("PNG export failed. Please try SVG format instead.")
          }
        }

        img.onerror = () => {
          console.error("Image load error")
          alert("PNG export failed. Please try SVG format instead.")
        }

        // Use data URL instead of blob URL to avoid CORS issues
        const encodedSvg = encodeURIComponent(svgData)
        img.src = `data:image/svg+xml;charset=utf-8,${encodedSvg}`

      } catch (error) {
        console.error("PNG conversion error:", error)
        alert("PNG export failed. Please try SVG format instead.")
      }
    }
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 300))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 25))
  }

  const handleZoomReset = () => {
    setZoomLevel(100)
  }

  const diagramTypes = [
    { id: 'flowchart', name: 'Flowchart', icon: GitBranch, description: 'Process flows and decision trees' },
    { id: 'sequence', name: 'Sequence', icon: Activity, description: 'Interaction sequences' },
    { id: 'gantt', name: 'Gantt', icon: Calendar, description: 'Project timelines' },
    { id: 'class', name: 'Class', icon: Boxes, description: 'Class relationships' },
    { id: 'state', name: 'State', icon: Route, description: 'State transitions' },
    { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Data distribution' },
    { id: 'er', name: 'ER Diagram', icon: Database, description: 'Entity relationships' },
    { id: 'journey', name: 'User Journey', icon: BarChart3, description: 'User experience flows' }
  ]

  const currentOptions = getDiagramSpecificOptions(diagramType)

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header Bar - Fixed Height */}
      <header className="flex-shrink-0 mx-4 mt-4 mb-4">
        <div className="flex items-center justify-between whitespace-nowrap rounded-lg border border-white/20 bg-white/50 px-6 py-3 shadow-sm backdrop-blur-lg dark:border-white/10 dark:bg-gray-800/50">
          <div className="flex items-center gap-4 text-gray-800 dark:text-white">
            <Code2 className="text-3xl" />
            <h1 className="text-xl font-bold">FlowCreate</h1>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <span className="font-medium">My Projects</span>
              <ChevronRight className="w-4 h-4" />
              <span className="font-bold text-gray-800 dark:text-white">User Onboarding Process</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-teal-500 px-4 text-sm font-bold text-white shadow-lg hover:bg-teal-600 transition-colors">
              <Share className="w-4 h-4 mr-2" />
              <span className="truncate">Share</span>
            </button>
            {/* Download Options Dropdown */}
            <div className="relative">
              <button
                id="export-button"
                className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-100 px-4 text-sm font-bold text-gray-800 shadow-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                onClick={() => {
                  const dropdown = document.getElementById('export-dropdown-portal')
                  if (dropdown) {
                    const isVisible = dropdown.style.display === 'block'
                    if (isVisible) {
                      dropdown.style.display = 'none'
                    } else {
                      // Position dropdown relative to button
                      const button = document.getElementById('export-button')
                      if (button) {
                        const rect = button.getBoundingClientRect()
                        dropdown.style.top = `${rect.bottom + 8}px`
                        dropdown.style.right = `${window.innerWidth - rect.right}px`
                      }
                      dropdown.style.display = 'block'
                    }
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="truncate">Export</span>
              </button>
            </div>
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-100 p-0 text-gray-800 shadow-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-400 to-blue-500"></div>
          </div>
        </div>
      </header>

      {/* Main Content - Flexible Height */}
      <main className="flex flex-1 gap-4 px-4 pb-4 min-h-0">
        {/* Sidebar - Fixed Width, Full Height */}
        <div className="w-96 flex-shrink-0 rounded-lg border border-white/30 bg-white/60 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-gray-800/60 flex flex-col">
          {/* Tab Navigation - Fixed */}
          <div className="flex-shrink-0 p-4">
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("types")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "types"
                  ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                  }`}
              >
                <GitBranch className="w-4 h-4" />
                Types
              </button>
              <button
                onClick={() => setActiveTab("styles")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "styles"
                  ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                  }`}
              >
                <Palette className="w-4 h-4" />
                Styles
              </button>
            </div>
          </div>

          {/* Tab Content - Scrollable */}
          <div className="flex-1 min-h-0">
            {/* Chart Types Tab */}
            {activeTab === "types" && (
              <div className="h-full overflow-y-auto px-4 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Chart Types</h3>
                <div className="space-y-2">
                  {diagramTypes.map((type) => {
                    const IconComponent = type.icon
                    return (
                      <button
                        key={type.id}
                        onClick={() => setDiagramType(type.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all hover:bg-gray-100 dark:hover:bg-gray-700 ${diagramType === type.id
                          ? 'bg-teal-50 border-2 border-teal-500 text-teal-700 dark:bg-teal-900/30 dark:border-teal-400 dark:text-teal-300'
                          : 'border-2 border-transparent text-gray-700 dark:text-gray-300'
                          }`}
                      >
                        <IconComponent className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{type.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{type.description}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Styles Tab */}
            {activeTab === "styles" && (
              <div className="h-full flex flex-col">
                {/* Header - Fixed */}
                <div className="flex-shrink-0 px-4 pb-4 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {diagramType.charAt(0).toUpperCase() + diagramType.slice(1)} Styles
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Customize your {diagramType} diagram appearance
                  </p>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
                  {/* Colors Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Colors
                    </h4>

                    <div className="space-y-3">
                      {currentOptions.colors.includes('nodeColor') && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Primary Node Color
                            <span className="block text-xs text-gray-500 dark:text-gray-500 font-normal">Main node background</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={currentStyles.nodeColor}
                              onChange={(e) => updateStyle('nodeColor', e.target.value)}
                              className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={currentStyles.nodeColor}
                              onChange={(e) => updateStyle('nodeColor', e.target.value)}
                              className="flex-1 px-3 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      )}

                      {currentOptions.colors.includes('nodeBorderColor') && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Node Border</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={currentStyles.nodeBorderColor}
                              onChange={(e) => updateStyle('nodeBorderColor', e.target.value)}
                              className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={currentStyles.nodeBorderColor}
                              onChange={(e) => updateStyle('nodeBorderColor', e.target.value)}
                              className="flex-1 px-3 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      )}

                      {currentOptions.colors.includes('nodeTextColor') && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Primary Node Text
                            <span className="block text-xs text-gray-500 dark:text-gray-500 font-normal">Text in primary nodes</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={currentStyles.nodeTextColor}
                              onChange={(e) => updateStyle('nodeTextColor', e.target.value)}
                              className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={currentStyles.nodeTextColor}
                              onChange={(e) => updateStyle('nodeTextColor', e.target.value)}
                              className="flex-1 px-3 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      )}

                      {currentOptions.colors.includes('secondaryNodeColor') && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Secondary Node Color
                            <span className="block text-xs text-gray-500 dark:text-gray-500 font-normal">Alternative node background</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={currentStyles.secondaryNodeColor}
                              onChange={(e) => updateStyle('secondaryNodeColor', e.target.value)}
                              className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={currentStyles.secondaryNodeColor}
                              onChange={(e) => updateStyle('secondaryNodeColor', e.target.value)}
                              className="flex-1 px-3 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      )}

                      {currentOptions.colors.includes('secondaryNodeTextColor') && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Secondary Node Text
                            <span className="block text-xs text-gray-500 dark:text-gray-500 font-normal">Text in secondary nodes</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={currentStyles.secondaryNodeTextColor}
                              onChange={(e) => updateStyle('secondaryNodeTextColor', e.target.value)}
                              className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={currentStyles.secondaryNodeTextColor}
                              onChange={(e) => updateStyle('secondaryNodeTextColor', e.target.value)}
                              className="flex-1 px-3 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      )}

                      {currentOptions.colors.includes('tertiaryNodeColor') && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Tertiary Node Color
                            <span className="block text-xs text-gray-500 dark:text-gray-500 font-normal">Third node background</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={currentStyles.tertiaryNodeColor}
                              onChange={(e) => updateStyle('tertiaryNodeColor', e.target.value)}
                              className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={currentStyles.tertiaryNodeColor}
                              onChange={(e) => updateStyle('tertiaryNodeColor', e.target.value)}
                              className="flex-1 px-3 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      )}

                      {currentOptions.colors.includes('tertiaryNodeTextColor') && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Tertiary Node Text
                            <span className="block text-xs text-gray-500 dark:text-gray-500 font-normal">Text in tertiary nodes</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={currentStyles.tertiaryNodeTextColor}
                              onChange={(e) => updateStyle('tertiaryNodeTextColor', e.target.value)}
                              className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={currentStyles.tertiaryNodeTextColor}
                              onChange={(e) => updateStyle('tertiaryNodeTextColor', e.target.value)}
                              className="flex-1 px-3 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      )}

                      {currentOptions.colors.includes('labelTextColor') && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Outside Text Color
                            <span className="block text-xs text-gray-500 dark:text-gray-500 font-normal">Labels & edge text</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={currentStyles.labelTextColor}
                              onChange={(e) => updateStyle('labelTextColor', e.target.value)}
                              className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={currentStyles.labelTextColor}
                              onChange={(e) => updateStyle('labelTextColor', e.target.value)}
                              className="flex-1 px-3 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      )}

                      {currentOptions.colors.includes('lineColor') && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Line Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={currentStyles.lineColor}
                              onChange={(e) => updateStyle('lineColor', e.target.value)}
                              className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={currentStyles.lineColor}
                              onChange={(e) => updateStyle('lineColor', e.target.value)}
                              className="flex-1 px-3 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      )}

                      {currentOptions.colors.includes('backgroundColor') && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Background</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={currentStyles.backgroundColor}
                              onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                              className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={currentStyles.backgroundColor}
                              onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                              className="flex-1 px-3 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Typography Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Typography
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Font Family</label>
                        <select
                          value={currentStyles.fontFamily}
                          onChange={(e) => updateStyle('fontFamily', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="Inter">Inter</option>
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Times New Roman">Times New Roman</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Font Size: {currentStyles.fontSize}px
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="24"
                          value={currentStyles.fontSize}
                          onChange={(e) => updateStyle('fontSize', Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Font Weight</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStyle('fontWeight', 'normal')}
                            className={`flex-1 px-3 py-2 text-xs rounded transition-all ${currentStyles.fontWeight === 'normal'
                              ? 'bg-teal-50 border-2 border-teal-500 text-teal-700 dark:bg-teal-900/30 dark:border-teal-400 dark:text-teal-300'
                              : 'border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                              }`}
                          >
                            Normal
                          </button>
                          <button
                            onClick={() => updateStyle('fontWeight', 'bold')}
                            className={`flex-1 px-3 py-2 text-xs rounded transition-all ${currentStyles.fontWeight === 'bold'
                              ? 'bg-teal-50 border-2 border-teal-500 text-teal-700 dark:bg-teal-900/30 dark:border-teal-400 dark:text-teal-300'
                              : 'border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                              }`}
                          >
                            Bold
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shapes & Lines Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Shapes & Lines
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Node Shape</label>
                        <div className="grid grid-cols-2 gap-2">
                          {currentOptions.shapes.map((shape) => {
                            const icons = {
                              rectangle: Square,
                              circle: Circle,
                              diamond: Diamond,
                              hexagon: Hexagon
                            }
                            const IconComponent = icons[shape as keyof typeof icons] || Square

                            return (
                              <button
                                key={shape}
                                onClick={() => updateStyle('nodeShape', shape)}
                                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-all ${currentStyles.nodeShape === shape
                                  ? 'bg-teal-50 border-2 border-teal-500 text-teal-700 dark:bg-teal-900/30 dark:border-teal-400 dark:text-teal-300'
                                  : 'border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                                  }`}
                              >
                                <IconComponent className="w-4 h-4" />
                                {shape.charAt(0).toUpperCase() + shape.slice(1)}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Line Style</label>
                        <div className="grid grid-cols-3 gap-2">
                          {currentOptions.lines.map((lineStyle) => (
                            <button
                              key={lineStyle}
                              onClick={() => updateStyle('lineStyle', lineStyle)}
                              className={`p-2 rounded-lg text-xs font-medium transition-all ${currentStyles.lineStyle === lineStyle
                                ? 'bg-teal-50 border-2 border-teal-500 text-teal-700 dark:bg-teal-900/30 dark:border-teal-400 dark:text-teal-300'
                                : 'border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                            >
                              {lineStyle.charAt(0).toUpperCase() + lineStyle.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Line Thickness: {currentStyles.lineThickness}px
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          value={currentStyles.lineThickness}
                          onChange={(e) => updateStyle('lineThickness', Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Node Size: {currentStyles.nodeSize}px
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          value={currentStyles.nodeSize}
                          onChange={(e) => updateStyle('nodeSize', Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Corner Radius: {currentStyles.cornerRadius}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={currentStyles.cornerRadius}
                          onChange={(e) => updateStyle('cornerRadius', Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Output Settings */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Layout className="w-4 h-4" />
                      Output Settings
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Aspect Ratio</label>
                        <select
                          value={aspectRatio}
                          onChange={(e) => {
                            setAspectRatio(e.target.value)
                            const ratios = {
                              "16:9": { width: 1920, height: 1080 },
                              "4:3": { width: 1600, height: 1200 },
                              "1:1": { width: 1080, height: 1080 },
                              "21:9": { width: 2560, height: 1080 },
                              "9:16": { width: 1080, height: 1920 }
                            }
                            const ratio = ratios[e.target.value as keyof typeof ratios]
                            if (ratio) {
                              setWidth(ratio.width)
                              setHeight(ratio.height)
                            }
                          }}
                          className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="16:9">16:9 (Widescreen)</option>
                          <option value="4:3">4:3 (Standard)</option>
                          <option value="1:1">1:1 (Square)</option>
                          <option value="21:9">21:9 (Ultra-wide)</option>
                          <option value="9:16">9:16 (Portrait)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Layout Direction</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setOutputDirection('horizontal')
                              setActualDirection('LR')
                            }}
                            className={`flex-1 px-3 py-2 text-xs rounded transition-all ${outputDirection === 'horizontal'
                              ? 'bg-teal-50 border-2 border-teal-500 text-teal-700 dark:bg-teal-900/30 dark:border-teal-400 dark:text-teal-300'
                              : 'border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                              }`}
                          >
                            Horizontal
                          </button>
                          <button
                            onClick={() => {
                              setOutputDirection('vertical')
                              setActualDirection('TD')
                            }}
                            className={`flex-1 px-3 py-2 text-xs rounded transition-all ${outputDirection === 'vertical'
                              ? 'bg-teal-50 border-2 border-teal-500 text-teal-700 dark:bg-teal-900/30 dark:border-teal-400 dark:text-teal-300'
                              : 'border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                              }`}
                          >
                            Vertical
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Width</label>
                          <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Height</label>
                          <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Themes */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quick Themes</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: 'Ocean', nodeColor: '#0EA5E9', lineColor: '#0284C7', backgroundColor: '#F0F9FF' },
                        { name: 'Forest', nodeColor: '#10B981', lineColor: '#059669', backgroundColor: '#F0FDF4' },
                        { name: 'Sunset', nodeColor: '#F59E0B', lineColor: '#D97706', backgroundColor: '#FFFBEB' },
                        { name: 'Purple', nodeColor: '#8B5CF6', lineColor: '#7C3AED', backgroundColor: '#FAF5FF' }
                      ].map((theme) => (
                        <button
                          key={theme.name}
                          onClick={() => {
                            setCurrentStyles(prev => ({
                              ...prev,
                              nodeColor: theme.nodeColor,
                              lineColor: theme.lineColor,
                              backgroundColor: theme.backgroundColor
                            }))
                          }}
                          className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 transition-all"
                        >
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: theme.nodeColor }}
                          ></div>
                          {theme.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apply Changes Section - Fixed at Bottom */}
                <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50">
                  {hasChanges && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                        You have unsaved changes
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={applyChanges}
                      disabled={!hasChanges}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all ${hasChanges
                        ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      Apply Changes
                    </button>

                    {hasChanges && (
                      <button
                        onClick={resetChanges}
                        className="px-3 py-3 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                    Changes will be applied to the diagram preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code Editor - Flexible Width, Full Height */}
        <div className="flex w-1/2 flex-col rounded-lg border border-white/30 bg-white/60 p-4 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-gray-800/60">
          {/* Header - Fixed */}
          <div className="flex-shrink-0">
            <div className="flex border-b border-gray-300/50 dark:border-white/20">
              <div className="flex items-center gap-2 border-b-[3px] border-teal-500 px-4 pb-2 pt-1 text-gray-800 dark:text-white">
                <Code2 className="w-5 h-5" />
                <p className="text-sm font-bold">flowchart.gen</p>
              </div>
              <div className="flex items-center gap-2 border-b-[3px] border-transparent px-4 pb-2 pt-1 text-gray-500 dark:text-gray-400">
                <BarChart3 className="w-5 h-5" />
                <p className="text-sm font-bold">styles.css</p>
              </div>
            </div>
          </div>

          {/* Editor - Flexible */}
          <div className="flex-1 overflow-auto bg-gray-50/50 p-4 font-mono text-sm text-gray-700 dark:bg-black/20 dark:text-gray-300 my-4 rounded-md">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent text-current font-mono text-sm resize-none border-none outline-none leading-relaxed"
              spellCheck={false}
              placeholder="Enter your Mermaid code here..."
            />
          </div>

          {/* Button - Fixed */}
          <div className="flex-shrink-0 pt-2">
            <button
              onClick={() => setCode(getDefaultCode(diagramType))}
              className="flex h-12 w-full min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-teal-500 px-5 text-base font-bold text-white shadow-lg hover:bg-teal-600 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              <span className="truncate">Generate Flowchart</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex-shrink-0 w-2 cursor-col-resize items-center justify-center">
          <div className="h-12 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>

        {/* Preview - Flexible Width, Full Height */}
        <div className="flex w-1/2 flex-col rounded-lg border border-white/30 bg-white/60 p-4 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-gray-800/60">
          {/* Header - Fixed */}
          <div className="flex flex-shrink-0 items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
              </span>
              <p className="text-sm font-medium text-teal-600 dark:text-teal-400">Live Preview</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-800 shadow-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                <Plus className="w-5 h-5" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-800 shadow-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                <Minus className="w-5 h-5" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-800 shadow-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                <ZoomOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preview Content - Flexible */}
          <div className="flex flex-1 flex-col rounded-md bg-gray-50/50 dark:bg-black/20 min-h-0">
            {/* Zoom Controls */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Zoom:</span>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 min-w-[3rem]">{zoomLevel}%</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 25}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Zoom Out"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <button
                  onClick={handleZoomReset}
                  className="flex h-8 px-3 items-center justify-center rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-xs font-medium"
                  title="Reset Zoom"
                >
                  <ZoomOut className="w-3 h-3 mr-1" />
                  Reset
                </button>

                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 300}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Zoom In"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chart Container with Zoom */}
            <div className="flex flex-1 items-center justify-center p-4 overflow-auto">
              <div
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease-in-out'
                }}
              >
                <MermaidChart
                  chart={code}
                  width={width}
                  height={height}
                  style={style}
                  direction={actualDirection}
                  customColors={{
                    primaryColor: appliedStyles.nodeColor,
                    secondaryColor: appliedStyles.secondaryNodeColor,
                    tertiaryColor: appliedStyles.tertiaryNodeColor,
                    backgroundColor: appliedStyles.backgroundColor,
                    textColor: appliedStyles.nodeTextColor,
                    secondaryTextColor: appliedStyles.secondaryNodeTextColor,
                    tertiaryTextColor: appliedStyles.tertiaryNodeTextColor,
                    labelTextColor: appliedStyles.labelTextColor,
                    lineColor: appliedStyles.lineColor,
                    accentColor: appliedStyles.accentColor,
                    borderColor: appliedStyles.nodeBorderColor
                  }}
                  customStyles={{
                    nodeShape: appliedStyles.nodeShape,
                    nodeSize: appliedStyles.nodeSize,
                    lineStyle: appliedStyles.lineStyle,
                    lineThickness: appliedStyles.lineThickness,
                    cornerRadius: appliedStyles.cornerRadius,
                    fontSize: appliedStyles.fontSize,
                    fontFamily: appliedStyles.fontFamily,
                    fontWeight: appliedStyles.fontWeight,
                    nodeSpacing: appliedStyles.nodeSpacing,
                    levelSpacing: appliedStyles.levelSpacing,
                    padding: appliedStyles.padding,
                    shadow: appliedStyles.shadow,
                    gradient: appliedStyles.gradient,
                    animation: appliedStyles.animation
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Export Dropdown Portal - Rendered at body level to avoid z-index issues */}
      <div
        id="export-dropdown-portal"
        className="fixed w-64 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-200"
        style={{
          display: 'none',
          zIndex: 2147483647
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Format</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => setDownloadFormat("svg")}
                className={`px-3 py-2 text-xs rounded transition-all ${downloadFormat === "svg"
                  ? 'bg-teal-50 border-2 border-teal-500 text-teal-700 dark:bg-teal-900/30 dark:border-teal-400 dark:text-teal-300'
                  : 'border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
              >
                SVG
              </button>
              <button
                onClick={() => setDownloadFormat("pdf")}
                className={`px-3 py-2 text-xs rounded transition-all ${downloadFormat === "pdf"
                  ? 'bg-teal-50 border-2 border-teal-500 text-teal-700 dark:bg-teal-900/30 dark:border-teal-400 dark:text-teal-300'
                  : 'border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
              >
                PDF
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDownloadFormat("png")}
                className={`px-3 py-2 text-xs rounded transition-all ${downloadFormat === "png"
                  ? 'bg-teal-50 border-2 border-teal-500 text-teal-700 dark:bg-teal-900/30 dark:border-teal-400 dark:text-teal-300'
                  : 'border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
              >
                PNG
              </button>
              <button
                onClick={() => setDownloadFormat("png-hd")}
                className={`px-3 py-2 text-xs rounded transition-all ${downloadFormat === "png-hd"
                  ? 'bg-teal-50 border-2 border-teal-500 text-teal-700 dark:bg-teal-900/30 dark:border-teal-400 dark:text-teal-300'
                  : 'border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
              >
                PNG HD
              </button>
            </div>
          </div>

          {(downloadFormat === "png-hd") && (
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Resolution Scale: {pngScale}x ({width * pngScale} × {height * pngScale}px)
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={pngScale}
                  onChange={(e) => setPngScale(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="grid grid-cols-4 gap-1 text-xs">
                {[1, 2, 4, 8].map((scale) => (
                  <button
                    key={scale}
                    onClick={() => setPngScale(scale)}
                    className={`px-2 py-1 rounded text-xs transition-all ${pngScale === scale
                      ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    {scale}x
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Higher scale = better zoom quality, larger file size
              </p>
            </div>
          )}

          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={transparentBackground}
                onChange={(e) => setTransparentBackground(e.target.checked)}
                className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              Transparent Background
            </label>
          </div>

          <button
            onClick={() => {
              handleDownload()
              // Hide dropdown after download
              const dropdown = document.getElementById('export-dropdown-portal')
              if (dropdown) {
                dropdown.style.display = 'none'
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Download {downloadFormat === "png-hd" ? "PNG HD" : downloadFormat.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  )
}