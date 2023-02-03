import { hasAlreadyAddedDocketNumbersAction } from './hasAlreadyAddedDocketNumbersAction';
import { runAction } from 'cerebral/test';

describe('hasAlreadyAddedDocketNumbersAction', () => {
  let path;

  beforeEach(() => {
    path = {
      no: jest.fn(),
      yes: jest.fn(),
    };
  });

  it('should return the yes path if addedDocketNumbers is set', async () => {
    await runAction(hasAlreadyAddedDocketNumbersAction, {
      props: {},
      providers: {
        path,
      },
      state: {
        addedDocketNumbers: ['101-20'],
      },
    });
    expect(path.yes).toHaveBeenCalled();
  });

  it('should return the no path if addedDocketNumbers is undefined', async () => {
    await runAction(hasAlreadyAddedDocketNumbersAction, {
      props: {},
      providers: {
        path,
      },
      state: {
        addedDocketNumbers: undefined,
      },
    });
    expect(path.no).toHaveBeenCalled();
  });
});
