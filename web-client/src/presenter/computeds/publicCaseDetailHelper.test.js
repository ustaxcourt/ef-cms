import { publicCaseDetailHelper } from './publicCaseDetailHelper';
import { runCompute } from 'cerebral/test';

let state;
describe('publicCaseDetailHelper', () => {
  beforeEach(() => {
    state = {
      caseDetail: {
        docketNumber: '123-45',
        docketRecord: [],
      },
    };
  });

  it('Should return the formatted docket record as an array', () => {
    const result = runCompute(publicCaseDetailHelper, { state });
    expect(Array.isArray(result.formattedDocketRecord)).toBeTruthy();
  });
});
