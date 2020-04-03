import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { prepareCreatePractitionerUserFormAction } from './prepareCreatePractitionerUserFormAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('prepareCreatePractitionerUserFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should create a contact object on form with the countryType set to Domestic', async () => {
    const result = await runAction(prepareCreatePractitionerUserFormAction, {
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
