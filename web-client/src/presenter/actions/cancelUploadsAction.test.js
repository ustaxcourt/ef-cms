import { cancelUploadsAction } from './cancelUploadsAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

describe('cancelUploadsAction', () => {
  it('should change the window location', async () => {
    const externalRoute = jest.fn();
    presenter.providers.router = { externalRoute };

    await runAction(cancelUploadsAction, {
      modules: {
        presenter,
      },
    });

    expect(externalRoute.mock.calls[0][0]).toEqual('/');
  });
});
