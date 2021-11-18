import { isTokenOnStateAction } from './isTokenOnStateAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

let yesStub;
let noStub;

describe('isTokenOnStateAction', () => {
  beforeAll(() => {
    yesStub = jest.fn();
    noStub = jest.fn();
    presenter.providers.path = { no: noStub, yes: yesStub };
  });

  it('should call yes if token is on state', async () => {
    await runAction(isTokenOnStateAction, {
      modules: {
        presenter,
      },
      state: {
        token: 'a',
      },
    });
    expect(yesStub).toHaveBeenCalled();
  });

  it('should call no if token is on state', async () => {
    await runAction(isTokenOnStateAction, {
      modules: {
        presenter,
      },
      state: {
        token: null,
      },
    });
    expect(noStub).toHaveBeenCalled();
  });
});
