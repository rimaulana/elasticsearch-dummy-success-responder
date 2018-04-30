const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const dummy = require('./dummy');

const { expect } = chai;

chai.use(chaiHttp);
describe('sending get to /', () => {
  it('it should get health check information', (done) => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.name).to.be.equal('Dummy ES');
        expect(res.body.version.build_snapshot).to.be.true;
        done();
      });
  });
});
describe('sending post method to /_bulk', () => {
  const buff = [dummy.Index.raw, dummy.Delete.raw, dummy.Create.raw, dummy.Update.raw];
  const request = buff.join('\r\n');
  const response = {
    took: 30,
    error: false,
    items: [dummy.Index.parsed, dummy.Delete.parsed, dummy.Create.parsed, dummy.Update.parsed],
  };
  it('its response should be equal to prepared response sample', (done) => {
    chai
      .request(server)
      .post('/_bulk')
      .type('application/x-ndjson')
      .send(request)
      .end((err, res) => {
        expect(res.body.took).to.be.equal(30);
        expect(res.body).to.deep.equal(response);
        done();
      });
  });
  it('it should response with 500 Internal Server Error', (done) => {
    chai
      .request(server)
      .post('/_bulk')
      .type('application/x-ndjson')
      .send('{\\\\}')
      .end((err, res) => {
        expect(res.status).to.be.equal(500);
        done();
      });
  });
});
