import { ContactFactory } from '../../../../../shared/src/business/entities/contacts/ContactFactory';
import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setDefaultCountryTypeOnAdvancedSearchFormAction } from './setDefaultCountryTypeOnAdvancedSearchFormAction';

presenter.providers.applicationContext = applicationContext;

describe('setDefaultCountryTypeOnAdvancedSearchFormAction', () => {
  it('sets COUNTRY_TYPE.DOMESTIC as state.advancedSearchForm.countryType', async () => {
    const result = await runAction(
      setDefaultCountryTypeOnAdvancedSearchFormAction,
      {
        modules: { presenter },
        state: {
          advancedSearchForm: {},
        },
      },
    );

    expect(result.state.advancedSearchForm.countryType).toEqual(
      ContactFactory.COUNTRY_TYPES.DOMESTIC,
    );
  });
});
