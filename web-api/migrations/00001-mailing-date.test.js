const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { MOCK_DOCUMENTS } = require('../../shared/src/test/mockDocuments');
const { mutateRecord, up } = require('./00001-mailing-date');

describe('mailing date migration', () => {
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

  it('should add mailingDate default if case has isPaper = true', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...MOCK_CASE,
            isPaper: true,
          },
          {
            ...MOCK_CASE,
            isPaper: false,
          },
          {
            ...MOCK_CASE,
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toEqual(1);
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      isPaper: true,
      mailingDate: expect.anything(),
    });
  });

  describe('mutateRecord', () => {
    it('should return undefined if item is not a case record', () => {
      const result = mutateRecord({ something: true });
      expect(result).toBeUndefined();
    });

    it('should return undefined if item is a case but isPaper = false', () => {
      const result = mutateRecord({ ...MOCK_CASE, isPaper: false });
      expect(result).toBeUndefined();
    });

    it('should return undefined if item is a case and isPaper = true and mailingDate is already defined', () => {
      const result = mutateRecord({
        ...MOCK_CASE,
        isPaper: true,
        mailingDate: '01-01-01',
      });
      expect(result).toBeUndefined();
    });

    it('should return the case with a mailingDate added if item is a case and isPaper = true and mailingDate is not already defined', () => {
      const result = mutateRecord({
        ...MOCK_CASE,
        isPaper: true,
      });
      expect(result).toMatchObject({
        isPaper: true,
        mailingDate: '01/01/2010',
      });
    });
  });
});
