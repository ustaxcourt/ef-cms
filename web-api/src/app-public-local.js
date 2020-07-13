const { app } = require('./app-public');
const port = 5000;

app.listen(port);
console.log(`listening on http://localhost:${port}`);
