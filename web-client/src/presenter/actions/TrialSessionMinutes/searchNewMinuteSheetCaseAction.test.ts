import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { searchNewMinuteSheetCaseAction } from './searchNewMinuteSheetCaseAction';

describe('searchNewMinuteSheetCaseAction', () => {
  const mockTrialSessionId = 'trial-session-123';
  const mockCaseInfo = {
    caseCaption: 'Test Petitioner, Petitioner',
    docketNumber: '101-20',
    docketNumberWithSuffix: '101-20S',
  };

  let successStub: jest.Mock;
  let errorStub: jest.Mock;
  let caseAlreadyOnTrialSessionStub: jest.Mock;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    successStub = jest.fn();
    errorStub = jest.fn();
    caseAlreadyOnTrialSessionStub = jest.fn();

    presenter.providers.path = {
      caseAlreadyOnTrialSession: caseAlreadyOnTrialSessionStub,
      error: errorStub,
      success: successStub,
    };
  });

  it('should call path.error with noResultsFound when docketNumber is empty', async () => {
    await runAction(searchNewMinuteSheetCaseAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            docketNumber: '',
          },
        },
        trialSession: {
          trialSessionId: mockTrialSessionId,
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({ errorType: 'noResultsFound' });
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should call path.error with noResultsFound when docketNumber is whitespace only', async () => {
    await runAction(searchNewMinuteSheetCaseAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            docketNumber: '   ',
          },
        },
        trialSession: {
          trialSessionId: mockTrialSessionId,
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({ errorType: 'noResultsFound' });
  });

  it('should call path.success with caseInfo when validation succeeds', async () => {
    applicationContext
      .getUseCases()
      .validateCaseForNewMinuteSheetInteractor.mockResolvedValue(mockCaseInfo);

    await runAction(searchNewMinuteSheetCaseAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            docketNumber: '101-20',
          },
        },
        trialSession: {
          trialSessionId: mockTrialSessionId,
        },
      },
    });

    expect(successStub).toHaveBeenCalledWith({ caseInfo: mockCaseInfo });
    expect(errorStub).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().validateCaseForNewMinuteSheetInteractor,
    ).toHaveBeenCalledWith(expect.anything(), {
      docketNumber: '101-20',
      trialSessionId: mockTrialSessionId,
    });
  });

  it('should call path.caseAlreadyOnTrialSession when interactor returns 400', async () => {
    const error = new Error('Case already on trial session');
    (error as any).responseCode = 400;
    applicationContext
      .getUseCases()
      .validateCaseForNewMinuteSheetInteractor.mockRejectedValue(error);

    await runAction(searchNewMinuteSheetCaseAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            docketNumber: '101-20',
          },
        },
        trialSession: {
          trialSessionId: mockTrialSessionId,
        },
      },
    });

    expect(caseAlreadyOnTrialSessionStub).toHaveBeenCalledWith({
      errorType: 'caseAlreadyOnTrialSession',
    });
    expect(successStub).not.toHaveBeenCalled();
    expect(errorStub).not.toHaveBeenCalled();
  });

  it('should call path.error with noResultsFound when interactor returns other error', async () => {
    applicationContext
      .getUseCases()
      .validateCaseForNewMinuteSheetInteractor.mockRejectedValue(
        new Error('Case not found'),
      );

    await runAction(searchNewMinuteSheetCaseAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            docketNumber: '999-99',
          },
        },
        trialSession: {
          trialSessionId: mockTrialSessionId,
        },
      },
    });

    expect(errorStub).toHaveBeenCalledWith({ errorType: 'noResultsFound' });
    expect(successStub).not.toHaveBeenCalled();
  });

  it('should trim the docket number before searching', async () => {
    applicationContext
      .getUseCases()
      .validateCaseForNewMinuteSheetInteractor.mockResolvedValue(mockCaseInfo);

    await runAction(searchNewMinuteSheetCaseAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            docketNumber: '  101-20  ',
          },
        },
        trialSession: {
          trialSessionId: mockTrialSessionId,
        },
      },
    });

    expect(
      applicationContext.getUseCases().validateCaseForNewMinuteSheetInteractor,
    ).toHaveBeenCalledWith(expect.anything(), {
      docketNumber: '101-20',
      trialSessionId: mockTrialSessionId,
    });
  });
});
