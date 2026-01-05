import { isLeadCase } from '@shared/business/entities/cases/Case';
import { state } from '@web-client/presenter/app.cerebral';
import { shouldAllowMultiDocket } from '@web-client/presenter/computeds/confirmInitiateServiceModalHelper';

export const isDocketEntryMultiDocketableAction = ({
  get,
  path,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  let {
    eventCode,
    multiDocketedOn,
    multiDocketedOriginalDocketNumber,
    processingStatus,
  } = get(state.form);

  if (!eventCode) {
    const docketEntry = caseDetail.docketEntries.find(
      doc => doc.docketEntryId === docketEntryId,
    );
    if (docketEntry) {
      ({
        eventCode,
        multiDocketedOn,
        multiDocketedOriginalDocketNumber,
        processingStatus,
      } = docketEntry);
    }
  }

  const isLead = isLeadCase(caseDetail);

  const checkAllTheCheckboxes = shouldAllowMultiDocket({
    eventCode,
    multiDocketedOn,
    multiDocketedOriginalDocketNumber,
    processingStatus,
    isLead,
  });

  if (checkAllTheCheckboxes) {
    return path.yes();
  }

  return path.no();
};
