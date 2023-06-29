/**
 * The returned object is specified by the v2 API and any changes to these properties
 * beyond additions must be accompanied by a version increase.
 *
 * @param {object} docketEntryObject the most up-to-date representation of a docketEntry
 * @returns {object} the v2 representation of a docketEntry
 */
export const marshallDocketEntry = docketEntryObject => {
  return {
    docketEntryId: docketEntryObject.docketEntryId,
    eventCode: docketEntryObject.eventCode,
    eventCodeDescription: docketEntryObject.documentType,
    filedBy: docketEntryObject.filedBy,
    filingDate: docketEntryObject.filingDate,
    index: docketEntryObject.index,
    isFileAttached: docketEntryObject.isFileAttached || false,
    servedAt: docketEntryObject.servedAt,
  };
};
