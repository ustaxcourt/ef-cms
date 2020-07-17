import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { shouldNavigateAction } from './shouldNavigateAction';

describe('shouldNavigateAction', () => {
  let pathYesStub;
  let pathNoStub;

  beforeAll(() => {
    pathYesStub = jest.fn();
    pathNoStub = jest.fn();

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('should return the no path when props.stayOnPage is true', async () => {
    runAction(shouldNavigateAction, {
      modules: {
        presenter,
      },
      props: {
        stayOnPage: true,
      },
      state: {},
    });

    expect(pathNoStub).toHaveBeenCalled();
  });

  it('should return the yes path when props.stayOnPage is false', async () => {
    runAction(shouldNavigateAction, {
      modules: {
        presenter,
      },
      props: {
        stayOnPage: false,
      },
      state: {},
    });

    expect(pathYesStub).toHaveBeenCalled();
  });
});
