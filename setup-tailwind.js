// setup-tailwind.js
const fs = require('fs');
const path = require('path');

// Tailwind config
const tailwindConfig = `module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      }
    },
  },
  plugins: [],
}`;

// PostCSS config
const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

// Create files
try {
  fs.writeFileSync(path.join(__dirname, 'tailwind.config.js'), tailwindConfig);
  console.log('✅ Created tailwind.config.js');
  
  fs.writeFileSync(path.join(__dirname, 'postcss.config.js'), postcssConfig);
  console.log('✅ Created postcss.config.js');
  
  console.log('\n✨ Tailwind CSS configuration files created successfully!');
  console.log('\nNext steps:');
  console.log('1. Make sure to import Tailwind in your CSS file (src/assets/main.css)');
  console.log('2. Add these lines to main.css:');
  console.log('   @tailwind base;');
  console.log('   @tailwind components;');
  console.log('   @tailwind utilities;');
} catch (error) {
  console.error('❌ Error creating config files:', error);
}