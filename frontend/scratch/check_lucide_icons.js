const fs = require('fs');
const path = require('path');
const lucide = require('lucide-react');

const directoryPath = 'c:/Users/Mahalakshmi/Downloads/DriveCore/frontend';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        results = results.concat(walk(fullPath));
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = walk(directoryPath);
const undefinedIconsMap = {};

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  // Find all imports from 'lucide-react'
  // Look for: import { ... } from 'lucide-react'
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const importBlock = match[1];
    // Split by comma
    const items = importBlock.split(',').map(s => s.trim()).filter(Boolean);
    items.forEach(item => {
      // Handle potential alias like: Name as Alias
      let originalName = item;
      let aliasName = item;
      if (item.includes(' as ')) {
        const parts = item.split(' as ');
        originalName = parts[0].trim();
        aliasName = parts[1].trim();
      }
      
      // Check if originalName exists in lucide-react exports
      if (lucide[originalName] === undefined) {
        if (!undefinedIconsMap[filePath]) {
          undefinedIconsMap[filePath] = [];
        }
        undefinedIconsMap[filePath].push({ originalName, item });
      }
    });
  }
});

console.log('--- UNDEFINED LUCIDE ICONS FOUND ---');
console.log(JSON.stringify(undefinedIconsMap, null, 2));
console.log('------------------------------------');
