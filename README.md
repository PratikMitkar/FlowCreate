# FlowCreate

FlowCreate is a modern, intuitive tool for creating beautiful flowcharts and diagrams using Mermaid syntax. With a sleek UI and real-time preview, it makes diagram creation effortless and enjoyable.

![FlowCreate Interface](public/placeholder.jpg)

## Features

- **Real-time Preview**: See your diagrams update as you type
- **Multiple Diagram Types**: Support for flowcharts, sequence diagrams, gantt charts, and more
- **Theme Customization**: Choose from 8 beautiful themes (Pastel, Vibrant, Minimal, Ocean, Corporate, Sunset, Forest, Dark)
- **Export Options**: Export your diagrams as SVG or PNG (with or without background)
- **Responsive Design**: Works beautifully on all device sizes
- **Glassmorphism UI**: Modern frosted glass design elements
- **Dark/Light Mode**: Automatic theme switching based on system preference

## Getting Started

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

## Deploy on GitHub Pages

### Automated Deployment (Recommended)

This project includes scripts to automate the deployment process:

**On Windows:**
```bash
deploy-to-github.bat
```

**On macOS/Linux:**
```bash
chmod +x deploy-to-github.sh
./deploy-to-github.sh
```

The scripts will:
1. Create a new repository on GitHub
2. Push your code to the repository
3. Configure GitHub Pages automatically

### Manual Deployment

To manually deploy this project on GitHub Pages, follow these steps:

1. Create a new repository on GitHub
2. Push your code to the repository:
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```
3. In your repository settings, go to "Pages"
4. Under "Build and deployment", select "GitHub Actions"
5. The deployment workflow is already configured in `.github/workflows/deploy.yml`

The site will automatically deploy whenever you push to the `main` branch.

### Manual Static Deployment

If you prefer to deploy manually, you can:

```bash
npm run build
```

This will generate an `out` directory that you can deploy to any static hosting service.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Tailwind CSS](https://tailwindcss.com/) - utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - accessible and customizable components
- [Mermaid](https://mermaid.js.org/) - diagramming and charting tool

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.