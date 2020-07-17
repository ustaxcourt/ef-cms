import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { clearAdvancedSearchFormAction } from './clearAdvancedSearchFormAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('clearAdvancedSearchFormAction', () => {
  presenter.providers.applicationContext = applicationContext;

  const { COUNTRY_TYPES } = applicationContext.getConstants();

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
        searchResults: [{ caseId: '1' }, { caseId: '2' }],
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
        searchResults: [{ caseId: '1' }, { caseId: '2' }],
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
      orderSearch: { keyword: '' },
    });
  });
});
