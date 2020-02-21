const {
  forAllRecords,
  isCaseRecord,
  isTrialSessionRecord,
  upGenerator,
} = require('./utilities');
const { Case } = require('../../shared/src/business/entities/cases/Case');

describe('utilities', () => {
  describe('isCaseRecord', () => {
    it('should return true if the item is a case record', () => {
      const result = isCaseRecord({
        caseType: Case.CASE_TYPES_MAP.cdp,
      });

      expect(result).toEqual(true);
    });

    it('should return false if the item is not a case record', () => {
      const result = isCaseRecord({
        contactPrimary: { name: 'Guy Fieri' },
      });

      expect(result).toEqual(false);
    });
  });

  describe('isTrialSessionRecord', () => {
    it('should return true if the item is a trial session record', () => {
      const result = isTrialSessionRecord({
        caseOrder: [],
        maxCases: 100,
        trialSessionId: 'trial-session-id-123',
      });

      expect(result).toEqual(true);
    });

    it('should return false if the item is not a trial session record', () => {
      const result = isTrialSessionRecord({
        caseType: Case.CASE_TYPES_MAP.cdp,
      });

      expect(result).toEqual(false);
    });
  });

  describe('forAllRecords', () => {
    let documentClient;
    let scanStub;
    let scannedItems;

    beforeEach(() => {
      scannedItems = [
        {
          caseId: 'case-123',
          caseType: Case.CASE_TYPES_MAP.cdp,
        },
        {
          caseId: 'case-321',
          caseType: Case.CASE_TYPES_MAP.deficiency,
        },
      ];

      scanStub = jest.fn().mockResolvedValue({
        Items: scannedItems,
        LastEvaluatedKey: null,
      });

      documentClient = {
        scan: () => ({ promise: scanStub }),
      };
    });

    it('executes a callback for each item return from a scan', async () => {
      let cbStub = jest.fn();

      await forAllRecords(documentClient, 'efcms-local', cbStub);

      expect(scanStub).toHaveBeenCalled();
      expect(cbStub.mock.calls.length).toBe(2);
    });
  });

  describe('upGenerator', () => {
    let documentClient;
    let scanStub;
    let putStub;
    let scannedItems;

    beforeEach(() => {
      putStub = jest.fn();

      scannedItems = [
        {
          caseId: 'case-123',
          caseType: Case.CASE_TYPES_MAP.cdp,
        },
        {
          caseId: 'case-321',
          caseType: Case.CASE_TYPES_MAP.deficiency,
        },
      ];

      scanStub = jest.fn().mockResolvedValue({
        Items: scannedItems,
        LastEvaluatedKey: null,
      });

      documentClient = {
        put: () => ({ promise: putStub }),
        scan: () => ({ promise: scanStub }),
      };
    });

    it('does not run migration if no records were found with the mutator', async () => {
      let mutateFunctionStub = jest.fn().mockReturnValue(false);

      await upGenerator(mutateFunctionStub)(
        documentClient,
        'efcms-local',
        forAllRecords,
      );

      expect(scanStub).toHaveBeenCalled();
      expect(putStub).not.toHaveBeenCalled();
    });

    it('run migration if records were found with the mutator', async () => {
      let mutateFunctionStub = jest.fn().mockReturnValue({
        caseId: 'case-id-123',
        pk: '123',
        sk: '123',
      });

      await upGenerator(mutateFunctionStub)(
        documentClient,
        'efcms-local',
        forAllRecords,
      );

      expect(scanStub).toHaveBeenCalled();
      expect(putStub).toHaveBeenCalled();
      expect(putStub.mock.calls.length).toBe(2);
    });

    it('throw an error and do not run migration if record returned from the mutator does not have dynamo keys', async () => {
      let mutateFunctionStub = jest.fn().mockReturnValue({
        caseId: 'case-id-123',
      });

      await expect(
        upGenerator(mutateFunctionStub)(
          documentClient,
          'efcms-local',
          forAllRecords,
        ),
      ).rejects.toThrow('data must contain pk, sk, or gsi1pk');

      expect(scanStub).toHaveBeenCalled();
      expect(putStub).not.toHaveBeenCalled();
    });
  });
});
