import { runAction } from 'cerebral/test';
import getFormCombinedWithCaseDetailAction from '../presenter/actions/getFormCombinedWithCaseDetailAction';

describe('getFormCombinedWithCaseDetailAction', async () => {
  it('should return the expected combined caseDetail after run', async () => {
    const results = await runAction(getFormCombinedWithCaseDetailAction, {
      state: {
        form: {
          irsYear: '2009',
          irsMonth: '01',
          irsDay: '01',
          payGovYear: '2009',
          payGovMonth: '01',
          payGovDay: '01',
        },
        caseDetail: {
          yearAmounts: [
            {
              year: '2009',
              amount: 1,
            },
            {
              year: '2010',
              amount: '2',
            },
            {
              year: '2011',
              amount: '110,322.432',
            },
          ],
        },
      },
    });
    expect(results.output).toEqual({
      combinedCaseDetailWithForm: {
        irsNoticeDate: '2009-01-01T00:00:00.000Z',
        payGovDate: '2009-01-01T00:00:00.000Z',
        yearAmounts: [
          {
            amount: '1',
            year: '2009-01-01T00:00:00.000Z',
          },
          {
            amount: '2',
            year: '2010-01-01T00:00:00.000Z',
          },
          {
            amount: '110322',
            year: '2011-01-01T00:00:00.000Z',
          },
        ],
      },
    });
  });
});
