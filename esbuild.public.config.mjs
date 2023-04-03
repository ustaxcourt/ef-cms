/* eslint-disable @miovision/disallow-date/no-new-date */
import esbuildHelper from './esbuildHelper.mjs';
import fs from 'fs';

const replaceHtmlFile = liveReload => {
  const indexFile = fs.readFileSync('./dist-public/index-public.html', 'utf8');
  const files = fs.readdirSync('./dist-public');
  const [jsFile] = files.filter(file =>
    /^index-public\.[A-Z0-9]+\.js$/.test(file),
  );
  const [cssFile] = files.filter(file =>
    /^index-public\.[A-Z0-9]+\.css$/.test(file),
  );
  let indexFileReplaced = indexFile
    .replace(/src="\/index-public\.js"/, `src="/${jsFile}"`)
    .replace(/href="\/index-public\.css"/, `href="/${cssFile}"`)
    .replace(/src="\/index-public\.[A-Z0-9]+\.js"/, `src="/${jsFile}"`)
    .replace(/href="\/index-public\.[A-Z0-9]+\.css"/, `href="/${cssFile}"`)
    .replace(/REPLACE_ME_LAST_DEPLOYED/, new Date().toString());

  if (liveReload) {
    indexFileReplaced = indexFileReplaced.replace(
      /<\/body>/g,
      '<script src="http://localhost' +
        ':37528/livereload.js?snipver=1"></script>' +
        '</body>',
    );
  }
  fs.writeFileSync('./dist-public/index.html', indexFileReplaced, 'utf8');
};

esbuildHelper({
  entryPoint: 'index-public.ts',
  indexName: 'index-public.html',
  outdir: 'dist-public',
  reloadServerPort: 37528,
  replaceHtmlFile,
});
