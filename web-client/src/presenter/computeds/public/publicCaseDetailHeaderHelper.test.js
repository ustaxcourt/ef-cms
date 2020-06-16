import { publicCaseDetailHeaderHelper } from './publicCaseDetailHeaderHelper';
import { runCompute } from 'cerebral/test';

let state;
describe('publicCaseDetailHeaderHelper', () => {
  beforeEach(() => {
    state = {
      caseDetail: {
        caseCaption: 'Test Caption',
        docketNumber: '123-45',
        docketNumberWithSuffix: '123-45S',
        docketRecord: [],
      },
    };
  });

  it('Should return case detail helper information', () => {
    const result = runCompute(publicCaseDetailHeaderHelper, { state });
    expect(result).toMatchObject({
      caseCaption: 'Test Caption',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      isCaseSealed: false,
    });
  });

  it('Should indicate whether a case is sealed', () => {
    state.caseDetail.isSealed = true;
    const result = runCompute(publicCaseDetailHeaderHelper, { state });
    expect(result.isCaseSealed).toBe(true);
  });
});
