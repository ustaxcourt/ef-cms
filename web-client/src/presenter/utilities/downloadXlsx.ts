export const downloadXlsx = ({
  encodedXlsxArray,
  fileName,
}: {
  encodedXlsxArray: number[];
  fileName: string;
}): void => {
  const uint8array = new Uint8Array(encodedXlsxArray);
  const blob = new Blob([uint8array]);
  const url = window.URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.setAttribute('id', 'download-xlsx');
  a.setAttribute('href', url);
  a.setAttribute('download', `${fileName}.xlsx`);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
