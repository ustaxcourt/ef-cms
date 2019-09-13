import { navigateBackAction } from './navigateBackAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

const mockBack = jest.fn();
describe('navigateBackAction', () => {
  beforeEach(() => {
    presenter.providers.router = {
      back: mockBack,
    };
  });

  it('calls history.back()', async () => {
    await runAction(navigateBackAction, {
      modules: {
        presenter,
      },
    });
    expect(mockBack).toHaveBeenCalled();
  });
});
