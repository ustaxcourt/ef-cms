import { isMiscellaneousDocketEntry } from './isMiscellaneousDocketEntry';

describe('isMiscellaneousDocument', () => {
  it("should return true when passed a docket entry that has a document type of 'Miscellaneous'", () => {
    const result = isMiscellaneousDocketEntry({
      createdAt: '2019-11-21T21:49:28.192Z',
      docketEntryId: '062c9a5d-1a65-4273-965e-25d41607bc98',
      docketNumber: '101-18',
      documentTitle: 'Attachment to Petition',
      documentType: 'Miscellaneous',
      entityName: 'DocketEntry',
      eventCode: 'ATP',
      filers: [],
      filingDate: '2017-03-01T09:00:00.000Z',
      isOnDocketRecord: true,
      processingStatus: 'pending',
      receivedAt: '2018-03-01T05:00:00.000Z',
      stampData: {},
    });

    expect(result).toBe(true);
  });

  it('should return true when passed a docket entry that has an undefined document type and that is not a draft status report order', () => {
    const result = isMiscellaneousDocketEntry({
      createdAt: '2019-11-21T21:49:28.192Z',
      docketEntryId: '062c9a5d-1a65-4273-965e-25d41607bc98',
      docketNumber: '101-18',
      documentTitle: 'Attachment to Petition',
      entityName: 'DocketEntry',
      eventCode: 'ATP',
      filers: [],
      filingDate: '2017-03-01T09:00:00.000Z',
      isOnDocketRecord: true,
      processingStatus: 'pending',
      receivedAt: '2018-03-01T05:00:00.000Z',
      stampData: {},
    });

    expect(result).toEqual(true);
  });

  it('should return false when passed a docket entry is a draft status report order', () => {
    const result = isMiscellaneousDocketEntry({
      createdAt: '2019-11-21T21:49:28.192Z',
      docketEntryId: '062c9a5d-1a65-4273-965e-25d41607bc98',
      docketNumber: '101-18',
      documentTitle: 'Attachment to Petition',
      draftOrderState: {
        orderType: 'statusReport',
      },
      entityName: 'DocketEntry',
      eventCode: 'ATP',
      filers: [],
      filingDate: '2017-03-01T09:00:00.000Z',
      isOnDocketRecord: true,
      processingStatus: 'pending',
      receivedAt: '2018-03-01T05:00:00.000Z',
      stampData: {},
    });

    expect(result).toEqual(false);
  });

  it('should return false when passed a docket entry is not a draft status report order', () => {
    const result = isMiscellaneousDocketEntry({
      createdAt: '2019-11-21T21:49:28.192Z',
      docketEntryId: '062c9a5d-1a65-4273-965e-25d41607bc98',
      docketNumber: '101-18',
      documentTitle: 'Attachment to Petition',
      documentType: 'Order',
      entityName: 'DocketEntry',
      eventCode: 'ATP',
      filers: [],
      filingDate: '2017-03-01T09:00:00.000Z',
      isOnDocketRecord: true,
      processingStatus: 'pending',
      receivedAt: '2018-03-01T05:00:00.000Z',
      stampData: {},
    });

    expect(result).toEqual(false);
  });
});
