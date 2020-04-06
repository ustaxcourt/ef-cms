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
      practitionerSearchByName: {
        practitionerName: 'Ricky',
      },
    });
  });
});
