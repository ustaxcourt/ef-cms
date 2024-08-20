import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateUploadPetitionStep5Action } from '@web-client/presenter/actions/validateUploadPetitionStep5Action';

describe('validateUploadPetitionStep5Action', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: mockErrorPath,
      success: mockSuccessPath,
    };
  });

  it('should call the valid path when the data gathered step 5 passes validation', async () => {
    runAction(validateUploadPetitionStep5Action, {
      modules: {
        presenter,
      },
      props: {
        createPetitionStep5Data: {
          stinFile: {},
          stinFileSize: 1,
        },
      },
    });

    expect(mockSuccessPath.mock.calls.length).toEqual(1);
    expect(mockErrorPath).not.toHaveBeenCalled();
  });

  it('should call the invalid path the data gathered step 5 does not pass validation', async () => {
    runAction(validateUploadPetitionStep5Action, {
      modules: {
        presenter,
      },
      props: {
        createPetitionStep5Data: {},
      },
    });

    expect(mockErrorPath.mock.calls.length).toEqual(1);
    expect(mockSuccessPath).not.toHaveBeenCalled();
  });
});
