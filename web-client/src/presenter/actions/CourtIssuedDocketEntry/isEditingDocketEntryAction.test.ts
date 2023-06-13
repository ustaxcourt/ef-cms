import { isEditingDocketEntryAction } from './isEditingDocketEntryAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('isEditingDocketEntryAction', () => {
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

  it('should return the yes path if state.isEditingDocketEntry is true', async () => {
    await runAction(isEditingDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        isEditingDocketEntry: true,
      },
    });

    expect(yesStub).toHaveBeenCalled();
  });

  it('should return the no path if state.isEditingDocketEntry is false', async () => {
    await runAction(isEditingDocketEntryAction, {
      modules: {
        presenter,
      },
      state: {
        isEditingDocketEntry: false,
      },
    });

    expect(noStub).toHaveBeenCalled();
  });
});
