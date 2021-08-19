const { app } = require('./app-public');
const port = 5000;

app.listen(port);
console.log(`Listening on http://localhost:${port}`);
