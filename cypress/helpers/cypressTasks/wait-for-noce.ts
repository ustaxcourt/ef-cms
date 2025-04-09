import { getCypressPostgresDb } from 'cypress/helpers/cypressTasks/postgres/getCypressPostgresDb';
import { isEmpty } from 'lodash';

export async function waitForNoce({
  attempts = 0,
  docketNumber,
}: {
  docketNumber: string;
  attempts?: number;
}): Promise<boolean> {
  const maxAttempts = 10;
  const dbConnection = await getCypressPostgresDb();
  const noceDocketEntry = await dbConnection
    .selectFrom('dwDocketEntry')
    .where('docketNumber', '=', docketNumber)
    .where('eventCode', '=', 'NOCE')
    .select('docketEntryId')
    .executeTakeFirst();

  if (!isEmpty(noceDocketEntry)) {
    return true;
  }

  if (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    return waitForNoce({ attempts: attempts + 1, docketNumber });
  } else {
    return false;
  }
}
