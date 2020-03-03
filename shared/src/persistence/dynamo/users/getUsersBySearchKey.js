const { getRecordsViaMapping } = require('../helpers/getRecordsViaMapping');

exports.getUsersBySearchKey = ({ applicationContext, searchKey, type }) => {
  return getRecordsViaMapping({
    applicationContext,
    key: searchKey,
    type,
  });
};
