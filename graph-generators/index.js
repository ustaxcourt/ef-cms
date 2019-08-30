const madge = require('madge');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

(async () => {
  const clientDependencies = await madge('./web-client/src/app.jsx');
  await clientDependencies.image('./graph-generators/client-dependencies.png');

  const serverDependencies = await madge([
    './web-api/src/apiHandlers.js',
    './web-api/src/casesHandlers.js',
    './web-api/src/documentsHandlers.js',
    './web-api/src/sectionsHandlers.js',
    './web-api/src/trialSessionsHandlers.js',
    './web-api/src/usersHandlers.js',
    './web-api/src/workItemsHandlers.js',
  ]);
  await serverDependencies.image('./graph-generators/server-dependencies.png');

  await imagemin(['./graph-generators/*.png'], {
    destination: './docs/images',
    plugins: [imageminPngquant()],
  });

  // eslint-disable-next-line no-console
  console.log('Images optimized');
})();
