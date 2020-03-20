import { ContactFactory } from '../../../../../shared/src/business/entities/contacts/ContactFactory';
import { applicationContext } from '../../../applicationContext';
import { defaultAdvancedSearchFormAction } from './defaultAdvancedSearchFormAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('defaultAdvancedSearchFormAction', () => {
  it('sets defaults on state.advancedSearchForm', async () => {
    const result = await runAction(defaultAdvancedSearchFormAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {},
      },
    });

    expect(result.state.advancedSearchForm).toEqual({
      caseSearchByDocketNumber: {},
      caseSearchByName: {
        countryType: ContactFactory.COUNTRY_TYPES.DOMESTIC,
      },
      currentPage: 1,
      practitionerSearchByBarNumber: {},
      practitionerSearchByName: {},
    });
  });
});
