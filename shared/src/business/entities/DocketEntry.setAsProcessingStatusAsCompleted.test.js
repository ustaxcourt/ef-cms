const { A_VALID_DOCKET_ENTRY } = require('./DocketEntry.test');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry } = require('./DocketEntry');
const { DOCUMENT_PROCESSING_STATUS_OPTIONS } = require('./EntityConstants');

describe('setAsProcessingStatusAsCompleted', () => {
  it('sets the docket entry processing status as completed', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
      },
      {
        applicationContext,
      },
    );

    expect(docketEntry.processingStatus).toEqual(
      DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
    );

    docketEntry.setAsProcessingStatusAsCompleted();

    expect(docketEntry.processingStatus).toEqual(
      DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    );
  });
});
