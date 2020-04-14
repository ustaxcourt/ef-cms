const { getRecordsViaMapping } = require('../helpers/getRecordsViaMapping');

exports.getPractitionerByBarNumber = async ({
  applicationContext,
  barNumber,
}) => {
  const upperCaseBarNumber = barNumber.toUpperCase();
  const users = [
    ...(await getRecordsViaMapping({
      applicationContext,
      pk: `irsPractitioner|${upperCaseBarNumber}`,
      prefix: 'user',
    })),
    ...(await getRecordsViaMapping({
      applicationContext,
      pk: `privatePractitioner|${upperCaseBarNumber}`,
      prefix: 'user',
    })),
    ...(await getRecordsViaMapping({
      applicationContext,
      pk: `inactivePractitioner|${upperCaseBarNumber}`,
      prefix: 'user',
    })),
  ];

  return users.pop();
};
