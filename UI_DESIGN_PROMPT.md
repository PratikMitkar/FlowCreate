# UI Design Prompt for FlowCreate

This prompt is designed to help you create comprehensive UI mockups for the FlowCreate application using image UI generators like Midjourney, DALL-E, or other AI design tools.

## Application Overview

FlowCreate is a modern flowchart creation tool that allows users to generate professional flowcharts using Mermaid.js syntax with multiple styling options and export capabilities.

## UI Design Prompt

```
Create a modern, professional UI design for a flowchart creation web application called "FlowCreate" with the following specifications:

1. Overall Design Aesthetic:
   - Glassmorphism design elements with subtle transparency effects
   - Neumorphic styling with soft shadows and rounded corners
   - Clean, minimalist interface with ample white space
   - Modern color scheme with purple/violet as the primary accent color
   - Smooth gradients for interactive elements
   - Consistent 1600x1200px canvas size with centered layout

2. Header Section:
   - Glassmorphism effect with semi-transparent background
   - Left side: App logo (hub icon) and "FlowCreate" title in bold
   - Center: Search input with search icon for "Flowchart Type..."
   - Right side: Navigation buttons (Templates, Docs) with icons and user avatar
   - Material Symbols icons throughout the interface
   - Subtle border and shadow effects

3. Main Content Area (Split Screen):
   - Left Panel (40% width) - Code Editor:
     * Section header with "Code Editor" title and action icons (history, copy, delete)
     * Glass-like container with soft inner shadows
     * JetBrains Mono monospace font for code display
     * Syntax highlighting with distinct colors for keywords, strings, and arrows
     * Line numbers column with light gray text
     * Soft purple shadow effect around the container
   - Right Panel (60% width) - Preview Area:
     * Light gray background with subtle inner shadow
     * Centered flowchart visualization area
     * Bottom control bar with:
       - Dark Mode toggle (pill switch component)
       - Neumorphism toggle (pill switch component)
       - Export button with gradient background and download icon

4. Visual Design Elements:
   - Inter font family for UI text elements
   - JetBrains Mono font for code elements
   - Purple/violet gradient as primary accent (#A78BFA to #C4B5FD)
   - Soft shadows with rgba(167, 139, 250, 0.1) color
   - Rounded corners throughout the interface (8-12px radius)
   - Smooth hover animations and transitions
   - Consistent spacing and alignment
   - Material Symbols icons for all interface elements

5. Color Scheme:
   - Background: #F8F9FA (light gray)
   - Panel Background: #FFFFFF (white) with glass effect
   - Editor Background: #FDFDFD (off-white)
   - Text Primary: #1F2937 (dark gray)
   - Text Secondary: #6B7280 (medium gray)
   - Accent Start: #A78BFA (purple)
   - Accent End: #C4B5FD (light purple)
   - Shadow Color: rgba(167, 139, 250, 0.1)

6. Interactive Elements:
   - Pill switch components for toggles with smooth transitions
   - Gradient export button with hover effects (glow and lift)
   - Icon buttons with hover state changes
   - Input fields with focus states and smooth transitions

7. Sample Content:
   - Display a sample flowchart in the preview area
   - Show sample Mermaid.js code in the editor with syntax highlighting:
     graph TD
         A["Start"] --> B{"User Action?"};
         B -->|Yes| C("Process Data");
         C --> D["Show Result"];
         B -->|No| E["End"];
         D --> E;

8. Overall Aesthetic:
   - Professional and modern look
   - Balanced visual hierarchy
   - Consistent spacing and alignment
   - Harmonious color palette
   - Intuitive user experience
   - Smooth transitions between states

Technical Requirements:
- Resolution: 1600x1200 pixels
- Format: PNG with transparent background
- Style: Glassmorphism with neumorphic elements
- Fonts: Inter for UI, JetBrains Mono for code
- Icons: Material Symbols
- Color Palette: 
  * Primary Gradient: #A78BFA to #C4B5FD
  * Background: #F8F9FA
  * Panel: #FFFFFF with glass effect
  * Text Primary: #1F2937
  * Text Secondary: #6B7280
```

## Specific UI Component Prompts

### 1. Header Component
```
Create a modern header component for a flowchart application with:
- Glassmorphism effect with semi-transparent background
- App logo (hub icon from Material Symbols) and "FlowCreate" title
- Search input field with search icon
- Navigation buttons (Templates, Docs) with icons
- User avatar on the right
- Subtle border and shadow effects
- Dark and light theme variations
```

### 2. Code Editor Panel
```
Design a code editor panel with:
- Glass-like container with soft inner shadows
- Section header with "Code Editor" title and action icons
- JetBrains Mono monospace font
- Syntax highlighting:
  * Keywords in #C4B5FD (light purple)
  * Strings in #A5B4FC (blue)
  * Arrows in #93C5FD (light blue)
  * Line numbers in #D1D5DB (light gray)
- Line numbers column with right alignment
- Soft purple shadow effect around the container
- Rounded corners
```

### 3. Preview Panel
```
Create a flowchart preview panel with:
- Light gray background (#F8F9FA)
- Subtle inner shadow effect
- Centered content area for flowchart visualization
- Bottom control bar with:
  * Dark Mode toggle (pill switch component)
  * Neumorphism toggle (pill switch component)
  * Export button with gradient background
- Clean borders with rounded corners
- Adequate padding around content
```

### 4. Interactive Components
```
Design the following interactive components:
1. Pill Switch (Toggle):
   - Default state: Gray background with white thumb
   - Enabled state: Purple gradient background with white thumb shifted right
   - Smooth transition animations
   - Subtle hover effects

2. Export Button:
   - Gradient background (#A78BFA to #C4B5FD)
   - White text with download icon
   - Subtle shadow in default state
   - Glow effect and lift animation on hover
   - Rounded full pill shape

3. Icon Buttons:
   - Circular or rounded square shape
   - Light gray background in default state
   - Slight darkening on hover
   - Smooth transition animations
```

### 5. Input Fields
```
Create search and text input fields with:
- Rounded full pill shape
- Light background with subtle border
- Left-aligned icons for search fields
- Focus states with purple border and ring
- Smooth transition animations
- Adequate padding for comfortable typing
```

## Theme Variations

When creating UI mockups, generate versions for all 5 themes:

1. **Default Theme**: Clean, professional styling with blue/violet accents
2. **Corporate Theme**: Business-oriented with navy and teal colors
3. **Sunset Theme**: Warm color palette with orange and purple tones
4. **Forest Theme**: Nature-inspired with green hues
5. **Dark Theme**: Dark mode with reduced eye strain

For each theme, adjust:
- Primary gradient colors
- Background colors
- Text colors
- Shadow colors
- Glassmorphism effect opacity

## Export Options Visualization

Create separate mockups showing:
1. Export button in default state
2. Export button in hover state (with glow and lift effect)
3. Context menu with export options (SVG, PNG with/without background)

## Responsive Design Variations

Generate mockups for different screen sizes:
1. Desktop (1600x1200) - Primary focus
2. Laptop (1440x900)
3. Tablet (1024x768)

## Usage Tips

1. Use consistent spacing and typography across all mockups
2. Maintain the color palette from the actual application
3. Include annotations to explain key UI elements
4. Show before/after comparisons where applicable
5. Create step-by-step guides for complex features
6. Focus on the user experience and workflow
7. Ensure all interactive elements are clearly identifiable
8. Show proper feedback states for user actions
9. Emphasize the glassmorphism and neumorphism design elements
10. Highlight the syntax highlighting in the code editor