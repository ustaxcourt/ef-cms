export const shouldUnsetParentMessageIdAction = ({
  path,
  props,
}: ActionProps) => {
  if (!props.parentMessageId) return path.yes();
  return path.no();
};
