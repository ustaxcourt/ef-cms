import {
  PROCEDURE_TYPES_MAP,
  TRIAL_CITY_STRINGS,
} from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateUploadPetitionStep4Action } from '@web-client/presenter/actions/validateUploadPetitionStep4Action';

describe('validateUploadPetitionStep4Action', () => {
  const mockSuccessPath = jest.fn();
  const mockErrorPath = jest.fn();

  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: mockErrorPath,
      success: mockSuccessPath,
    };
  });

  it('should call the valid path when the data gathered step 4 passes validation', async () => {
    runAction(validateUploadPetitionStep4Action, {
      modules: {
        presenter,
      },
      props: {
        createPetitionStep4Data: {
          preferredTrialCity: TRIAL_CITY_STRINGS[0],
          procedureType: PROCEDURE_TYPES_MAP.regular,
        },
      },
    });

    expect(mockSuccessPath.mock.calls.length).toEqual(1);
    expect(mockErrorPath).not.toHaveBeenCalled();
  });

  it('should call the invalid path the data gathered step 4 does not pass validation', async () => {
    runAction(validateUploadPetitionStep4Action, {
      modules: {
        presenter,
      },
      props: {
        createPetitionStep4Data: {},
      },
    });

    expect(mockErrorPath.mock.calls.length).toEqual(1);
    expect(mockSuccessPath).not.toHaveBeenCalled();
  });
});
