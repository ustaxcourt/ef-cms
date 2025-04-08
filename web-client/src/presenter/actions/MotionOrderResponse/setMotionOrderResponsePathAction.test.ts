import { runAction } from '@web-client/presenter/test.cerebral';
import { setMotionOrderResponsePathAction } from './setMotionOrderResponsePathAction';

describe('setMotionOrderResponsePathAction', () => {
  it('should return path and motionOrderIndex from props', async () => {
    const result = await runAction(setMotionOrderResponsePathAction, {
      props: {
        path: `/messages/*/message-detail/*/*/motion-order-response-create`,
        motionOrderIndex: 0,
      },
    });

    expect(result.output).toEqual({
      path: '/messages/*/message-detail/*/*/motion-order-response-create',
      motionOrderIndex: 0,
    });
  });
});
