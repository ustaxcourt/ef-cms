/* eslint-disable @miovision/disallow-date/no-new-date */
import esbuildHelper from './esbuildHelper.mjs';
import fs from 'fs';

const replaceHtmlFile = liveReload => {
  const indexFile = fs.readFileSync('./dist/index.html', 'utf8');
  const files = fs.readdirSync('./dist');
  const [jsFile] = files.filter(file => /^index\.[A-Z0-9]+\.js$/.test(file));
  const [cssFile] = files.filter(file => /^index\.[A-Z0-9]+\.css$/.test(file));
  let indexFileReplaced = indexFile
    .replace(/src="\/index\.js"/, `src="/${jsFile}"`)
    .replace(/href="\/index\.css"/, `href="/${cssFile}"`)
    .replace(/src="\/index\.[A-Z0-9]+\.js"/, `src="/${jsFile}"`)
    .replace(/href="\/index\.[A-Z0-9]+\.css"/, `href="/${cssFile}"`)
    .replace(/REPLACE_ME_LAST_DEPLOYED/, new Date().toString());
  if (liveReload) {
    indexFileReplaced = indexFileReplaced.replace(
      /<\/body>/g,
      '<script src="http://localhost' +
        ':37527/livereload.js?snipver=1"></script>' +
        '</body>',
    );
  }
  fs.writeFileSync('./dist/index.html', indexFileReplaced, 'utf8');
};

esbuildHelper({
  entryPoint: 'index.ts',
  indexName: 'index.html',
  outdir: 'dist',
  reloadServerPort: 37527,
  replaceHtmlFile,
});
