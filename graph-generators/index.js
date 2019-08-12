const madge = require('madge');

madge('./web-client/src/app.jsx').then(res =>
  res.image('./docs/images/client-dependencies.png'),
);
madge([
  './web-api/src/apiHandlers.js',
  './web-api/src/casesHandlers.js',
  './web-api/src/documentsHandlers.js',
  './web-api/src/sectionsHandlers.js',
  './web-api/src/trialSessionsHandlers.js',
  './web-api/src/usersHandlers.js',
  './web-api/src/workItemsHandlers.js',
]).then(res => res.image('./docs/images/server-dependencies.png'));
