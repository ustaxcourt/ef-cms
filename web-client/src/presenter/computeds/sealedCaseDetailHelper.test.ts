import { runCompute } from '@web-client/presenter/test.cerebral';
import { sealedCaseDetailHelper } from './sealedCaseDetailHelper';
import { withAppContextDecorator } from '../../withAppContext';

let state;
let sealedCaseDetailHelperDecorator;

describe('sealedCaseDetailHelper', () => {
  beforeEach(() => {
    state = {
      caseDetail: {
        caseCaption: 'Test Caption',
        docketNumber: '123-45',
        docketNumberWithSuffix: '123-45S',
      },
    };
    sealedCaseDetailHelperDecorator = withAppContextDecorator(
      sealedCaseDetailHelper,
    );
  });

  it('should return an empty string for caseCaption when it is undefined', () => {
    const stateWithoutCaseCaption = {
      caseDetail: {
        caseCaption: undefined,
        docketNumber: '123-45',
        docketNumberWithSuffix: '123-45S',
      },
    };

    const result: { caseCaption: string } = runCompute(
      sealedCaseDetailHelperDecorator,
      {
        state: stateWithoutCaseCaption,
      },
    );

    expect(result.caseCaption).toBe('');
  });

  it('should return case detail helper information', () => {
    const result = runCompute(sealedCaseDetailHelperDecorator, {
      state,
    });

    expect(result).toMatchObject({
      caseCaption: 'Test Caption',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      isCaseSealed: false,
    });
  });

  it('should indicate whether a case is sealed', () => {
    state.caseDetail.isSealed = true;

    const result: {
      isCaseSealed: boolean;
    } = runCompute(sealedCaseDetailHelperDecorator, { state });

    expect(result.isCaseSealed).toBe(true);
  });
});
