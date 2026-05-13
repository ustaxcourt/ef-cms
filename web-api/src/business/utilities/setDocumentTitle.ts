import { Stamp } from '@web-api/business/entities/Stamp';

export function setDocumentTitle(
  documentTitle: string,
  stampData: Stamp,
): string {
  const prefix = 'Order - ';
  return stampData.disposition
    ? documentTitle.startsWith(prefix)
      ? documentTitle
      : `${prefix}${documentTitle}`
    : documentTitle;
}
