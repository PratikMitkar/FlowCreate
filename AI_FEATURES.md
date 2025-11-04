# AI Features in FlowCreate

FlowCreate now includes an AI assistant that can automatically generate Mermaid diagrams from natural language descriptions. This feature runs entirely in the browser, making it lightweight and privacy-friendly.

## How It Works

The AI assistant uses a template-based approach to convert your text descriptions into appropriate Mermaid code:

1. **Keyword Detection**: The system analyzes your input to determine the most suitable diagram type (flowchart, sequence diagram, etc.)
2. **Template Matching**: Based on the detected diagram type, it selects an appropriate template
3. **Content Generation**: It extracts key concepts from your description and incorporates them into the template
4. **Code Output**: The generated Mermaid code is automatically placed in the editor for you to customize further

## Supported Diagram Types

- **Flowcharts**: Best for processes, workflows, and step-by-step procedures
- **Sequence Diagrams**: Ideal for showing interactions between different entities
- **Gantt Charts**: Perfect for project timelines and scheduling
- **Class Diagrams**: Great for showing object-oriented structures
- **State Diagrams**: Useful for illustrating different states and transitions
- **Pie Charts**: Good for showing distributions and proportions
- **ER Diagrams**: Suitable for database entity relationships
- **Journey Diagrams**: Excellent for user experience flows

## Using the AI Assistant

1. Describe what you want to visualize in the text input area
2. Click "Generate Chart" or press Enter
3. The AI will analyze your request and generate appropriate Mermaid code
4. The generated code will appear in the editor panel
5. You can further customize the code or regenerate with different descriptions

## Examples

Try these example prompts to see how the AI assistant works:

- "Create a flowchart for a user login process with authentication and error handling"
- "Show a sequence diagram of a user placing an order on an e-commerce website"
- "Create a timeline for a software development project with design, development, and testing phases"
- "Show a class diagram for a simple banking system with Account, Customer, and Transaction classes"

## Privacy

All processing happens directly in your browser - no data is sent to any servers. Your descriptions and generated diagrams remain completely private.

## Limitations

Since this is a lightweight, browser-based solution, it has some limitations compared to full AI models:

- The generation is template-based rather than using a large language model
- Complex or highly specific requirements may need manual adjustments
- The system relies on keyword detection which may not always perfectly match your intent

## Customization

After the AI generates code, you can:
- Edit the generated Mermaid code directly
- Adjust styling and layout options
- Modify node labels and connections
- Add additional elements as needed

The AI assistant is designed to give you a strong starting point that you can then refine to meet your exact needs.