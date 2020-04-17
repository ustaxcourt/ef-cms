import { isEditModeAction } from './isEditModeAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('isEditModeAction', () => {
  let noStub;
  let yesStub;

  beforeAll(() => {
    noStub = jest.fn();
    yesStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('should return the yes path if documentId is set on state', async () => {
    await runAction(isEditModeAction, {
      modules: {
        presenter,
      },
      state: {
        documentId: '123',
      },
    });

    expect(yesStub).toHaveBeenCalled();
  });

  it('should return the no path if documentId is NOT set on state', async () => {
    await runAction(isEditModeAction, {
      modules: {
        presenter,
      },
      state: {
        documentId: null,
      },
    });

    expect(noStub).toHaveBeenCalled();
  });
});
