import { publicCaseDetailHelper as publicCaseDetailHelperComputed } from '../src/presenter/computeds/Public/publicCaseDetailHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { setTerminalUserIps } from '../integration-tests/helpers';
import { setupTest } from './helpers';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Amended And Redacted Brief Visibility Journey', () => {
  const cerebralTest = setupTest();

  const publicCaseDetailHelper = withAppContextDecorator(
    publicCaseDetailHelperComputed,
  );

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Unauthorized Public User', () => {
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

    it('view case detail', async () => {
      await cerebralTest.runSequence('gotoPublicCaseDetailSequence', {
        docketNumber: '105-23',
      });

      const publicCaseDetail = runCompute(publicCaseDetailHelper, {
        state: cerebralTest.getState(),
      });

      const { formattedDocketEntriesOnDocketRecord } = publicCaseDetail;

      const actualDocketRecordVisibility = {};
      formattedDocketEntriesOnDocketRecord.forEach(docketEntry => {
        actualDocketRecordVisibility[docketEntry.index] = {
          eventCode: docketEntry.eventCode,
          showLinkToDocument: docketEntry.showLinkToDocument,
        };
      });

      expect(actualDocketRecordVisibility).toEqual(
        expectedDocketRecordVisibility,
      );
    });
  });

  describe('Terminal User', () => {
    const expectedDocketRecordVisibility = {
      1: { eventCode: 'P', showLinkToDocument: true },
      2: { eventCode: 'RQT', showLinkToDocument: false },
      3: { eventCode: 'NOTR', showLinkToDocument: true },
      4: { eventCode: 'AMAT', showLinkToDocument: true },
      5: { eventCode: 'SIAB', showLinkToDocument: true },
      6: { eventCode: 'SIAM', showLinkToDocument: true },
      7: { eventCode: 'SIOB', showLinkToDocument: false },
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
      19: { eventCode: 'REDC', showLinkToDocument: false },
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

    beforeAll(async () => {
      await setTerminalUserIps(['localhost']);
    });

    afterAll(async () => {
      await setTerminalUserIps([]);
    });

    it('view case detail', async () => {
      await cerebralTest.runSequence('gotoPublicCaseDetailSequence', {
        docketNumber: '105-23',
      });

      const publicCaseDetail = runCompute(publicCaseDetailHelper, {
        state: cerebralTest.getState(),
      });

      const { formattedDocketEntriesOnDocketRecord } = publicCaseDetail;

      const actualDocketRecordVisibility = {};
      formattedDocketEntriesOnDocketRecord.forEach(docketEntry => {
        actualDocketRecordVisibility[docketEntry.index] = {
          eventCode: docketEntry.eventCode,
          showLinkToDocument: docketEntry.showLinkToDocument,
        };
      });

      expect(actualDocketRecordVisibility).toEqual(
        expectedDocketRecordVisibility,
      );
    });
  });
});
