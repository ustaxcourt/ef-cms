import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateNewMinuteSheetModalAction } from './validateNewMinuteSheetModalAction';

describe('validateNewMinuteSheetModalAction', () => {
  let successStub: jest.Mock;
  let errorStub: jest.Mock;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call path.error when case is not selected (checkbox not checked)', async () => {
    await runAction(validateNewMinuteSheetModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          caseInfo: {
            caseCaption: 'Test Case',
            docketNumber: '101-20',
          },
          form: {
            caseSelected: false,
            docketNumber: '101-20',
          },
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({
      errors: {
        caseSelected: 'Select a case',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.error when caseSelected is undefined', async () => {
    await runAction(validateNewMinuteSheetModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          caseInfo: {
            caseCaption: 'Test Case',
            docketNumber: '101-20',
          },
          form: {
            docketNumber: '101-20',
          },
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({
      errors: {
        caseSelected: 'Select a case',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.error when caseInfo is null', async () => {
    await runAction(validateNewMinuteSheetModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            caseSelected: true,
            docketNumber: '101-20',
          },
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({
      errors: {
        caseSelected: 'Select a case',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.error when form is empty', async () => {
    await runAction(validateNewMinuteSheetModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {},
      },
    });

    expect(errorStub).toHaveBeenCalledWith({
      errors: {
        caseSelected: 'Select a case',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.success when case is selected and caseInfo exists', async () => {
    const mockCaseInfo = {
      caseCaption: 'Test Case',
      docketNumber: '101-20',
      docketNumberWithSuffix: '101-20',
    };

    await runAction(validateNewMinuteSheetModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          caseInfo: mockCaseInfo,
          form: {
            caseSelected: true,
            docketNumber: '101-20',
          },
        },
      },
    });

    expect(successStub).toHaveBeenCalledWith({
      caseInfo: mockCaseInfo,
    });
    expect(errorStub).not.toHaveBeenCalled();
  });
});
