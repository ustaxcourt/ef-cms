const { getRecordsViaMapping } = require('../helpers/getRecordsViaMapping');

exports.getUsersBySearchKey = ({ applicationContext, searchKey, type }) => {
  return getRecordsViaMapping({
    applicationContext,
    pk: `${type}|${searchKey}`,
    prefix: 'user',
  });
};
