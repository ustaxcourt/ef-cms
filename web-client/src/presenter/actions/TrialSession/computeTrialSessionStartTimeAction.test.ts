import { computeTrialSessionStartTimeAction } from './computeTrialSessionStartTimeAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('computeTrialSessionStartTimeAction', () => {
  it('should return a midnight start time in 12hr format', async () => {
    let result;

    result = await runAction(computeTrialSessionStartTimeAction, {
      props: {
        trialSession: {
          startTime: '00:00',
        },
      },
    });

    expect(result.output).toMatchObject({
      startTimeExtension: 'am',
      startTimeHours: '12',
      startTimeMinutes: '00',
    });
  });

  it('should return a noon start time in 12hr format', async () => {
    let result;

    result = await runAction(computeTrialSessionStartTimeAction, {
      props: {
        trialSession: {
          startTime: '12:00',
        },
      },
    });

    expect(result.output).toMatchObject({
      startTimeExtension: 'pm',
      startTimeHours: '12',
      startTimeMinutes: '00',
    });
  });

  it('should return an afternoon (pm) start time in 12hr format', async () => {
    let result;

    result = await runAction(computeTrialSessionStartTimeAction, {
      props: {
        trialSession: {
          startTime: '15:45',
        },
      },
    });

    expect(result.output).toMatchObject({
      startTimeExtension: 'pm',
      startTimeHours: '3',
      startTimeMinutes: '45',
    });
  });

  it('should return a morning (am) start time in 12hr format', async () => {
    let result;

    result = await runAction(computeTrialSessionStartTimeAction, {
      props: {
        trialSession: {
          startTime: '8:29',
        },
      },
    });

    expect(result.output).toMatchObject({
      startTimeExtension: 'am',
      startTimeHours: '8',
      startTimeMinutes: '29',
    });
  });
});
