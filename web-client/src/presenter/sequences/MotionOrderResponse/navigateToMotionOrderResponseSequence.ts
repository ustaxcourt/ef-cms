import { setMotionOrderResponsePathAction } from '@web-client/presenter/actions/MotionOrderResponse/setMotionOrderResponsePathAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';

export const navigateToMotionOrderResponseSequence = [
  setMotionOrderResponsePathAction,
  navigateToPathAction,
] as unknown as (props: {
  motionOrderIndex: number;
  path: string;
}) => void;
