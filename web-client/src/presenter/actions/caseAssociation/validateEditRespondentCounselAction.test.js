import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateEditRespondentCounselAction } from './validateEditRespondentCounselAction';

describe('validateEditRespondentCounselAction', () => {
  let successStub;
  let errorStub;
  let SERVICE_INDICATOR_TYPES;

  ({ SERVICE_INDICATOR_TYPES } = applicationContext.getConstants());

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call the success path when no errors are found', async () => {
    await runAction(validateEditRespondentCounselAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          irsPractitioners: [
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
        form: {
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          userId: '1',
        },
      },
    });

    expect(successStub).toBeCalled();
  });

  it('should call the error path when attempting to change from paper to electronic service', async () => {
    await runAction(validateEditRespondentCounselAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          irsPractitioners: [
            { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER, userId: '1' },
            { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER, userId: '2' },
          ],
        },
        form: {
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          userId: '1',
        },
      },
    });

    expect(errorStub).toBeCalled();
    expect(errorStub.mock.calls[0][0].errors).toEqual({
      serviceIndicator: expect.anything(),
    });
  });
});
