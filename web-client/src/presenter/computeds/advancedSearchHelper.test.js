import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { advancedSearchHelper as advancedSearchHelperComputed } from './advancedSearchHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const advancedSearchHelper = withAppContextDecorator(
  advancedSearchHelperComputed,
);

describe('advancedSearchHelper', () => {
  it('returns empty object when searchResults is undefined', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {},
    });
    expect(result).toEqual({});
  });

  it('returns showNoMatches true and showSearchResults false if searchResults is an empty array', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        constants: { US_STATES: ContactFactory.US_STATES },
        searchResults: [],
      },
    });
    expect(result).toMatchObject({
      showNoMatches: true,
      showSearchResults: false,
    });
  });

  it('returns showNoMatches false, showSearchResults true, and the results count if searchResults is an not empty array', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        constants: { US_STATES: ContactFactory.US_STATES },
        searchResults: [
          {
            contactPrimary: { name: 'Test Person', state: 'TN' },
            docketNumber: '101-19',
          },
        ],
      },
    });
    expect(result).toMatchObject({
      searchResultsCount: 1,
      showNoMatches: false,
      showSearchResults: true,
    });
  });

  it('formats search results and sorts by docket number', () => {
    const result = runCompute(advancedSearchHelper, {
      state: {
        constants: { US_STATES: ContactFactory.US_STATES },
        searchResults: [
          {
            caseCaption: 'Test Taxpayer, Petitioner',
            contactPrimary: { name: 'Test Person', state: 'TN' },
            docketNumber: '101-19',
            filedDate: '2019-03-01T05:00:00.000Z',
          },
          {
            caseCaption: 'Test Taxpayer & Another Taxpayer, Petitioner(s)',
            contactPrimary: { name: 'Test Person', state: 'TX' },
            contactSecondary: { name: 'Another Person', state: 'TX' },
            docketNumber: '102-18',
            docketNumberSuffix: 'W',
            filedDate: '2018-05-01T05:00:00.000Z',
          },
        ],
      },
    });
    expect(result.formattedSearchResults).toMatchObject([
      {
        caseCaptionNames: 'Test Taxpayer & Another Taxpayer',
        contactPrimaryName: 'Test Person',
        contactSecondaryName: 'Another Person',
        docketNumberWithSuffix: '102-18W',
        formattedFiledDate: '05/01/18',
        fullStateName: 'Texas',
      },
      {
        caseCaptionNames: 'Test Taxpayer',
        contactPrimaryName: 'Test Person',
        contactSecondaryName: undefined,
        docketNumberWithSuffix: '101-19',
        formattedFiledDate: '03/01/19',
        fullStateName: 'Tennessee',
      },
    ]);
  });
});
