import { getRecordsViaMapping } from '../helpers/getRecordsViaMapping';

export const getUsersBySearchKey = ({
  applicationContext,
  searchKey,
  type,
}: {
  applicationContext: IApplicationContext;
  searchKey: string;
  type: string;
}) => {
  return getRecordsViaMapping({
    applicationContext,
    pk: `${type}|${searchKey.toUpperCase()}`,
    prefix: 'user',
  });
};
