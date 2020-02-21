const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { MOCK_DOCUMENTS } = require('../../shared/src/test/mockDocuments');
const { mutateRecord, up } = require('./00007-previous-document');

describe('previous document string to object migration', () => {
  let applicationContext;
  let scanStub;
  let putStub;

  beforeEach(() => {
    MOCK_CASE.pk = '3a45813b-8b4d-4a2e-bfc5-729e85c2332c';
    MOCK_CASE.sk = '3a45813b-8b4d-4a2e-bfc5-729e85c2332c';

    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [MOCK_DOCUMENTS[0]],
      }),
    });

    putStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
        scan: scanStub,
      }),
    };
  });

  it('should not update the item when it is not a case', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [MOCK_DOCUMENTS[0]],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(0);
  });

  it('should throw an error when the case is not valid', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...MOCK_CASE,
            docketRecord: [],
          },
        ],
      }),
    });

    await expect(
      up(applicationContext.getDocumentClient(), '', forAllRecords),
    ).rejects.toThrow();

    expect(putStub.mock.calls.length).toBe(0);
  });

  it('should update each document with a previousDocument, converting it from a string to an object', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...MOCK_CASE,
            documents: [
              {
                documentId: 'cb028c6a-e408-471b-a9f5-6808ed61732f',
                documentType: 'Petition',
                userId: 'ff90899b-4635-4567-bd56-46428f13a08e',
              },
              {
                documentId: 'cb028c6a-e408-471b-a9f5-6808ed61732f',
                documentType: 'Amended',
                previousDocument: 'Petition',
                userId: 'ff90899b-4635-4567-bd56-46428f13a08e',
              },
            ],
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toEqual(1);
    expect(putStub.mock.calls[0][0].Item.documents[1]).toMatchObject({
      previousDocument: {
        documentTitle: 'Petition',
        documentType: 'Petition',
      },
    });
  });

  describe('mutateRecord', () => {
    it('should return undefined if item is not a case record', () => {
      const result = mutateRecord({ something: true });
      expect(result).toBeFalsy();
    });

    it('should return the case with each document with a previousDocument converted from a string to an object', () => {
      const result = mutateRecord({
        ...MOCK_CASE,
        documents: [
          {
            documentId: 'cb028c6a-e408-471b-a9f5-6808ed61732f',
            documentType: 'Petition',
            userId: 'ff90899b-4635-4567-bd56-46428f13a08e',
          },
          {
            documentId: 'cb028c6a-e408-471b-a9f5-6808ed61732f',
            documentType: 'Amended',
            previousDocument: 'Petition',
            userId: 'ff90899b-4635-4567-bd56-46428f13a08e',
          },
        ],
      });
      expect(result.documents[1]).toMatchObject({
        previousDocument: {
          documentTitle: 'Petition',
          documentType: 'Petition',
        },
      });
    });
  });
});
