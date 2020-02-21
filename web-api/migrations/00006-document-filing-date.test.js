const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { MOCK_DOCUMENTS } = require('../../shared/src/test/mockDocuments');
const { mutateRecord, up } = require('./00006-document-filing-date');

describe('document filing date migration', () => {
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

  it("should update each document with the correspondending docket entry's filing date", async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...MOCK_CASE,
            docketRecord: [
              {
                description: 'Petition',
                documentId: 'cb028c6a-e408-471b-a9f5-6808ed61732f',
                eventCode: 'P',
                filingDate: '2019-03-01T21:40:46.415Z',
                index: 0,
              },
            ],
            documents: [
              {
                documentId: 'cb028c6a-e408-471b-a9f5-6808ed61732f',
                documentType: 'Petition',
                userId: 'ff90899b-4635-4567-bd56-46428f13a08e',
              },
            ],
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls[0][0].Item.documents[0]).toMatchObject({
      filingDate: '2019-03-01T21:40:46.415Z',
    });
  });

  describe('mutateRecord', () => {
    it('should return undefined if item is not a case record', () => {
      const result = mutateRecord({ something: true });
      expect(result).toBeFalsy();
    });

    it("should return the case with each document updated with the correspondending docket entry's filing date", () => {
      const result = mutateRecord({
        ...MOCK_CASE,
        docketRecord: [
          {
            description: 'Petition',
            documentId: 'cb028c6a-e408-471b-a9f5-6808ed61732f',
            eventCode: 'P',
            filingDate: '2019-03-01T21:40:46.415Z',
            index: 0,
          },
          {
            description: 'Request for Place of Trial',
            eventCode: 'RQT',
            filingDate: '2019-03-01T21:40:46.415Z',
            index: 1,
          },
          {
            description: 'Answer',
            documentId: '62a546eb-9bf2-423e-ba33-f21666756319',
            eventCode: 'A',
            filingDate: '2019-05-01T21:40:46.415Z',
            index: 2,
          },
        ],
        documents: [
          {
            documentId: 'cb028c6a-e408-471b-a9f5-6808ed61732f',
            documentType: 'Petition',
            userId: 'ff90899b-4635-4567-bd56-46428f13a08e',
          },
          {
            documentId: '62a546eb-9bf2-423e-ba33-f21666756319',
            documentType: 'Answer',
            userId: '4ff0f841-a276-4505-9199-579c9abe92d5',
          },
        ],
      });
      expect(result.documents[0]).toMatchObject({
        filingDate: '2019-03-01T21:40:46.415Z',
      });
      expect(result.documents[1]).toMatchObject({
        filingDate: '2019-05-01T21:40:46.415Z',
      });
    });
  });
});
