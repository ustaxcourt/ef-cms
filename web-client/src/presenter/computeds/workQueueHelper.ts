/* eslint-disable complexity */

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { capitalize } from 'lodash';
import { getWorkQueueFilters } from '@shared/business/utilities/getWorkQueueFilters';
import { isLeadCase } from '@shared/business/entities/cases/Case';
import { state } from '@web-client/presenter/app.cerebral';

export const workQueueHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  currentBoxView: string;
  documentQCNavigationPath: Function;
  getQueuePath: Function;
  hideCaseStatusColumn: boolean;
  hideIconColumn: boolean;
  individualInProgressCount: number;
  individualInboxCount: number;
  isCaseServicesSupervisor: boolean;
  outboxFiledByColumnLabel: string;
  sectionInProgressCount: number;
  sectionInboxCount: number;
  sentTitle: string;
  showAssignedToColumn: boolean;
  outboxRenderedRowCount: number;
  showCaseStatusColumn: boolean;
  showDocketClerkFilter: boolean;
  showEditDocketEntry: boolean;
  showFiledByColumn: boolean;
  showFromColumn: boolean;
  showInProgressTab: boolean;
  showInbox: boolean;
  showIndividualWorkQueue: boolean;
  showMyQueueToggle: boolean;
  showOutbox: boolean;
  showProcessedByColumn: boolean;
  showSectionSentTab: boolean;
  showSectionWorkQueue: boolean;
  showSelectAllCheckbox: boolean;
  showSelectColumn: boolean;
  showSendToBar: boolean;
  showStartPetitionButton: boolean;
  showSwitchToMyDocQCLink: boolean;
  workQueueTitle: string;
} => {
  const user = get(state.user);
  const selectedWorkItems = get(state.selectedWorkItems);
  const workQueueToDisplay = get(state.workQueueToDisplay);
  const { USER_ROLES } = applicationContext.getConstants();
  const isJudge = user.role === USER_ROLES.judge;
  const selectedSection = workQueueToDisplay.section;
  const showInbox = workQueueToDisplay.box === 'inbox';
  const showInProgress = workQueueToDisplay.box === 'inProgress';
  const showOutbox = workQueueToDisplay.box === 'outbox';
  const showIndividualWorkQueue = workQueueToDisplay.queue === 'my';
  const individualInboxCount = get(state.individualInboxCount);
  const individualInProgressCount = get(state.individualInProgressCount);
  const stateSectionInboxCount = get(state.sectionInboxCount);
  const sectionInProgressCount = get(state.sectionInProgressCount);
  const userIsChambers = user.role === USER_ROLES.chambers;
  const userIsPetitionsClerk = user.role === USER_ROLES.petitionsClerk;
  const userIsDocketClerk = user.role === USER_ROLES.docketClerk;
  const isCaseServicesSupervisor =
    user.role === USER_ROLES.caseServicesSupervisor;
  const userIsOther = !(
    [
      USER_ROLES.docketClerk,
      USER_ROLES.petitionsClerk,
      USER_ROLES.caseServicesSupervisor,
    ] as string[]
  ).includes(user.role);
  let workQueueTitle = `${
    showIndividualWorkQueue ? 'My ' : userIsOther ? '' : 'Section '
  }Document QC`;

  if (isCaseServicesSupervisor) {
    workQueueTitle = selectedSection
      ? `${capitalize(selectedSection)} Section QC`
      : 'My Document QC';
  }

  const documentQCNavigationPath = ({ box, queue, section }) => {
    return section
      ? `/document-qc/${queue}/${box}/selectedSection?section=${section}`
      : `/document-qc/${queue}/${box}`;
  };

  const permissions = get(state.permissions);

  const outboxFiledByColumnLabel = userIsPetitionsClerk ? 'Processed' : 'Filed';

  const formattedWorkQueue = get(state.formattedWorkQueue) as any[];
  let outboxRenderedRowCount = 0;
  if (Array.isArray(formattedWorkQueue) && formattedWorkQueue.length > 0) {
    const byLead = new Map<string, Set<string>>();
    for (const item of formattedWorkQueue) {
      const lead = item.leadDocketNumber || item.docketNumber || '';
      const docTitle =
        (item.docketEntry &&
          (item.docketEntry.descriptionDisplay ||
            item.docketEntry.documentType)) ||
        '';
      if (!byLead.has(lead)) {
        byLead.set(lead, new Set());
      }
      byLead.get(lead)!.add(docTitle);
    }

    for (const docSet of byLead.values()) {
      outboxRenderedRowCount += docSet.size;
    }
  }

  const showStartPetitionButton = permissions.START_PAPER_CASE;
  const userIsAllowed =
    userIsDocketClerk || userIsPetitionsClerk || isCaseServicesSupervisor;
  const userIsPetitionsOrCaseServices =
    userIsPetitionsClerk || isCaseServicesSupervisor;
  const userIsDocketOrCaseServices =
    userIsDocketClerk || isCaseServicesSupervisor;

  const showSectionWorkQueue = workQueueToDisplay.queue === 'section';
  const showMyQueueToggle = userIsAllowed;

  const showSwitchToMyDocQCLink =
    !isCaseServicesSupervisor && showSectionWorkQueue && showMyQueueToggle;

  let sectionInboxCount = stateSectionInboxCount;
  if (workQueueToDisplay.queue === 'section') {
    try {
      const workItems = get(state.workQueue) as any[];
      const filters = getWorkQueueFilters({ section: selectedSection, user });
      const composedFilter = filters['section']['inbox'];
      let filteredInbox = (workItems || []).filter(composedFilter);

      const anyPreGrouped = filteredInbox.some(
        (wi: any) =>
          Array.isArray(wi.groupedCases) && wi.groupedCases.length > 0,
      );

      if (anyPreGrouped) {
        const groups = new Map<string, any[]>();
        for (const wi of filteredInbox as any[]) {
          if (wi.leadDocketNumber && wi.groupedCases?.length) {
            groups.set(wi.leadDocketNumber, wi.groupedCases);
          }
        }
        filteredInbox = (filteredInbox as any[]).map(wi => {
          if (wi.leadDocketNumber && groups.has(wi.leadDocketNumber)) {
            return { ...wi, groupedCases: groups.get(wi.leadDocketNumber) };
          }
          return wi;
        });
        sectionInboxCount = filteredInbox.length;
      } else {
        const consolidated: any[] = [];
        const solo: any[] = [];
        for (const wi of filteredInbox) {
          if (wi.leadDocketNumber) {
            consolidated.push(wi);
          } else {
            solo.push(wi);
          }
        }

        const byLead = new Map<string, any[]>();
        for (const wi of consolidated) {
          const key = wi.leadDocketNumber!;
          if (!byLead.has(key)) byLead.set(key, []);
          byLead.get(key)!.push(wi);
        }

        const consolidatedResult: any[] = [];

        for (const group of byLead.values()) {
          const leadItems = group.filter((w: any) => isLeadCase(w));

          const groupedCases = Array.from(
            new Map(group.map((g: any) => [g.docketNumber, g])).values(),
          ).map((g: any) => ({
            docketNumber: g.docketNumber,
            docketNumberWithSuffix: g.docketNumberWithSuffix,
            inLeadCase: isLeadCase(g),
          }));

          if (leadItems.length > 0) {
            for (const li of leadItems) {
              consolidatedResult.push({ ...li, groupedCases });
            }
          } else {
            for (const member of group) {
              consolidatedResult.push({ ...member, groupedCases });
            }
          }
        }

        sectionInboxCount = solo.length + consolidatedResult.length;
      }
    } catch (e) {
      // fallback to server-provided count on error
      sectionInboxCount = stateSectionInboxCount;
    }
  }

  return {
    currentBoxView: workQueueToDisplay.box,
    documentQCNavigationPath,
    getQueuePath: ({ box, queue }) => {
      return `/document-qc/${queue}/${box}`;
    },
    hideCaseStatusColumn: userIsPetitionsOrCaseServices,
    hideIconColumn: userIsOther,
    individualInProgressCount,
    individualInboxCount,
    isCaseServicesSupervisor,
    outboxFiledByColumnLabel,
    sectionInProgressCount,
    sectionInboxCount,
    sentTitle: userIsDocketOrCaseServices ? 'Processed' : 'Served',
    showAssignedToColumn:
      !showIndividualWorkQueue && (showInbox || showInProgress) && !userIsOther,
    showCaseStatusColumn: isJudge || userIsChambers,
    showDocketClerkFilter: userIsDocketOrCaseServices,
    showEditDocketEntry: permissions.DOCKET_ENTRY,
    showFiledByColumn: userIsDocketOrCaseServices,
    showFromColumn: isJudge || userIsChambers,
    showInProgressTab: userIsAllowed,
    showInbox,
    showIndividualWorkQueue,
    showMyQueueToggle: userIsAllowed,
    showOutbox,
    showProcessedByColumn:
      (userIsDocketOrCaseServices && showOutbox) ||
      (userIsPetitionsOrCaseServices && showInProgress),
    showSectionSentTab: userIsAllowed,
    showSectionWorkQueue,
    showSelectAllCheckbox: permissions.ASSIGN_ALL_WORK_ITEMS,
    showSelectColumn: permissions.ASSIGN_WORK_ITEM,
    showSendToBar: selectedWorkItems.length > 0,
    showStartPetitionButton,
    showSwitchToMyDocQCLink,
    workQueueTitle,
    outboxRenderedRowCount,
  };
};
