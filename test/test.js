let controller = require("../controllers");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let expect = chai.expect;

chai.use(chaiHttp);
describe("sending get to /", () => {
    it("it should get health check information", done => {
        chai
            .request(server)
            .get("/")
            .end((err, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body.name).to.be.equal("Dummy ES");
                expect(res.body.version.build_snapshot).to.be.true;
                done();
            });
    });
});
describe("sending post method to /_bulk", () => {
    var request =
        '{ "index" : { "_index" : "test", "_type" : "type1", "_id" : "1" } }\r\n\r\n\n\n{ "field1" : "value1" }\r\n{ "delete" : { "_index" : "test", "_type" : "type1", "_id" : "2" } }\r\n{ "create" : { "_index" : "test", "_type" : "type1", "_id" : "3" } }\r\n{ "field1" : "value3" }\r\n{ "update" : {"_id" : "1", "_type" : "type1", "_index" : "test"} }\r\n{ "doc" : {"field2" : "value2"} }';
    var response = {
        took: 30,
        error: false,
        items: [
            {
                index: {
                    _index: "test",
                    _type: "type1",
                    _id: "1",
                    _version: 1,
                    result: "created",
                    _shards: {
                        total: 2,
                        successful: 1,
                        failed: 0
                    },
                    status: 201,
                    _seq_no: 0,
                    _primary_term: 1
                }
            },
            {
                delete: {
                    _index: "test",
                    _type: "type1",
                    _id: "2",
                    _version: 1,
                    result: "deleted",
                    _shards: {
                        total: 2,
                        successful: 1,
                        failed: 0
                    },
                    status: 200,
                    _seq_no: 1,
                    _primary_term: 2
                }
            },
            {
                create: {
                    _index: "test",
                    _type: "type1",
                    _id: "3",
                    _version: 1,
                    result: "created",
                    _shards: {
                        total: 2,
                        successful: 1,
                        failed: 0
                    },
                    status: 201,
                    _seq_no: 2,
                    _primary_term: 3
                }
            },
            {
                update: {
                    _index: "test",
                    _type: "type1",
                    _id: "1",
                    _version: 1,
                    result: "updated",
                    _shards: {
                        total: 2,
                        successful: 1,
                        failed: 0
                    },
                    status: 200,
                    _seq_no: 3,
                    _primary_term: 4
                }
            }
        ]
    };
    it("its response should be equal to prepared response sample", done => {
        chai
            .request(server)
            .post("/_bulk")
            .type("application/x-ndjson")
            .send(request)
            .end((err, res) => {
                expect(res.body.took).to.be.equal(30);
                expect(res.body).to.deep.equal(response);
                done();
            });
    });
    it("it should response with 500 Internal Server Error", done => {
        chai
            .request(server)
            .post("/_bulk")
            .type("application/x-ndjson")
            .send("{\\\\}")
            .end((err, res) => {
                expect(res.status).to.be.equal(500);
                done();
            });
    });
});
