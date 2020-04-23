const {
  isDraftDocument,
  isPrivateDocument,
  PublicCase,
} = require('./PublicCase');

describe('PublicCase', () => {
  describe('validation', () => {
    it('should validate when all information is provided and case is not sealed', () => {
      const entity = new PublicCase(
        {
          caseCaption: 'testing',
          caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          contactPrimary: {},
          contactSecondary: {},
          createdAt: '2020-01-02T03:30:45.007Z',
          docketNumber: 'testing',
          docketNumberSuffix: 'testing',
          docketRecord: [{}],
          documents: [{}],
          receivedAt: '2020-01-05T03:30:45.007Z',
        },
        {},
      );
      expect(entity.getFormattedValidationErrors()).toBe(null);
    });
    it('should not validate when case is sealed but sensitive information is provided to constructor', () => {
      const entity = new PublicCase(
        {
          caseCaption: 'testing',
          caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          contactPrimary: {},
          contactSecondary: {},
          createdAt: '2020-01-02T03:30:45.007Z',
          docketNumber: '111-12',
          docketNumberSuffix: 'S',
          docketRecord: [{ any: 'thing' }],
          documents: [{ any: 'thing' }],
          receivedAt: '2020-01-05T03:30:45.007Z',
          sealedDate: '2020-01-05T03:30:45.007Z',
        },
        {},
      );
      expect(entity.getFormattedValidationErrors()).toMatchObject({
        // caseId is permitted
        // docketNumber is permitted
        // docketNumberSuffix is permitted
        // isSealed is permitted
        caseCaption: expect.anything(),
        contactPrimary: expect.anything(),
        contactSecondary: expect.anything(),
        createdAt: expect.anything(),
        docketRecord: expect.anything(),
        receivedAt: expect.anything(),
      });
    });
  });

  it('should only have expected fields', () => {
    const entity = new PublicCase(
      {
        caseCaption: 'testing',
        caseId: 'testing',
        contactPrimary: {},
        contactSecondary: {},
        createdAt: 'testing',
        docketNumber: 'testing',
        docketNumberSuffix: 'testing',
        docketRecord: [],
        documents: [],
        receivedAt: 'testing',
      },
      {},
    );

    expect(entity.toRawObject()).toEqual({
      caseCaption: 'testing',
      caseId: 'testing',
      contactPrimary: {
        entityName: 'PublicContact',
        name: undefined,
        state: undefined,
      },
      contactSecondary: {
        entityName: 'PublicContact',
        name: undefined,
        state: undefined,
      },
      createdAt: 'testing',
      docketNumber: 'testing',
      docketNumberSuffix: 'testing',
      docketRecord: [],
      documents: [],
      entityName: 'PublicCase',
      isSealed: false,
      receivedAt: 'testing',
    });
  });

  it('should only have expected fields if documents if null', () => {
    const entity = new PublicCase(
      {
        caseCaption: 'testing',
        caseId: 'testing',
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
      contactPrimary: undefined,
      contactSecondary: undefined,
      createdAt: 'testing',
      docketNumber: 'testing',
      docketNumberSuffix: 'testing',
      docketRecord: [],
      documents: [],
      entityName: 'PublicCase',
      isSealed: false,
      receivedAt: 'testing',
    });
  });

  it('should filter draft documents out of the documents array', () => {
    const entity = new PublicCase(
      {
        caseCaption: 'testing',
        caseId: 'testing',
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
          { documentId: '987', eventCode: 'TRAN' },
        ],
        receivedAt: 'testing',
      },
      {},
    );

    expect(entity.toRawObject()).toEqual({
      caseCaption: 'testing',
      caseId: 'testing',
      contactPrimary: undefined,
      contactSecondary: undefined,
      createdAt: 'testing',
      docketNumber: 'testing',
      docketNumberSuffix: 'testing',
      docketRecord: [
        {
          description: undefined,
          documentId: '123',
          entityName: 'PublicDocketRecordEntry',
          filedBy: undefined,
          filingDate: undefined,
          index: undefined,
        },
      ],
      documents: [
        {
          additionalInfo: undefined,
          additionalInfo2: undefined,
          caseId: undefined,
          createdAt: undefined,
          documentId: '123',
          documentTitle: undefined,
          documentType: 'OAJ - Order that case is assigned',
          entityName: 'PublicDocument',
          eventCode: undefined,
          filedBy: undefined,
          isPaper: undefined,
          processingStatus: undefined,
          receivedAt: undefined,
          servedAt: undefined,
          servedParties: undefined,
          status: undefined,
        },
        {
          additionalInfo: undefined,
          additionalInfo2: undefined,
          caseId: undefined,
          createdAt: undefined,
          documentId: '345',
          documentTitle: undefined,
          documentType: 'Petition',
          entityName: 'PublicDocument',
          eventCode: undefined,
          filedBy: undefined,
          isPaper: undefined,
          processingStatus: undefined,
          receivedAt: undefined,
          servedAt: undefined,
          servedParties: undefined,
          status: undefined,
        },
        {
          additionalInfo: undefined,
          additionalInfo2: undefined,
          caseId: undefined,
          createdAt: undefined,
          documentId: '987',
          documentTitle: undefined,
          documentType: undefined,
          entityName: 'PublicDocument',
          eventCode: 'TRAN',
          filedBy: undefined,
          isPaper: undefined,
          processingStatus: undefined,
          receivedAt: undefined,
          servedAt: undefined,
          servedParties: undefined,
          status: undefined,
        },
      ],
      entityName: 'PublicCase',
      isSealed: false,
      receivedAt: 'testing',
    });
  });

  describe('isDraftDocument', () => {
    it('should return true for a stipulated decision document that is not on the docket record', () => {
      const isPrivate = isDraftDocument(
        {
          documentType: 'Stipulated Decision',
        },
        [],
      );
      expect(isPrivate).toEqual(true);
    });

    it('should return true for an order document that is not on the docket record', () => {
      const isPrivate = isDraftDocument(
        {
          documentType: 'Order',
        },
        [],
      );
      expect(isPrivate).toEqual(true);
    });

    it('should return true for a court-issued order document that is not on the docket record', () => {
      const isPrivate = isDraftDocument(
        {
          documentType: 'O - Order',
        },
        [],
      );
      expect(isPrivate).toEqual(true);
    });

    it('should return false for a court-issued order document that is on the docket record', () => {
      const isPrivate = isDraftDocument(
        {
          documentId: '123',
          documentType: 'O - Order',
        },
        [{ documentId: '123' }],
      );
      expect(isPrivate).toEqual(false);
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

    it('should return true for a transcript document', () => {
      const isPrivate = isPrivateDocument(
        {
          documentId: 'db3ed57e-cfca-4228-ad5c-547484b1a801',
          eventCode: 'TRAN',
        },
        [{ documentId: 'db3ed57e-cfca-4228-ad5c-547484b1a801' }],
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

    it('should return false for a court-issued order document that is on the docket record', () => {
      const isPrivate = isPrivateDocument(
        {
          documentId: '123',
          documentType: 'O - Order',
        },
        [{ documentId: '123' }],
      );
      expect(isPrivate).toEqual(false);
    });

    it('should return true for an external document', () => {
      const isPrivate = isPrivateDocument(
        {
          documentType: 'Petition',
        },
        [],
      );
      expect(isPrivate).toEqual(true);
    });
  });
});
