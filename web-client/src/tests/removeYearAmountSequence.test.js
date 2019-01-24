import { CerebralTest } from 'cerebral/test';

import applicationContext from '../applicationContext';
import presenter from '../presenter';

let test;
presenter.providers.applicationContext = applicationContext;

test = CerebralTest(presenter);

describe('removeYearAmountSequence', async () => {
  it('removes the expected index from the yearAmounts array on caseDetail', async () => {
    test.setState('caseDetail', {
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
    });
    await test.runSequence('removeYearAmountSequence', {
      index: 1,
    });
    expect(test.getState('caseDetail')).toEqual({
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
