const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { MOCK_DOCUMENTS } = require('../../shared/src/test/mockDocuments');
const { mutateRecord, up } = require('./00002-qc-complete-for-trial');

describe('qc complete for trial migration', () => {
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

  it('should add qcCompleteForTrial default if item is a case and qcCompleteForTrial is not already defined', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...MOCK_CASE,
          },
          {
            ...MOCK_CASE,
            qcCompleteForTrial: { abc: '123' },
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
      qcCompleteForTrial: {},
    });
  });

  describe('mutateRecord', () => {
    it('should return undefined if item is not a case record', () => {
      const result = mutateRecord({ something: true });
      expect(result).toBeUndefined();
    });

    it('should return undefined if item is a case but qcCompleteForTrial is defined', () => {
      const result = mutateRecord({
        ...MOCK_CASE,
        qcCompleteForTrial: { abc: '123' },
      });
      expect(result).toBeUndefined();
    });

    it('should return the case with qcCompleteForTrial added if item is a case and qcCompleteForTrial is not already defined', () => {
      const result = mutateRecord({
        ...MOCK_CASE,
      });
      expect(result).toMatchObject({
        qcCompleteForTrial: {},
      });
    });
  });
});
