import { state } from 'cerebral';

export const scanBatchPreviewerHelper = get => {
  const selectedBatchIndex = get(state.selectedBatchIndex) || 0;
  const batches = get(state.batches);
  const selectedBatch = batches.length ? batches[selectedBatchIndex] : {};
  const selectedPageIndex = get(state.selectedPageIndex);
  let selectPageImage = null;

  const bufferToBase64 = buf => {
    const binstr = Array.prototype.map
      .call(buf, function(ch) {
        return String.fromCharCode(ch);
      })
      .join('');
    return btoa(binstr);
  };

  if (
    batches.length &&
    selectedPageIndex !== null &&
    selectedBatchIndex !== null
  ) {
    const page = selectedBatch.pages[selectedPageIndex];
    const b64encoded = bufferToBase64(page);
    selectPageImage = b64encoded;
  }

  return {
    batches,
    currentPage: 0,
    selectedBatch: batches.length ? batches[selectedBatchIndex] : {},
    selectedPageImage: selectPageImage,
  };
};
