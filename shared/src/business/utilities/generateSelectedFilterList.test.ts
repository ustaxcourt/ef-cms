import { generateCaseStatus, isMemberCase } from './generateSelectedFilterList';

describe('generateCaseStatus', () => {
  const statusLabelsPreUPDATE = [
    { key: 'setForTrial', label: 'Set for Trial' },
    { key: 'dismissed', label: 'Dismissed' },
    { key: 'continued', label: 'Continued' },
    { key: 'rule122', label: 'Rule 122' },
    { key: 'basisReached', label: 'A Basis Reached' },
    { key: 'settled', label: 'Settled' },
    { key: 'recall', label: 'Recall' },
    { key: 'submittedCAV', label: 'Taken Under Advisement' },
  ];
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
    const areUpdatedTrialSessionTypesEnabled = false;
    const result = generateCaseStatus(
      trialStatus,
      areUpdatedTrialSessionTypesEnabled,
    );
    expect(result).toEqual('Unassigned');
  });

  for (let index = 0; index < statusLabelsPreUPDATE.length; index++) {
    const areUpdatedTrialSessionTypesEnabled = false;
    const caseFilter = statusLabelsPreUPDATE[index];
    it(`should return the correct status label for filter code: ${caseFilter.key} prior to the UPDATED_TRIAL_STATUS_TYPES being turned on`, () => {
      const result = generateCaseStatus(
        caseFilter.key,
        areUpdatedTrialSessionTypesEnabled,
      );
      expect(result).toEqual(caseFilter.label);
    });
  }

  for (let index = 0; index < statusLabelsPostUPDATE.length; index++) {
    const areUpdatedTrialSessionTypesEnabled = true;
    const caseFilter = statusLabelsPostUPDATE[index];
    it(`should return the correct status label for filter code: ${caseFilter.key} after the UPDATED_TRIAL_STATUS_TYPES is turned on`, () => {
      const result = generateCaseStatus(
        caseFilter.key,
        areUpdatedTrialSessionTypesEnabled,
      );
      expect(result).toEqual(caseFilter.label);
    });
  }
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
