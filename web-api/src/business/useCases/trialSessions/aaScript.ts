import { createApplicationContext } from '@web-api/applicationContext';
import fs from 'fs';

console.clear();
console.log('STARTING SCRIPT');

async function app() {
  const applicationContext = createApplicationContext();
  const results = await applicationContext
    .getUseCases()
    .getTrialSessionPlanningReportDataInteractor(
      applicationContext as any,
      {
        term: 'winter',
        year: 2024,
      },
      undefined,
    );
  fs.writeFileSync('./test.json', JSON.stringify(results, null, 2));
}

void app();
