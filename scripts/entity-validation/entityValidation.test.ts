import fs from 'fs/promises';
import { entityValidationFunctions } from './entityValidationHelper';
import { getSSMItem, putSSMItem } from '../../shared/admin-tools/aws/ssmHelper';
import {
  detectEntityValidationChange,
  getCurrentFingerprintFromSSM,
  getEntityIdentifiers,
  resolveChangedEntities,
  validateEntitiesWithNewRules,
  runEntityValidation,
  main,
} from './entityValidation';

jest.mock('fs/promises', () => ({
  readdir: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../shared/admin-tools/aws/ssmHelper', () => ({
  getSSMItem: jest.fn(),
  putSSMItem: jest.fn(),
}));

jest.mock('./entityValidationHelper', () => ({
  entityValidationFunctions: {
    Case: jest.fn().mockResolvedValue([]),
    Message: jest.fn().mockResolvedValue([]),
    PractitionerDocument: jest.fn().mockResolvedValue([]),
    TrialSession: jest.fn().mockResolvedValue([]),
    TrialSessionWorkingCopy: jest.fn().mockResolvedValue([]),
    User: jest.fn().mockResolvedValue([]),
    WorkItem: jest.fn().mockResolvedValue([]),
  },
}));

jest.mock('./createValidationIdentifier', () => ({
  createValidationIdentifier: jest.fn().mockReturnValue('mock-hash'),
}));

