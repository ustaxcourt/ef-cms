const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');

exports.getUsersInSection = ({ applicationContext, section }) => {
  return getRecordsViaMapping({
    applicationContext,
    pk: `section|${section}`,
    prefix: 'user',
  });
};
