import { runCompute } from 'cerebral/test';
import assert from 'assert';

import {
  formattedCaseDetail,
  formattedCases,
} from '../main/computeds/formattedCaseDetail';

import { formattedSearchParams } from '../main/computeds/formattedSearchParams';

describe('formatted case details computed', () => {
  it('formats the docket number', () => {
    const result = runCompute(formattedCaseDetail, {
      state: {
        caseDetail: { docketNumber: '00101-18', documents: [] },
        form: {},
      },
    });
    assert.equal(result.docketNumber, '101-18');
  });

  it('formats the docket number in a list of cases', () => {
    const result = runCompute(formattedCases, {
      state: { cases: [{ docketNumber: '00101-18', documents: [] }] },
    });
    assert.equal(result[0].docketNumber, '101-18');
  });
});

describe('formatted search parameters computed', () => {
  it('formats a docket number search param', () => {
    const result = runCompute(formattedSearchParams, {
      state: { searchTerm: '101-18' },
    });
    assert.equal(result, '00101-18');
  });
});
