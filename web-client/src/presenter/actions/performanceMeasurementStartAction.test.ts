import { performanceMeasurementStartAction } from './performanceMeasurementStartAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('performanceMeasurementStartAction', () => {
  it('should return a start time if sequenceName is provided', async () => {
    const { output } = await runAction(performanceMeasurementStartAction, {
      props: {
        sequenceName: 'TEST_SEQUENCE_NAME',
      },
    });

    expect(output).toEqual({
      performanceMeasurementStart: expect.anything(),
    });
  });

  it('should not return a start time if sequenceName is not provided', async () => {
    const { output } = await runAction(performanceMeasurementStartAction, {
      props: {
        sequenceName: undefined,
      },
    });

    expect(output).toEqual(undefined);
  });
});
