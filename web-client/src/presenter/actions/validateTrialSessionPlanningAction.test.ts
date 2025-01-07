import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateTrialSessionPlanningAction } from './validateTrialSessionPlanningAction';

describe('validateTrialSessionPlanningAction', () => {
  let successMock;
  let errorMock;

  const VALID_YEARS = ['2023', '2024', '2025'];

  beforeAll(() => {
    successMock = jest.fn();
    errorMock = jest.fn();

    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });

  it('should return the error path if term is null', () => {
    runAction(validateTrialSessionPlanningAction, {
      modules: {
        presenter,
      },
      props: {
        term: null,
        year: '2024',
      },
      state: {
        modal: {
          trialYears: VALID_YEARS,
        },
      },
    });

    const errorCalls = errorMock.mock.calls;
    expect(errorCalls.length).toEqual(1);
    expect(errorCalls[0][0]).toEqual({ errors: { term: 'Select a term' } });
  });

  it('should return the error path if year is null', () => {
    runAction(validateTrialSessionPlanningAction, {
      modules: {
        presenter,
      },
      props: {
        term: 'winter',
        year: null,
      },
      state: {
        modal: {
          trialYears: VALID_YEARS,
        },
      },
    });

    const errorCalls = errorMock.mock.calls;
    expect(errorCalls.length).toEqual(1);
    expect(errorCalls[0][0]).toEqual({ errors: { year: 'Select a year' } });
  });

  it('should return the error path if both year and term are null', () => {
    runAction(validateTrialSessionPlanningAction, {
      modules: {
        presenter,
      },
      props: {
        term: null,
        year: null,
      },
      state: {
        modal: {
          trialYears: VALID_YEARS,
        },
      },
    });

    const errorCalls = errorMock.mock.calls;
    expect(errorCalls.length).toEqual(1);
    expect(errorCalls[0][0]).toEqual({
      errors: {
        term: 'Select a term',
        year: 'Select a year',
      },
    });
  });

  it('should return the error path if term is not a valid option', () => {
    runAction(validateTrialSessionPlanningAction, {
      modules: {
        presenter,
      },
      props: {
        term: 'RANDOM_TERM',
        year: '2024',
      },
      state: {
        modal: {
          trialYears: VALID_YEARS,
        },
      },
    });

    const errorCalls = errorMock.mock.calls;
    expect(errorCalls.length).toEqual(1);
    expect(errorCalls[0][0]).toEqual({
      errors: {
        term: 'Select a valid term',
      },
    });
  });

  it('should return the error path if year is not a valid option', () => {
    runAction(validateTrialSessionPlanningAction, {
      modules: {
        presenter,
      },
      props: {
        term: 'winter',
        year: '-1',
      },
      state: {
        modal: {
          trialYears: VALID_YEARS,
        },
      },
    });

    const errorCalls = errorMock.mock.calls;
    expect(errorCalls.length).toEqual(1);
    expect(errorCalls[0][0]).toEqual({
      errors: {
        year: 'Select a valid year',
      },
    });
  });

  it('should return the success path if both modal.year and modal.term are defined', () => {
    runAction(validateTrialSessionPlanningAction, {
      modules: {
        presenter,
      },
      props: {
        term: 'winter',
        year: '2024',
      },
      state: {
        modal: {
          trialYears: VALID_YEARS,
        },
      },
    });

    expect(successMock).toHaveBeenCalled();
  });
});
