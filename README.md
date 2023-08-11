# Overview
This project was written as open-source code by the WPP, using the MIT open-source license.
If you'd like to make improvements, pull-requests are welcome!

To use the application, you may play with the latest live version here:
[https://benhutchinswpp.github.io/StateIdentifier/](https://benhutchinswpp.github.io/StateIdentifier/)



# Project Resources
The following resources were used while developing this application:
- [GitHub](https://github.com/)
- [Git](https://git-scm.com/download/win)
- [Visual Studio Code](https://code.visualstudio.com/) 
- [Node.js for Windows](https://nodejs.org/en#home-downloadhead)
- [Getting Started with Vite](https://vitejs.dev/guide/)
- [TailWindCSS with React + Vite](https://www.freecodecamp.org/news/how-to-install-tailwindcss-in-react/)
- [Census Bureau - Cartographic Boundary Files - Shapefile](https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html)
- [ShapeFile to GeoJSON](https://mygeodata.cloud/converter/)
- [World Atlas UnPkg](https://unpkg.com/browse/world-atlas@2.0.2/)
- [d3-geo library](https://github.com/d3/d3-geo#geoContains)


# Git Project Setup
- Pre-Requisites:
  - Install Visual Studio Code
  - Setup a GitHub Account
  - Install Git
- Open Visual Studio Code
- From a terminal, configure git for your GitHub account like so:
  - git config --global user.name "John Doe"
  - git config --global user.email johndoe@example.com

# Project Creation
This project was setup with the following packages:
- npm create vite@latest
  - Framework: React
  - Variant: JavaScript + SWC (Speedy Web Compiler - Rust)
- npm install
- ISC License (The ISC license is functionally equivalent to the BSD 2-Clause and MIT licenses)
  - npm install d3
  - npm install d3-geo
- MIT License:
  - npx tailwindcss init
  - npm install -D tailwindcss postcss autoprefixer
  - npm install react-tabulator
  - npm install --save react-json-view-lite

<!-- Had to remove due to compatibility issues with compilation in GitHub Pages -->
<!-- - npm install --save @koale/useworker --force -->

<!-- Some packages which were tested for their copy-paste functionality in grid-views, but which we decided against using due to licensing or compatibility: -->
<!-- - npm install --save ag-grid-community -->
<!-- - npm install --save ag-grid-react -->
<!-- - npm install handsontable -->
<!-- - npm add -D @trebco/treb -->
<!-- tabulator -->



To start the page for debugging locally:
- Open a VSC terminal
  - npm run dev
- CTRL-Click on the localhost link

# Hosting on GitHub Pages
To setup the hosting on GitHub pages, the following steps were taken:
- The below is a summary of this [Youtube Video](https://www.youtube.com/watch?v=XhoWXhyuW_I)
- Include the root-path (name of the repo) in vite.config.js
```js
export default defineConfig({
  plugins: [react()],
  base: "/StateIdentifier/"
})
```
- Added /.github/workflows/deploy.yml
- GitHub Project &rarr; Settings &rarr; Actions &rarr; General &rarr; Workflow Permissions &rarr; Read and Write
- GitHub Project &rarr; Settings &rarr; Pages &rarr; Branch &rarr; gh-pages




# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
