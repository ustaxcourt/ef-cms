import { loadingHelper } from './loadingHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('headerHelper', () => {
  it('should return pageIsInterstitial false if state.currentPage is not Interstitial', () => {
    let result = runCompute(loadingHelper, {
      state: { currentPage: 'CaseDetail' },
    });
    expect(result.pageIsInterstitial).toBeFalsy();
  });

  it('should return pageIsInterstitial true if state.currentPage is Interstitial', () => {
    let result = runCompute(loadingHelper, {
      state: { currentPage: 'Interstitial' },
    });
    expect(result.pageIsInterstitial).toBeTruthy();
  });
});
