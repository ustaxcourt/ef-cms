const {
  CASE_TYPES_MAP,
} = require('../../shared/src/business/entities/EntityConstants');
const {
  forAllRecords,
  isCaseMessageRecord,
  isCaseRecord,
  isNewUserCaseMappingRecord,
  isTrialSessionRecord,
  isUserCaseMappingRecord,
  upGenerator,
} = require('./utilities');

describe('utilities', () => {
  describe('isCaseMessageRecord', () => {
    it('should return true if the item is a case message record', () => {
      const result = isCaseMessageRecord({
        pk: 'case|',
        sk: 'message|',
      });

      expect(result).toEqual(true);
    });

    it('should return false if the item is not a case message record', () => {
      const result = isCaseMessageRecord({
        pk: 'case|',
        sk: 'case|',
      });

      expect(result).toEqual(false);
    });
  });

  describe('isCaseRecord', () => {
    it('should return true if the item is a case record', () => {
      const result = isCaseRecord({
        caseType: CASE_TYPES_MAP.cdp,
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
        caseType: CASE_TYPES_MAP.cdp,
      });

      expect(result).toEqual(false);
    });
  });

  describe('isUserCaseMappingRecord', () => {
    it('should return true if the item is a user case mapping record', () => {
      const result = isUserCaseMappingRecord({
        pk: 'user|',
        sk: 'case|',
      });

      expect(result).toEqual(true);
    });

    it('should return false if the item is not a user case mapping record (pk,sk = case|)', () => {
      const result = isUserCaseMappingRecord({
        pk: 'case|',
        sk: 'case|',
      });

      expect(result).toEqual(false);
    });

    it('should return false if the item is not a user case mapping record (pk,sk = user|)', () => {
      const result = isUserCaseMappingRecord({
        pk: 'user|',
        sk: 'user|',
      });
      expect(result).toEqual(false);
    });
  });

  describe('isNewUserCaseMappingRecord', () => {
    it('should return true if the record is a new user-case mapping record', () => {
      const result = isNewUserCaseMappingRecord({
        gsi1pk: 'user-case|',
      });

      expect(result).toEqual(true);
    });

    it('should return false if the record is not a new user-case mapping record', () => {
      const result = isNewUserCaseMappingRecord({
        gsi1pk: 'case|',
      });

      expect(result).toEqual(false);
    });

    it('should return false if the record is not a new user-case mapping record (no gsi1pk)', () => {
      const result = isNewUserCaseMappingRecord({});

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
          caseType: CASE_TYPES_MAP.cdp,
        },
        {
          caseId: 'case-321',
          caseType: CASE_TYPES_MAP.deficiency,
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
          caseType: CASE_TYPES_MAP.cdp,
        },
        {
          caseId: 'case-321',
          caseType: CASE_TYPES_MAP.deficiency,
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
