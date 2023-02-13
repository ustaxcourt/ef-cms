import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDefaultServiceStampAction } from './setDefaultServiceStampAction';

presenter.providers.applicationContext = applicationContext;

describe('setDefaultServiceStampAction', () => {
  it('should set default serviceStamp on form if user is a petitions clerk', async () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitionsClerk,
    });

    const result = await runAction(setDefaultServiceStampAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(result.state.form).toEqual({
      serviceStamp: 'Served',
    });
  });

  it('should not set default serviceStamp on form if user is a docket clerk', async () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.docketClerk,
    });

    const result = await runAction(setDefaultServiceStampAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(result.state.form).toEqual({});
  });
});
