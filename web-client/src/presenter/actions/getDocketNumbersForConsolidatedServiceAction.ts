import { state } from '@web-client/presenter/app.cerebral';

export const getDocketNumbersForConsolidatedServiceAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  const { NON_MULTI_DOCKETABLE_EVENT_CODES } =
    applicationContext.getConstants();

  const { eventCode } = get(state.form);
  const caseDetail = get(state.caseDetail);

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
