export const openPdfInNewTabAction = ({
  applicationContext,
  props,
  router,
}: ActionProps) => {
  const { file } = props;
  const reader = applicationContext.getFileReaderInstance();

  reader.onload = async () => {
    const blob = new Blob([reader.result], { type: 'application/pdf' });
    const url = router.createObjectURL(blob);
    await applicationContext.getUtilities().openUrlInNewTab({ url });
  };

  reader.readAsArrayBuffer(file);
};
