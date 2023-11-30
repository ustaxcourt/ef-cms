export const chooseExportPendingReportMethodAction = ({
  path,
  props,
}: ActionProps) => {
  switch (props.method) {
    case 'e2scv':
      return path.e2csv();
    case 'csvs':
      return path.csvs();
    default:
      return path.base();
  }
};
