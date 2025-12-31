import { state } from '@web-client/presenter/app.cerebral';
import { isLeadCase } from '@shared/business/entities/cases/Case';
import { NON_MULTI_DOCKETABLE_EVENT_CODES } from '@shared/business/entities/EntityConstants';

export const getDocketNumbersForConsolidatedServiceAction = ({
  get,
}: ActionProps) => {
  const { eventCode, multiDocketedOn } = get(state.form);
  const caseDetail = get(state.caseDetail);

  const isLead = isLeadCase(caseDetail);
  const isFiling = !!eventCode;
  const isMultiDocketed = multiDocketedOn?.length > 1;

  const shouldServeMultiDocket =
    isLead &&
    (isFiling || isMultiDocketed) &&
    !NON_MULTI_DOCKETABLE_EVENT_CODES.includes(eventCode);

  if (!shouldServeMultiDocket) {
    return { docketNumbers: [] };
  }

  const consolidatedCases =
    get(state.modal.form.consolidatedCasesToMultiDocketOn) || [];

  const docketNumbers = consolidatedCases
    .filter(
      consolidatedCase =>
        consolidatedCase.checked &&
        consolidatedCase.docketNumber !== caseDetail.docketNumber,
    )
    .map(consolidatedCase => consolidatedCase.docketNumber);

  return { docketNumbers };
};
