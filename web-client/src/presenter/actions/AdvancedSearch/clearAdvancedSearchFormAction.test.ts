import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { clearAdvancedSearchFormAction } from './clearAdvancedSearchFormAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearAdvancedSearchFormAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const { ADVANCED_SEARCH_OPINION_TYPES, COUNTRY_TYPES } =
    applicationContext.getConstants();

  it('should clear the advanced search form ONLY for the props.formType', async () => {
    const result = await runAction(clearAdvancedSearchFormAction, {
      modules: { presenter },
      props: { formType: 'practitionerSearchByName' },
      state: {
        advancedSearchForm: {
          caseSearchByName: {
            countryType: COUNTRY_TYPES.INTERNATIONAL,
            petitionerName: 'bob',
            petitionerState: 'TN',
            sure: 'yes',
          },
          currentPage: 83,
          orderSearch: { keyword: '' },
          practitionerSearchByName: {
            practitionerName: 'Ricky',
          },
        },
        searchResults: [{ docketNumber: '123-45' }, { docketNumber: '678-90' }],
      },
    });

    expect(result.state.advancedSearchForm).toEqual({
      caseSearchByName: {
        countryType: COUNTRY_TYPES.INTERNATIONAL,
        petitionerName: 'bob',
        petitionerState: 'TN',
        sure: 'yes',
      },
      currentPage: 83,
      orderSearch: { keyword: '' },
      practitionerSearchByName: {},
    });
  });

  it('should clear the advanced search form ONLY for the props.formType and set the default countryType if the formType is caseSearchByName', async () => {
    const result = await runAction(clearAdvancedSearchFormAction, {
      modules: { presenter },
      props: { formType: 'caseSearchByName' },
      state: {
        advancedSearchForm: {
          caseSearchByName: {
            countryType: COUNTRY_TYPES.INTERNATIONAL,
            petitionerName: 'bob',
            petitionerState: 'TN',
            sure: 'yes',
          },
          currentPage: 83,
          orderSearch: { keyword: '' },
          practitionerSearchByName: {
            practitionerName: 'Ricky',
          },
        },
        searchResults: [{ docketNumber: '123-45' }, { docketNumber: '678-90' }],
      },
    });

    expect(result.state.advancedSearchForm).toEqual({
      caseSearchByName: { countryType: COUNTRY_TYPES.DOMESTIC },
      currentPage: 83,
      orderSearch: { keyword: '' },
      practitionerSearchByName: {
        practitionerName: 'Ricky',
      },
    });
  });

  it('should clear the advanced search form ONLY for the props.formType and set the default keyword if the formType is orderSearch', async () => {
    const result = await runAction(clearAdvancedSearchFormAction, {
      modules: { presenter },
      props: { formType: 'orderSearch' },
      state: {
        advancedSearchForm: {
          orderSearch: {
            keyword: 'Order of Dismissal',
          },
        },
        searchResults: [{ documentTitle: 'Order of Dismissal' }],
      },
    });

    expect(result.state.advancedSearchForm).toEqual({
      orderSearch: { dateRange: 'allDates', keyword: '' },
    });
  });

  it('should clear the advanced search form for an opinionSearch and include default opinionTypes', async () => {
    const result = await runAction(clearAdvancedSearchFormAction, {
      modules: { presenter },
      props: { formType: 'opinionSearch' },
      state: {
        advancedSearchForm: {
          opinionSearch: { keyword: 'blah' },
        },
      },
    });

    expect(result.state.advancedSearchForm).toEqual({
      opinionSearch: {
        dateRange: 'allDates',
        keyword: '',
        opinionTypes: {
          [ADVANCED_SEARCH_OPINION_TYPES.Memorandum]: true,
          [ADVANCED_SEARCH_OPINION_TYPES.Summary]: true,
          [ADVANCED_SEARCH_OPINION_TYPES.Bench]: true,
          [ADVANCED_SEARCH_OPINION_TYPES['T.C.']]: true,
        },
      },
    });
  });
});
