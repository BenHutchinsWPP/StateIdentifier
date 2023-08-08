# Project Resources
The following resources were used while developing this application:
- [GitHub](https://github.com/)
- [Git](https://git-scm.com/download/win)
- [Visual Studio Code](https://code.visualstudio.com/) 
- [Node.js for Windows](https://nodejs.org/en#home-downloadhead)
- [Getting Started with Vite](https://vitejs.dev/guide/)



# Git Setup
- Pre-Requisites:
  - Install Visual Studio Code
  - Setup a GitHub Account
  - Install Git
- Open Visual Studio Code
- From a terminal, configure git for your GitHub account like so:
  - git config --global user.name "John Doe"
  - git config --global user.email johndoe@example.com

# Project Creation
This project was created by running these commands:
- npm create vite@latest
  - Framework: React
  - Variant: JavaScript + SWC (Speedy Web Compiler - Rust)
- npm install
- npm run dev
- npm install --save ag-grid-community
- npm install -D tailwindcss
- npx tailwindcss init





# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
