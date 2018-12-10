import { runCompute } from 'cerebral/test';
import assert from 'assert';

import {
  formattedCaseDetail,
  formattedCases,
} from '../main/computeds/formattedCaseDetail';

import { formattedSearchParams } from '../main/computeds/formattedSearchParams';

describe('formatted case details computed', () => {
  it('formats the date', () => {
    const result = runCompute(formattedCaseDetail, {
      state: {
        caseDetail: { irsDate: '2018-11-21T20:49:28.192Z', documents: [] },
        form: {},
      },
    });
    assert.equal(result.irsDateFormatted, '11/21/2018');
  });

  it('formats the date in a list of cases', () => {
    const result = runCompute(formattedCases, {
      state: {
        cases: [{ irsDate: '2018-11-21T20:49:28.192Z', documents: [] }],
      },
    });
    assert.equal(result[0].irsDateFormatted, '11/21/2018');
  });
});

describe('formatted search parameters computed', () => {
  it('formats a docket number search param', () => {
    const result = runCompute(formattedSearchParams, {
      state: { searchTerm: '101-18' },
    });
    // currently noop
    assert.equal(result, '101-18');
  });
});
