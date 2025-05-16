// import { RawUser } from '@shared/business/entities/User';
import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { toKyselyNewPractitioners } from './mapper';

export const upsertPractitionerRecords = async practitioners => {
  await pgInsertInto({
    table: 'dwPractitioner',
    values: toKyselyNewPractitioners(practitioners),
    onConflictColumns: ['userId'],
  });
};
