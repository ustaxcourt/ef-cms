export const addPrintableDocketRecordCheckAction = ({
  path,
  props,
}: ActionProps<{ isAddPrintableDocketRecordSelected: boolean }>) => {
  if (props.isAddPrintableDocketRecordSelected) return path.yes();
  return path.no();
};
