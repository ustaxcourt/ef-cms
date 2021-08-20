const { getRecordsViaMapping } = require('../helpers/getRecordsViaMapping');

exports.getPractitionerByBarNumber = async ({
  applicationContext,
  barNumber,
}) => {
  const upperCaseBarNumber = barNumber.toUpperCase();
  const practitionerKeyPrefixes = [
    'irsPractitioner',
    'privatePractitioner',
    'inactivePractitioner',
  ];
  const practitionerQueryResults = await Promise.all(
    practitionerKeyPrefixes.map(pkPrefix =>
      getRecordsViaMapping({
        applicationContext,
        pk: `${pkPrefix}|${upperCaseBarNumber}`,
        prefix: 'user',
      }),
    ),
  );

  const practitioner = practitionerQueryResults.flat().pop();

  return practitioner;
};
