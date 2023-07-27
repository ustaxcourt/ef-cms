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

  describe('Unassociate petitioner', () => {
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

      for (const [index, value] of Object.entries(
        expectedDocketRecordVisibility,
      )) {
        const found = formattedDocketEntriesOnDocketRecord.find(
          entry => entry.index === +index,
        );

        expect(found.showLinkToDocument).toBe(value);
      }
    });
  });

  describe('Private Practitioner associated with case', () => {
    const expectedDocketRecordVisibility = {
      1: true,
      2: false,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
      9: false,
      10: true,
      11: true,
      12: true,
      13: false,
      14: true,
      15: true,
      16: false,
      17: true,
      18: true,
      19: true,
      20: true,
      21: true,
      22: true,
      23: true,
      24: true,
      25: true,
      26: false,
      27: true,
      28: true,
      29: true,
      30: true,
    };

    loginAs(cerebralTest, 'privatepractitioner1@example.com');

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

      for (const [index, value] of Object.entries(
        expectedDocketRecordVisibility,
      )) {
        const found = formattedDocketEntriesOnDocketRecord.find(
          entry => entry.index === +index,
        );

        expect(found.showLinkToDocument).toBe(value);
      }
    });
  });
});
