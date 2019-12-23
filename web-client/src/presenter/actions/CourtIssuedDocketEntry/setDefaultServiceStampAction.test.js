import { User } from '../../../../../shared/src/business/entities/User';
import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setDefaultServiceStampAction } from './setDefaultServiceStampAction';

presenter.providers.applicationContext = applicationContext;

describe('setDefaultServiceStampAction', () => {
  it('should set default serviceStamp on form if user is a petitions clerk', async () => {
    applicationContext.getCurrentUser = () => ({
      role: User.ROLES.petitionsClerk,
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
      role: User.ROLES.docketClerk,
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
