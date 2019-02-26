import { CerebralTest } from 'cerebral/test';

import applicationContext from '../../applicationContext';
import presenter from '..';

let test;
presenter.providers.applicationContext = applicationContext;

test = CerebralTest(presenter);

describe('setIrsNoticeFalseSequence', async () => {
  it('should clear the irsNoticeDate fields on the form, clear the yearAmounts, and set hasIrsNotice to false on the caseDetail', async () => {
    test.setState('form', {
      irsMonth: '01',
      irsDay: '10',
      irsYear: '2019',
    });
    test.setState('caseDetail', {
      hasIrsNotice: true,
      hasVerifiedIrsNotice: undefined,
      yearAmounts: [
        {
          year: '2000',
          amount: 100.0,
        },
      ],
    });

    await test.runSequence('setIrsNoticeFalseSequence');
    expect(test.getState('form')).toMatchObject({
      irsMonth: '',
      irsDay: '',
      irsYear: '',
    });
    expect(test.getState('caseDetail')).toMatchObject({
      hasIrsNotice: true,
      hasVerifiedIrsNotice: false,
      yearAmounts: [],
    });
  });
});
