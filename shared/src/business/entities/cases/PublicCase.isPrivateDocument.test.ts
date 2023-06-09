const {
  POLICY_DATE_IMPACTED_EVENTCODES,
  TRANSCRIPT_EVENT_CODE,
} = require('../EntityConstants');
const { PublicCase } = require('./PublicCase');

describe('PublicCase isPrivateDocument', () => {
  it('should return true for a transcript document', () => {
    const isPrivate = PublicCase.isPrivateDocument(
      {
        docketEntryId: 'db3ed57e-cfca-4228-ad5c-547484b1a801',
        eventCode: TRANSCRIPT_EVENT_CODE,
      },
      [{ docketEntryId: 'db3ed57e-cfca-4228-ad5c-547484b1a801' }],
    );
    expect(isPrivate).toEqual(true);
  });

  it('should return true for an order document that is not on the docket record', () => {
    const isPrivate = PublicCase.isPrivateDocument(
      {
        documentType: 'Order',
      },
      [],
    );
    expect(isPrivate).toEqual(true);
  });

  it('should return true for a court-issued order document that is not on the docket record', () => {
    const isPrivate = PublicCase.isPrivateDocument(
      {
        documentType: 'Order',
      },
      [],
    );
    expect(isPrivate).toEqual(true);
  });

  it('should return false for a court-issued order document that is on the docket record', () => {
    const isPrivate = PublicCase.isPrivateDocument({
      docketEntryId: '123',
      documentType: 'Order',
      isOnDocketRecord: true,
    });
    expect(isPrivate).toEqual(false);
  });

  it('should return false for a document with hasPolicyDateImpactedEventCode true that is on the docket record', () => {
    const isPrivate = PublicCase.isPrivateDocument({
      docketEntryId: '123',
      eventCode: POLICY_DATE_IMPACTED_EVENTCODES[0],
      isOnDocketRecord: true,
    });
    expect(isPrivate).toEqual(false);
  });

  it('should return true for an external document', () => {
    const isPrivate = PublicCase.isPrivateDocument(
      {
        documentType: 'Petition',
      },
      [],
    );
    expect(isPrivate).toEqual(true);
  });

  it('should return true for a court-issued document that is stricken', () => {
    const isPrivate = PublicCase.isPrivateDocument({
      docketEntryId: '123',
      documentType: 'Order',
      isOnDocketRecord: true,
      isStricken: true,
    });
    expect(isPrivate).toEqual(true);
  });
});
