const { forAllRecords } = require('./utilities');
const { mutateRecord, up } = require('./00008-judge-thornton');

describe('judge thorton -> thornton migration', () => {
  let applicationContext;
  let scanStub;
  let putStub;

  beforeEach(() => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [],
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

  it('should not update the item if its pk does not match the expected pk', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [{ pk: 'case-ba364f4f-8055-4da3-89b6-ef40a543dc01' }],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(0);
  });

  it('should update each item containing thorton to thornton', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            pk: 'thortonsChambers|user',
          },
          {
            pk: 'section-thortonsChambers',
          },
          {
            pk: 'user-43e449be-8d37-4677-b04a-fe99d16a5d69',
            section: 'thortonsChambers',
          },
          {
            judge: {
              section: 'thortonsChambers',
            },
            pk: 'case-a6a6f516-085a-4052-893a-23e75c232b68',
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toEqual(4);
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      pk: 'thorntonsChambers|user',
    });
    expect(putStub.mock.calls[1][0].Item).toMatchObject({
      pk: 'section-thorntonsChambers',
    });
    expect(putStub.mock.calls[2][0].Item).toMatchObject({
      section: 'thorntonsChambers',
    });
    expect(putStub.mock.calls[3][0].Item).toMatchObject({
      judge: {
        section: 'thorntonsChambers',
      },
    });
  });

  describe('mutateRecord', () => {
    it('should return undefined if item should not be updated', () => {
      const result = mutateRecord({ pk: 'armensChambers|user' });
      expect(result).toBeFalsy();
    });

    it('should return the item with an updated spelling of thornton if the pk matches thortonsChambers|user', () => {
      const result = mutateRecord({
        pk: 'thortonsChambers|user',
      });
      expect(result).toMatchObject({
        pk: 'thorntonsChambers|user',
      });
    });

    it('should return the item with updated spellings of thornton if the pk matches section-thortonsChambers, the section matches thortonsChambers, and the judge.section matches thortonsChambers', () => {
      const result = mutateRecord({
        judge: { section: 'thortonsChambers' },
        pk: 'section-thortonsChambers',
        section: 'thortonsChambers',
      });
      expect(result).toMatchObject({
        judge: { section: 'thorntonsChambers' },
        pk: 'section-thorntonsChambers',
        section: 'thorntonsChambers',
      });
    });
  });
});
