import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateCaseInventoryReportModalAction } from './validateCaseInventoryReportModalAction';

describe('validateCaseInventoryReportModalAction', () => {
  const { CHIEF_JUDGE, STATUS_TYPES } = applicationContext.getConstants();

  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  it('should call the success path when no errors are found', async () => {
    await runAction(validateCaseInventoryReportModalAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {
          associatedJudge: CHIEF_JUDGE,
          status: STATUS_TYPES.new,
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
  });

  it('should call the error path when any errors are found', async () => {
    await runAction(validateCaseInventoryReportModalAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {},
      },
    });

    expect(errorStub).toHaveBeenCalled();
  });
});
