import { navigateBackAction } from './navigateBackAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

const mockBack = jest.fn();
describe('navigateBackAction', () => {
  beforeAll(() => {
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
