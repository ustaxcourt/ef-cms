import { migrateItems } from './0000-validate-all-items';

describe('0000-validate-all-items', () => {
  const entities = [
    {
      contactPrimary: {},
      entityName: 'Case',
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
      entityName: 'WorkItem',
    },
  ];

  entities.forEach(entity => {
    it('should validate the expected entities', async () => {
      await expect(migrateItems([entity])).rejects.toThrow(
        `The ${entity.entityName} entity was invalid`,
      );
    });
  });
});
