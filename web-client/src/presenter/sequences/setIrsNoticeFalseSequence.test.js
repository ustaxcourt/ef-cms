import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { setIrsNoticeFalseSequence } from '../sequences/setIrsNoticeFalseSequence';

describe('setIrsNoticeFalseSequence', () => {
  let test;
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      setIrsNoticeFalseSequence,
    };
    test = CerebralTest(presenter);
  });
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
