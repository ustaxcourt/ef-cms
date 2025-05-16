import { getUniqueId } from '@shared/sharedAppContext';
import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { pickPractitionerFields } from './mapper';
import { pinkLog } from '@shared/tools/pinkLog';

export const upsertPractitionerRecords = async practitioners => {
  await pgInsertInto({
    table: 'dwPractitioner',
    values: practitioners.map((practitioner, i) => {
      pinkLog(`Practitioner #${i}`, practitioner);
      return {
        ...pickPractitionerFields(practitioner),
        practitionerId: getUniqueId(),
      };
    }),
    onConflictColumns: ['userId'],
  });
};
