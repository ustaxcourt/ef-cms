const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { MOCK_DOCUMENTS } = require('../../shared/src/test/mockDocuments');
const { mutateRecord, up } = require('./00003-event-code-docket-entry');

describe('docket entry event code migration', () => {
  let applicationContext;
  let scanStub;
  let putStub;

  beforeEach(() => {
    MOCK_CASE.pk = '3a45813b-8b4d-4a2e-bfc5-729e85c2332c';
    MOCK_CASE.sk = '3a45813b-8b4d-4a2e-bfc5-729e85c2332c';

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

  it('should add default eventCode, description, and index to docket entries if not defined', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...MOCK_CASE,
            docketRecord: [{ filingDate: '2019-03-01T21:40:46.415Z' }],
          },
          {
            ...MOCK_CASE,
          },
          {
            notACase: true,
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toEqual(1);
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      docketRecord: [
        {
          description: 'MGRTED',
          eventCode: 'MGRTED',
          index: 100,
        },
      ],
    });
  });

  describe('mutateRecord', () => {
    it('should return undefined if item is not a case record', () => {
      const result = mutateRecord({ something: true });
      expect(result).toBeFalsy();
    });

    it('should return undefined if item is a case and all docket record entries have eventCode, description, and index', () => {
      const result = mutateRecord({
        ...MOCK_CASE,
      });
      expect(result).toBeFalsy();
    });

    it('should return the case with default added for eventCode, description, and index if they are not present in docket record entry', () => {
      const result = mutateRecord({
        ...MOCK_CASE,
        docketRecord: [{ filingDate: '2019-03-01T21:40:46.415Z' }],
      });
      expect(result).toMatchObject({
        docketRecord: [
          {
            description: 'MGRTED',
            eventCode: 'MGRTED',
            index: 100,
          },
        ],
      });
    });
  });
});
