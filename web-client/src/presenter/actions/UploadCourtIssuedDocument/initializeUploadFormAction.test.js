import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { initializeUploadFormAction } from './initializeUploadFormAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('initializeUploadFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should initialize the form values', async () => {
    const results = await runAction(initializeUploadFormAction, {
      modules: {
        presenter,
      },
    });

    expect(results.state.form).toEqual({
      documentTitle: '[anything]',
      documentType: 'Miscellaneous',
      eventCode: 'MISC',
      scenario: 'Type A',
    });
  });
});
