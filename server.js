const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const config = require('./config');

app.use(bodyParser.raw({ type: 'application/x-ndjson' }));
app.use(bodyParser.raw({ type: 'text/plain' }));
app.use(require('./controllers'));

app.listen(config.port, () => {
  console.log(`Running server on port ${config.port}`);
});

module.exports = app;
