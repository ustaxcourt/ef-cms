import { runAction } from 'cerebral/test';
import removeYearAmountAction from './removeYearAmountAction';

import applicationContext from '../../applicationContext';
import presenter from '..';

presenter.providers.applicationContext = applicationContext;

describe('removeYearAmountAction', async () => {
  it('removes the expected index from the yearAmounts array on caseDetail', async () => {
    const { state } = await runAction(removeYearAmountAction, {
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
      props: {
        index: 1,
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
