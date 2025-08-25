import {
  CASE_STATUS_TYPES,
  PETITIONS_SECTION,
  Role,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { getDocQcSectionForUser } from '@shared/business/utilities/getDocQcSectionForUser';
import { RawWorkItemWithCaseAndDocketEntryInfo } from '@web-api/persistence/postgres/workitems/schema';

export const getWorkQueueFilters = ({
  section,
  user,
}: {
  section?: string;
  user: { userId: string; section?: string; role: Role };
}) => {
  const sectionToDisplay = section || getDocQcSectionForUser(user);
  const isCaseServicesSupervisor = user.role === ROLES.caseServicesSupervisor;
  const isDocketClerk = user.role === ROLES.docketClerk;
  const isPetitionsClerk = user.role === ROLES.petitionsClerk;

  const canViewPetitionsSection = isPetitionsClerk || isCaseServicesSupervisor;
  const canViewDocketSection = isDocketClerk || isCaseServicesSupervisor;

  return {
    my: {
      inProgress: (item: RawWorkItemWithCaseAndDocketEntryInfo) => {
        return (
          // DocketClerks
          (item.assigneeId === user.userId &&
            canViewDocketSection &&
            !item.completedAt &&
            (item.docketEntry.isFileAttached === false || item.inProgress)) ||
          // PetitionsClerks
          (item.assigneeId === user.userId &&
            canViewPetitionsSection &&
            item.inProgress)
        );
      },
      inbox: (item: RawWorkItemWithCaseAndDocketEntryInfo) => {
        if (sectionToDisplay === PETITIONS_SECTION) {
          return (
            item.assigneeId === user.userId &&
            !item.completedAt &&
            item.docketEntry.isFileAttached !== false &&
            !item.inProgress &&
            item.caseStatus === CASE_STATUS_TYPES.new
          );
        }

        // DOCKET SECTION
        return (
          item.assigneeId === user.userId &&
          !item.completedAt &&
          item.docketEntry.isFileAttached !== false &&
          !item.inProgress
        );
      },
      outbox: (item: RawWorkItemWithCaseAndDocketEntryInfo) => {
        return (
          (canViewPetitionsSection ? !!item.section : true) &&
          item.completedByUserId &&
          item.completedByUserId === user.userId &&
          !!item.completedAt
        );
      },
    },
    section: {
      inProgress: (item: RawWorkItemWithCaseAndDocketEntryInfo) => {
        return (
          // DocketClerks
          (!item.completedAt &&
            canViewDocketSection &&
            item.section === sectionToDisplay &&
            (item.docketEntry.isFileAttached === false || item.inProgress)) ||
          // PetitionsClerks
          (canViewPetitionsSection && item.inProgress === true)
        );
      },
      inbox: (item: RawWorkItemWithCaseAndDocketEntryInfo) => {
        if (sectionToDisplay === PETITIONS_SECTION) {
          return (
            !item.completedAt &&
            item.section === sectionToDisplay &&
            item.docketEntry.isFileAttached !== false &&
            !item.inProgress &&
            item.caseStatus === CASE_STATUS_TYPES.new
          );
        }

        // Docket section
        return (
          !item.completedAt &&
          item.section === sectionToDisplay &&
          item.docketEntry.isFileAttached !== false &&
          !item.inProgress
        );
      },
      outbox: (item: RawWorkItemWithCaseAndDocketEntryInfo) => {
        return (
          !!item.completedAt &&
          (canViewPetitionsSection ? !!item.section : true)
        );
      },
    },
  };
};
