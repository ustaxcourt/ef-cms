const { PublicCase } = require('./PublicCase');

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
});
