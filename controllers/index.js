const express = require('express');

const router = express.Router();
const info = require('../package.json');

const parseJSON = data => Promise.resolve(JSON.parse(data));

const parse = input => new Promise((resolve) => {
  const body = input.toString().split('\r\n');
  const promises = [];
  const regex = new RegExp('\\{.*\\}');

  body
    .filter(unfiltered => regex.test(unfiltered))
    .forEach((filtered) => {
      promises.push(parseJSON(filtered));
    });

  resolve(Promise.all(promises));
});

const isRegisteredAction = (data) => {
  const actions = ['index', 'delete', 'create', 'update'];
  const keys = Object.keys(data);
  if (actions.indexOf(keys[0].toLowerCase()) > -1) {
    return keys[0].toLowerCase();
  }
  return 'unknown';
};

const getResult = (action) => {
  if (action !== 'index') {
    return `${action}d`;
  }
  return 'created';
};

/* eslint no-underscore-dangle:0 */
const formatData = (action, data, sequence) => {
  const result = {};
  result[action] = {
    _index: data[action]._index,
    _type: data[action]._type,
    _id: data[action]._id,
    _version: 1,
    result: getResult(action),
    _shards: {
      total: 2,
      successful: 1,
      failed: 0,
    },
    status: getResult(action) === 'created' ? 201 : 200,
    _seq_no: sequence,
    _primary_term: sequence + 1,
  };
  return result;
};

router.get('/', (req, res) => {
  const response = {
    name: 'Dummy ES',
    version: {
      number: info.version,
      build_hash: 'm93b675',
      build_date: '2017-11-29T06:51:46.989Z',
      build_snapshot: true,
      lucene_version: "doesn't use lucene",
    },
    tagline: 'You Know, only for _bulk',
  };
  // return JSON HTTP response to API caller
  res.json(response);
});

router.post('/_bulk', (req, res) => {
  parse(req.body)
    .then((data) => {
      const response = {
        took: 30,
        error: false,
        items: [],
      };
      let iteration = 0;
      data.forEach((item) => {
        const action = isRegisteredAction(item);
        if (action !== 'unknown') {
          response.items.push(formatData(action, item, iteration));
          iteration += 1;
        }
      });
      res.json(response);
    })
    .catch(error => res.status(500).json({ reason: error.message }));
});

module.exports = router;