describe('entityValidation', () => {
  // Must be at describe level to run synchronously before auto-invoked main() resolves
  jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

  describe('detectEntityValidationChange', () => {
    it('returns an empty array when the new fingerprint is empty', () => {
      const result = detectEntityValidationChange(
        { 'Entity.VALIDATION_RULES': 'hash' },
        {},
      );
      expect(result).toEqual([]);
    });

    it('returns an empty array when both fingerprints are identical', () => {
      const fp = { 'Entity.VALIDATION_RULES': 'hash' };
      expect(detectEntityValidationChange(fp, fp)).toEqual([]);
    });

    it('returns entities whose hash has changed', () => {
      const result = detectEntityValidationChange(
        { 'Entity.VALIDATION_RULES': 'old-hash' },
        { 'Entity.VALIDATION_RULES': 'new-hash' },
      );
      expect(result).toEqual(['Entity.VALIDATION_RULES']);
    });

    it('returns entities present in the new fingerprint but not the current one', () => {
      const result = detectEntityValidationChange(
        {},
        { 'NewEntity.VALIDATION_RULES': 'hash' },
      );
      expect(result).toEqual(['NewEntity.VALIDATION_RULES']);
    });

    it('does not return entities removed from the new fingerprint', () => {
      const result = detectEntityValidationChange(
        { 'RemovedEntity.VALIDATION_RULES': 'hash' },
        { 'NewEntity.VALIDATION_RULES': 'hash' },
      );
      expect(result).not.toContain('RemovedEntity.VALIDATION_RULES');
      expect(result).toContain('NewEntity.VALIDATION_RULES');
    });
  });

  describe('resolveChangedEntities', () => {
    it('returns all ENTITIES_TO_CHECK when entityValidationRequired is "true"', () => {
      const result = resolveChangedEntities('{}', '{}', 'true');
      expect(result).toContain('Case.ts');
      expect(result).toContain('Message.ts');
      expect(result).toContain('User.ts');
      expect(result).toHaveLength(11);
    });

    it('detects changed entities when entityValidationRequired is not set', () => {
      const curr = JSON.stringify({ 'Case.VALIDATION_RULES': 'old-hash' });
      const next = JSON.stringify({ 'Case.VALIDATION_RULES': 'new-hash' });
      expect(resolveChangedEntities(curr, next, undefined)).toEqual([
        'Case.VALIDATION_RULES',
      ]);
    });

    it('treats undefined currFingerprint as an empty object', () => {
      const next = JSON.stringify({ 'Case.VALIDATION_RULES': 'hash' });
      expect(resolveChangedEntities(undefined, next, undefined)).toEqual([
        'Case.VALIDATION_RULES',
      ]);
    });

    it('returns an empty array when fingerprints are unchanged', () => {
      const fp = JSON.stringify({ 'Case.VALIDATION_RULES': 'hash' });
      expect(resolveChangedEntities(fp, fp, undefined)).toEqual([]);
    });
  });

  describe('validateEntitiesWithNewRules', () => {
    it('returns an empty array when changedEntities is empty', async () => {
      expect(await validateEntitiesWithNewRules([])).toEqual([]);
    });

    it('calls entityValidationFunctions for a non-case entity', async () => {
      await validateEntitiesWithNewRules(['Message.VALIDATION_RULES']);
      expect(entityValidationFunctions.Message).toHaveBeenCalledTimes(1);
    });

    it('calls Case validation when a Case-related entity changes', async () => {
      await validateEntitiesWithNewRules(['Case.VALIDATION_RULES']);
      expect(entityValidationFunctions.Case).toHaveBeenCalledTimes(1);
    });

    it('calls case validation with an invalid case', async () => {
      (entityValidationFunctions.Case as jest.Mock).mockResolvedValueOnce([
        'case error',
      ]);
      const result = await validateEntitiesWithNewRules([
        'Case.VALIDATION_RULES',
      ]);
      expect(result).toEqual(['case error']);
    });

    it('calls Case validation when a DocketEntry-related entity changes', async () => {
      await validateEntitiesWithNewRules(['DocketEntry.VALIDATION_RULES']);
      expect(entityValidationFunctions.Case).toHaveBeenCalledTimes(1);
    });

    it('does not directly call entityValidationFunctions for a case-type entity', async () => {
      await validateEntitiesWithNewRules(['IrsPractitioner.VALIDATION_RULES']);
      expect(entityValidationFunctions.Case).toHaveBeenCalledTimes(1);
      // IrsPractitioner is in ENTITIES_OF_CASE, so only Case is called — not IrsPractitioner
      expect(
        entityValidationFunctions[
          'IrsPractitioner' as keyof typeof entityValidationFunctions
        ],
      ).toBeUndefined();
    });

    it('deduplicates entities sharing the same base name', async () => {
      await validateEntitiesWithNewRules(['Message.RULE_1', 'Message.RULE_2']);
      expect(entityValidationFunctions.Message).toHaveBeenCalledTimes(1);
    });

    it('collects and returns validation errors from multiple entities', async () => {
      (entityValidationFunctions.Message as jest.Mock).mockResolvedValueOnce([
        'error1',
        'error2',
      ]);
      (entityValidationFunctions.User as jest.Mock).mockResolvedValueOnce([
        'error3',
      ]);
      const result = await validateEntitiesWithNewRules([
        'Message.VALIDATION_RULES',
        'User.VALIDATION_RULES',
      ]);
      expect(result).toEqual(['error1', 'error2', 'error3']);
    });

    it('throws when entityValidationFunctions throws for a non-case entity', async () => {
      (entityValidationFunctions.WorkItem as jest.Mock).mockRejectedValueOnce(
        new Error('DB error'),
      );
      await expect(
        validateEntitiesWithNewRules(['WorkItem.VALIDATION_RULES']),
      ).rejects.toThrow('Error validating entity WorkItem: Error: DB error');
    });

    it('throws when Case validation throws', async () => {
      (entityValidationFunctions.Case as jest.Mock).mockRejectedValueOnce(
        new Error('Case DB error'),
      );
      await expect(
        validateEntitiesWithNewRules(['Case.VALIDATION_RULES']),
      ).rejects.toThrow('Error validating entity Case: Error: Case DB error');
    });
  });

  describe('getCurrentFingerprintFromSSM', () => {
    it('returns the fingerprint string from SSM', async () => {
      (getSSMItem as jest.Mock).mockResolvedValueOnce(
        '{"Entity.VALIDATION_RULES":"hash"}',
      );
      const result = await getCurrentFingerprintFromSSM();
      expect(result).toBe('{"Entity.VALIDATION_RULES":"hash"}');
    });

    it('returns undefined when getSSMItem throws', async () => {
      (getSSMItem as jest.Mock).mockRejectedValueOnce(
        new Error('SSM unavailable'),
      );
      const result = await getCurrentFingerprintFromSSM();
      expect(result).toBeUndefined();
    });
  });

  describe('getEntityIdentifiers', () => {
    it('returns an empty object JSON when the directory is empty', async () => {
      (fs.readdir as jest.Mock).mockResolvedValueOnce([]);
      const result = await getEntityIdentifiers();
      expect(result).toBe(JSON.stringify({}, null, 2));
    });

    it('filters out non-.ts files', async () => {
      (fs.readdir as jest.Mock).mockResolvedValueOnce([
        'Case.js',
        'Message.js',
      ]);
      const result = await getEntityIdentifiers();
      expect(JSON.parse(result)).toEqual({});
    });

    it('filters out .test.ts files', async () => {
      (fs.readdir as jest.Mock).mockResolvedValueOnce(['Case.test.ts']);
      const result = await getEntityIdentifiers();
      expect(JSON.parse(result)).toEqual({});
    });

    it('filters out .ts files not in ENTITIES_TO_CHECK', async () => {
      (fs.readdir as jest.Mock).mockResolvedValueOnce(['SomeOtherEntity.ts']);
      const result = await getEntityIdentifiers();
      expect(JSON.parse(result)).toEqual({});
    });

    it('returns a JSON string with validation identifiers for valid .ts files', async () => {
      (fs.readdir as jest.Mock).mockResolvedValueOnce([
        'cases/Case.ts',
        'Message.ts',
      ]);
      const result = await getEntityIdentifiers();
      const parsedResult = JSON.parse(result);
      //   expect(parsedResult).toHaveProperty('Case.VALIDATION_RULES');
      expect(parsedResult).toEqual(
        expect.objectContaining({
          'Case.VALIDATION_RULES': 'mock-hash',
          'Message.VALIDATION_RULES': 'mock-hash',
        }),
      );
      //   expect(parsedResult).toHaveProperty('Message.VALIDATION_RULES');
    });
  });

  describe('runEntityValidation', () => {
    it('returns 0 when fingerprints are unchanged (no entities to validate)', async () => {
      // getCurrentFingerprintFromSSM internally calls getSSMItem(SSM_KEY)
      (getSSMItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({ 'Case.VALIDATION_RULES': 'same-hash' }),
      );
      // getEntityIdentifiers internally calls fs.readdir — return empty so newFingerprint = {}
      (fs.readdir as jest.Mock).mockResolvedValueOnce([]);
      // entityValidationRequired check also calls getSSMItem
      (getSSMItem as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await runEntityValidation();
      expect(result).toBe(0);
    });

    it('returns 0 when validation runs and finds no errors', async () => {
      // getCurrentFingerprintFromSSM — return old fingerprint
      (getSSMItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({ 'Case.VALIDATION_RULES': 'old-hash' }),
      );
      // getEntityIdentifiers — return a Case.ts file so newFingerprint differs
      (fs.readdir as jest.Mock).mockResolvedValueOnce(['cases/Case.ts']);
      // entityValidationRequired — undefined (compare fingerprints)
      (getSSMItem as jest.Mock).mockResolvedValueOnce(undefined);
      // putSSMItem is called after successful validation with no errors
      (putSSMItem as jest.Mock).mockResolvedValueOnce(true);
      (entityValidationFunctions.Case as jest.Mock).mockResolvedValueOnce([]);

      const result = await runEntityValidation();
      expect(result).toBe(0);
    });

    it('returns 1 and logs a message when putSSMItem fails', async () => {
      (getSSMItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({ 'Case.VALIDATION_RULES': 'old-hash' }),
      );
      (fs.readdir as jest.Mock).mockResolvedValueOnce(['cases/Case.ts']);
      (getSSMItem as jest.Mock).mockResolvedValueOnce(undefined);
      (putSSMItem as jest.Mock).mockResolvedValueOnce(false);
      (entityValidationFunctions.Case as jest.Mock).mockResolvedValueOnce([]);
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});

      const result = await runEntityValidation();

      expect(result).toBe(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to write new entity validation fingerprint to SSM. Please check SSM permissions and retry.',
      );
      consoleSpy.mockRestore();
    });

    it('returns the error count when validation finds errors', async () => {
      (getSSMItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({ 'Case.VALIDATION_RULES': 'old-hash' }),
      );
      (fs.readdir as jest.Mock).mockResolvedValueOnce(['cases/Case.ts']);
      (getSSMItem as jest.Mock).mockResolvedValueOnce(undefined);
      (entityValidationFunctions.Case as jest.Mock).mockResolvedValueOnce([
        'error1',
        'error2',
      ]);

      const result = await runEntityValidation();
      expect(result).toBe(2);
    });

    it('treats entityValidationRequired as undefined when its SSM lookup throws', async () => {
      // getCurrentFingerprintFromSSM — same fingerprint so no changes after comparison
      (getSSMItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({ 'Case.VALIDATION_RULES': 'same-hash' }),
      );
      (fs.readdir as jest.Mock).mockResolvedValueOnce([]);
      // entityValidationRequired SSM lookup throws — catch sets it to undefined
      (getSSMItem as jest.Mock).mockRejectedValueOnce(
        new Error('SSM unavailable'),
      );

      const result = await runEntityValidation();
      expect(result).toBe(0);
    });
  });

  describe('main', () => {
    it('calls process.exit with 0 when there are no validation errors', async () => {
      // No current fingerprint in SSM → no changes detected → exit(0)
      (getSSMItem as jest.Mock).mockRejectedValueOnce(new Error('not found'));
      (fs.readdir as jest.Mock).mockResolvedValueOnce([]);
      (getSSMItem as jest.Mock).mockResolvedValueOnce(undefined);

      await main();

      expect(process.exit).toHaveBeenCalledWith(0);
    });

    it('calls process.exit(1) when runEntityValidation throws', async () => {
      // Make getSSMItem throw an unhandled error to trigger the .catch branch
      (getSSMItem as jest.Mock).mockRejectedValueOnce(new Error('SSM error'));
      (fs.readdir as jest.Mock).mockRejectedValueOnce(new Error('fs error'));

      await main();

      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
