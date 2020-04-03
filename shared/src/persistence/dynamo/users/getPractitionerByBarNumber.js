const { getRecordsViaMapping } = require('../helpers/getRecordsViaMapping');

exports.getPractitionerByBarNumber = async ({
  applicationContext,
  barNumber,
}) => {
  // TODO: Ask Cody about doing this better
  const users = [
    ...(await getRecordsViaMapping({
      applicationContext,
      pk: `irsPractitioner|${barNumber}`,
      prefix: 'user',
    })),
    ...(await getRecordsViaMapping({
      applicationContext,
      pk: `privatePractitioner|${barNumber}`,
      prefix: 'user',
    })),
  ];

  return users.pop();
};
