const { isPrivateDocument, PublicCase } = require('./PublicCase');

describe('PublicCase', () => {
  it('should only have expected fields', () => {
    const entity = new PublicCase(
      {
        caseCaption: 'testing',
        caseId: 'testing',
        caseTitle: 'testing',
        contactPrimary: {},
        contactSecondary: {},
        createdAt: 'testing',
        docketNumber: 'testing',
        docketNumberSuffix: 'testing',
        docketRecord: [{}],
        documents: [{}],
        receivedAt: 'testing',
      },
      {},
    );

    expect(entity.toRawObject()).toEqual({
      caseCaption: 'testing',
      caseId: 'testing',
      caseTitle: 'testing',
      contactPrimary: {},
      contactSecondary: {},
      createdAt: 'testing',
      docketNumber: 'testing',
      docketNumberSuffix: 'testing',
      docketRecord: [{}],
      documents: [{}],
      receivedAt: 'testing',
    });
  });

  it('should only have expected fields if documents if null', () => {
    const entity = new PublicCase(
      {
        caseCaption: 'testing',
        caseId: 'testing',
        caseTitle: 'testing',
        contactPrimary: undefined,
        contactSecondary: undefined,
        createdAt: 'testing',
        docketNumber: 'testing',
        docketNumberSuffix: 'testing',
        docketRecord: null,
        documents: null,
        receivedAt: 'testing',
      },
      {},
    );

    expect(entity.toRawObject()).toEqual({
      caseCaption: 'testing',
      caseId: 'testing',
      caseTitle: 'testing',
      contactPrimary: undefined,
      contactSecondary: undefined,
      createdAt: 'testing',
      docketNumber: 'testing',
      docketNumberSuffix: 'testing',
      docketRecord: [],
      documents: [],
      receivedAt: 'testing',
    });
  });

  it('should filter private (draft court-issued) documents out of the documents array', () => {
    const entity = new PublicCase(
      {
        caseCaption: 'testing',
        caseId: 'testing',
        caseTitle: 'testing',
        contactPrimary: undefined,
        contactSecondary: undefined,
        createdAt: 'testing',
        docketNumber: 'testing',
        docketNumberSuffix: 'testing',
        docketRecord: [{ documentId: '123' }],
        documents: [
          {
            documentId: '123',
            documentType: 'OAJ - Order that case is assigned',
          },
          { documentId: '234', documentType: 'O - Order' },
          { documentId: '345', documentType: 'Petition' },
        ],
        receivedAt: 'testing',
      },
      {},
    );

    expect(entity.toRawObject()).toEqual({
      caseCaption: 'testing',
      caseId: 'testing',
      caseTitle: 'testing',
      contactPrimary: undefined,
      contactSecondary: undefined,
      createdAt: 'testing',
      docketNumber: 'testing',
      docketNumberSuffix: 'testing',
      docketRecord: [{ documentId: '123' }],
      documents: [
        {
          documentId: '123',
          documentType: 'OAJ - Order that case is assigned',
        },
        { documentId: '345', documentType: 'Petition' },
      ],
      receivedAt: 'testing',
    });
  });

  describe('isPrivateDocument', () => {
    it('should return true for a stipulated decision document that is not on the docket record', () => {
      const isPrivate = isPrivateDocument(
        {
          documentType: 'Stipulated Decision',
        },
        [],
      );
      expect(isPrivate).toEqual(true);
    });

    it('should return true for an order document that is not on the docket record', () => {
      const isPrivate = isPrivateDocument(
        {
          documentType: 'Order',
        },
        [],
      );
      expect(isPrivate).toEqual(true);
    });

    it('should return true for a court-issued order document that is not on the docket record', () => {
      const isPrivate = isPrivateDocument(
        {
          documentType: 'O - Order',
        },
        [],
      );
      expect(isPrivate).toEqual(true);
    });

    it('should return true for a court-issued order document that is on the docket record', () => {
      const isPrivate = isPrivateDocument(
        {
          documentId: '123',
          documentType: 'O - Order',
        },
        [{ documentId: '123' }],
      );
      expect(isPrivate).toEqual(false);
    });

    it('should return false for a non-court-issued order document', () => {
      const isPrivate = isPrivateDocument(
        {
          documentType: 'Petition',
        },
        [],
      );
      expect(isPrivate).toEqual(false);
    });
  });
});
