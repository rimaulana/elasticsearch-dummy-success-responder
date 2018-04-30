const Index = {
  raw: '{ "index" : { "_index" : "test", "_type" : "type1", "_id" : "1" } }\r\n{ "field1" : "value1" }',
  parsed: {
    index: {
      _index: 'test',
      _type: 'type1',
      _id: '1',
      _version: 1,
      result: 'created',
      _shards: {
        total: 2,
        successful: 1,
        failed: 0,
      },
      status: 201,
      _seq_no: 0,
      _primary_term: 1,
    },
  },
};

const Delete = {
  raw: '{ "delete" : { "_index" : "test", "_type" : "type1", "_id" : "2" }}',
  parsed: {
    delete: {
      _index: 'test',
      _type: 'type1',
      _id: '2',
      _version: 1,
      result: 'deleted',
      _shards: {
        total: 2,
        successful: 1,
        failed: 0,
      },
      status: 200,
      _seq_no: 1,
      _primary_term: 2,
    },
  },
};

const Create = {
  raw: '{ "create" : { "_index" : "test", "_type" : "type1", "_id" : "3" } }\r\n{ "field1" : "value3" }',
  parsed: {
    create: {
      _index: 'test',
      _type: 'type1',
      _id: '3',
      _version: 1,
      result: 'created',
      _shards: {
        total: 2,
        successful: 1,
        failed: 0,
      },
      status: 201,
      _seq_no: 2,
      _primary_term: 3,
    },
  },
};

const Update = {
  raw: '{ "update" : {"_id" : "1", "_type" : "type1", "_index" : "test"} }\r\n{ "doc" : {"field2" : "value2"} }',
  parsed: {
    update: {
      _index: 'test',
      _type: 'type1',
      _id: '1',
      _version: 1,
      result: 'updated',
      _shards: {
        total: 2,
        successful: 1,
        failed: 0,
      },
      status: 200,
      _seq_no: 3,
      _primary_term: 4,
    },
  },
};

module.exports = {
  Index, Delete, Create, Update,
};

