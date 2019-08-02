const { getRecordsViaMapping } = require('../helpers/getRecordsViaMapping');
const { stripInternalKeys } = require('../helpers/stripInternalKeys');

exports.getUsersBySearchKey = ({ applicationContext, searchKey, type }) => {
  return getRecordsViaMapping({
    applicationContext,
    key: searchKey,
    type,
  }).then(stripInternalKeys);
};
