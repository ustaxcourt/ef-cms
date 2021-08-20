const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');

exports.getUsersInSection = ({ applicationContext, section }) =>
  getRecordsViaMapping({
    applicationContext,
    pk: `section|${section}`,
    prefix: 'user',
  });
