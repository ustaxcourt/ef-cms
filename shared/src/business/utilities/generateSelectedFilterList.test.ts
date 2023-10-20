import { generateCaseStatus, isMemberCase } from './generateSelectedFilterList';

describe('generateCaseStatus', () => {
  const statusLabelsPostUPDATE = [
    { key: 'basisReached', label: 'Basis Reached' },
    { key: 'recall', label: 'Recall' },
    { key: 'probableSettlement', label: 'Probable Settlement' },
    { key: 'continued', label: 'Continued' },
    { key: 'probableTrial', label: 'Probable Trial' },
    { key: 'rule122', label: 'Rule 122' },
    { key: 'definiteTrial', label: 'Definite Trial' },
    { key: 'submittedCAV', label: 'Submitted/CAV' },
    { key: 'motionToDismiss', label: 'Motion' },
  ];

  it('should return "Unassigned" if trial status has not been selected', () => {
    const trialStatus = undefined;
    const result = generateCaseStatus(trialStatus);
    expect(result).toEqual('Unassigned');
  });

  for (let index = 0; index < statusLabelsPostUPDATE.length; index++) {
    const caseFilter = statusLabelsPostUPDATE[index];
    it(`should return the correct status label for filter code: ${caseFilter.key}`, () => {
      const result = generateCaseStatus(caseFilter.key);
      expect(result).toEqual(caseFilter.label);
    });
  }
});

describe('isMemberCase', () => {
  it('return true if case in a member case and not lead case', () => {
    const formattedCase = {
      inConsolidatedGroup: true,
      isLeadCase: false,
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
