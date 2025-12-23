import { state } from '@web-client/presenter/app.cerebral';
import { NON_MULTI_DOCKETABLE_EVENT_CODES } from '@shared/business/entities/EntityConstants';

export const getDocketNumbersForConsolidatedServiceAction = ({
  get,
}: ActionProps) => {
  const { eventCode } = get(state.form);
  const caseDetail = get(state.caseDetail);
  const confirmHelper = get(state.confirmInitiateServiceModalHelper);

  if (!confirmHelper.canShowCheckboxes) {
    return { docketNumbers: [] };
  }

  const consolidatedCases =
    get(state.modal.form.consolidatedCasesToMultiDocketOn) || [];

  let docketNumbers = consolidatedCases
    .filter(consolidatedCase => consolidatedCase.checked)
    .filter(
      consolidatedCase =>
        consolidatedCase.docketNumber !== caseDetail.docketNumber,
    )
    .map(consolidatedCase => consolidatedCase.docketNumber);

  if (NON_MULTI_DOCKETABLE_EVENT_CODES.includes(eventCode)) {
    docketNumbers = [];
  }

  return { docketNumbers };
};
