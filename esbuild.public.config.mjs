import esbuildHelper from './esbuildHelper.mjs';
import fs from 'fs';

const replaceHtmlFile = () => {
  const indexFile = fs.readFileSync('./dist-public/index-public.html', 'utf8');
  const files = fs.readdirSync('./dist-public');
  const [jsFile] = files.filter(file =>
    /^index-public\.[A-Z0-9]+\.js$/.test(file),
  );
  const [cssFile] = files.filter(file =>
    /^index-public\.[A-Z0-9]+\.css$/.test(file),
  );
  const indexFileReplaced = indexFile
    .replace(/src="\/index-public\.js"/, `src="/${jsFile}"`)
    .replace(/href="\/index-public\.css"/, `href="/${cssFile}"`)
    .replace(/src="\/index-public\.[A-Z0-9]+\.js"/, `src="/${jsFile}"`)
    .replace(/href="\/index-public\.[A-Z0-9]+\.css"/, `href="/${cssFile}"`);
  fs.writeFileSync('./dist-public/index.html', indexFileReplaced, 'utf8');
};

esbuildHelper({
  entryPoint: 'index-public.js',
  hostPort: 5678,
  indexName: 'index-public.html',
  jsRegex: /index-public\.[A-Z0-9]+\.js/,
  outdir: 'dist-public',
  replaceHtmlFile,
  servePort: 5556,
});
