import { RawUserCase } from '@shared/business/entities/UserCase';
import { createApplicationContext } from '@web-api/applicationContext';
import { migrateItems } from './0000-validate-all-items';

describe('0000-validate-all-items', () => {
  const applicationContext = createApplicationContext({});
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

  it.each(entities)(
    'should throw an error when a $entityName entity is invalid',
    entity => {
      expect(() => migrateItems([entity], applicationContext)).toThrow(
        `The ${entity.entityName} entity was invalid`,
      );
    },
  );

  it('should NOT validate an entity that is not recognized', () => {
    expect(() =>
      migrateItems([{ entityName: 'DOES_NOT_EXIST' }], applicationContext),
    ).not.toThrow();
  });

  it('should not throw an error when the entity is valid', () => {
    const validUserCase: RawUserCase = {
      docketNumber: '104-21',
      entityName: 'UserCase',
    };

    const result = migrateItems([validUserCase], applicationContext);

    expect(result).toEqual([validUserCase]);
  });
});
