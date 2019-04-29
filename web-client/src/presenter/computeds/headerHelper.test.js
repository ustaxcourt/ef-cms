import { headerHelper } from './headerHelper';
import { runCompute } from 'cerebral/test';

describe('headerHelper', () => {
  it('should show search in header for non-practitioners', () => {
    const result = runCompute(headerHelper, {
      state: {
        user: {
          role: 'taxpayer',
        },
      },
    });
    expect(result.showSearchInHeader).toBeTruthy();
  });
  it('should NOT show search in header for practitioners', () => {
    const result = runCompute(headerHelper, {
      state: {
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result.showSearchInHeader).toBeFalsy();
  });
});
