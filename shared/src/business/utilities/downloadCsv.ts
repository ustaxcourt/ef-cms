export const downloadCsv = ({
  csvString,
  fileName,
}: {
  csvString: string;
  fileName: string;
}): void => {
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = window.document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', fileName);
  a.click();
};
