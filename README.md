# webpack-templet

A modern, production-ready **React 19 + TypeScript** starter template powered by **Webpack 5**. Designed for rapid development with CSS Modules, environment variables, runtime config injection, error boundaries, code splitting, and automated GitHub Pages deployment.

---

## ✨ Features

- **React 19 + TypeScript** — Latest React with full TypeScript support and strict mode.
- **Webpack 5** — Separate dev / production configs merged via `webpack-merge`.
- **CSS Modules** — Scoped styles with `*.module.css` convention and camelCase exports.
- **Environment Variables** — `.env` support with safe defaults via `dotenv-webpack`.
- **Runtime Config** — Inject runtime variables through `src/config.ts` → `config.js` (no rebuild needed).
- **Compile-Time Globals** — `__DEV__`, `__PROD__`, `__VERSION__`, `__BUILD_DATE__` available everywhere.
- **Error Boundaries & HOCs** — Built-in `ErrorBoundary`, `withErrorBoundary`, and `withSuspense` higher-order components.
- **Code Splitting & Tree Shaking** — Automatic vendor chunking, dead-code elimination, and Terser minification.
- **Asset Handling** — Import images, fonts (woff2), and SVGs directly in your code.
- **ESLint + Prettier** — Pre-configured with `eslint-config-prettier` and `eslint-plugin-react-hooks`.
- **Husky + lint-staged** — Auto-format and lint staged files on every commit.
- **Polyfills** — `core-js 3` usage-based polyfills targeting older browsers (Chrome 49+, Firefox 52+, Safari 10+, Edge 14+).
- **Bundle Analyzer** — Generates a static report on every production build.
- **GitHub Actions** — CI/CD workflow for automated GitHub Pages deployment.
- **Clean Script** — Reset the project to a minimal starter state with one command.

---

## 📁 Folder Structure

```
.
├── .babelrc                    # Babel config (presets, polyfill targets)
├── .env.defaults               # Default env values (fallback)
├── .env.example                # Example env file — copy to .env
├── .gitignore
├── .prettierrc.json
├── .prettierignore
├── eslint.config.mjs           # ESLint flat config
├── package.json
├── tsconfig.json
├── webpack.config.common.ts    # Shared webpack config
├── webpack.config.dev.ts       # Development config (dev server, source maps)
├── webpack.config.prod.ts      # Production config (minification, chunking)
├── README.md
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deploy workflow
│
├── .husky/
│   └── pre-commit              # Runs lint-staged before each commit
│
├── .vscode/
│   └── settings.json
│
├── public/
│   └── react.svg               # Static assets copied to dist/
│
├── scripts/
│   ├── clean.sh                # Reset project to minimal template
│   └── ConfigWebpackPlugin.ts  # Custom plugin: compiles config.ts → config.js
│
└── src/
    ├── index.html              # HTML template
    ├── index.tsx               # App entry point
    ├── index.css               # Global styles
    ├── App.tsx                 # Root component
    ├── App.module.css          # Root component styles (CSS Module)
    ├── config.ts               # Runtime config (injected as config.js)
    ├── declarations.d.ts       # TypeScript declarations (CSS, images, globals)
    │
    ├── assets/                 # Fonts, images
    │   ├── Sohne.woff2
    │   └── webpack.png
    │
    ├── components/             # Reusable components
    │   ├── Counter.tsx
    │   ├── Counter.module.css
    │   ├── DemoError.tsx
    │   └── ErrorBoundary.tsx
    │
    └── HOC/                    # Higher-order components
        ├── withErrorBoundary.tsx
        └── withSuspense.tsx
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20 (recommended)
- **npm** ≥ 9

### Installation

```sh
# Clone the repository
git clone https://github.com/<your-username>/webpack-templet.git
cd webpack-templet

