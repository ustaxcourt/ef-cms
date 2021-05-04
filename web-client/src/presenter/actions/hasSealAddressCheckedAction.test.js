import { hasSealAddressCheckedAction } from './hasSealAddressCheckedAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('hasUpdatedPetitionerEmailAction', () => {
  let pathNoStub = jest.fn();
  let pathYesStub = jest.fn();

  beforeAll(() => {
    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('returns the yes path when form.sealAddress is true', async () => {
    runAction(hasSealAddressCheckedAction, {
      modules: { presenter },
      state: {
        form: { sealAddress: true },
      },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('returns the no path when form.sealAddress is false', async () => {
    runAction(hasSealAddressCheckedAction, {
      modules: { presenter },
      state: {
        form: { sealAddress: false },
      },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });
});
