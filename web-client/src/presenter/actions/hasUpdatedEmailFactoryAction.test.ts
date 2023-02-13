import { hasUpdatedEmailFactoryAction } from './hasUpdatedEmailFactoryAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('hasUpdatedEmailFactoryAction', () => {
  let pathNoStub = jest.fn();
  let pathYesStub = jest.fn();

  beforeAll(() => {
    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('returns the yes path when updatedEmail is defined on state.form', () => {
    runAction(hasUpdatedEmailFactoryAction('updatedEmail'), {
      modules: { presenter },
      state: { form: { updatedEmail: 'blah@example.com' } },
    });

    expect(pathYesStub).toHaveBeenCalled();
  });

  it('returns the no path when updatedEmail is not defined on state.form', () => {
    runAction(hasUpdatedEmailFactoryAction('updatedEmail'), {
      modules: { presenter },
      state: { form: {} },
    });

    expect(pathNoStub).toHaveBeenCalled();
  });
});
