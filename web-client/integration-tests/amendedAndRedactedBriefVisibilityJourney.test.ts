import { formattedDocketEntries as formattedDocketEntriesComputed } from '../src/presenter/computeds/formattedDocketEntries';
import { loginAs, setupTest } from './helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Amended And Redacted Brief Visibility Journey', () => {
  const cerebralTest = setupTest();

  const formattedDocketEntries = withAppContextDecorator(
    formattedDocketEntriesComputed,
  );

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Unassociated petitioner', () => {
    const expectedDocketRecordVisibility = {
      1: { eventCode: 'P', showLinkToDocument: false },
      2: { eventCode: 'RQT', showLinkToDocument: false },
      3: { eventCode: 'NOTR', showLinkToDocument: false },
      4: { eventCode: 'AMAT', showLinkToDocument: false },
      5: { eventCode: 'SIAB', showLinkToDocument: true },
      6: { eventCode: 'SIAM', showLinkToDocument: true },
      7: { eventCode: 'SIOB', showLinkToDocument: false },
      8: { eventCode: 'AMAT', showLinkToDocument: true },
      9: { eventCode: 'AMAT', showLinkToDocument: false },
      10: { eventCode: 'REDC', showLinkToDocument: true },
      11: { eventCode: 'MISCL', showLinkToDocument: false },
      12: { eventCode: 'SEAB', showLinkToDocument: true },
      13: { eventCode: 'SESB', showLinkToDocument: false },
      14: { eventCode: 'REDC', showLinkToDocument: true },
      15: { eventCode: 'NODC', showLinkToDocument: false },
      16: { eventCode: 'SIAB', showLinkToDocument: false },
      17: { eventCode: 'AMAT', showLinkToDocument: true },
      18: { eventCode: 'AMAT', showLinkToDocument: true },
      19: { eventCode: 'REDC', showLinkToDocument: false },
      20: { eventCode: 'SEOB', showLinkToDocument: true },
      21: { eventCode: 'AMAT', showLinkToDocument: true },
      22: { eventCode: 'AMBR', showLinkToDocument: false },
      23: { eventCode: 'AMBR', showLinkToDocument: true },
      24: { eventCode: 'AMAT', showLinkToDocument: true },
      25: { eventCode: 'AMAT', showLinkToDocument: true },
      26: { eventCode: 'SIMB', showLinkToDocument: false },
      27: { eventCode: 'M014', showLinkToDocument: false },
      28: { eventCode: 'MISCL', showLinkToDocument: false },
      29: { eventCode: 'AMAT', showLinkToDocument: false },
      30: { eventCode: 'REPL', showLinkToDocument: false },
    };

    loginAs(cerebralTest, 'petitioner1@example.com');

    it('view case detail', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: '105-23',
      });

      const formattedDocketEntriesHelperResult = runCompute(
        formattedDocketEntries,
        {
          state: cerebralTest.getState(),
        },
      );

      const { formattedDocketEntriesOnDocketRecord } =
        formattedDocketEntriesHelperResult;

      for (const [
        docketEntryIndex,
        { eventCode, showLinkToDocument },
      ] of Object.entries(expectedDocketRecordVisibility)) {
        const found = formattedDocketEntriesOnDocketRecord.find(
          entry => entry.index === +docketEntryIndex,
        );

        if (!found) {
          console.log(
            `count not find a docket entry with index ${docketEntryIndex} on case`,
          );
        }

        expect(found.showLinkToDocument).toBe(showLinkToDocument);
        expect(found.eventCode).toBe(eventCode);
      }
    });

    it('should display multi-docketed briefs as hyperlinks when they were e-filed by a practitioner AFTER the visibility policy date change', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: '104-67',
      });

      const formattedDocketEntriesHelperResult = runCompute(
        formattedDocketEntries,
        {
          state: cerebralTest.getState(),
        },
      );

      const { formattedDocketEntriesOnDocketRecord } =
        formattedDocketEntriesHelperResult;

      const document = formattedDocketEntriesOnDocketRecord.find(
        entry => entry.eventCode === 'SEAB',
      );

      expect(document.showLinkToDocument).toBeTruthy();
    });
  });

  describe('Associated private practitioner', () => {
    const expectedDocketRecordVisibility = {
      1: { eventCode: 'P', showLinkToDocument: true },
      2: { eventCode: 'RQT', showLinkToDocument: false },
      3: { eventCode: 'NOTR', showLinkToDocument: true },
      4: { eventCode: 'AMAT', showLinkToDocument: true },
      5: { eventCode: 'SIAB', showLinkToDocument: true },
      6: { eventCode: 'SIAM', showLinkToDocument: true },
      7: { eventCode: 'SIOB', showLinkToDocument: true },
      8: { eventCode: 'AMAT', showLinkToDocument: true },
      9: { eventCode: 'AMAT', showLinkToDocument: false },
      10: { eventCode: 'REDC', showLinkToDocument: true },
      11: { eventCode: 'MISCL', showLinkToDocument: true },
      12: { eventCode: 'SEAB', showLinkToDocument: true },
      13: { eventCode: 'SESB', showLinkToDocument: false },
      14: { eventCode: 'REDC', showLinkToDocument: true },
      15: { eventCode: 'NODC', showLinkToDocument: true },
      16: { eventCode: 'SIAB', showLinkToDocument: false },
      17: { eventCode: 'AMAT', showLinkToDocument: true },
      18: { eventCode: 'AMAT', showLinkToDocument: true },
      19: { eventCode: 'REDC', showLinkToDocument: true },
      20: { eventCode: 'SEOB', showLinkToDocument: true },
      21: { eventCode: 'AMAT', showLinkToDocument: true },
      22: { eventCode: 'AMBR', showLinkToDocument: true },
      23: { eventCode: 'AMBR', showLinkToDocument: true },
      24: { eventCode: 'AMAT', showLinkToDocument: true },
      25: { eventCode: 'AMAT', showLinkToDocument: true },
      26: { eventCode: 'SIMB', showLinkToDocument: false },
      27: { eventCode: 'M014', showLinkToDocument: true },
      28: { eventCode: 'MISCL', showLinkToDocument: true },
      29: { eventCode: 'AMAT', showLinkToDocument: true },
      30: { eventCode: 'REPL', showLinkToDocument: true },
    };

    loginAs(cerebralTest, 'privatePractitioner1@example.com');

    it('view case detail', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: '105-23',
      });

      const formattedDocketEntriesHelperResult = runCompute(
        formattedDocketEntries,
        {
          state: cerebralTest.getState(),
        },
      );

      const { formattedDocketEntriesOnDocketRecord } =
        formattedDocketEntriesHelperResult;

      for (const [
        docketEntryIndex,
        { eventCode, showLinkToDocument },
      ] of Object.entries(expectedDocketRecordVisibility)) {
        const found = formattedDocketEntriesOnDocketRecord.find(
          entry => entry.index === +docketEntryIndex,
        );

        if (!found) {
          console.log(
            `count not find a docket entry with index ${docketEntryIndex} on case`,
          );
        }

        expect(found.showLinkToDocument).toBe(showLinkToDocument);
        expect(found.eventCode).toBe(eventCode);
      }
    });
  });
});
