import { ContactFactory } from '../../../../../shared/src/business/entities/contacts/ContactFactory';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setDefaultCountryTypeOnAdvancedSearchFormAction } from './setDefaultCountryTypeOnAdvancedSearchFormAction';

describe('setDefaultCountryTypeOnAdvancedSearchFormAction', () => {
  it('sets state.constants.COUNTRY_TYPE.DOMESTIC as state.form.countryType', async () => {
    const result = await runAction(
      setDefaultCountryTypeOnAdvancedSearchFormAction,
      {
        modules: { presenter },
        state: {
          constants: { COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES },
          form: {},
        },
      },
    );

    expect(result.state.form.countryType).toEqual(
      ContactFactory.COUNTRY_TYPES.DOMESTIC,
    );
  });
});
