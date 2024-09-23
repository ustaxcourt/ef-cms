export const downloadBlob = ({
  blob,
  fileName,
}: {
  blob: Blob;
  fileName: string;
}): void => {
  const url = window.URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.setAttribute('id', 'download-blob');
  a.setAttribute('href', url);
  a.setAttribute('download', fileName);
  a.click();
};
