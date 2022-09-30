import {
  generateCaseStatus,
  generateSelectedFilterList,
  orderedFilterMap,
} from './generateSelectedFilterList';

describe('generateCaseStatus', () => {
  it('should return "Unassigned" if trial status has not been selected', () => {
    const trialStatus = undefined;
    const result = generateCaseStatus(trialStatus);
    expect(result).toEqual('Unassigned');
  });

  for (let index = 0; index < orderedFilterMap.length; index++) {
    const caseFilter = orderedFilterMap[index];
    it(`should not return the status "Unassigned" for valid filter code: ${caseFilter.code}`, () => {
      const result = generateCaseStatus(caseFilter.code);
      expect(result).not.toEqual('Unassigned');
    });
  }
});

describe('generateSelectedFilterList', () => {
  it('return all 9 filters when the user selects "Show All"', () => {
    const userFilters = {
      aBasisReached: true,
      continued: true,
      dismissed: true,
      recall: true,
      rule122: true,
      setForTrial: true,
      settled: true,
      showAll: true,
      statusUnassigned: true,
      takenUnderAdvisement: true,
    };
    const result = generateSelectedFilterList(userFilters);
    expect(result.length).toEqual(9);
  });

  it.skip('should format clinic letter key correctly for locations with multiple spaces', () => {
    const result = generateSelectedFilterList({
      procedureType: 'Small',
      trialLocation: 'Los Angeles, New York',
    });

    expect(result).toEqual('clinic-letter-los-angeles-new-york-small');
  });
});
