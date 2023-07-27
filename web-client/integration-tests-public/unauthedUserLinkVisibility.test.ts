import { publicCaseDetailHelper as publicCaseDetailHelperComputed } from '../src/presenter/computeds/Public/publicCaseDetailHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
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

  describe('unauthorized public user', () => {
    const expectedDocketRecordVisibility = {
      1: false,
      2: false,
      3: false,
      4: false,
      5: true,
      6: true,
      7: false,
      8: true,
      9: false,
      10: true,
      11: false,
      12: true,
      13: false,
      14: true,
      15: false,
      16: false,
      17: true,
      18: true,
      19: false,
      20: true,
      21: true,
      22: false,
      23: true,
      24: true,
      25: true,
      26: false,
      27: false,
      28: false,
      29: false,
      30: false,
    };

    it('view case detail', async () => {
      await cerebralTest.runSequence('gotoPublicCaseDetailSequence', {
        docketNumber: '105-23',
      });

      const publicCaseDetail = runCompute(publicCaseDetailHelper, {
        state: cerebralTest.getState(),
      });

      const { formattedDocketEntriesOnDocketRecord } = publicCaseDetail;

      for (const [index, value] of Object.entries(
        expectedDocketRecordVisibility,
      )) {
        const found = formattedDocketEntriesOnDocketRecord.find(
          entry => entry.index === +index,
        );

        expect(found?.showLinkToDocument).toBe(value);
      }
    });
  });
});
