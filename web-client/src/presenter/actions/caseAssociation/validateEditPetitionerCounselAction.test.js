import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateEditPetitionerCounselAction } from './validateEditPetitionerCounselAction';

describe('validateEditPetitionerCounselAction', () => {
  let successStub;
  let errorStub;
  let serviceIndicatorTypes;

  beforeAll(() => {
    serviceIndicatorTypes =
      applicationContext.getConstants().SERVICE_INDICATOR_TYPES;
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateEditPetitionerCounselInteractor.mockReturnValue(null);

    await runAction(validateEditPetitionerCounselAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          privatePractitioners: [
            {
              serviceIndicator: serviceIndicatorTypes.SI_ELECTRONIC,
              userId: '1',
            },
            {
              serviceIndicator: serviceIndicatorTypes.SI_ELECTRONIC,
              userId: '2',
            },
          ],
        },
        form: {
          representing: ['abc'],
          serviceIndicator: serviceIndicatorTypes.SI_ELECTRONIC,
          userId: '1',
        },
      },
    });

    expect(successStub).toBeCalled();
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateEditPetitionerCounselInteractor.mockReturnValue({
        something: 'error',
      });

    await runAction(validateEditPetitionerCounselAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          privatePractitioners: [
            {
              serviceIndicator: serviceIndicatorTypes.SI_ELECTRONIC,
              userId: '1',
            },
            {
              serviceIndicator: serviceIndicatorTypes.SI_ELECTRONIC,
              userId: '2',
            },
          ],
        },
        form: {
          userId: '1',
        },
      },
    });

    expect(
      applicationContext.getUseCases().validateEditPetitionerCounselInteractor,
    ).toBeCalled();
    expect(errorStub).toBeCalled();
    expect(errorStub.mock.calls[0][0].errors).toEqual({
      something: 'error',
    });
  });

  it('should call the error path when attempting to change from paper to electronic service', async () => {
    applicationContext
      .getUseCases()
      .validateEditPetitionerCounselInteractor.mockReturnValue({
        something: 'error',
      });
    await runAction(validateEditPetitionerCounselAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          privatePractitioners: [
            {
              serviceIndicator: serviceIndicatorTypes.SI_PAPER,
              userId: '1',
            },
            {
              serviceIndicator: serviceIndicatorTypes.SI_PAPER,
              userId: '2',
            },
          ],
        },
        form: {
          representing: ['abc'],
          serviceIndicator: serviceIndicatorTypes.SI_ELECTRONIC,
          userId: '2',
        },
      },
    });

    expect(
      applicationContext.getUseCases().validateEditPetitionerCounselInteractor,
    ).toBeCalled();
    expect(errorStub).toBeCalled();
    expect(errorStub.mock.calls[0][0].errors).toEqual({
      serviceIndicator: expect.anything(),
      something: 'error',
    });
  });
});
