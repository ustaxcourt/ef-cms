import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { validateCaseInventoryReportModalAction } from './validateCaseInventoryReportModalAction';

describe('validateCaseInventoryReportModalAction', () => {
  let successStub;
  let errorStub;

  beforeEach(() => {
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
        modal: {
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
        modal: {},
      },
    });

    expect(errorStub).toBeCalled();
  });
});
