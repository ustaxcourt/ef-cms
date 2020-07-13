const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const madge = require('madge');

(async () => {
  const clientDependencies = await madge('./web-client/src/app.jsx');
  await clientDependencies.image('./graph-generators/client-dependencies.jpg');

  const serverDependencies = await madge(['./web-api/src/app.js']);
  await serverDependencies.image('./graph-generators/server-dependencies.jpg');

  await imagemin(['./graph-generators/*.jpg'], {
    destination: './docs/images',
    plugins: [imageminPngquant()],
  });

  // eslint-disable-next-line no-console
  console.log('Images optimized');
})();
