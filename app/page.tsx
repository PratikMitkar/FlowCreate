"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Code2, Download, Copy, Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import dynamic from "next/dynamic"
import "./globals.css"

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
    C --> K[End]
    E --> K
    G --> K
    I --> K
    J --> K`

const defaultSequenceCode = `sequenceDiagram
    participant P as Patient
    participant D as Database
    participant Doc as Doctor
    
    P->>D: Login
    D-->>P: Authentication
    P->>D: Upload Data
    P->>D: Edit Data
    P->>D: View Data
    P->>Doc: Share Access
    Doc->>D: Access Data`

const defaultGanttCode = `gantt
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
    User acceptance testing         :test2, 2024-03-01, 2024-03-15`

const defaultClassCode = `classDiagram
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
    Patient --> Doctor : shares access`

const defaultStateCode = `stateDiagram-v2
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
    Authenticated --> LoggedOut : Logout`

const defaultPieCode = `pie title Patient Activities Distribution
    "Data Upload" : 25
    "Data Editing" : 20
    "Data Viewing" : 35
    "Doctor Sharing" : 15
    "Other" : 5`

const defaultERCode = `erDiagram
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
    }`

const defaultJourneyCode = `journey
    title Patient Data Management Journey
    section Authentication
      Patient logs in : 5: Patient
    section Data Management
      Upload new data : 4: Patient
      Edit existing data : 3: Patient
      View data : 5: Patient
    section Sharing
      Share with doctor : 4: Patient
      Doctor accesses data : 5: Doctor`

const getDefaultCode = (type: string) => {
  switch (type) {
    case 'sequence': return defaultSequenceCode;
    case 'gantt': return defaultGanttCode;
    case 'class': return defaultClassCode;
    case 'state': return defaultStateCode;
    case 'pie': return defaultPieCode;
    case 'er': return defaultERCode;
    case 'journey': return defaultJourneyCode;
    default: return defaultFlowchartCode;
  }
}

const aspectRatios = {
  "16:9": { width: 1920, height: 1080 },
  "4:3": { width: 1600, height: 1200 },
  "1:1": { width: 1080, height: 1080 },
  "21:9": { width: 2560, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  custom: { width: 1920, height: 1080 },
}

export default function FlowchartConverter() {
  const [code, setCode] = useState(defaultFlowchartCode)
  const [copied, setCopied] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<keyof typeof aspectRatios>("16:9")
  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1080)
  const [style, setStyle] = useState("pastel")
  const [direction, setDirection] = useState<"auto" | "TD" | "LR" | "RL" | "BT">("auto")
  const [actualDirection, setActualDirection] = useState<"TD" | "LR" | "RL" | "BT">("TD")
  const [diagramType, setDiagramType] = useState("flowchart")

  // Update code when diagram type changes
  useEffect(() => {
    setCode(getDefaultCode(diagramType))
  }, [diagramType])

  useEffect(() => {
    if (direction === "auto") {
      const ratio = width / height
      if (ratio > 1.5) {
        // Wide layout (16:9, 21:9) - use horizontal
        setActualDirection("LR")
      } else if (ratio < 0.7) {
        // Tall layout (9:16) - use vertical
        setActualDirection("TD")
      } else {
        // Square-ish layout (1:1, 4:3) - use vertical
        setActualDirection("TD")
      }
    } else {
      setActualDirection(direction)
    }
  }, [width, height, direction])

  const handleAspectRatioChange = (value: keyof typeof aspectRatios) => {
    setAspectRatio(value)
    if (value !== "custom") {
      setWidth(aspectRatios[value].width)
      setHeight(aspectRatios[value].height)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async () => {
    const svgElement = document.querySelector(".mermaid-container svg")
    if (svgElement) {
      const svgClone = svgElement.cloneNode(true) as SVGElement
      svgClone.setAttribute("width", width.toString())
      svgClone.setAttribute("height", height.toString())
      svgClone.setAttribute("viewBox", `0 0 ${width} ${height}`)

      const svgData = new XMLSerializer().serializeToString(svgClone)
      const blob = new Blob([svgData], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `flowchart-${width}x${height}.svg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleDownloadPNG = async (withBackground: boolean) => {
    const svgElement = document.querySelector(".mermaid-container svg")
    if (svgElement) {
      // Get the outer HTML of the SVG
      let svgString = svgElement.outerHTML
      
      // Set proper dimensions
      svgString = svgString.replace(/width="[^"]*"/, `width="${width}"`)
      svgString = svgString.replace(/height="[^"]*"/, `height="${height}"`)
      
      // Add viewBox if not present
      if (!svgString.includes('viewBox=')) {
        svgString = svgString.replace('<svg', `<svg viewBox="0 0 ${width} ${height}"`)
      }
      
      // Add xmlns if not present
      if (!svgString.includes('xmlns=')) {
        svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
      }
      
      // Handle background
      if (withBackground) {
        if (svgString.includes('style="')) {
          svgString = svgString.replace(/style="(.*?)"/, 'style="$1 background: white;"')
        } else {
          svgString = svgString.replace('<svg', '<svg style="background: white;"')
        }
      }
      
      // Use base64 encoding which is more reliable
      const base64Svg = btoa(unescape(encodeURIComponent(svgString)))
      const dataUrl = `data:image/svg+xml;base64,${base64Svg}`
      
      // Create image
      const img = new Image()
      
      img.onload = function() {
        // Create canvas
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        
        if (ctx) {
          try {
            // Fill background if needed
            if (withBackground) {
              ctx.fillStyle = 'white'
              ctx.fillRect(0, 0, width, height)
            }
            
            // Draw the image
            ctx.drawImage(img, 0, 0)
            
            // Convert to PNG and download using the most compatible method
            canvas.toBlob(function(blob) {
              if (blob) {
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `flowchart-${width}x${height}${withBackground ? '-with-bg' : '-without-bg'}.png`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
              }
            }, 'image/png')
          } catch (e) {
            console.error('Canvas operation failed:', e)
            // Try alternative method
            try {
              const pngDataUrl = canvas.toDataURL('image/png')
              const a = document.createElement('a')
              a.href = pngDataUrl
              a.download = `flowchart-${width}x${height}${withBackground ? '-with-bg' : '-without-bg'}.png`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
            } catch (e2) {
              console.error('Alternative method also failed:', e2)
              alert('Unable to generate PNG due to browser security restrictions. Please download as SVG instead.')
            }
          }
        }
      }
      
      img.onerror = function(e) {
        console.error('Image failed to load:', e)
        alert('Failed to load diagram for PNG conversion. Please try downloading as SVG instead.')
      }
      
      // Set the source
      img.src = dataUrl
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header with Glassmorphism Effect */}
      <header className="border-b border-border bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm shadow-sm rounded-t-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-accent-start to-accent-end shadow-lg hover:translate-y-[-2px] transition-transform duration-200">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">FlowCreate</h1>
                <p className="text-sm text-muted-foreground">Design beautiful flowcharts and diagrams</p>
              </div>
            </div>
            
            {/* Controls - Removed search and profile */}
            <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
              {/* Style Controls */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="style" className="text-sm font-medium text-foreground">
                    Theme:
                  </Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="style" className="w-[110px] hover-lift">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pastel">Pastel</SelectItem>
                      <SelectItem value="vibrant">Vibrant</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="ocean">Ocean</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="sunset">Sunset</SelectItem>
                      <SelectItem value="forest">Forest</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor="diagram-type" className="text-sm font-medium text-foreground">
                    Type:
                  </Label>
                  <Select value={diagramType} onValueChange={setDiagramType}>
                    <SelectTrigger id="diagram-type" className="w-[110px] hover-lift">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flowchart">Flowchart</SelectItem>
                      <SelectItem value="sequence">Sequence</SelectItem>
                      <SelectItem value="gantt">Gantt</SelectItem>
                      <SelectItem value="class">Class</SelectItem>
                      <SelectItem value="state">State</SelectItem>
                      <SelectItem value="pie">Pie</SelectItem>
                      <SelectItem value="er">ER</SelectItem>
                      <SelectItem value="journey">Journey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Dimension Controls */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="aspect-ratio" className="text-sm font-medium text-foreground">
                    Size:
                  </Label>
                  <Select value={aspectRatio} onValueChange={handleAspectRatioChange}>
                    <SelectTrigger id="aspect-ratio" className="w-[90px] hover-lift">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9</SelectItem>
                      <SelectItem value="4:3">4:3</SelectItem>
                      <SelectItem value="1:1">1:1</SelectItem>
                      <SelectItem value="21:9">21:9</SelectItem>
                      <SelectItem value="9:16">9:16</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => {
                      setWidth(Number(e.target.value))
                      setAspectRatio("custom")
                    }}
                    className="w-[80px] text-center hover-lift"
                    placeholder="Width"
                  />
                  <span className="text-muted-foreground">×</span>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => {
                      setHeight(Number(e.target.value))
                      setAspectRatio("custom")
                    }}
                    className="w-[80px] text-center hover-lift"
                    placeholder="Height"
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopy} 
                  className="gap-2 hover-lift"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </>
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="gap-2 bg-gradient-to-r from-accent-start to-accent-end text-white hover:shadow-lg hover:translate-y-[-2px] transition-all duration-200"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 animate-fade-in bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <DropdownMenuItem onClick={handleDownload} className="gap-2 hover:bg-accent hover:text-accent-foreground">
                      <Download className="w-4 h-4" />
                      Export as SVG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownloadPNG(true)} className="gap-2 hover:bg-accent hover:text-accent-foreground">
                      <Download className="w-4 h-4" />
                      Export as PNG (With Background)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownloadPNG(false)} className="gap-2 hover:bg-accent hover:text-accent-foreground">
                      <Download className="w-4 h-4" />
                      Export as PNG (Transparent)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden container mx-auto w-full py-6 px-4">
        {/* Code Editor Panel with Glassmorphism */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-border bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-l-xl shadow-lg">
          <div className="px-6 py-4 border-b border-border bg-muted/50 rounded-tl-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Code Editor</h2>
                <p className="text-sm text-muted-foreground">Write your Mermaid syntax</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary animate-pulse-soft">
                  {diagramType}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 md:p-6 overflow-auto">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-background text-foreground font-mono text-sm p-4 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none leading-relaxed shadow-sm hover-lift"
              spellCheck={false}
              placeholder="Enter your Mermaid code here..."
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-full md:w-1/2 flex flex-col bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-r-xl shadow-lg">
          <div className="px-6 py-4 border-b border-border bg-muted/50 rounded-tr-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Preview</h2>
                <p className="text-sm text-muted-foreground">
                  Live visualization • {width} × {height}px
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground animate-pulse-soft">
                  {style}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="flex items-center justify-center min-h-full bg-background rounded-lg border border-border shadow-sm p-4 hover-lift">
              <MermaidChart chart={code} width={width} height={height} style={style} direction={actualDirection} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}