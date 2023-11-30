export const chooseExportPendingReportMethodAction = ({
  path,
  props,
}: ActionProps) => {
  console.log('Method used:', props.method);
  switch (props.method) {
    case 'e2csv':
      return path.e2csv();
    case 'csvs':
      return path.csvs();
    default:
      return path.base();
  }
};
