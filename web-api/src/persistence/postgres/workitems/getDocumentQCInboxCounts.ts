import {
  CASE_STATUS_TYPES,
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
  Role,
} from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { sql } from 'kysely';

/**
 * Computes QC inbox/inProgress/unread counts directly in SQL,
 * avoiding the need to fetch full work item rows and docket entries.
 */

const isFileAttachedIsFalse = sql`de.is_file_attached = false`;
const isFileAttachedIsNotFalse = sql`de.is_file_attached IS DISTINCT FROM false`;

function getRoleBooleans(role: Role) {
  const isCaseServicesSupervisor = role === ROLES.caseServicesSupervisor;
  return {
    canViewDocketSection: role === ROLES.docketClerk || isCaseServicesSupervisor,
    canViewPetitionsSection:
      role === ROLES.petitionsClerk || isCaseServicesSupervisor,
  };
}

export const getDocumentQCInboxCountsForUser = async ({
  userId,
  role,
  section,
}: {
  userId: string;
  role: Role;
  section: typeof PETITIONS_SECTION | typeof DOCKET_SECTION;
}): Promise<{
  inProgressCount: number;
  inboxCount: number;
  unreadCount: number;
}> => {
  const { canViewDocketSection, canViewPetitionsSection } =
    getRoleBooleans(role);

  const inProgressCondition = buildInProgressCondition({
    canViewDocketSection,
    canViewPetitionsSection,
  });

  const inboxCondition = buildInboxCondition({ section });

  const result = await getDbReader(reader =>
    reader
      .selectFrom('dwWorkItem as w')
      .leftJoin('dwCase as c', 'c.docketNumber', 'w.docketNumber')
      .leftJoin('dwDocketEntry as de', join =>
        join
          .onRef('de.docketEntryId', '=', 'w.docketEntryId')
          .onRef('de.docketNumber', '=', 'w.docketNumber'),
      )
      .where('w.assigneeId', '=', userId)
      .where('w.completedAt', 'is', null)
      .select([
        sql<string>`COUNT(*) FILTER (WHERE ${inProgressCondition})`.as(
          'inProgressCount',
        ),
        sql<string>`COUNT(*) FILTER (WHERE ${inboxCondition})`.as(
          'inboxCount',
        ),
        sql<string>`COUNT(*) FILTER (WHERE w.is_read IS NOT TRUE)`.as(
          'unreadCount',
        ),
      ])
      .executeTakeFirstOrThrow(),
  );

  return {
    inProgressCount: Number(result.inProgressCount),
    inboxCount: Number(result.inboxCount),
    unreadCount: Number(result.unreadCount),
  };
};

export const getDocumentQCInboxCountsForSection = async ({
  judgeId,
  section,
  role,
}: {
  judgeId?: string | null;
  section: typeof PETITIONS_SECTION | typeof DOCKET_SECTION;
  role: Role;
}): Promise<{
  inProgressCount: number;
  inboxCount: number;
}> => {
  const { canViewDocketSection, canViewPetitionsSection } =
    getRoleBooleans(role);

  const inProgressCondition = buildInProgressCondition({
    canViewDocketSection,
    canViewPetitionsSection,
  });

  const inboxCondition = buildInboxCondition({ section });

  const result = await getDbReader(reader => {
    let builder = reader
      .selectFrom('dwWorkItem as w')
      .leftJoin('dwCase as c', 'c.docketNumber', 'w.docketNumber')
      .leftJoin('dwDocketEntry as de', join =>
        join
          .onRef('de.docketEntryId', '=', 'w.docketEntryId')
          .onRef('de.docketNumber', '=', 'w.docketNumber'),
      )
      .where('w.section', '=', section)
      .where('w.completedAt', 'is', null);

    if (judgeId) {
      builder = builder.where('c.associatedJudgeId', '=', judgeId);
    } else if (judgeId === null) {
      builder = builder.where('c.associatedJudgeId', 'is', null);
    }

    return builder
      .select([
        sql<string>`COUNT(*) FILTER (WHERE ${inProgressCondition})`.as(
          'inProgressCount',
        ),
        sql<string>`COUNT(*) FILTER (WHERE ${inboxCondition})`.as(
          'inboxCount',
        ),
      ])
      .executeTakeFirstOrThrow();
  });

  return {
    inProgressCount: Number(result.inProgressCount),
    inboxCount: Number(result.inboxCount),
  };
};

function buildInProgressCondition({
  canViewDocketSection,
  canViewPetitionsSection,
}: {
  canViewDocketSection: boolean;
  canViewPetitionsSection: boolean;
}) {
  // Mirrors getWorkQueueFilters section.inProgress / my.inProgress:
  //   (canViewDocketSection && (isFileAttached === false || inProgress))
  //   || (canViewPetitionsSection && inProgress)
  // Note: completedAt IS NULL is already in the WHERE clause.
  if (canViewDocketSection) {
    return sql`(${isFileAttachedIsFalse} OR w.in_progress = true)`;
  }
  if (canViewPetitionsSection) {
    return sql`w.in_progress = true`;
  }
  return sql`false`;
}

function buildInboxCondition({
  section,
}: {
  section: typeof PETITIONS_SECTION | typeof DOCKET_SECTION;
}) {
  // Mirrors getWorkQueueFilters section.inbox / my.inbox:
  //   isFileAttached !== false && !inProgress
  //   (petitions only: && caseStatus === 'New')
  if (section === PETITIONS_SECTION) {
    return sql`${isFileAttachedIsNotFalse} AND (w.in_progress IS NOT TRUE) AND c.status = ${CASE_STATUS_TYPES.new}`;
  }
  return sql`${isFileAttachedIsNotFalse} AND (w.in_progress IS NOT TRUE)`;
}
