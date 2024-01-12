import {
  COURT_ISSUED_EVENT_CODES,
  INITIAL_DOCUMENT_TYPES,
  MINUTE_ENTRIES_MAP,
  UNSERVABLE_EVENT_CODES,
} from '../entities/EntityConstants';

const getIsInitialFilingType = docketEntry => {
  const INITIAL_DOCUMENT_EVENT_CODES = Object.keys(INITIAL_DOCUMENT_TYPES).map(
    key => INITIAL_DOCUMENT_TYPES[key].eventCode,
  );

  return INITIAL_DOCUMENT_EVENT_CODES.includes(docketEntry.eventCode);
};

const getIsMinuteEntry = docketEntry => {
  const MINUTE_ENTRIES_EVENT_CODES = Object.keys(MINUTE_ENTRIES_MAP).map(
    key => MINUTE_ENTRIES_MAP[key].eventCode,
  );

  return MINUTE_ENTRIES_EVENT_CODES.includes(docketEntry.eventCode);
};

const getIsCourtIssued = docketEntry =>
  COURT_ISSUED_EVENT_CODES.map(item => item.eventCode).includes(
    docketEntry.eventCode,
  );

const getIsUnservable = docketEntry =>
  UNSERVABLE_EVENT_CODES.includes(docketEntry.eventCode);

/**
 * determines if a docket entry should get an index
 *
 * @param {string} applicationContext the application context
 * @param {string} caseDetail the case detail object
 * @param {object} docketEntry the docket entry
 * @returns {boolean} true if a given entry should have an index applied or false otherwise
 */
export const shouldGenerateDocketRecordIndex = ({
  caseDetail,
  docketEntry,
}) => {
  if (docketEntry.index) {
    return false; // an index does not need to be generated
  }

  const isMinuteEntry = getIsMinuteEntry(docketEntry.eventCode);
  const isInitialFilingType = getIsInitialFilingType(docketEntry);
  const isCourtIssued = getIsCourtIssued(docketEntry);
  const isUnservable = getIsUnservable(docketEntry);

  if (!isInitialFilingType && !isMinuteEntry && !docketEntry.docketEntryId) {
    return false;
  }

  if (docketEntry.eventCode === INITIAL_DOCUMENT_TYPES.stin.eventCode) {
    return false;
  }

  if (!docketEntry.isPaper && !isCourtIssued) {
    return true;
  }

  if (isInitialFilingType) {
    if (docketEntry.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode) {
      return true;
    } else {
      const petitionDocument = caseDetail.docketEntries.find(
        d => d.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode,
      );
      // if the petition has a servedAt, then this non-petition initial document is being added after the fact (not filed at the same time)
      if (petitionDocument.servedAt) {
        // if this initial document is being served, it should have an index
        return !!docketEntry.servedAt;
      } else {
        return true;
      }
    }
  }

  return isUnservable || isMinuteEntry || !!docketEntry.servedAt;
};
