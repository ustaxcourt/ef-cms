export const downloadXlsxAction = ({
  applicationContext,
  props,
}: ActionProps) => {
  const { bufferArray, termName } = props;

  applicationContext.getUtilities().downloadXlsx({
    encodedXlsxArray: bufferArray.data,
    fileName: termName,
  });
};
