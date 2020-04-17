const { upGenerator } = require('./utilities');

const mutateRecord = () => {
  //migration goes here
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
