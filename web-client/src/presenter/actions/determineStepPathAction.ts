export const determineStepPathAction = ({ path, props }: ActionProps) => {
  const { step } = props;
  const pathName = `step${step}`;
  return path[pathName]();
};
