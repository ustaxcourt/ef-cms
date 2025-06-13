import { getUniqueId } from '@shared/sharedAppContext';
import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { pickPractitionerFields } from './mapper';

export const upsertPractitionerRecords = async practitioners => {
  await pgInsertInto({
    table: 'dwPractitioner',
    values: practitioners.map(practitioner => {
      return {
        ...pickPractitionerFields(practitioner),
        practitionerId: getUniqueId(),
      };
    }),
    onConflictColumns: ['userId'],
  });
};
