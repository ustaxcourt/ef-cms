import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { prepareCreateAttorneyUserFormAction } from './prepareCreateAttorneyUserFormAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

describe('prepareCreateAttorneyUserFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should create a contact object on form with the countryType set to Domestic', async () => {
    const result = await runAction(prepareCreateAttorneyUserFormAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(result.state.form).toEqual({
      contact: {
        countryType: 'domestic',
      },
    });
  });
});
