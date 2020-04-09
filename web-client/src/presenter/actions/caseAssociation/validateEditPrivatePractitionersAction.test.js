import { SERVICE_INDICATOR_TYPES } from '../../../../../shared/src/business/entities/cases/CaseConstants';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateEditPrivatePractitionersAction } from './validateEditPrivatePractitionersAction';

describe('validateEditPrivatePractitionersAction', () => {
  let validateEditPrivatePractitionerInteractorStub;
  let successStub;
  let errorStub;

  beforeEach(() => {
    jest.clearAllMocks();

    validateEditPrivatePractitionerInteractorStub = jest.fn();
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateEditPrivatePractitionerInteractor: validateEditPrivatePractitionerInteractorStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateEditPrivatePractitionerInteractorStub = jest
      .fn()
      .mockReturnValue(null);
    await runAction(validateEditPrivatePractitionersAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          privatePractitioners: [
            {
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
              userId: '1',
            },
            {
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
              userId: '2',
            },
          ],
        },
        modal: {
          privatePractitioners: [
            {
              representingPrimary: true,
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
              userId: '1',
            },
            {
              representingPrimary: true,
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
              userId: '2',
            },
          ],
        },
      },
    });

    expect(successStub).toBeCalled();
  });

  it('should call the error path when any errors are found', async () => {
    validateEditPrivatePractitionerInteractorStub = jest
      .fn()
      .mockReturnValue('error');
    await runAction(validateEditPrivatePractitionersAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          privatePractitioners: [
            {
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
              userId: '1',
            },
            {
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
              userId: '2',
            },
          ],
        },
        modal: {
          privatePractitioners: [
            { userId: '1' },
            {
              representingPrimary: true,
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
              userId: '2',
            },
          ],
        },
      },
    });

    expect(errorStub).toBeCalled();
    expect(errorStub.mock.calls[0][0].errors).toEqual({
      privatePractitioners: ['error', 'error'],
    });
  });

  it('should call the error path when attempting to change from paper to electronic service', async () => {
    validateEditPrivatePractitionerInteractorStub = jest
      .fn()
      .mockReturnValue({ something: 'error' });
    await runAction(validateEditPrivatePractitionersAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          privatePractitioners: [
            { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER, userId: '1' },
            { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER, userId: '2' },
          ],
        },
        modal: {
          privatePractitioners: [
            { userId: '1' },
            {
              representingPrimary: true,
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
              userId: '2',
            },
          ],
        },
      },
    });

    expect(errorStub).toBeCalled();
    expect(errorStub.mock.calls[0][0].errors).toEqual({
      privatePractitioners: [
        { something: 'error' },
        { serviceIndicator: expect.anything(), something: 'error' },
      ],
    });
  });
});
