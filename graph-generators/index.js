const madge = require('madge');

madge('../web-client/src/app.jsx')
  .then(res => res.image('../docs/images/client-dependencies.png'))
  .then(writtenImagePath => {
    console.log('Image written to ' + writtenImagePath);
  });
madge('../web-api/src/handlers.js')
  .then(res => res.image('../docs/images/server-dependencies.png'))
  .then(writtenImagePath => {
    console.log('Image written to ' + writtenImagePath);
  });
