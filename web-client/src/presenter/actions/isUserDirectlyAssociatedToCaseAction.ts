export const isUserAssociatedWithTrialSessionAction = ({
  props,
  path,
}: ActionProps) => {
  if (props.isDirectlyAssociated) return path.yes();
  return path.no();
};
