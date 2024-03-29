import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { prepareCreatePractitionerUserFormAction } from './prepareCreatePractitionerUserFormAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

const { COUNTRY_TYPES } = applicationContext.getConstants();

describe('prepareCreatePractitionerUserFormAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should create a contact object on form with the countryType set to Domestic and admissionsStatus set to Active', async () => {
    const result = await runAction(prepareCreatePractitionerUserFormAction, {
      modules: {
        presenter,
      },
      state: { form: {} },
    });

    expect(result.state.form).toEqual({
      admissionsStatus: 'Active',
      contact: {
        countryType: COUNTRY_TYPES.DOMESTIC,
      },
    });
  });
});
