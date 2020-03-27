import { initializeUploadFormAction } from './initializeUploadFormAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
const applicationContext = applicationContextForClient;
presenter.providers.applicationContext = applicationContext;

describe('initializeUploadFormAction', () => {
  it('should initialize the form values', async () => {
    const results = await runAction(initializeUploadFormAction, {
      modules: {
        presenter,
      },
    });

    expect(results.state.form).toEqual({
      documentTitle: '[anything]',
      documentType: 'MISC - Miscellaneous',
      eventCode: 'MISC',
      scenario: 'Type A',
    });
  });
});
