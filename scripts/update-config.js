const fs = require('fs');
const path = require('path');

// Get repository name from command line argument
const repoName = process.argv[2];

if (!repoName) {
  console.error('Please provide a repository name as an argument');
  console.error('Usage: node update-config.js <repository-name>');
  process.exit(1);
}

// Update next.config.mjs
const nextConfigPath = path.join(__dirname, '..', 'next.config.mjs');
let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');

// Replace the basePath and assetPrefix
nextConfig = nextConfig.replace(
  /basePath: process.env.NODE_ENV === 'production' \? '\/[^']*' : ''/,
  `basePath: process.env.NODE_ENV === 'production' ? '/${repoName}' : ''`
);

nextConfig = nextConfig.replace(
  /assetPrefix: process.env.NODE_ENV === 'production' \? '\/[^']*' : ''/,
  `assetPrefix: process.env.NODE_ENV === 'production' ? '/${repoName}/' : ''`
);

fs.writeFileSync(nextConfigPath, nextConfig);

console.log(`✅ Updated next.config.mjs with repository name: ${repoName}`);

// Update package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

packageJson.repository.url = `https://github.com/${process.env.USER || 'username'}/${repoName}.git`;
packageJson.bugs.url = `https://github.com/${process.env.USER || 'username'}/${repoName}/issues`;
packageJson.homepage = `https://github.com/${process.env.USER || 'username'}/${repoName}#readme`;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`✅ Updated package.json with repository information`);

console.log(`
📝 Next steps:
1. Commit these changes: git add . && git commit -m "Update config for ${repoName}"
2. Push to GitHub: git push origin main
3. Enable GitHub Pages in your repository settings
`);