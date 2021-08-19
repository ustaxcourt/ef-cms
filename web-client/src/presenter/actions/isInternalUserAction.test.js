import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { isInternalUserAction } from './isInternalUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('isInternalUserAction', () => {
  const yesStub = jest.fn();
  const noStub = jest.fn();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    presenter.providers.path = {
      no: noStub,
      yes: yesStub,
    };
  });

  it('should call path.yes if the user is an internal user', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => ({
      role: ROLES.docketClerk,
    });

    await runAction(isInternalUserAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(yesStub).toBeCalled();
  });

  it('should call the path.no if the user is an external user', async () => {
    presenter.providers.applicationContext.getCurrentUser = () => ({
      role: ROLES.petitioner,
    });
    await runAction(isInternalUserAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(noStub).toBeCalled();
  });
});
