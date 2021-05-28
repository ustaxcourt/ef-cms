// babel is needed for local development, in prod this is done with webpack
require('regenerator-runtime');
require('@babel/register')({
  extensions: ['.jsx'],
  presets: ['@babel/preset-react', '@babel/preset-env'],
});

const { app } = require('./app-public');
const port = 5000;

app.listen(port);
console.log(`Listening on http://localhost:${port}`);
