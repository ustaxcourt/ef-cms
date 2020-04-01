import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { shouldRefreshOrderPdfAction } from './shouldRefreshOrderPdfAction';

describe('shouldRefreshOrderPdfAction', () => {
  const noStub = jest.fn();
  const yesStub = jest.fn();

  beforeAll(() => {
    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('should return path.yes if createOrderTab is preview', async () => {
    await runAction(shouldRefreshOrderPdfAction, {
      modules: { presenter },
      state: { createOrderTab: 'preview' },
    });

    expect(yesStub).toBeCalled();
    expect(noStub).not.toBeCalled();
  });

  it('should return path.no if createOrderTab is not preview', async () => {
    await runAction(shouldRefreshOrderPdfAction, {
      modules: { presenter },
      state: { createOrderTab: 'generate' },
    });

    expect(noStub).toBeCalled();
    expect(yesStub).not.toBeCalled();
  });
});
