import { Case } from '@shared/business/entities/cases/Case';
import { GENERATION_TYPES } from '@web-client/getConstants';
import { state } from '@web-client/presenter/app.cerebral';
import { showGenerationType } from '../setDefaultGenerationTypeAction';
import { EXPLICITLY_DENIED_CONSOLIDATED_GROUP_FILING_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { ROLES } from '@shared/business/entities/EntityConstants';

export const setDefaultFileDocumentFormValuesAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const user = get(state.user);

  const { USER_ROLES } = applicationContext.getConstants();

  const caseDetail = get(state.caseDetail);
  const { eventCode } = get(state.form);

  const isInConsolidatedGroup = !!caseDetail.leadDocketNumber;
  const isMultiDocketableEventCode = !!applicationContext
    .getConstants()
    .MULTI_DOCKET_FILING_EVENT_CODES.includes(eventCode);
  const isAllowedToFileInConsolidatedGroup = () => {
    if (
      EXPLICITLY_DENIED_CONSOLIDATED_GROUP_FILING_EVENT_CODES.includes(
        eventCode,
      )
    ) {
      return !(
        user.role === ROLES.privatePractitioner ||
        user.role === ROLES.irsPractitioner
      );
    }
    return true;
  };
  const canFileInConsolidatedGroup =
    isInConsolidatedGroup &&
    isMultiDocketableEventCode &&
    isAllowedToFileInConsolidatedGroup();

  const filersMap = {};

  if (user.role === USER_ROLES.petitioner) {
    filersMap[user.userId] = true;
  }

  if (
    user.role === USER_ROLES.irsPractitioner &&
    Case.isFirstIrsFiling(caseDetail)
  ) {
    store.set(state.form.partyIrsPractitioner, true);
  }

  store.set(state.form.fileAcrossConsolidatedGroup, canFileInConsolidatedGroup);
  store.set(state.form.attachments, false);
  store.set(state.form.certificateOfService, false);
  store.set(state.form.hasSupportingDocuments, false);
  store.set(state.form.hasSecondarySupportingDocuments, false);
  if (showGenerationType(user, eventCode, caseDetail.petitioners)) {
    store.set(state.form.generationType, GENERATION_TYPES.AUTO);
  } else {
    store.set(state.form.generationType, GENERATION_TYPES.MANUAL);
  }
  store.set(state.form.practitioner, []);
  store.set(state.form.filersMap, filersMap);
};
