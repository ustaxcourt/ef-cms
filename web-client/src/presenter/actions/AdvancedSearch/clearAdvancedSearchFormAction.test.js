import { clearAdvancedSearchFormAction } from './clearAdvancedSearchFormAction';
import { runAction } from 'cerebral/test';

describe('clearAdvancedSearchFormAction', () => {
  it('should clear the advanced search form ONLY for the props.formType', async () => {
    const result = await runAction(clearAdvancedSearchFormAction, {
      props: { formType: 'practitionerSearchByName' },
      state: {
        advancedSearchForm: {
          caseSearchByName: {
            countryType: 'international',
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
        countryType: 'international',
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
      props: { formType: 'caseSearchByName' },
      state: {
        advancedSearchForm: {
          caseSearchByName: {
            countryType: 'international',
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
      caseSearchByName: { countryType: 'domestic' },
      currentPage: 83,
      orderSearch: { keyword: '' },
      practitionerSearchByName: {
        practitionerName: 'Ricky',
      },
    });
  });

  it('should clear the advanced search form ONLY for the props.formType and set the default keyword if the formType is orderSearch', async () => {
    const result = await runAction(clearAdvancedSearchFormAction, {
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
