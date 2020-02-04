import { applicationContext } from '../../../applicationContext';
import { initializeUploadFormAction } from './initializeUploadFormAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('initializeUploadFormAction', () => {
  beforeEach(() => {
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
      documentType: 'MISC - Miscellaneous',
      eventCode: 'MISC',
      scenario: 'Type A',
    });
  });
});
