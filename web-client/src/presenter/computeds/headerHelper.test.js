import { headerHelper } from './headerHelper';
import { runCompute } from 'cerebral/test';

describe('mapValueHelper', () => {
  it('should return an empty object', () => {
    const result = runCompute(headerHelper, {
      state: {
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result).toEqual({ showSearchInHeader: true });
  });
  it('should return an empty object', () => {
    const result = runCompute(headerHelper, {
      state: {
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result).toEqual({ showSearchInHeader: false });
  });
});
