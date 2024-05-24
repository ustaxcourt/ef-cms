export const openPdfInNewTabAction = ({
  applicationContext,
  props,
  router,
}: ActionProps) => {
  const { file } = props;
  const reader = applicationContext.getFileReaderInstance();

  reader.onload = () => {
    const blob = new Blob([reader.result], { type: 'application/pdf' });
    const url = router.createObjectURL(blob);
    window.open(url, '_blank');
  };

  reader.readAsArrayBuffer(file);
};
