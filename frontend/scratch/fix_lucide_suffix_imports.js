const fs = require('fs');
const path = require('path');

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

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Correct regex to match multiline braced imports
  const importRegex = /import\s*\{\s*([\s\S]*?)\s*\}\s*from\s+['"]lucide-react['"]/g;
  
  let modified = false;
  
  content = content.replace(importRegex, (match, importBlock) => {
    const items = importBlock.split(',');
    let changed = false;
    
    const newItems = items.map(item => {
      const trimmed = item.trim();
      if (!trimmed) return '';
      
      // Match names ending in 'Icon' but NOT having ' as '
      if (trimmed.endsWith('Icon') && !trimmed.includes(' as ')) {
        const baseName = trimmed.slice(0, -4); // Remove 'Icon'
        if (baseName && baseName !== 'type LucideIcon') {
          changed = true;
          return `${baseName} as ${trimmed}`;
        }
      }
      return trimmed;
    });
    
    if (changed) {
      modified = true;
      return `import {\n  ${newItems.filter(Boolean).join(',\n  ')}\n} from 'lucide-react'`;
    }
    return match;
  });
  
  if (modified) {
    console.log(`Updated lucide imports in: ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

console.log('Script execution finished.');
