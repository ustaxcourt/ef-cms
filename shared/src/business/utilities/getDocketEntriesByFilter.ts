export const getDocketEntriesByFilter = (
  applicationContext,
  {
    docketEntries,
    docketRecordFilter,
  }: { docketEntries: RawDocketEntry[]; docketRecordFilter: string },
): RawDocketEntry[] => {
  let result = docketEntries;
  const {
    DOCKET_RECORD_FILTER_OPTIONS,
    EXHIBIT_EVENT_CODES,
    MOTION_EVENT_CODES,
    ORDER_EVENT_CODES,
  } = applicationContext.getConstants();

  switch (docketRecordFilter) {
    case DOCKET_RECORD_FILTER_OPTIONS.exhibits:
      result = docketEntries.filter(entry =>
        EXHIBIT_EVENT_CODES.includes(entry.eventCode),
      );
      break;
    case DOCKET_RECORD_FILTER_OPTIONS.motions:
      result = docketEntries.filter(
        entry => MOTION_EVENT_CODES.includes(entry.eventCode) && !entry.isDraft,
      );
      break;
    case DOCKET_RECORD_FILTER_OPTIONS.orders:
      result = docketEntries.filter(
        entry => ORDER_EVENT_CODES.includes(entry.eventCode) && !entry.isDraft,
      );
      break;
  }

  return result;
};
