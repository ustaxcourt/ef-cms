import { isFormPristineAction } from './isFormPristineAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('isFormPristineAction', () => {
  let yesStub;
  let noStub;

  beforeAll(() => {
    yesStub = jest.fn();
    noStub = jest.fn();

    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('returns the yes path for editing a document', async () => {
    await runAction(isFormPristineAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {
          pristine: true,
        },
      },
    });

    expect(yesStub).toHaveBeenCalled();
    expect(noStub).not.toHaveBeenCalled();
  });

  it('returns the no path for editing a document', async () => {
    await runAction(isFormPristineAction, {
      modules: {
        presenter,
      },
      state: {
        screenMetadata: {
          pristine: false,
        },
      },
    });

    expect(yesStub).not.toHaveBeenCalled();
    expect(noStub).toHaveBeenCalled();
  });
});
