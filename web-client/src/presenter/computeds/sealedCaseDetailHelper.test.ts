import { runCompute } from 'cerebral/test';
import { sealedCaseDetailHelper } from './sealedCaseDetailHelper';

let state;
describe('sealedCaseDetailHelper', () => {
  beforeEach(() => {
    state = {
      caseDetail: {
        caseCaption: 'Test Caption',
        docketNumber: '123-45',
        docketNumberWithSuffix: '123-45S',
      },
    };
  });

  it('should return an empty string for caseCaption when it is undefined', () => {
    const stateWithoutCaseCaption = {
      caseDetail: {
        caseCaption: undefined,
        docketNumber: '123-45',
        docketNumberWithSuffix: '123-45S',
      },
    };

    const result = runCompute(sealedCaseDetailHelper, {
      state: stateWithoutCaseCaption,
    });

    expect(result.caseCaption).toBe('');
  });

  it('should return case detail helper information', () => {
    const result = runCompute(sealedCaseDetailHelper, { state });

    expect(result).toMatchObject({
      caseCaption: 'Test Caption',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      isCaseSealed: false,
    });
  });

  it('should indicate whether a case is sealed', () => {
    state.caseDetail.isSealed = true;

    const result = runCompute(sealedCaseDetailHelper, { state });

    expect(result.isCaseSealed).toBe(true);
  });
});
