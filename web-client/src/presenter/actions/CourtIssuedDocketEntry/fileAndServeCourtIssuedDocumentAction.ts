import { createISODateString } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const fileAndServeCourtIssuedDocumentAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const docketEntryId = get(state.docketEntryId);
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);

  const { orderType, dueDate } =
    (
      caseDetail.docketEntries.find(
        docketEntry => docketEntry.docketEntryId == docketEntryId,
      ) || { draftOrderState: {} }
    ).draftOrderState || {};

  if (
    orderType === 'statusReport' ||
    orderType === 'statusReportStipulatedDecision'
  ) {
    form.date = createISODateString(dueDate);
  }

  const clientConnectionId = get(state.clientConnectionId);

  const { docketNumbers } = props;

  await applicationContext
    .getUseCases()
    .fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId,
      docketNumbers,
      form: {
        ...form,
        orderType,
      },
      subjectCaseDocketNumber: caseDetail.docketNumber,
    });
};
