import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateEditPrivatePractitionersAction } from './validateEditPrivatePractitionersAction';

describe('validateEditPrivatePractitionersAction', () => {
  let successStub;
  let errorStub;
  let serviceIndicatorTypes;

  beforeAll(() => {
    serviceIndicatorTypes = applicationContext.getConstants()
      .SERVICE_INDICATOR_TYPES;
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
      .validateEditPrivatePractitionerInteractor.mockReturnValue(null);
    await runAction(validateEditPrivatePractitionersAction, {
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
        modal: {
          privatePractitioners: [
            {
              representingPrimary: true,
              serviceIndicator: serviceIndicatorTypes.SI_ELECTRONIC,
              userId: '1',
            },
            {
              representingPrimary: true,
              serviceIndicator: serviceIndicatorTypes.SI_ELECTRONIC,
              userId: '2',
            },
          ],
        },
      },
    });

    expect(successStub).toBeCalled();
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateEditPrivatePractitionerInteractor.mockReturnValue('error');

    await runAction(validateEditPrivatePractitionersAction, {
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
        modal: {
          privatePractitioners: [
            { userId: '1' },
            {
              representingPrimary: true,
              serviceIndicator: serviceIndicatorTypes.SI_ELECTRONIC,
              userId: '2',
            },
          ],
        },
      },
    });

    expect(
      applicationContext.getUseCases()
        .validateEditPrivatePractitionerInteractor,
    ).toBeCalled();
    expect(errorStub).toBeCalled();
    expect(errorStub.mock.calls[0][0].errors).toEqual({
      privatePractitioners: ['error', 'error'],
    });
  });

  it('should call the error path when attempting to change from paper to electronic service', async () => {
    applicationContext
      .getUseCases()
      .validateEditPrivatePractitionerInteractor.mockReturnValue({
        something: 'error',
      });
    await runAction(validateEditPrivatePractitionersAction, {
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
        modal: {
          privatePractitioners: [
            { userId: '1' },
            {
              representingPrimary: true,
              serviceIndicator: serviceIndicatorTypes.SI_ELECTRONIC,
              userId: '2',
            },
          ],
        },
      },
    });

    expect(
      applicationContext.getUseCases()
        .validateEditPrivatePractitionerInteractor,
    ).toBeCalled();
    expect(errorStub).toBeCalled();
    expect(errorStub.mock.calls[0][0].errors).toEqual({
      privatePractitioners: [
        { something: 'error' },
        { serviceIndicator: expect.anything(), something: 'error' },
      ],
    });
  });
});
