export const exportCsvFileAction = ({
  applicationContext,
  props,
}: ActionProps<{ fileName: string; csvString: string }>) => {
  const { csvString, fileName } = props;
  applicationContext.getUtilities().downloadCsv({ csvString, fileName });
};
