import { Case } from '@shared/business/entities/cases/Case';
import { getEntityByName } from './getEntityByName';

describe('getEntityByName', () => {
  it('should return the Case entity when given "Case"', () => {
    const result = getEntityByName('Case');
    expect(result).toBe(Case);
  });

  it('should return undefined for an unknown entity name', () => {
    const result = getEntityByName('NonExistentEntity');
    expect(result).toBeUndefined();
  });
});
