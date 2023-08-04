import { MOCK_CASE } from '../../../../../../shared/src/test/mockCase';
import { PENDING_DOCKET_ENTRY } from '../../../../../../shared/src/test/mockDocketEntry';
import {
  ROLES,
  SYSTEM_ROLE,
} from '../../../../../../shared/src/business/entities/EntityConstants';
import { getUserById } from '../../../../../../shared/src/persistence/dynamo/users/getUserById';
import { migrateItems } from './0011-add-filed-by-role';
import { privatePractitionerUser } from '../../../../../../shared/src/test/mockUsers';
jest.mock('../../../../../../shared/src/persistence/dynamo/users/getUserById');

describe('migrateItems', () => {
  it('should NOT modify a record that is NOT a docket entry', async () => {
    (getUserById as jest.Mock).mockResolvedValue(privatePractitionerUser);

    const items = [
      {
        ...MOCK_CASE,
        filedByRole: undefined,
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: `case|${MOCK_CASE.docketNumber}`,
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...MOCK_CASE,
        filedByRole: undefined,
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: `case|${MOCK_CASE.docketNumber}`,
      },
    ]);
  });

  it('should set the role of the person who filed the docket entry when the item is a docket entry', async () => {
    (getUserById as jest.Mock).mockResolvedValue(privatePractitionerUser);

    const items = [
      {
        ...PENDING_DOCKET_ENTRY,
        filedByRole: undefined,
        pk: `case|${PENDING_DOCKET_ENTRY.docketEntryId}`,
        sk: `docket-entry|${PENDING_DOCKET_ENTRY.docketEntryId}`,
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...PENDING_DOCKET_ENTRY,
        filedByRole: ROLES.privatePractitioner,
        pk: `case|${PENDING_DOCKET_ENTRY.docketEntryId}`,
        sk: `docket-entry|${PENDING_DOCKET_ENTRY.docketEntryId}`,
      },
    ]);
  });

  it('should add system as the role of the person who filed the docket entry when the user who filed the entry was not found in persistence', async () => {
    (getUserById as jest.Mock).mockResolvedValue(undefined);
    const items = [
      {
        ...PENDING_DOCKET_ENTRY,
        filedByRole: undefined,
        pk: `case|${PENDING_DOCKET_ENTRY.docketEntryId}`,
        sk: `docket-entry|${PENDING_DOCKET_ENTRY.docketEntryId}`,
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...PENDING_DOCKET_ENTRY,
        filedByRole: SYSTEM_ROLE,
        pk: `case|${PENDING_DOCKET_ENTRY.docketEntryId}`,
        sk: `docket-entry|${PENDING_DOCKET_ENTRY.docketEntryId}`,
      },
    ]);
  });

  it('should set the role of the person who filed the docket entry when the docket entry is a draft', async () => {
    (getUserById as jest.Mock).mockResolvedValue(privatePractitionerUser);
    const items = [
      {
        ...PENDING_DOCKET_ENTRY,
        filedByRole: undefined,
        isDraft: true,
        pk: `case|${PENDING_DOCKET_ENTRY.docketEntryId}`,
        sk: `docket-entry|${PENDING_DOCKET_ENTRY.docketEntryId}`,
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...PENDING_DOCKET_ENTRY,
        filedByRole: undefined,
        isDraft: true,
        pk: `case|${PENDING_DOCKET_ENTRY.docketEntryId}`,
        sk: `docket-entry|${PENDING_DOCKET_ENTRY.docketEntryId}`,
      },
    ]);
  });
});
