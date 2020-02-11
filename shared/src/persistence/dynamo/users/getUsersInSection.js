const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');

exports.getUsersInSection = ({ applicationContext, section }) => {
  return getRecordsViaMapping({
    applicationContext,
    key: section,
    type: 'user',
  });
};
