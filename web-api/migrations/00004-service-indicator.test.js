const {
  SERVICE_INDICATOR_TYPES,
} = require('../../shared/src/business/entities/cases/CaseConstants');
const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { MOCK_DOCUMENTS } = require('../../shared/src/test/mockDocuments');
const { mutateRecord, up } = require('./00004-service-indicator');

describe('service indicator migration', () => {
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

  it('should not throw an error when a case does not have any practitioners', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [MOCK_CASE],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(0);
  });

  it("should update each practitioner's service indicator to electronic if one is not already specified", async () => {
    const mockPractitioners = [
      { userId: '6f5b27d4-386c-422a-8fcf-7397beff15a7' },
      {
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        userId: '184b3223-f5c0-4a89-b86e-02c0ceb9f173',
      },
    ];
    const expectedPractitioners = [
      {
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        userId: '6f5b27d4-386c-422a-8fcf-7397beff15a7',
      },
      {
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        userId: '184b3223-f5c0-4a89-b86e-02c0ceb9f173',
      },
    ];
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...MOCK_CASE,
            practitioners: mockPractitioners,
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls[0][0].Item.practitioners).toMatchObject(
      expectedPractitioners,
    );
  });

  describe('mutateRecord', () => {
    it('should return undefined if item is not a case record', () => {
      const result = mutateRecord({ something: true });
      expect(result).toBeFalsy();
    });

    it('should return undefined if item.practitioners is undefined', () => {
      const result = mutateRecord({
        ...MOCK_CASE,
        practitioners: undefined,
      });
      expect(result).toBeFalsy();
    });

    it('should return the case with serviceIndicator defaulted for each practitioner that does not already have one set', () => {
      const result = mutateRecord({
        ...MOCK_CASE,
        practitioners: [
          {
            userId: 'e27a4e63-c754-4b0e-8462-60ac03beaa94',
          },
          {
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            userId: '69900e8a-862c-4c60-9b21-d62a33c0efef',
          },
        ],
      });
      expect(result).toMatchObject({
        practitioners: [
          {
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
            userId: 'e27a4e63-c754-4b0e-8462-60ac03beaa94',
          },
          {
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            userId: '69900e8a-862c-4c60-9b21-d62a33c0efef',
          },
        ],
      });
    });
  });
});
