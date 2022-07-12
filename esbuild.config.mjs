import esbuildHelper from './esbuildHelper.mjs';
import fs from 'fs';

const replaceHtmlFile = () => {
  const indexFile = fs.readFileSync('./dist/index.html', 'utf8');
  const files = fs.readdirSync('./dist');
  const [jsFile] = files.filter(file => /^index\.[A-Z0-9]+\.js$/.test(file));
  const [cssFile] = files.filter(file => /^index\.[A-Z0-9]+\.css$/.test(file));
  const indexFileReplaced = indexFile
    .replace(/src="\/index\.js"/, `src="/${jsFile}"`)
    .replace(/href="\/index\.css"/, `href="/${cssFile}"`)
    .replace(/src="\/index\.[A-Z0-9]+\.js"/, `src="/${jsFile}"`)
    .replace(/href="\/index\.[A-Z0-9]+\.css"/, `href="/${cssFile}"`);
  fs.writeFileSync('./dist/index.html', indexFileReplaced, 'utf8');
};

esbuildHelper({
  entryPoint: 'index.js',
  hostPort: 1234,
  indexName: 'index.html',
  jsRegex: /index\.[A-Z0-9]+\.js/,
  outdir: 'dist',
  replaceHtmlFile,
  servePort: 5555,
});
