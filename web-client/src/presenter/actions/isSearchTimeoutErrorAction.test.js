import { isSearchTimeoutErrorAction } from './isSearchTimeoutErrorAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

let yesStub;
let noStub;

describe('isSearchTimeoutErrorAction', () => {
  beforeAll(() => {
    yesStub = jest.fn();
    noStub = jest.fn();

    presenter.providers.path = { no: noStub, yes: yesStub };
  });

  it('returns yes path if a timeout occurs while user is performing a search', async () => {
    await runAction(isSearchTimeoutErrorAction, {
      modules: {
        presenter,
      },
      state: {
        currentPage: 'AdvancedSearch',
      },
    });

    expect(yesStub.mock.calls.length).toEqual(1);
  });

  it('returns no path if timeout occurs when user is NOT performing a search', async () => {
    await runAction(isSearchTimeoutErrorAction, {
      modules: {
        presenter,
      },
      state: {
        currentPage: 'notAdvancedSearch',
      },
    });

    expect(noStub.mock.calls.length).toEqual(1);
  });
});
