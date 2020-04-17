import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateCaseInventoryReportModalAction } from './validateCaseInventoryReportModalAction';

describe('validateCaseInventoryReportModalAction', () => {
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
          associatedJudge: 'Chief Judge',
          status: 'New',
        },
      },
    });

    expect(successStub).toBeCalled();
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

    expect(errorStub).toBeCalled();
  });
});
