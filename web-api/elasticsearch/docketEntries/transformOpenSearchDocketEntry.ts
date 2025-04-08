import { DocketEntryKysely } from '@web-api/persistence/postgres/docketEntries/schema';

export const transformOpenSearchDocketEntry = (
  docketEntryData: DocketEntryKysely | DocketEntryKysely[],
): { docketNumber: string; docketEntryId: string }[] => {
  const docketEntryArray = Array.isArray(docketEntryData)
    ? docketEntryData
    : [docketEntryData];
  return docketEntryArray.map(d => ({
    docketNumber: d.docketNumber,
    docketEntryId: d.docketEntryId,
  }));
};
