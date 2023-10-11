import { GENERATION_TYPES } from '@web-client/getConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const setDefaultFileDocumentFormValuesAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const { eventCode: documentToFileEventCode } = get(state.form);

  const isInConsolidatedGroup = !!caseDetail.leadDocketNumber;
  const isMultiDocketableEventCode = !!applicationContext
    .getConstants()
    .MULTI_DOCKET_FILING_EVENT_CODES.includes(documentToFileEventCode);

  store.set(
    state.form.fileAcrossConsolidatedGroup,
    isInConsolidatedGroup && isMultiDocketableEventCode,
  );
  store.set(state.form.attachments, false);
  store.set(state.form.certificateOfService, false);
  store.set(state.form.hasSupportingDocuments, false);
  store.set(state.form.hasSecondarySupportingDocuments, false);
  store.set(state.form.generationType, GENERATION_TYPES.MANUAL);
  store.set(state.form.practitioner, []);

  const filersMap = {};
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();

  if (user.role === USER_ROLES.petitioner) {
    filersMap[user.userId] = true;
  }
  store.set(state.form.filersMap, filersMap);
};
