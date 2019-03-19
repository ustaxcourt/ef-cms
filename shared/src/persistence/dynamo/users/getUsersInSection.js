const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');

const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

exports.getUsersInSection = ({ applicationContext, section }) => {
  return getRecordsViaMapping({
    applicationContext,
    key: section,
    type: 'user',
  }).then(stripInternalKeys);
};
