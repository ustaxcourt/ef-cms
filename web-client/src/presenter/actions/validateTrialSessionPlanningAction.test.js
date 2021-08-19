import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
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
      state: {
        modal: {
          term: null,
          year: '2001',
        },
      },
    });
    expect(errorMock).toHaveBeenCalled();
  });

  it('should return the error path if modal.year is null', () => {
    runAction(validateTrialSessionPlanningAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          term: 'Winter',
          year: null,
        },
      },
    });
    expect(errorMock).toHaveBeenCalled();
  });

  it('should return the error path if both modal.year and modal.term are null', () => {
    runAction(validateTrialSessionPlanningAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          term: null,
          year: null,
        },
      },
    });
    expect(errorMock).toHaveBeenCalled();
  });

  it('should return the success path if both modal.year and modal.term are defined', () => {
    runAction(validateTrialSessionPlanningAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          term: 'winter',
          year: '2009',
        },
      },
    });
    expect(successMock).toHaveBeenCalled();
  });
});
