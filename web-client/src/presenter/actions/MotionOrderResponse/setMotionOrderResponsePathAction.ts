export const setMotionOrderResponsePathAction = ({ props }: ActionProps) => {
  const { motionOrderIndex } = props;

  return { path: props.path, motionOrderIndex };
};
