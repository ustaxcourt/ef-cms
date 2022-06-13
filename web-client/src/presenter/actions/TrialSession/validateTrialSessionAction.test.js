import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateTrialSessionAction } from './validateTrialSessionAction';

const MOCK_TRIAL = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2019-12-01T00:00:00.000Z',
  term: 'Fall',
  trialLocation: 'Birmingham, Alabama',
};

describe('validateTrialSessionAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };

    applicationContext
      .getUseCases()
      .validateTrialSessionInteractor.mockReturnValue(
        'hello from validate trial session',
      );
  });

  it('should call the success path when no errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateTrialSessionInteractor.mockReturnValue(null);
    await runAction(validateTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: MOCK_TRIAL,
      },
    });

    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateTrialSessionInteractor.mockReturnValue({ some: 'error' });
    await runAction(validateTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: MOCK_TRIAL,
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when term is summer', async () => {
    applicationContext
      .getUseCases()
      .validateTrialSessionInteractor.mockReturnValue({ term: 'error' });
    await runAction(validateTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        form: { ...MOCK_TRIAL, term: 'Summer' },
      },
    });

    expect(errorStub.mock.calls.length).toEqual(1);
  });

  it('should pass the expected estimatedEndDate from props into the validation function', async () => {
    applicationContext
      .getUseCases()
      .validateTrialSessionInteractor.mockReturnValue(null);

    await runAction(validateTrialSessionAction, {
      modules: {
        presenter,
      },
      props: {
        computedEstimatedEndDate: undefined,
      },
      state: {
        form: { ...MOCK_TRIAL, term: 'Summer' },
      },
    });

    expect(
      applicationContext.getUseCases().validateTrialSessionInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      trialSession: {
        estimatedEndDate: null,
      },
    });
  });

  it('removes the estimatedEndDateMonth, Day, Year from the trialSession', async () => {
    await runAction(validateTrialSessionAction, {
      modules: {
        presenter,
      },
      props: {
        computedEstimatedEndDate: '2020-12-01T00:00:00.000Z',
        computedStartDate: '2019-12-01T00:00:00.000Z',
      },
      state: {
        form: {
          ...MOCK_TRIAL,
          estimatedEndDateDay: '02',
          estimatedEndDateMonth: '01',
          estimatedEndDateYear: '2002',
          startDateDay: '04',
          startDateMonth: '04',
          startDateYear: '2000',
        },
      },
    });
    const sentTrialSession =
      applicationContext.getUseCases().validateTrialSessionInteractor.mock
        .calls[0][1].trialSession;

    expect(sentTrialSession.estimatedEndDateDay).not.toBeDefined();
    expect(sentTrialSession.estimatedEndDateMonth).not.toBeDefined();
    expect(sentTrialSession.estimatedEndDateYear).not.toBeDefined();
    expect(sentTrialSession.startDateDay).not.toBeDefined();
    expect(sentTrialSession.startDateMonth).not.toBeDefined();
    expect(sentTrialSession.startDateYear).not.toBeDefined();
    expect(sentTrialSession).toMatchObject({
      estimatedEndDate: '2020-12-01T00:00:00.000Z',
      startDate: '2019-12-01T00:00:00.000Z',
    });
  });
});
