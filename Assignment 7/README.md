# UMLForge — Interactive UML Class Diagram & Java Source Generator

[![React 19](https://img.shields.io/badge/React-19.2.8-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2.2-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.3-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![React Flow](https://img.shields.io/badge/React%20Flow-12.11-FF0072.svg)](https://reactflow.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg?logo=docker)](https://www.docker.com/)
[![CI/CD Pipeline](https://img.shields.io/badge/GitHub%20Actions-Passing-2088FF.svg?logo=github-actions)](https://github.com/features/actions)

> **Web Technology — Assignment 7**  
> **Author**: **Varad** ([@KVarad777](https://github.com/KVarad777))  
> **Institution**: Vishwakarma Institute of Technology (VIT), Pune  

---

## 1. Executive Summary

**UMLForge** is a visual software architecture workspace designed to bridge UML Class Diagrams and live Java application development. It provides an interactive diagramming canvas on the left that translates into formatted Java 17/21 source code on the right.

The platform eliminates the barrier between architectural modeling and coding by generating full class definitions, visibility modifiers, Java beans (constructors, getters, setters), relationship associations, and method stubs in real time.

---

## 2. Visual Interface & Previews

### Architectural Workspace (Dark Theme)
![UMLForge Architecture Workspace](assets/ui_overview.png)

### Split Diagram & Synchronized Java Code View (Light Theme)
![UMLForge Light Mode Split View](assets/light_mode.png)

### Synchronized Java Source Generator View
![UMLForge Java Source View](assets/java_generation.png)

---

## 3. Core Capabilities

### Visual UML Modeling
- **Interactive Drag & Pan**: Freely arrange classes across an infinite canvas with smooth pan, zoom, and auto-layout capabilities.
- **Hierarchical Auto-Layout**: Integrated Dagre graph layout algorithm for instant one-click diagram organization.
- **Multi-Directional Connectors**: 4 connection ports per node (Top, Right, Bottom, Left) supporting complex multi-directional relationships.
- **Stereotype Classifications**: Full support for `class`, `«interface»`, `«abstract»`, `«enum»`, and `«record»`.
- **Standard Visibility Notation**:
  - `+` : `public`
  - `−` : `private`
  - `#` : `protected`
  - `~` : `package-private` / default

### UML Relationships & Semantic Code Generation
| Relationship Type | UML Notation | Java Code Translation |
| :--- | :--- | :--- |
| **Inheritance** | Solid line + Hollow Triangle | `public class Child extends Parent` |
| **Realization** | Dashed line + Hollow Triangle | `public class Implementation implements Interface` |
| **Composition** | Solid line + Filled Diamond | Inferred collection (`List<Item>`) initialized and owned by parent |
| **Aggregation** | Solid line + Hollow Diamond | Inferred shared reference (`List<Item>`) passed via constructor/setter |
| **Association** | Solid line + Open Arrow | Direct member reference to target type |
| **Dependency** | Dashed line + Open Arrow | Transient method parameter or return type usage |

### Right-Click Context Menu
Right-clicking any class node opens a floating action menu:
- **Edit Properties**: Focuses the property inspector panel.
- **Add Attribute**: Immediately adds an attribute field.
- **Add Method**: Immediately adds an operation signature.
- **Duplicate Class**: Clones the complete structure.
- **Change Kind**: Switch between Class, Interface, Abstract, Enum, and Record.
- **Delete Class**: Removes the class and its connected relationships.

### Data Types & Array Support
- **Primitives**: `int`, `long`, `double`, `float`, `boolean`, `char`, `byte`, `short`, `void`.
- **Java Arrays**: `String[]`, `int[]`, `long[]`, `double[]`, `byte[]`, `boolean[]`, `Object[]`, and custom class arrays (`ClassName[]`).
- **Standard Objects & Math**: `String`, `UUID`, `LocalDate`, `LocalDateTime`, `BigDecimal`, `BigInteger`, `Optional<T>`.
- **Collections**: `List<T>`, `Set<T>`, `Map<K, V>`, `Queue<T>`, `Deque<T>`.
- **Custom Diagram References**: All user-created classes automatically appear in type autocompletion lists.

### Export & Packaging
- **Diagram JSON**: Export and import complete architecture diagrams as JSON files.
- **Java Project ZIP**: Download an archive containing structured Maven/Gradle source files (`src/main/java/...`), Javadoc comments, and a generated `README.md`.

### Dual-Theme Support
- **Dark Theme**: Developer slate (`#080c14`, `#0d131f`) with neon accents.
- **Light Theme**: Clean studio palette (`#f8fafc`, `#ffffff`) with matching light canvas background and high-contrast typography.

---

## 4. Technical Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 (`19.2.8`) | Component hierarchy, state management, hooks |
| **Type System** | TypeScript 6.0 | Strict type definitions for UML models and AST generation |
| **Build Tool** | Vite 8.2 | Fast Hot Module Replacement and production bundling |
| **Styling** | Tailwind CSS v4 | Custom design tokens and CSS theme variables |
| **Graph Engine** | `@xyflow/react` (v12.11) | Interactive node canvas, handles, and viewport controls |
| **Auto-Layout** | `dagre` | Directed graph layout computation |
| **Icons & Micro-animations** | `lucide-react`, `canvas-confetti` | Interface iconography and copy feedback |
| **File Archiving** | `jszip`, `file-saver` | Client-side ZIP generation and diagram persistence |
| **Containerization** | Docker, Nginx Alpine, Docker Compose | Production multi-stage build and deployment |
| **CI/CD** | GitHub Actions | Automated lint, build, testing, and container verification |

---

## 5. Project Directory Structure

```text
Assignment 7/
├── .github/
│   └── workflows/
│       └── ci.yml                     # Self-contained GitHub Actions workflow
├── assets/                            # Application UI screenshots and previews
├── public/
│   └── favicon.svg                    # Application icon
├── src/
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── CanvasToolbar.tsx      # Floating canvas controls (+ Class, Auto Layout, ⋯)
│   │   │   ├── ContextMenu.tsx        # Right-click contextual action menu
│   │   │   ├── UMLCanvas.tsx          # React Flow canvas wrapper with theme grid
│   │   │   ├── UMLClassNode.tsx       # Custom UML class node renderer
│   │   │   └── UMLEdge.tsx            # Custom UML relationship connectors with markers
│   │   ├── codegen/
│   │   │   └── JavaViewerPanel.tsx    # Live Java code editor with syntax highlighting
│   │   ├── inspector/
│   │   │   ├── AttributeEditor.tsx    # Compact field editor with type datalists
│   │   │   ├── InspectorPanel.tsx     # Contextual property editor drawer
│   │   │   ├── MethodEditor.tsx       # Operation editor with parameter lists
│   │   │   └── RelationshipEditor.tsx # Relationship type & multiplicity editor
│   │   └── layout/
│   │       └── AppHeader.tsx          # Top navbar (Presets, Export, Theme, Layout focus)
│   ├── core/
│   │   ├── diagramUtils.ts            # Auto-layout, JSON import/export, ZIP builder
│   │   ├── initialData.ts             # Domain presets (E-Commerce, Observer Pattern)
│   │   ├── javaGenerator.ts           # AST to Java source code translation engine
│   │   └── types.ts                   # TypeScript data models and type constants
│   ├── App.tsx                        # Master state orchestrator and layout manager
│   ├── index.css                      # Dual-theme variables and React Flow styling
│   └── main.tsx                       # React application entry point
├── .dockerignore                      # Docker context exclusions
├── .gitignore                         # Git ignored files and directories
├── docker-compose.yml                 # Docker Compose deployment definition
├── Dockerfile                         # Multi-stage production Dockerfile
├── index.html                         # HTML5 shell with Google Fonts
├── nginx.conf                         # Production Nginx reverse proxy configuration
├── package.json                       # Dependencies and build scripts
├── tsconfig.app.json                  # TypeScript compiler options
├── tsconfig.json                      # Workspace TS configuration
└── vite.config.ts                     # Vite + Tailwind v4 configuration
```

---

## 6. Getting Started Locally

### Prerequisites
- **Node.js**: Version 20.0 or higher
- **npm**: Version 10.0 or higher

### Local Development

1. Navigate to the project directory:
   ```bash
   cd "Assignment 7"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open the application:
   ```text
   http://localhost:5173
   ```

### Production Build

```bash
npm run build
npm run preview
```

---

## 7. Docker & Container Deployment

### 1. Build and Run Container with Docker

```bash
# Build the production Docker image
docker build -t umlforge-app .

# Run the container on port 8080
docker run -d -p 8080:80 --name umlforge umlforge-app
```

Access the application at **[http://localhost:8080](http://localhost:8080)**.  
Verify container health:
```bash
curl http://localhost:8080/health
# Returns: healthy
```

### 2. Run with Docker Compose

```bash
# Start container in background
docker compose up -d

# View container logs
docker compose logs -f

# Stop container
docker compose down
```

---

## 8. Continuous Integration & Deployment (CI/CD)

The project includes an automated GitHub Actions pipeline (`.github/workflows/assignment-7-ci.yml`):

1. **Lint & Build Stage**:
   - Sets up Node.js 20 environment.
   - Verifies TypeScript compilation and builds the Vite production bundle.
   - Archives and uploads the production bundle artifact.
2. **Docker Build & Smoke Test Stage**:
   - Builds the multi-stage Docker container image.
   - Runs a container instance and validates the `/health` endpoint.

---

## 9. Academic Information

- **Author**: **Varad** ([@KVarad777](https://github.com/KVarad777))
- **Course**: Web Technology (WT) — Semester V
- **Institution**: Vishwakarma Institute of Technology (VIT), Pune
- **Repository**: [https://github.com/KVarad777/WT-Assignment](https://github.com/KVarad777/WT-Assignment)
