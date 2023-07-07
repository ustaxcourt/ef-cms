import { migrateItems } from './0000-validate-all-items';
import { validUserCase } from '../../../../../../shared/src/business/entities/UserCase.test';

describe('0000-validate-all-items', () => {
  console.log = () => null;

  const entities = [
    {
      contactPrimary: {},
      entityName: 'Case',
    },
    {
      entityName: 'CaseDeadline',
    },
    {
      entityName: 'DocketEntry',
    },
    {
      entityName: 'Practitioner',
    },
    {
      entityName: 'IrsPractitioner',
    },
    {
      entityName: 'PrivatePractitioner',
    },
    {
      entityName: 'Message',
    },
    {
      entityName: 'TrialSession',
    },
    {
      entityName: 'TrialSessionWorkingCopy',
    },
    {
      entityName: 'User',
    },
    {
      entityName: 'UserCase',
    },
    {
      entityName: 'UserCaseNote',
    },
    {
      entityName: 'WorkItem',
    },
  ];

  entities.forEach(entity => {
    it('should validate the expected entities', () => {
      expect(() => migrateItems([entity])).toThrow(
        `The ${entity.entityName} entity was invalid`,
      );
    });
  });

  it('should not throw an error when the entity is valid', () => {
    const result = migrateItems([validUserCase]);

    expect(result).toEqual([validUserCase]);
  });
});
