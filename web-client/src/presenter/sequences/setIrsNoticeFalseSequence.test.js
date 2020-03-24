import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';

let test;
presenter.providers.applicationContext = applicationContext;

test = CerebralTest(presenter);

describe('setIrsNoticeFalseSequence', () => {
  // hasIrsNotice is the original value submitted from the petitioner, hasVerifiedIrsNotice is a different field used by the petitionsclerk
  it('when hasVerifiedIrsNotice is not defined, it should set the hasVerifiedIrsNotice to false, clear the form year properties, and not modify the original hasIrsNotice', async () => {
    test.setState('form', {
      hasIrsNotice: true,
      hasVerifiedIrsNotice: undefined,
      irsDay: '10',
      irsMonth: '01',
      irsYear: '2019',
    });

    await test.runSequence('setIrsNoticeFalseSequence');
    expect(test.getState('form')).toMatchObject({
      hasIrsNotice: true,
      hasVerifiedIrsNotice: false,
      irsDay: '',
      irsMonth: '',
      irsYear: '',
    });
  });
});
