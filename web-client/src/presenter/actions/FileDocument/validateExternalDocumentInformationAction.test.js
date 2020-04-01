import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateExternalDocumentInformationAction } from './validateExternalDocumentInformationAction';

import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
const applicationContext = applicationContextForClient;
presenter.providers.applicationContext = applicationContext;

const {
  validateExternalDocumentInformationInteractor,
} = applicationContext.getUseCases();

describe('validateExternalDocumentInformationAction', () => {
  let successStub;
  let errorStub;

  let mockDocInfo;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    mockDocInfo = {
      data: 'hello world',
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateExternalDocumentInformationInteractor.mockReturnValue(null);
    await runAction(validateExternalDocumentInformationAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocInfo,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    validateExternalDocumentInformationInteractor.mockReturnValue('error');
    await runAction(validateExternalDocumentInformationAction, {
      modules: {
        presenter,
      },
      state: {
        form: mockDocInfo,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });
});
