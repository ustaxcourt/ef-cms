import { publicCaseDetailHeaderHelper } from './publicCaseDetailHeaderHelper';
import { runCompute } from 'cerebral/test';

let state;
describe('publicCaseDetailHeaderHelper', () => {
  beforeEach(() => {
    state = {
      caseDetail: {
        caseTitle: 'Test Title',
        docketNumber: '123-45',
        docketNumberSuffix: 'S',
        docketRecord: [],
      },
    };
  });

  it('Should return the case title', () => {
    const result = runCompute(publicCaseDetailHeaderHelper, { state });
    expect(result.caseTitle).toEqual('Test Title');
  });

  it('Should return the docket number', () => {
    const result = runCompute(publicCaseDetailHeaderHelper, { state });
    expect(result.docketNumber).toEqual('123-45');
  });

  it('Should return the docket number with suffix', () => {
    const result = runCompute(publicCaseDetailHeaderHelper, { state });
    expect(result.docketNumberWithSuffix).toEqual('123-45S');
  });
});
