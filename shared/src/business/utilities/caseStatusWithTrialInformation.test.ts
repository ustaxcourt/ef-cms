import {
  CASE_STATUS_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '@shared/business/entities/EntityConstants';
import { caseStatusWithTrialInformation } from '@shared/business/utilities/caseStatusWithTrialInformation';
import { createTestApplicationContext } from '@shared/business/test/createTestApplicationContext';

describe('caseStatusWithTrialInformation', () => {
  const applicationContext = createTestApplicationContext();

  it('should add the trial location and trial date to the case status when the case is calendared', () => {
    const caseStatusWithTrialInfo = caseStatusWithTrialInformation({
      applicationContext,
      caseStatus: CASE_STATUS_TYPES.calendared,
      trialDate: '2022-02-01T17:21:05.486Z',
      trialLocation: 'Houston, Texas',
    });

    expect(caseStatusWithTrialInfo).toEqual(
      `${CASE_STATUS_TYPES.calendared} - 02/01/22 Houston, TX`,
    );
  });

  it('should not add the trial location and trial date to the case status when the case is not calendared', () => {
    const caseStatusWithTrialInfo = caseStatusWithTrialInformation({
      applicationContext,
      caseStatus: CASE_STATUS_TYPES.new,
    });

    expect(caseStatusWithTrialInfo).toEqual(CASE_STATUS_TYPES.new);
  });

  it('should add the trial location and trial date to the case status when the case is calendared and the trail location is standalone remote', () => {
    const caseStatusWithTrialInfo = caseStatusWithTrialInformation({
      applicationContext,
      caseStatus: CASE_STATUS_TYPES.calendared,
      trialDate: '2022-02-01T17:21:05.486Z',
      trialLocation: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
    });

    expect(caseStatusWithTrialInfo).toEqual(
      `${CASE_STATUS_TYPES.calendared} - 02/01/22 ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`,
    );
  });
});
