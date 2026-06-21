const fs = require('fs');
const path = require('path');

const inputPath = 'C:\\Users\\admin\\.gemini\\antigravity-ide\\brain\\6170aaa2-aef6-428a-816b-d3410d90bbd3\\.system_generated\\steps\\13\\output.txt';
const outputPath = path.join(__dirname, 'projects_summary.txt');

try {
  const content = fs.readFileSync(inputPath, 'utf8');
  const data = JSON.parse(content);
  const summary = data.projects.map(p => ({
    name: p.name,
    title: p.title
  }));
  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log('Successfully formatted projects list to projects_summary.txt');
} catch (err) {
  console.error('Error processing file:', err);
}