# Install dependencies
npm install
```

### Setup Environment

```sh
# Copy the example env file and edit as needed
cp .env.example .env
```

### Start Development Server

```sh
npm start
```

Opens at [http://localhost:3000](http://localhost:3000) with hot module replacement enabled.

### Build for Production

```sh
npm run build
```

Outputs optimized bundle to `dist/`. A bundle analyzer report is generated at `dist/report.html`.

---

## 📜 Scripts

| Command            | Description                                                          |
| ------------------ | -------------------------------------------------------------------- |
| `npm start`        | Start the dev server at `localhost:3000` with HMR                    |
| `npm run build`    | Create an optimized production build in `dist/`                      |
| `npm run lint`     | Run ESLint across the project                                        |
| `npm run lint:fix` | Run ESLint and auto-fix issues                                       |
| `npm run clean`    | Reset `src/` to a minimal template (removes components, HOC, assets) |
| `npm run prepare`  | Install Husky Git hooks (runs automatically after `npm install`)     |

---

## ⚙️ Environment Variables

### Build-Time Variables (`.env`)

Managed by `dotenv-webpack`. Create a `.env` file from the example:

```sh
cp .env.example .env
```

| File            | Purpose                                                |
| --------------- | ------------------------------------------------------ |
| `.env`          | Your local overrides (git-ignored)                     |
| `.env.defaults` | Fallback values used when a key is missing from `.env` |
| `.env.example`  | Documents available keys — used as a safe schema       |

Access in code via `process.env.APP_NAME`.

### Compile-Time Globals

Injected by `DefinePlugin` — available in all source files:

| Variable         | Type      | Description                                  |
| ---------------- | --------- | -------------------------------------------- |
| `__DEV__`        | `boolean` | `true` in development, `false` in production |
| `__PROD__`       | `boolean` | `true` in production, `false` in development |
| `__VERSION__`    | `string`  | Version from `package.json`                  |
| `__BUILD_DATE__` | `string`  | ISO timestamp of the build                   |

### Runtime Config (`src/config.ts`)

For values that need to change **without rebuilding** (e.g., API URLs per environment):

```ts
// src/config.ts
(function (window: Window) {
  window.__env = window.__env || {};
  window.__env.NAME = 'Config Name';
})(window);
```

This file is compiled to `config.js` by the custom `ConfigWebpackPlugin` and injected as a `<script>` tag in `<head>` before the app bundle. In production, you can swap the `config.js` file on the server to change values without redeploying.

Access in code via `window.__env.NAME`.

---

## 🧹 Clean Script

Reset the project to a minimal starter state:

```sh
npm run clean
```

This removes `src/components/`, `src/HOC/`, and `src/assets/`, and resets `App.tsx`, `App.module.css`, and `index.css` to minimal templates. Useful when using this repo as a starting point for a new project.

---

## 🔧 Webpack Configuration

The webpack setup is split into three files:

| File                       | Purpose                                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| `webpack.config.common.ts` | Shared config — entry, Babel loader, HTML plugin, env plugin, config plugin                    |
| `webpack.config.dev.ts`    | Dev server (`localhost:3000`), source maps, `style-loader`, HMR                                |
| `webpack.config.prod.ts`   | Minification (Terser + CSS Minimizer), `MiniCssExtractPlugin`, code splitting, bundle analyzer |

### Production Optimizations

- **Vendor Splitting** — Each `node_modules` package gets its own chunk (`npm.<package-name>.js`)
- **Common Chunks** — Shared code across 2+ entry points is extracted automatically
- **Terser** — Multi-pass compression with dead-code elimination
- **CSS Extraction** — Styles extracted to separate `.css` files
- **Content Hashing** — Filenames include hashes for long-term caching
- **Tree Shaking** — `usedExports`, `sideEffects`, and `innerGraph` enabled

---

## 🧪 Linting & Formatting

### ESLint

```sh
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
```

### Prettier

Configured via `.prettierrc.json`. Runs automatically on staged files via `lint-staged`.

### Pre-commit Hook (Husky + lint-staged)

On every commit, Husky triggers `lint-staged` which:

- Runs `eslint --fix` and `prettier --write` on staged `*.ts` / `*.tsx` files
- Runs `prettier --write` on staged `*.css` / `*.scss` files
- Runs `prettier --write` on staged `*.json` / `*.md` files

---

## 🌐 Browser Targets

Configured in `.babelrc` with `core-js 3` usage-based polyfills:

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | 49              |
| Firefox | 52              |
| Safari  | 10              |
| Edge    | 14              |

---

## 🚢 Deployment (GitHub Pages)

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

1. Triggers on push/PR to `main`, or manually via `workflow_dispatch`
2. Installs dependencies and builds the project
3. Deploys the `dist/` folder to GitHub Pages

### Setup

1. Go to your repository **Settings → Pages**
2. Set **Source** to **GitHub Actions**
3. Push to `main` — the workflow runs automatically

---

## 📂 CSS Modules

Any file named `*.module.css` is treated as a CSS Module:

```tsx
import style from './App.module.css';

const App = () => <div className={style.container}>Hello</div>;
```

- **Development**: Class names are readable — `[path][name]__[local]___[hash:5]`
- **Production**: Class names are minified — `[hash:5]`
- **Convention**: Exports use `camelCase` (e.g., `.my-class` → `style.myClass`)

---

## 📦 Key Dependencies

| Package                                          | Purpose                              |
| ------------------------------------------------ | ------------------------------------ |
| `react` / `react-dom`                            | UI framework                         |
| `core-js`                                        | Polyfills for older browsers         |
| `webpack` / `webpack-cli` / `webpack-dev-server` | Build tooling                        |
| `babel-loader` + presets                         | TypeScript & JSX transpilation       |
| `dotenv-webpack`                                 | Build-time `.env` variable injection |
| `html-webpack-plugin`                            | HTML template processing             |
| `mini-css-extract-plugin`                        | CSS extraction for production        |
| `terser-webpack-plugin`                          | JavaScript minification              |
| `webpack-bundle-analyzer`                        | Bundle size visualization            |
| `eslint` / `prettier`                            | Code quality & formatting            |
| `husky` / `lint-staged`                          | Git hooks & staged file processing   |

---

## License

[ISC](LICENSE)
