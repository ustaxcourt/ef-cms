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

  it('Should return case detail helper information', () => {
    const result = runCompute(publicCaseDetailHeaderHelper, { state });
    expect(result).toMatchObject({
      caseTitle: 'Test Title',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      isCaseSealed: false,
    });
  });

  it('Should indicate a case is sealedDate has a valid date', () => {
    state.caseDetail.sealedDate = '2019-09-19T16:42:00.000Z';
    const result = runCompute(publicCaseDetailHeaderHelper, { state });
    expect(result.isCaseSealed).toBe(true);
  });
});
