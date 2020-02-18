const { upGenerator } = require('./utilities');

const mutateRecord = item => {
  if (item.pk.startsWith('judges-case-note')) {
    item.pk = item.pk.replace('judges-case-note', 'user-case-note');
    return item;
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
