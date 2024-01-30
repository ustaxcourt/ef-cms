import { RawUserCase } from '@shared/business/entities/UserCase';
import { migrateItems } from './0000-validate-all-items';

describe('0000-validate-all-items', () => {
  console.log = () => null;

  const entities = [
    {
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

  it('should NOT validate an entity that is not recognized', () => {
    expect(() =>
      migrateItems([{ entityName: 'DOES_NOT_EXIST' }]),
    ).not.toThrow();
  });

  it('should not throw an error when the entity is valid', () => {
    const validUserCase: RawUserCase = {
      docketNumber: '104-21',
      entityName: 'UserCase',
    };

    const result = migrateItems([validUserCase]);

    expect(result).toEqual([validUserCase]);
  });
});
