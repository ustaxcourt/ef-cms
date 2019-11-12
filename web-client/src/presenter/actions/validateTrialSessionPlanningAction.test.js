import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateTrialSessionPlanningAction } from './validateTrialSessionPlanningAction';

const successMock = jest.fn();
const errorMock = jest.fn();

presenter.providers.path = {
  error: errorMock,
  success: successMock,
};

presenter.providers.applicationContext = {};

describe('validateTrialSessionPlanningAction', () => {
  it('should return the error path if modal.term is null', async () => {
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

  it('should return the error path if modal.year is null', async () => {
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

  it('should return the error path if both modal.year and modal.term are null', async () => {
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

  it('should return the success path if both modal.year and modal.term are defined', async () => {
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
