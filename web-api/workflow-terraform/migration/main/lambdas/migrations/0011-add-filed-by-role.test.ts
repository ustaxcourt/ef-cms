// import { aggregateCaseItems } from '../../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems';
import { PENDING_DOCKET_ENTRY } from '../../../../../../shared/src/test/mockDocketEntry';
import { ROLES } from '../../../../../../shared/src/business/entities/EntityConstants';
import { getUserById } from '../../../../../../shared/src/persistence/dynamo/users/getUserById';
import { migrateItems } from './0011-add-filed-by-role';
import { privatePractitionerUser } from '../../../../../../shared/src/test/mockUsers';
jest.mock('../../../../../../shared/src/persistence/dynamo/users/getUserById');

describe('migrateItems', () => {
  it('should add the filedByRole onto any docket entry', async () => {
    (getUserById as jest.Mock).mockResolvedValue(privatePractitionerUser);

    const items = [
      {
        ...PENDING_DOCKET_ENTRY,
        filedByRole: undefined,
        pk: `docket-entry|${PENDING_DOCKET_ENTRY.docketEntryId}`,
        sk: `docket-entry|${PENDING_DOCKET_ENTRY.docketEntryId}`,
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...PENDING_DOCKET_ENTRY,
        filedByRole: ROLES.privatePractitioner,
        pk: `docket-entry|${PENDING_DOCKET_ENTRY.docketEntryId}`,
        sk: `docket-entry|${PENDING_DOCKET_ENTRY.docketEntryId}`,
      },
    ]);
  });

  it('should add system as filedByRole onto any docket entry where the user cannot be found', async () => {
    (getUserById as jest.Mock).mockResolvedValue(undefined);
    const items = [
      {
        ...PENDING_DOCKET_ENTRY,
        filedByRole: undefined,
        pk: `docket-entry|${PENDING_DOCKET_ENTRY.docketEntryId}`,
        sk: `docket-entry|${PENDING_DOCKET_ENTRY.docketEntryId}`,
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...PENDING_DOCKET_ENTRY,
        filedByRole: 'System',
        pk: `docket-entry|${PENDING_DOCKET_ENTRY.docketEntryId}`,
        sk: `docket-entry|${PENDING_DOCKET_ENTRY.docketEntryId}`,
      },
    ]);
  });

  // should NOT migrate a docket entry that is a draft
});
