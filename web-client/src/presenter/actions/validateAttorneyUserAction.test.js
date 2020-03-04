import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateAttorneyUserAction } from './validateAttorneyUserAction';

describe('validateAttorneyUserAction', () => {
  let successMock;

  beforeEach(() => {
    successMock = jest.fn();
  });
  it('validates an attorney user', async () => {
    await runAction(validateAttorneyUserAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(successMock.calledOnce).toEqual(true);
  });
});
