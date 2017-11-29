var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    config = require("./config");

app.use(bodyParser.raw({ type: "application/x-ndjson" }));
app.use(bodyParser.raw({ type: "text/plain" }));
app.use(require("./controllers"));

app.listen(config.port, function() {
    console.log("Running server on port " + config.port);
});

module.exports = app;
