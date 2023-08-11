import { caseDetailHeaderHelper as caseDetailHeaderComputed } from '../src/presenter/computeds/caseDetailHeaderHelper';
import { formattedDocketEntries as formattedDocketEntriesComputed } from '../src/presenter/computeds/formattedDocketEntries';
import { loginAs, setupTest } from './helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('User accesses a case that does not belong to them, but is part of a consolidated group associated with a case that does belong to them', () => {
  const formattedDocketEntriesHelper = withAppContextDecorator(
    formattedDocketEntriesComputed,
  );

  const caseDetailHeaderHelper = withAppContextDecorator(
    caseDetailHeaderComputed,
  );

  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Petitioner', () => {
    loginAs(cerebralTest, 'petitioner2@example.com');

    it('navigate to case 104-23 and verify the links are clickable', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: '104-23',
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

  describe('Private Practitioner', () => {
    loginAs(cerebralTest, 'privatepractitioner@example.com');

    it('navigate to case 104-23 and verify the links are clickable, and "request access to case" is visible', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: '104-23',
      });

      const helper = runCompute(formattedDocketEntriesHelper, {
        state: cerebralTest.getState(),
      });

      expect(
        helper.formattedDocketEntriesOnDocketRecord.every(
          entry => entry.showLinkToDocument,
        ),
      ).toBe(true);

      const { showFileDocumentButton, showRequestAccessToCaseButton } =
        runCompute(caseDetailHeaderHelper, {
          state: cerebralTest.getState(),
        });
      expect(showFileDocumentButton).toBe(false);
      expect(showRequestAccessToCaseButton).toBe(true);
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
});
