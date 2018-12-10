export default documentBlob => {
  // open a new window with the contents of the PDF blob
  const url = window.URL.createObjectURL(documentBlob, {
    type: 'application/pdf',
  });
  window.open(url, '_blank', 'noopener,noreferrer');
  // after the file is viewed, remove the reference to allow garbage collection
  window.setTimeout(() => window.URL.revokeObjectURL(url), 10000);
};
