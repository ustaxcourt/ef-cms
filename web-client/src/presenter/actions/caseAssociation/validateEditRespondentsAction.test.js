import { SERVICE_INDICATOR_TYPES } from '../../../../../shared/src/business/entities/cases/CaseConstants';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateEditRespondentsAction } from './validateEditRespondentsAction';

describe('validateEditRespondentsAction', () => {
  let successStub;
  let errorStub;

  beforeEach(() => {
    jest.clearAllMocks();

    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    await runAction(validateEditRespondentsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          respondents: [
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
          respondents: [
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
      },
    });

    expect(successStub).toBeCalled();
  });

  it('should call the error path when attempting to change from paper to electronic service', async () => {
    await runAction(validateEditRespondentsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          respondents: [
            { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER, userId: '1' },
            { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER, userId: '2' },
          ],
        },
        modal: {
          respondents: [
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
      },
    });

    expect(errorStub).toBeCalled();
    expect(errorStub.mock.calls[0][0].errors).toEqual({
      respondents: [
        { serviceIndicator: expect.anything() },
        { serviceIndicator: expect.anything() },
      ],
    });
  });
});
