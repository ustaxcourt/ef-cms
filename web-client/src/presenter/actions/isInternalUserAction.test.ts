import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { isInternalUserAction } from './isInternalUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

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
    await runAction(isInternalUserAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          role: ROLES.docketClerk,
        },
      },
    });

    expect(yesStub).toHaveBeenCalled();
  });

  it('should call the path.no if the user is an external user', async () => {
    await runAction(isInternalUserAction, {
      modules: {
        presenter,
      },
      state: {
        user: {
          role: ROLES.petitioner,
        },
      },
    });

    expect(noStub).toHaveBeenCalled();
  });
});
