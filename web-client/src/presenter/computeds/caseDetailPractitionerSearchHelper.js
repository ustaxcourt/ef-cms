import { state } from 'cerebral';

export const caseDetailPractitionerSearchHelper = get => {
  const caseDetail = get(state.caseDetail);
  const modalState = get(state.modal);

  const practitionerMatchesFormatted =
    modalState && modalState.practitionerMatches;
  if (practitionerMatchesFormatted) {
    practitionerMatchesFormatted.map(practitioner => {
      if (practitioner.contact) {
        practitioner.cityStateZip = `${practitioner.contact.city}, ${practitioner.contact.state} ${practitioner.contact.postalCode}`;
      }
      if (caseDetail.privatePractitioners) {
        practitioner.isAlreadyInCase = caseDetail.privatePractitioners.find(
          casePractitioner => casePractitioner.userId === practitioner.userId,
        );
      }
    });
  }
  const respondentMatchesFormatted = modalState && modalState.respondentMatches;
  if (respondentMatchesFormatted) {
    respondentMatchesFormatted.map(respondent => {
      if (respondent.contact) {
        respondent.cityStateZip = `${respondent.contact.city}, ${respondent.contact.state} ${respondent.contact.postalCode}`;
      }
      if (caseDetail.irsPractitioners) {
        respondent.isAlreadyInCase = caseDetail.irsPractitioners.find(
          caseRespondent => caseRespondent.userId === respondent.userId,
        );
      }
    });
  }

  const practitionerSearchResultsCount =
    modalState &&
    modalState.practitionerMatches &&
    modalState.practitionerMatches.length;

  const respondentSearchResultsCount =
    modalState &&
    modalState.respondentMatches &&
    modalState.respondentMatches.length;

  let showOnePractitioner = false;
  let showMultiplePractitioners = false;

  if (practitionerSearchResultsCount === 1) {
    showOnePractitioner = true;
  } else if (practitionerSearchResultsCount > 1) {
    showMultiplePractitioners = true;
  }

  let showOneRespondent = false;
  let showMultipleRespondents = false;

  if (respondentSearchResultsCount === 1) {
    showOneRespondent = true;
  } else if (respondentSearchResultsCount > 1) {
    showMultipleRespondents = true;
  }

  return {
    practitionerMatchesFormatted,
    practitionerSearchResultsCount,
    respondentMatchesFormatted,
    respondentSearchResultsCount,
    showMultiplePractitioners,
    showMultipleRespondents,
    showOnePractitioner,
    showOneRespondent,
  };
};
