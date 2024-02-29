import { createApplicationContext } from '@web-api/applicationContext';
import { docketClerk1User } from '@shared/test/mockUsers';
const TEST_DOCKET_NUMBER = '21959-16';
const TEST_DOCKET_ENTRY_ID = 'd90f1118-c724-4262-853d-b67d9e6da59a';

async function testMethod() {
  console.time('run script');
  const applicationContext = createApplicationContext(docketClerk1User);
  await applicationContext
    .getUseCases()
    .addCoversheetInteractor(applicationContext, {
      docketEntryId: TEST_DOCKET_ENTRY_ID,
      docketNumber: TEST_DOCKET_NUMBER,
    });
  console.timeEnd('run script');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
testMethod();
