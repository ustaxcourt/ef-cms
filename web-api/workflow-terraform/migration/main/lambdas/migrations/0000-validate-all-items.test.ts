import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { RawUserCase } from '@shared/business/entities/UserCase';
import { migrateItems } from './0000-validate-all-items';

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
    const validUserCase: RawUserCase = {
      caseCaption: 'Guy Fieri, Petitioner',
      closedDate: '2019-05-01T21:40:48.000Z',
      createdAt: '2019-03-01T21:40:46.415Z',
      docketNumber: '104-21',
      docketNumberWithSuffix: '104-21W',
      entityName: 'UserCase',
      leadDocketNumber: '101-21',
      status: CASE_STATUS_TYPES.closed,
    };

    const result = migrateItems([validUserCase]);

    expect(result).toEqual([validUserCase]);
  });
});
