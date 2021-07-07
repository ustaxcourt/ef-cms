// const createApplicationContext = require('../../../src/applicationContext');

// const applicationContext = createApplicationContext({});

exports.handler = async event => {
  const { Records } = event;
  console.log('Records*********', JSON.stringify(Records));
};
