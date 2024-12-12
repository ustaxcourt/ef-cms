import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateTrialSessionPlanningAction } from './validateTrialSessionPlanningAction';

describe('validateTrialSessionPlanningAction', () => {
  let successMock;
  let errorMock;

  beforeAll(() => {
    successMock = jest.fn();
    errorMock = jest.fn();

    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });

  it('should return the error path if modal.term is null', () => {
    runAction(validateTrialSessionPlanningAction, {
      modules: {
        presenter,
      },
      props: {
        term: null,
        year: '2001',
      },
    });

    const errorCalls = errorMock.mock.calls;
    expect(errorCalls.length).toEqual(1);
    expect(errorCalls[0][0]).toEqual({ errors: { term: 'Select a term' } });
  });

  it('should return the error path if modal.year is null', () => {
    runAction(validateTrialSessionPlanningAction, {
      modules: {
        presenter,
      },
      props: {
        term: 'Winter',
        year: null,
      },
    });

    const errorCalls = errorMock.mock.calls;
    expect(errorCalls.length).toEqual(1);
    expect(errorCalls[0][0]).toEqual({ errors: { year: 'Select a year' } });
  });

  it('should return the error path if both modal.year and modal.term are null', () => {
    runAction(validateTrialSessionPlanningAction, {
      modules: {
        presenter,
      },
      props: {
        term: null,
        year: null,
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

  it('should return the success path if both modal.year and modal.term are defined', () => {
    runAction(validateTrialSessionPlanningAction, {
      modules: {
        presenter,
      },
      props: {
        term: 'winter',
        year: '2009',
      },
    });
    expect(successMock).toHaveBeenCalled();
  });
});
