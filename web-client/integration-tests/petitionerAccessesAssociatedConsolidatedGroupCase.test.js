import { caseDetailHeaderHelper as caseDetailHeaderComputed } from '../src/presenter/computeds/caseDetailHeaderHelper';
import { formattedDocketEntries as formattedDocketEntriesComputed } from '../src/presenter/computeds/formattedDocketEntries';
import { loginAs, setupTest } from './helpers';
import { runCompute } from 'cerebral/test';
import { seedDatabase } from './utils/database';
import { withAppContextDecorator } from '../src/withAppContext';
import path from 'path';

const formattedDocketEntriesHelper = withAppContextDecorator(
  formattedDocketEntriesComputed,
);

const caseDetailHeaderHelper = withAppContextDecorator(
  caseDetailHeaderComputed,
);

describe('Petitioner accesses a case that does not belong to them, but is part of a consolidated group associated with a case that does belong to them', () => {
  const cerebralTest = setupTest();

  beforeAll(async () => {
    await seedDatabase(
      path.resolve(__dirname, './fixtures/consolidated-cases.json'),
    );
  });

  afterAll(async () => {
    cerebralTest.closeSocket();
    await seedDatabase(
      path.resolve(
        __dirname,
        '../../web-api/storage/fixtures/seed/efcms-local.json',
      ),
    );
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
