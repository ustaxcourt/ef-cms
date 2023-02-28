export const validateScannerSourceAction = async ({
  applicationContext,
  path,
  props,
}) => {
  const scanner = await applicationContext.getScanner();

  if (
    props.scannerSourceIndex !== null &&
    scanner.getSourceNameByIndex(props.scannerSourceIndex) ===
      props.scannerSourceName
  ) {
    return path.valid();
  } else {
    return path.invalid();
  }
};
