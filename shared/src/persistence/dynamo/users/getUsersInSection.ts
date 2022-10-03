import { getRecordsViaMapping } from '../../dynamo/helpers/getRecordsViaMapping';

export const getUsersInSection = ({
  applicationContext,
  section,
}: {
  applicationContext: IApplicationContext;
  section: string;
}) => {
  return getRecordsViaMapping({
    applicationContext,
    pk: `section|${section}`,
    prefix: 'user',
  });
};
