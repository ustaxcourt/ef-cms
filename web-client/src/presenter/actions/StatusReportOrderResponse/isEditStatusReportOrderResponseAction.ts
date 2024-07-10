export const isEditStatusReportOrderResponseAction = ({
  path,
  props,
}: ActionProps) => {
  if (props.isEditing) {
    return path.edit();
  }
  return path.create();
};
