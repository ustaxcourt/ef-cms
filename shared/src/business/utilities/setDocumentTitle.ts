import { Stamp } from '@shared/business/entities/Stamp';

export function setDocumentTitle(documentTitle: string, stampData: Stamp) {
  const prefix = 'Order - ';
  return stampData.disposition
    ? documentTitle.startsWith(prefix)
      ? documentTitle
      : `${prefix}${documentTitle}`
    : documentTitle;
}
