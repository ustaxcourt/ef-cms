import { CerebralTest } from 'cerebral/test';

import applicationContext from '../applicationContext';
import presenter from '../presenter';

let test;
presenter.providers.applicationContext = applicationContext;

test = CerebralTest(presenter);

describe('appendNewYearAmountSequence', async () => {
  it('should append a new yearAmount at the end of the yearAmounts array on the caseDetail', async () => {
    test.setState('caseDetail', {
      yearAmounts: [],
    });
    await test.runSequence('appendNewYearAmountSequence');
    expect(test.getState('caseDetail')).toEqual({
      yearAmounts: [{ year: '', amount: '' }],
    });
  });
});
