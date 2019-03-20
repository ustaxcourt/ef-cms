import { applicationContext } from '../../applicationContext';
import presenter from '..';
import { removeYearAmountAction } from './removeYearAmountAction';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('removeYearAmountAction', () => {
  it('removes the expected index from the yearAmounts array on caseDetail', async () => {
    const { state } = await runAction(removeYearAmountAction, {
      props: {
        index: 1,
      },
      state: {
        caseDetail: {
          yearAmounts: [
            {
              year: '2000',
            },
            {
              year: '2001',
            },
            {
              year: '2002',
            },
          ],
        },
      },
    });

    expect(state.caseDetail).toEqual({
      yearAmounts: [
        {
          year: '2000',
        },
        {
          year: '2002',
        },
      ],
    });
  });
});
