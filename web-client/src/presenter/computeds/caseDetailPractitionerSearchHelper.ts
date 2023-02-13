import { state } from 'cerebral';

export const caseDetailPractitionerSearchHelper = get => {
  const caseDetail = get(state.caseDetail);
  const modalState = get(state.modal);

  const formatMatches = matchesKey => {
    const matchesFormatted = (modalState && modalState[matchesKey]) || [];

    const casePractitionerKey =
      matchesKey === 'practitionerMatches'
        ? 'privatePractitioners'
        : 'irsPractitioners';

    if (matchesFormatted.length) {
      matchesFormatted.map(practitioner => {
        if (practitioner.contact) {
          practitioner.cityStateZip = `${practitioner.contact.city}, ${practitioner.contact.state} ${practitioner.contact.postalCode}`;
        }
        if (caseDetail[casePractitionerKey]) {
          practitioner.isAlreadyInCase = caseDetail[casePractitionerKey].find(
            casePractitioner => casePractitioner.userId === practitioner.userId,
          );
        }
      });
    }

    return matchesFormatted;
  };

  const practitionerMatchesFormatted = formatMatches('practitionerMatches');
  const respondentMatchesFormatted = formatMatches('respondentMatches');

  const practitionerSearchResultsCount = modalState
    ? modalState.practitionerMatches?.length
    : undefined;

  const respondentSearchResultsCount = modalState
    ? modalState.respondentMatches?.length
    : undefined;

  const showOnePractitioner = practitionerSearchResultsCount === 1;
  let showMultiplePractitioners = practitionerSearchResultsCount > 1;

  let showOneRespondent = respondentSearchResultsCount === 1;
  let showMultipleRespondents = respondentSearchResultsCount > 1;

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
