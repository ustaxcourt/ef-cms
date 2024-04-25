/* eslint-disable complexity */

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { capitalize } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const workQueueHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const user = applicationContext.getCurrentUser();
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
  const sectionInboxCount = get(state.sectionInboxCount);
  const sectionInProgressCount = get(state.sectionInProgressCount);
  const userIsChambers = user.role === USER_ROLES.chambers;
  const userIsPetitionsClerk = user.role === USER_ROLES.petitionsClerk;
  const userIsDocketClerk = user.role === USER_ROLES.docketClerk;
  const isCaseServicesSupervisor =
    user.role === USER_ROLES.caseServicesSupervisor;
  const userIsOther = ![
    USER_ROLES.docketClerk,
    USER_ROLES.petitionsClerk,
    USER_ROLES.caseServicesSupervisor,
  ].includes(user.role);
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
  };
};
