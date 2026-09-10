# UMLForge — Interactive UML Class Diagram & Java Generator

> **Web Technology Assignment 7**  
> A developer-grade visual workspace for crafting UML Class Diagrams with real-time synchronized Java 17/21 source code generation.

---

## 🚀 Features

- **Interactive Movable UML Canvas**: Drag, drop, align, and organize classes freely.
- **Full UML Stereotypes**: Support for standard Classes, `«interface»`, `«abstract»`, `«enum»`, and `«record»`.
- **Standard Visibility Notation**: `+` (public), `−` (private), `#` (protected), `~` (package-private).
- **Rich Data Types & Java Arrays**: Supports primitives, array types (`String[]`, `int[]`, etc.), collections (`List<T>`, `Set<T>`, `Map<K, V>`), and custom class references.
- **UML Relationships**:
  - Inheritance (`extends`) with hollow closed arrowhead.
  - Realization (`implements`) with dashed line and hollow arrowhead.
  - Composition (whole-part ownership) with diamond marker.
  - Aggregation (shared reference) with hollow diamond.
  - Association and Dependency with directional arrows and multiplicity badges (`1`, `0..1`, `1..*`, `*`).
- **Right-Click Context Menu**: Right-click on any class node for quick editing, duplicating, adding fields/methods, and changing types.
- **Real-Time Synchronized Java Code Generator**: Live syntax highlighting, parameter list formatting, getters/setters generation, and constructors.
- **Export & Import**:
  - Save diagram as JSON and import existing architectures.
  - One-click Java Project ZIP export (`src/main/java/...`).
- **Dual-Theme Support**: Dark developer slate and crisp Light mode.
- **Dagre Auto-Layout**: Hierarchical auto-arrangement of complex diagram graphs.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4
- **Diagramming**: `@xyflow/react` (React Flow v12), `dagre` graph layout
- **Utilities**: `lucide-react`, `canvas-confetti`, `jszip`, `file-saver`
- **Deployment & Server**: Docker, Nginx Alpine, Docker Compose
- **CI/CD**: GitHub Actions

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js 20+ and npm

### Installation & Run

```bash
cd "Assignment 7"
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🐳 Docker Deployment

### 1. Build and Run with Docker

```bash
# Build the Docker container image
docker build -t umlforge-app .

# Run the container on port 8080
docker run -d -p 8080:80 --name umlforge umlforge-app
```

Access the application at [http://localhost:8080](http://localhost:8080).  
Check container health at `http://localhost:8080/health`.

### 2. Run with Docker Compose

```bash
docker compose up -d
```

To stop:
```bash
docker compose down
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

The repository includes an automated CI/CD pipeline (`.github/workflows/assignment-7-ci.yml`) that executes on every push and pull request:

1. **Build & Lint**:
   - Sets up Node.js 20.
   - Verifies TypeScript compilation and builds the Vite production bundle.
   - Archives and uploads the production bundle artifact.
2. **Docker Build & Smoke Test**:
   - Builds the multi-stage Nginx Docker container.
   - Runs a container instance and validates the `/health` endpoint.
