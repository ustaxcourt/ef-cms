import {
  generateCaseStatus,
  generateSelectedFilterList,
  isMemberCase,
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
    expect(result).toEqual([
      'Set For Trial',
      'Dismissed',
      'Continued',
      'Rule 122',
      'A Basis Reached',
      'Settled',
      'Recall',
      'Taken Under Advisement',
      'Status Unassigned',
    ]);
  });

  it('return only the filters set to true', () => {
    const userFilters = {
      aBasisReached: true,
      continued: false,
      dismissed: true,
      recall: false,
      rule122: true,
      setForTrial: true,
      settled: false,
      showAll: false,
      statusUnassigned: false,
      takenUnderAdvisement: true,
    };
    const result = generateSelectedFilterList(userFilters);

    expect(result.length).toEqual(5);
    expect(result).toEqual([
      'Set For Trial',
      'Dismissed',
      'Rule 122',
      'A Basis Reached',
      'Taken Under Advisement',
    ]);
  });
});

describe('isMemberCase', () => {
  it('return true if case in a member case and not lead case', () => {
    const formattedCase = {
      inConsolidatedGroup: true,
      leadCase: false,
    };
    const result = isMemberCase(formattedCase);
    expect(result).toEqual(true);
  });
  it('return false if case is not a member of consolidated group', () => {
    const formattedCase = {
      inConsolidatedGroup: false,
    };
    const result = isMemberCase(formattedCase);
    expect(result).toEqual(false);
  });
});
