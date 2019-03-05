import { CerebralTest } from 'cerebral/test';

import applicationContext from '../../applicationContext';
import presenter from '..';

let test;
presenter.providers.applicationContext = applicationContext;

test = CerebralTest(presenter);

describe('setIrsNoticeFalseSequence', async () => {
  it('should clear the irsNoticeDate fields on the form, clear the yearAmounts, and set hasIrsNotice to false on the caseDetail', async () => {
    test.setState('form', {
      irsDay: '10',
      irsMonth: '01',
      irsYear: '2019',
    });
    test.setState('caseDetail', {
      hasIrsNotice: true,
      hasVerifiedIrsNotice: undefined,
      yearAmounts: [
        {
          amount: 100.0,
          year: '2000',
        },
      ],
    });

    await test.runSequence('setIrsNoticeFalseSequence');
    expect(test.getState('form')).toMatchObject({
      irsDay: '',
      irsMonth: '',
      irsYear: '',
    });
    expect(test.getState('caseDetail')).toMatchObject({
      hasIrsNotice: true,
      hasVerifiedIrsNotice: false,
      yearAmounts: [],
    });
  });
});
