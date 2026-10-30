import { REPORTING_SESSION_EXCLUDED_FIELDS } from '@shared/business/entities/trialSessions/TrialSession';
import { applyTrialSessionProceedingTypeRulesAction } from './applyTrialSessionProceedingTypeRulesAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('applyTrialSessionProceedingTypeRulesAction', () => {
  it.each(['Special', 'Motion/Hearing', 'Regular'])(
    'should clear incompatible values for Reporting with session type %s',
    async sessionType => {
      const result = await runAction(
        applyTrialSessionProceedingTypeRulesAction,
        {
          props: { key: 'proceedingType' },
          state: {
            form: {
              ...Object.fromEntries(
                REPORTING_SESSION_EXCLUDED_FIELDS.map(field => [
                  field,
                  'old value',
                ]),
              ),
              proceedingType: 'Reporting',
              sessionScope: 'Standalone Remote',
              sessionType,
              startTimeHours: '10',
              startTimeMinutes: '00',
              startTimeExtension: 'am',
              swingSession: true,
              trialLocation: 'Birmingham, Alabama',
              chambersPhoneNumber: '1234567890',
              startDate: '3000-12-01T00:00:00.000Z',
              estimatedEndDate: '3000-12-05T00:00:00.000Z',
            },
          },
        },
      );
      for (const field of REPORTING_SESSION_EXCLUDED_FIELDS)
        expect(result.state.form[field]).toBeUndefined();
      expect(result.state.form.sessionScope).toBe('Location-based');
      expect(result.state.form.sessionType).toBe(
        sessionType === 'Regular' ? 'Regular' : undefined,
      );
      expect(result.state.form.startTimeHours).toBeUndefined();
      expect(result.state.form.swingSession).toBeUndefined();
      expect(result.state.form.trialLocation).toBe('Birmingham, Alabama');
      expect(result.state.form.chambersPhoneNumber).toBe('1234567890');
      expect(result.state.form.estimatedEndDate).toBe(
        result.state.form.startDate,
      );
    },
  );

  it('should reset proceeding data and restore time when switching away from Reporting', async () => {
    const result = await runAction(applyTrialSessionProceedingTypeRulesAction, {
      props: { key: 'proceedingType' },
      state: {
        form: {
          proceedingType: 'Remote',
          address1: 'old address',
          meetingId: 'old meeting',
          trialClerkId: 'old clerk',
        },
      },
    });
    expect(result.state.form).toEqual({
      proceedingType: 'Remote',
      startTime: '10:00',
      startTimeHours: '10',
      startTimeMinutes: '00',
      startTimeExtension: 'am',
    });
  });

  it('should preserve other edits to an ordinary session', async () => {
    const form = {
      proceedingType: 'Remote',
      meetingId: '123',
      startTime: '11:00',
    };
    const result = await runAction(applyTrialSessionProceedingTypeRulesAction, {
      props: { key: 'meetingId' },
      state: { form },
    });
    expect(result.state.form).toEqual(form);
  });
});
