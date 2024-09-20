// Usage: npx ts-node --transpile-only scripts/user/revoke-e-access.ts 432143213-4321-1234-4321-432143214321 101-23

import { Case } from '@shared/business/entities/cases/Case';
import { createApplicationContext } from '@web-api/applicationContext';
import { getCaseByDocketNumber } from '@web-api/persistence/dynamo/cases/getCaseByDocketNumber';
import { getUniqueId } from '@shared/sharedAppContext';
import { requireEnvVars } from '../../shared/admin-tools/util';

const userId = process.argv[2];
const docketNumber = process.argv[3];

if (!userId || !docketNumber) {
  console.error('Error: missing docket number or user id.');
  console.log(
    'Usage:\nnpx ts-node --transpile-only scripts/user/revoke-e-access.ts 432143213-4321-1234-4321-432143214321 101-23',
  );
  process.exit(1);
}
requireEnvVars(['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'ENV']);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});

  const rawCase = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });
  if (!rawCase.docketNumber) {
    console.error(`Error: Unable to find case ${docketNumber}.`);
    process.exit(1);
  }

  const offendingPetitioner = rawCase.petitioners.find(
    p => p.contactId === userId,
  );
  if (!offendingPetitioner) {
    console.error(
      `Error: Unable to find petitioner with id ${userId} in case ${docketNumber}.`,
    );
    process.exit(1);
  }

  offendingPetitioner.contactId = getUniqueId();
  offendingPetitioner.serviceIndicator = 'Paper';
  delete offendingPetitioner.email;
  const caseToUpdate = new Case(rawCase, { authorizedUser: undefined })
    .validate()
    .toRawObject();

  await applicationContext
    .getPersistenceGateway()
    .updateCase({ applicationContext, caseToUpdate });
  await applicationContext
    .getPersistenceGateway()
    .deleteUserFromCase({ applicationContext, docketNumber, userId });

  console.log(
    `Electronic access to case ${docketNumber} has been revoked for ${offendingPetitioner.name}.`,
  );
})();
