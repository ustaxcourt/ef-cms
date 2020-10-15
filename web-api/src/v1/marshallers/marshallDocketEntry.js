// The returned object is specified by the v1 API and should not change
// without changing the API version.
exports.marshallDocketEntry = docketEntryObject => {
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
