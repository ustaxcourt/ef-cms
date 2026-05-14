import { MOCK_TRIAL_REMOTE } from '@shared/test/mockTrial';
import { TrialSessionInfoDTO } from './TrialSessionInfoDTO';

describe('TrialSessionInfoDTO', () => {
  it('maps a raw trial session to DTO fields', () => {
    const dto = new TrialSessionInfoDTO(MOCK_TRIAL_REMOTE);

    expect(dto.isCalendared).toBe(MOCK_TRIAL_REMOTE.isCalendared);
    expect(dto.judge).toEqual(MOCK_TRIAL_REMOTE.judge);
    expect(dto.proceedingType).toBe(MOCK_TRIAL_REMOTE.proceedingType);
    expect(dto.sessionType).toBe(MOCK_TRIAL_REMOTE.sessionType);
    expect(dto.startDate).toBe(MOCK_TRIAL_REMOTE.startDate);
    expect(dto.term).toBe(MOCK_TRIAL_REMOTE.term);
    expect(dto.sessionScope).toBe(MOCK_TRIAL_REMOTE.sessionScope);
    expect(dto.termYear).toBe(MOCK_TRIAL_REMOTE.termYear);
    expect(dto.trialLocation).toBe(MOCK_TRIAL_REMOTE.trialLocation);
    expect(dto.trialSessionId).toBe(MOCK_TRIAL_REMOTE.trialSessionId);
    expect(dto.sessionStatus).toBe(MOCK_TRIAL_REMOTE.sessionStatus);
  });
});
