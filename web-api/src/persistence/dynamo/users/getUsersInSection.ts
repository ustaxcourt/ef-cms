import { RawUser } from '@shared/business/entities/User';
import { getRecordsViaMapping } from '../helpers/getRecordsViaMapping';

export const getUsersInSection = ({
  applicationContext,
  section,
}: {
  applicationContext: IApplicationContext;
  section: string;
}): Promise<RawUser[]> => {
  return getRecordsViaMapping<RawUser>({
    applicationContext,
    pk: `section|${section}`,
    prefix: 'user',
  });
};
