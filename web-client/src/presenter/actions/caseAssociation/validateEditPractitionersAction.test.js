import { SERVICE_INDICATOR_TYPES } from '../../../../../shared/src/business/entities/cases/CaseConstants';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateEditPractitionersAction } from './validateEditPractitionersAction';

describe('validateEditPractitionersAction', () => {
  let validateEditPractitionerInteractorStub;
  let successStub;
  let errorStub;

  beforeEach(() => {
    jest.clearAllMocks();

    validateEditPractitionerInteractorStub = jest.fn();
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        validateEditPractitionerInteractor: validateEditPractitionerInteractorStub,
      }),
    };

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    validateEditPractitionerInteractorStub = jest.fn().mockReturnValue(null);
    await runAction(validateEditPractitionersAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          practitioners: [
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
          practitioners: [
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
    validateEditPractitionerInteractorStub = jest.fn().mockReturnValue('error');
    await runAction(validateEditPractitionersAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          practitioners: [
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
          practitioners: [
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
      practitioners: ['error', 'error'],
    });
  });

  it('should call the error path when attempting to change from paper to electronic service', async () => {
    validateEditPractitionerInteractorStub = jest
      .fn()
      .mockReturnValue({ something: 'error' });
    await runAction(validateEditPractitionersAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          practitioners: [
            { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER, userId: '1' },
            { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER, userId: '2' },
          ],
        },
        modal: {
          practitioners: [
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
      practitioners: [
        { something: 'error' },
        { serviceIndicator: expect.anything(), something: 'error' },
      ],
    });
  });
});
