import { caseDetailHeaderHelper as caseDetailHeaderComputed } from '../src/presenter/computeds/caseDetailHeaderHelper';
import { formattedDocketEntries as formattedDocketEntriesComputed } from '../src/presenter/computeds/formattedDocketEntries';
import { loginAs, setupTest } from './helpers';
import { runCompute } from 'cerebral/test';
import { seedData } from './fixtures/consolidated-cases';
import { seedDatabase, seedFullDataset } from './utils/database.js';
import { withAppContextDecorator } from '../src/withAppContext';

const formattedDocketEntriesHelper = withAppContextDecorator(
  formattedDocketEntriesComputed,
);

const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderComputed,
);

describe('Petitioner accesses a case that does not belong to them, but is part of a consolidated group associated with a case that does belong to them', () => {
  const cerebralTest = setupTest();

  beforeAll(async () => {
    await seedDatabase(seedData);
  });

  afterAll(async () => {
    cerebralTest.closeSocket();
    await seedFullDataset();
  });

  loginAs(cerebralTest, 'petitioner2@example.com');

  it('navigate to case 105-23 and verify the links are clickable', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: '105-23',
    });

    const helper = runCompute(formattedDocketEntriesHelper, {
      state: cerebralTest.getState(),
    });

    expect(
      helper.formattedDocketEntriesOnDocketRecord.every(
        entry => entry.showLinkToDocument,
      ),
    ).toBe(true);

    const { showFileDocumentButton } = runCompute(caseDetailHeaderHelper, {
      state: cerebralTest.getState(),
    });

    expect(showFileDocumentButton).toBe(false);
  });

  it('navigate to case 106-23 and verify the "File a Document" button is visible', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: '106-23',
    });

    const { showFileDocumentButton } = runCompute(caseDetailHeaderHelper, {
      state: cerebralTest.getState(),
    });

    expect(showFileDocumentButton).toBe(true);
  });
});
