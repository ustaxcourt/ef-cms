const { forAllRecords } = require('./utilities');
const { mutateRecord, up } = require('./00009-judge-user-notes');

describe('judge -> user notes migration', () => {
  let applicationContext;
  let scanStub;
  let putStub;

  beforeEach(() => {
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

  it('should not update the item when it is not a judges case note', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            pk: 'other-case-note|9fef42ca-48b9-4061-88c0-9f4ffdd73f61',
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(0);
  });

  it('should update the item when it is a judges case note', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            pk: 'judges-case-note|9fef42ca-48b9-4061-88c0-9f4ffdd73f61',
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(1);
  });

  describe('mutateRecord', () => {
    it('should return undefined if item.pk does not start with judges-case-note', () => {
      const result = mutateRecord({ pk: 'armensChambers|user' });
      expect(result).toBeFalsy();
    });

    it('should return the item with an updated pk if it starts with judges-case-note', () => {
      const result = mutateRecord({
        pk: 'judges-case-note-c6a28d79-38e4-4d0e-96fc-877181234e80',
      });
      expect(result).toMatchObject({
        pk: 'user-case-note-c6a28d79-38e4-4d0e-96fc-877181234e80',
      });
    });
  });
});
