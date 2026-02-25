import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../../entities/EntityConstants';
import { TrialSessionInfoDTO } from './TrialSessionInfoDTO';

describe('TrialSessionInfoDTO', () => {
  it('should map all properties from a raw trial session', () => {
    const rawTrialSession = {
      estimatedEndDate: '2025-04-01T04:00:00.000Z',
      isCalendared: true,
      judge: { name: 'Judge Buch', userId: '123' },
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
      sessionStatus: SESSION_STATUS_TYPES.open,
      sessionType: SESSION_TYPES.regular,
      startDate: '2025-03-01T05:00:00.000Z',
      startTime: '10:00',
      term: 'Spring',
      termYear: '2025',
      trialLocation: 'Houston, Texas',
      trialSessionId: 'abc-123',
      noticeIssuedDate: '2025-01-15T05:00:00.000Z',
      swingSession: true,
      dismissedAlertForNott: false,
      trialClerk: { name: 'Clerk A', userId: '456' },
      alternateTrialClerkName: 'Clerk B',
    } as any;

    const dto = new TrialSessionInfoDTO(rawTrialSession);

    expect(dto.estimatedEndDate).toEqual('2025-04-01T04:00:00.000Z');
    expect(dto.isCalendared).toEqual(true);
    expect(dto.judge).toEqual({ name: 'Judge Buch', userId: '123' });
    expect(dto.proceedingType).toEqual(
      TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    );
    expect(dto.sessionScope).toEqual(TRIAL_SESSION_SCOPE_TYPES.locationBased);
    expect(dto.sessionStatus).toEqual(SESSION_STATUS_TYPES.open);
    expect(dto.sessionType).toEqual(SESSION_TYPES.regular);
    expect(dto.startDate).toEqual('2025-03-01T05:00:00.000Z');
    expect(dto.startTime).toEqual('10:00');
    expect(dto.term).toEqual('Spring');
    expect(dto.termYear).toEqual('2025');
    expect(dto.trialLocation).toEqual('Houston, Texas');
    expect(dto.trialSessionId).toEqual('abc-123');
    expect(dto.noticeIssuedDate).toEqual('2025-01-15T05:00:00.000Z');
    expect(dto.swingSession).toEqual(true);
    expect(dto.dismissedAlertForNott).toEqual(false);
    expect(dto.trialClerk).toEqual({ name: 'Clerk A', userId: '456' });
    expect(dto.alternateTrialClerkName).toEqual('Clerk B');
  });

  it('should handle optional properties being undefined', () => {
    const rawTrialSession = {
      isCalendared: false,
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
      sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
      sessionStatus: SESSION_STATUS_TYPES.new,
      sessionType: SESSION_TYPES.small,
      startDate: '2025-03-01T05:00:00.000Z',
      term: 'Fall',
      termYear: '2025',
    } as any;

    const dto = new TrialSessionInfoDTO(rawTrialSession);

    expect(dto.isCalendared).toEqual(false);
    expect(dto.estimatedEndDate).toBeUndefined();
    expect(dto.judge).toBeUndefined();
    expect(dto.startTime).toBeUndefined();
    expect(dto.trialLocation).toBeUndefined();
    expect(dto.trialSessionId).toBeUndefined();
    expect(dto.noticeIssuedDate).toBeUndefined();
    expect(dto.swingSession).toBeUndefined();
    expect(dto.dismissedAlertForNott).toBeUndefined();
    expect(dto.trialClerk).toBeUndefined();
    expect(dto.alternateTrialClerkName).toBeUndefined();
  });
});
