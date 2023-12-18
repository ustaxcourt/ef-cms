import { COUNTRY_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { defaultAdvancedSearchFormAction } from './defaultAdvancedSearchFormAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('defaultAdvancedSearchFormAction', () => {
  presenter.providers.applicationContext = applicationContextForClient;

  it('sets defaults on state.advancedSearchForm if state.advancedSearchForm is empty', async () => {
    const result = await runAction(defaultAdvancedSearchFormAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {},
      },
    });

    expect(result.state.advancedSearchForm).toMatchObject({
      caseSearchByDocketNumber: {},
      caseSearchByName: {
        countryType: 'all',
      },
      opinionSearch: {
        opinionTypes: {
          MOP: true,
          OST: true,
          SOP: true,
          TCOP: true,
        },
      },
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

    expect(result.state.advancedSearchForm).toMatchObject({
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

  it('should set the current page to 1', async () => {
    const result = await runAction(defaultAdvancedSearchFormAction, {
      modules: { presenter },
      state: {
        advancedSearchForm: {},
      },
    });

    expect(result.state.advancedSearchForm.currentPage).toEqual(1);
  });
});
