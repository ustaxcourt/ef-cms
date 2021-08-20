const { getRecordsViaMapping } = require('../helpers/getRecordsViaMapping');

exports.getUsersBySearchKey = ({ applicationContext, searchKey, type }) =>
  getRecordsViaMapping({
    applicationContext,
    pk: `${type}|${searchKey.toUpperCase()}`,
    prefix: 'user',
  });
