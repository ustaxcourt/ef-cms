import { MOCK_TRIAL_REMOTE } from '@shared/test/mockTrial';
import { PublicTrialSessionInfoDTO } from './PublicTrialSessionInfoDTO';

describe('PublicTrialSessionInfoDTO', () => {
  it('maps a raw trial session to public DTO fields', () => {
    const dto = new PublicTrialSessionInfoDTO(MOCK_TRIAL_REMOTE);

    expect(dto.entityName).toBe('PublicTrialSessionInfoDTO');
    expect(dto.isCalendared).toBe(MOCK_TRIAL_REMOTE.isCalendared);
    expect(dto.judge!.name).toBe(MOCK_TRIAL_REMOTE.judge!.name);
    expect(dto.proceedingType).toBe(MOCK_TRIAL_REMOTE.proceedingType);
    expect(dto.sessionScope).toBe(MOCK_TRIAL_REMOTE.sessionScope);
    expect(dto.sessionStatus).toBe(MOCK_TRIAL_REMOTE.sessionStatus);
    expect(dto.sessionType).toBe(MOCK_TRIAL_REMOTE.sessionType);
    expect(dto.startDate).toBe(MOCK_TRIAL_REMOTE.startDate);
    expect(dto.swingSession).toBe(MOCK_TRIAL_REMOTE.swingSession);
    expect(dto.term).toBe(MOCK_TRIAL_REMOTE.term);
    expect(dto.termYear).toBe(MOCK_TRIAL_REMOTE.termYear);
    expect(dto.trialLocation).toBe(MOCK_TRIAL_REMOTE.trialLocation);
    expect(dto.trialSessionId).toBe(MOCK_TRIAL_REMOTE.trialSessionId);
  });
});
