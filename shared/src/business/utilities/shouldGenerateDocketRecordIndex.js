const {
  COURT_ISSUED_EVENT_CODES,
  INITIAL_DOCUMENT_TYPES,
  MINUTE_ENTRIES_MAP,
  UNSERVABLE_EVENT_CODES,
} = require('../entities/EntityConstants');

/**
 * determines if a docket record entry should get an index
 *
 * @param {string} applicationContext the application context
 * @param {string} caseDetail the case detail object
 * @param {string} docketRecordEntry the docket record entry
 * @returns {boolean} true if a given entry should have an index applied or false otherwise
 */
const shouldGenerateDocketRecordIndex = ({ caseDetail, docketRecordEntry }) => {
  if (!docketRecordEntry) {
    return false;
  }

  let isInitialFilingType = false;
  const INITIAL_DOCUMENT_EVENT_CODES = Object.keys(INITIAL_DOCUMENT_TYPES).map(
    key => INITIAL_DOCUMENT_TYPES[key].eventCode,
  );
  if (INITIAL_DOCUMENT_EVENT_CODES.includes(docketRecordEntry.eventCode)) {
    isInitialFilingType = true;
  }

  const MINUTE_ENTRIES_EVENT_CODES = Object.keys(MINUTE_ENTRIES_MAP).map(
    key => MINUTE_ENTRIES_MAP[key].eventCode,
  );

  const isMinuteEntry = MINUTE_ENTRIES_EVENT_CODES.includes(
    docketRecordEntry.eventCode,
  );

  const isCourtIssued = COURT_ISSUED_EVENT_CODES.map(
    item => item.eventCode,
  ).includes(docketRecordEntry.eventCode);

  if (docketRecordEntry.index) {
    return false;
  }

  if (!isInitialFilingType && !isMinuteEntry && !docketRecordEntry.documentId) {
    return false;
  }

  const document =
    docketRecordEntry.documentId &&
    caseDetail.documents.find(
      doc => doc.documentId === docketRecordEntry.documentId,
    );

  if (document && !document.isPaper && !isCourtIssued) {
    return true;
  }

  if (isInitialFilingType) {
    if (
      docketRecordEntry.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode
    ) {
      return true;
    } else {
      const petitionRecord = caseDetail.docketRecord.find(
        record =>
          record.eventCode === INITIAL_DOCUMENT_TYPES.petition.eventCode,
      );

      // Determine if the document was created along with the petition
      const petitionFiled = new Date(petitionRecord.filingDate).getTime();
      const documentFiled = new Date(docketRecordEntry.filingDate).getTime();
      const acceptableTimeGap = 10000; // 10 seconds

      if (Math.abs(petitionFiled - documentFiled) <= acceptableTimeGap) {
        return true;
      }
    }
  }

  if (UNSERVABLE_EVENT_CODES.includes(docketRecordEntry.eventCode)) {
    return true;
  }

  if (isMinuteEntry) {
    return true;
  }

  if (document && !document.servedAt) {
    return false;
  }

  if (document && document.servedAt) {
    return true;
  }
};

exports.shouldGenerateDocketRecordIndex = shouldGenerateDocketRecordIndex;
