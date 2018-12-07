import { state } from 'cerebral';

export default async ({ get }) => {
  const documentBlob = get(state.documentBlob);
  const documentUrl = window.URL.createObjectURL(documentBlob, {
    type: 'application/pdf',
  });
  window.open(documentUrl, '_blank', 'noopener,noreferrer');
};
