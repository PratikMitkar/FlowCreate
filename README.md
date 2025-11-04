# FlowCreate 🌊

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![GitHub repo size](https://img.shields.io/github/repo-size/PratikVMitkar/FlowCreate)
![GitHub stars](https://img.shields.io/github/stars/PratikVMitkar/FlowCreate?style=social)

**FlowCreate** is a modern, intuitive tool for creating beautiful flowcharts and diagrams using Mermaid syntax. With a sleek UI and real-time preview, it makes diagram creation effortless and enjoyable.

![FlowCreate Interface](public/placeholder.jpg)

## 🌟 Features

- **Real-time Preview** - See your diagrams update as you type
- **Multiple Diagram Types** - Support for flowcharts, sequence diagrams, gantt charts, and more
- **AI-Powered Generation** - Convert natural language descriptions to diagrams automatically
- **Theme Customization** - Choose from 8 beautiful themes (Pastel, Vibrant, Minimal, Ocean, Corporate, Sunset, Forest, Dark)
- **Export Options** - Export your diagrams as SVG or PNG (with or without background)
- **Responsive Design** - Works beautifully on all device sizes
- **Glassmorphism UI** - Modern frosted glass design elements
- **Dark/Light Mode** - Automatic theme switching based on system preference

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 🛠️ Technologies Used

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Typed JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Accessible and customizable components
- **[Mermaid.js](https://mermaid.js.org/)** - Diagramming and charting tool
- **[Transformers.js](https://github.com/xenova/transformers.js)** - Lightweight browser-based AI models
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icon toolkit

## 🎨 UI/UX Highlights

### Glassmorphism Design
Our interface features a modern glassmorphism design with:
- Frosted glass panels with backdrop blur
- Subtle shadows for depth perception
- Smooth transitions and animations

### Theme System
- 8 carefully crafted themes
- Automatic dark/light mode detection
- Consistent color palette across all components

### Responsive Layout
- Works on mobile, tablet, and desktop
- Adaptive component sizing
- Touch-friendly controls

### AI Assistant
Our AI assistant can convert natural language descriptions into Mermaid diagrams:
- Works entirely in the browser (no server required)
- Supports all diagram types (flowcharts, sequence diagrams, etc.)
- Privacy-focused - your data never leaves your device
- Template-based generation for fast results

## 📦 Deployment

### GitHub Pages Setup

1. **Fork or clone this repository**
2. **Update the repository name in configuration files using the provided script:**
   ```bash
   # On Windows
   scripts\update-config.bat FlowCreate
   
   # On macOS/Linux
   node scripts/update-config.js FlowCreate
   ```
3. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Build and deployment", select "GitHub Actions"
4. **Push to the `main` branch to trigger automatic deployment**

Your site will be available at `https://[your-username].github.io/FlowCreate/`

For detailed deployment instructions, see [GITHUB_DEPLOYMENT_GUIDE.md](GITHUB_DEPLOYMENT_GUIDE.md)

### Vercel (Recommended)
For the best experience, deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPratikVMitkar%2FFlowCreate)

## 📚 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Tailwind CSS](https://tailwindcss.com/) - utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - accessible and customizable components
- [Mermaid](https://mermaid.js.org/) - diagramming and charting tool

## 🤖 AI Features

For detailed information about the AI capabilities, see [AI_FEATURES.md](AI_FEATURES.md)

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Pratik Vikas Mitkar**
- Email: [pratikmitkar12@gmail.com](mailto:pratikmitkar12@gmail.com)
- Phone: +91 9665344075
- GitHub: [@PratikVMitkar](https://github.com/PratikVMitkar)

## 🙏 Acknowledgments

- Thanks to the open-source community for the amazing tools and libraries
- Inspired by the need for simple, beautiful diagramming tools
- Built with ❤️ using modern web technologies