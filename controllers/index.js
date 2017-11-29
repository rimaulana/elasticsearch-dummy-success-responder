var express = require("express"),
    router = express.Router(),
    info = require("../package.json");

function parse(input, callback) {
    var result = [];
    var body = input.toString().split("\r\n");
    try {
        for (var i in body) {
            if (/\{.*\}/.test(body[i])) {
                result.push(JSON.parse(body[i]));
            }
        }
        callback(null, result);
    } catch (error) {
        callback(error, null);
    }
}
router.get("/", function(req, res) {
    var response = {
        name: "Dummy ES",
        version: {
            number: info.version,
            build_hash: "m93b675",
            build_date: "2017-11-29T06:51:46.989Z",
            build_snapshot: true,
            lucene_version: "doesn't use lucene"
        },
        tagline: "You Know, only for _bulk"
    };
    // return JSON HTTP response to API caller
    res.json(response);
});

router.post("/_bulk", function(req, res) {
    parse(req.body, function(error, parsed) {
        if (error) {
            res.status(500).json({ reason: error.message });
        } else {
            var response = {
                took: 30,
                error: false,
                items: []
            };
            var associated = false;
            var iteration = 0;
            for (var j in parsed) {
                if (!associated) {
                    var keys = Object.keys(parsed[j]);
                    if (keys[0] === "index" || keys[0] === "create" || keys[0] === "update") {
                        associated = true;
                    }
                    var buffer = {};
                    buffer[keys[0]] = {
                        _index: parsed[j][keys[0]]._index,
                        _type: parsed[j][keys[0]]._type,
                        _id: parsed[j][keys[0]]._id,
                        _version: 1,
                        result: keys[0] === "delete" ? "deleted" : keys[0] === "update" ? "updated" : "created",
                        _shards: {
                            total: 2,
                            successful: 1,
                            failed: 0
                        },
                        status: keys[0] === "create" || keys[0] === "index" ? 201 : 200,
                        _seq_no: iteration,
                        _primary_term: iteration + 1
                    };
                    response.items.push(buffer);
                    iteration += 1;
                } else {
                    associated = false;
                }
            }
            res.json(response);
        }
    });
});

module.exports = router;
