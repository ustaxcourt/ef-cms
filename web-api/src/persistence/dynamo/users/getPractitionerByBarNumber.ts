import { getRecordsViaMapping } from '../helpers/getRecordsViaMapping';

export const getPractitionerByBarNumber = async ({
  applicationContext,
  barNumber,
}: {
  applicationContext: IApplicationContext;
  barNumber: string;
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
