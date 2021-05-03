import { partiesInformationHelper } from './partiesInformationHelper';
import { runCompute } from 'cerebral/test';

describe('partiesInformationHelper', () => {
  it('should return formatted petitioners with representing practitioners', () => {
    const result = runCompute(partiesInformationHelper, {
      state: {
        caseDetail: {
          petitioners: [{}],
        },
      },
    });

    expect(result.showIndividualMessages).toBeTruthy();
    expect(result.showSectionMessages).toBeFalsy();
  });
});
