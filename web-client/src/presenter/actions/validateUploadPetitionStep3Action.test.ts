import { CASE_TYPES_MAP } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateUploadPetitionStep3Action } from '@web-client/presenter/actions/validateUploadPetitionStep3Action';

describe('validateUploadPetitionStep3Action', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: mockErrorPath,
      success: mockSuccessPath,
    };
  });

  it('should call the valid path when the data gathered step 3 passes validation', async () => {
    runAction(validateUploadPetitionStep3Action, {
      modules: {
        presenter,
      },
      props: {
        createPetitionStep3Data: {
          caseType: CASE_TYPES_MAP.cdp,
          hasIrsNotice: false,
          hasUploadedIrsNotice: false,
        },
      },
    });

    expect(mockSuccessPath.mock.calls.length).toEqual(1);
    expect(mockErrorPath).not.toHaveBeenCalled();
  });

  it('should call the invalid path the data gathered step 3 does not pass validation', async () => {
    runAction(validateUploadPetitionStep3Action, {
      modules: {
        presenter,
      },
      props: {
        createPetitionStep3Data: {},
      },
    });

    expect(mockErrorPath.mock.calls.length).toEqual(1);
    expect(mockSuccessPath).not.toHaveBeenCalled();
  });
});
