import { state } from '@web-client/presenter/app.cerebral';

export const addPrintableDocketRecordCheckAction = ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{ isAddPrintableDocketRecordSelected: boolean }>) => {
  console.log(
    'isAddPrintableDocketRecordSelected',
    props.isAddPrintableDocketRecordSelected,
  );
  if (props.isAddPrintableDocketRecordSelected) return path.yes();
  return path.no();
};
