import { COUNTRY_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { defaultAdvancedSearchFormAction } from './defaultAdvancedSearchFormAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContextForClient;

describe('defaultAdvancedSearchFormAction', () => {
  it('sets defaults on state.advancedSearchForm if state.advancedSearchForm is empty', async () => {
    const result = await runAction(defaultAdvancedSearchFormAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {},
      },
    });

    expect(result.state.advancedSearchForm).toEqual({
      caseSearchByDocketNumber: {},
      caseSearchByName: {
        countryType: COUNTRY_TYPES.DOMESTIC,
      },
      opinionSearch: {},
      orderSearch: {},
      practitionerSearchByBarNumber: {},
      practitionerSearchByName: {},
      searchMode: 'byName',
    });
  });

  it('sets defaults on state.opinionDocumentTypes if state.advancedSearchForm is empty', async () => {
    const result = await runAction(defaultAdvancedSearchFormAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {},
      },
    });

    expect(result.state.opinionDocumentTypes).toEqual([]);
  });

  it('does not overwrite values for form data if they are present on state.advancedSearchForm', async () => {
    const result = await runAction(defaultAdvancedSearchFormAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {
          caseSearchByDocketNumber: { yes: true },
          caseSearchByName: {
            countryType: COUNTRY_TYPES.INTERNATIONAL,
            no: false,
          },
          opinionSearch: {},
          orderSearch: { taco: 'tuesday' },
          practitionerSearchByBarNumber: { red: 'blue' },
          practitionerSearchByName: { one: 'two' },
          searchMode: 'byDocketNumber',
        },
      },
    });

    expect(result.state.advancedSearchForm).toEqual({
      caseSearchByDocketNumber: { yes: true },
      caseSearchByName: {
        countryType: COUNTRY_TYPES.INTERNATIONAL,
        no: false,
      },
      opinionSearch: {},
      orderSearch: { taco: 'tuesday' },
      practitionerSearchByBarNumber: { red: 'blue' },
      practitionerSearchByName: { one: 'two' },
      searchMode: 'byDocketNumber',
    });
  });
});
