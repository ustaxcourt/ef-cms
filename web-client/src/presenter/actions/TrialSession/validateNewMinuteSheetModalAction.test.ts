import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateNewMinuteSheetModalAction } from './validateNewMinuteSheetModalAction';

describe('validateNewMinuteSheetModalAction', () => {
  let successStub: jest.Mock;
  let errorStub: jest.Mock;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call path.error when docket number is empty', async () => {
    await runAction(validateNewMinuteSheetModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            docketNumber: '',
          },
          trialSessionId: 'trial-session-123',
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({
      errors: {
        docketNumber: 'Enter a valid docket number',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.error when docket number is undefined', async () => {
    await runAction(validateNewMinuteSheetModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {},
          trialSessionId: 'trial-session-123',
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({
      errors: {
        docketNumber: 'Enter a valid docket number',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.error when docket number format is invalid', async () => {
    await runAction(validateNewMinuteSheetModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            docketNumber: 'invalid-format',
          },
          trialSessionId: 'trial-session-123',
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({
      errors: {
        docketNumber: 'Enter a valid docket number',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.success when docket number is valid and case is found', async () => {
    const mockCaseInfo = {
      caseCaption: 'Test Case',
      docketNumber: '101-20',
      docketNumberWithSuffix: '101-20',
      isLeadCase: false,
      leadDocketNumber: undefined,
    };

    applicationContext
      .getUseCases()
      .validateCaseForNewMinuteSheetInteractor.mockResolvedValue(mockCaseInfo);

    await runAction(validateNewMinuteSheetModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            docketNumber: '101-20',
          },
          trialSessionId: 'trial-session-123',
        },
      },
    });

    expect(successStub).toHaveBeenCalledWith({
      caseInfo: mockCaseInfo,
    });
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should call path.error with "Case not found" when case does not exist', async () => {
    const error = new Error('Case not found');
    (error as any).responseCode = 404;

    applicationContext
      .getUseCases()
      .validateCaseForNewMinuteSheetInteractor.mockRejectedValue(error);

    await runAction(validateNewMinuteSheetModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            docketNumber: '999-99',
          },
          trialSessionId: 'trial-session-123',
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({
      errors: {
        docketNumber: 'Case not found',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.error when case is already on trial session', async () => {
    const error = new Error(
      'This case is already associated with this trial session',
    );

    applicationContext
      .getUseCases()
      .validateCaseForNewMinuteSheetInteractor.mockRejectedValue(error);

    await runAction(validateNewMinuteSheetModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            docketNumber: '101-20',
          },
          trialSessionId: 'trial-session-123',
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({
      errors: {
        docketNumber: 'This case is already associated with this trial session',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should return consolidated case info with lead case details', async () => {
    const mockCaseInfo = {
      caseCaption: 'Lead Case',
      consolidatedCases: [
        {
          caseCaption: 'Member Case',
          docketNumber: '102-20',
          docketNumberWithSuffix: '102-20',
        },
      ],
      docketNumber: '101-20',
      docketNumberWithSuffix: '101-20',
      isLeadCase: true,
      leadDocketNumber: '101-20',
    };

    applicationContext
      .getUseCases()
      .validateCaseForNewMinuteSheetInteractor.mockResolvedValue(mockCaseInfo);

    await runAction(validateNewMinuteSheetModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            docketNumber: '101-20',
          },
          trialSessionId: 'trial-session-123',
        },
      },
    });

    expect(successStub).toHaveBeenCalledWith({
      caseInfo: expect.objectContaining({
        consolidatedCases: expect.arrayContaining([
          expect.objectContaining({
            docketNumber: '102-20',
          }),
        ]),
        isLeadCase: true,
        leadDocketNumber: '101-20',
      }),
    });
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should call path.error with default message when error has no responseCode and no message', async () => {
    applicationContext
      .getUseCases()
      .validateCaseForNewMinuteSheetInteractor.mockRejectedValue(new Error());

    await runAction(validateNewMinuteSheetModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            docketNumber: '101-20',
          },
          trialSessionId: 'trial-session-123',
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({
      errors: {
        docketNumber: 'An error occurred while validating the case',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.error with "already associated" message when responseCode is 400', async () => {
    const error = new Error('Bad request');
    (error as any).responseCode = 400;

    applicationContext
      .getUseCases()
      .validateCaseForNewMinuteSheetInteractor.mockRejectedValue(error);

    await runAction(validateNewMinuteSheetModalAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            docketNumber: '101-20',
          },
          trialSessionId: 'trial-session-123',
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({
      errors: {
        docketNumber: 'This case is already associated with this trial session',
      },
    });
    expect(successStub).not.toHaveBeenCalled();
  });
});
