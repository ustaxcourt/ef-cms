import { state } from 'cerebral';

export const externalConsolidatedCaseGroupHelper = (
  get,
  applicationContext,
) => {
  const caseDetail = get(state.caseDetail);

  const { CONTACT_TYPE_TITLES, USER_ROLES } = applicationContext.getConstants();

  let formattedCurrentCasePetitionerNames;
  let formattedConsolidatedCaseList: string[] = [];
  let consolidatedGroupServiceParties: any[] = [];

  if (caseDetail.consolidatedCases) {
    const currentCasePetitioners = caseDetail.petitioners
      .map(ptr => ptr.name)
      .join(' & ');

    formattedCurrentCasePetitionerNames = `${caseDetail.docketNumber} ${currentCasePetitioners}`;

    formattedConsolidatedCaseList = caseDetail.consolidatedCases.map(
      currentCase => {
        if (!currentCase.isSealed) {
          const formattedPetitioners = currentCase.petitioners
            .map(ptr => ptr.name)
            .join(' & ');

          return `${currentCase.docketNumber} ${formattedPetitioners}`;
        }

        return `${currentCase.docketNumber} Sealed Case`;
      },
    );

    const roleToDisplay = party => {
      if (party.role === USER_ROLES.privatePractitioner) {
        return 'Petitioner Counsel';
      } else if (party.role === USER_ROLES.irsPractitioner) {
        return 'Respondent Counsel';
      } else {
        return CONTACT_TYPE_TITLES[party.contactType];
      }
    };

    caseDetail.consolidatedCases.forEach((memberCase, i) => {
      consolidatedGroupServiceParties[i] = {};
      const combinedPartiesList = [
        ...(memberCase.petitioners ?? []),
        ...(memberCase.privatePractitioners ?? []),
        ...(memberCase.irsPractitioners ?? []),
      ];
      combinedPartiesList.forEach((party, j) => {
        consolidatedGroupServiceParties[i][j] = `${party.name}, ${roleToDisplay(
          party,
        )}`;
      });
    });
  }

  return {
    consolidatedGroupServiceParties,
    formattedConsolidatedCaseList,
    formattedCurrentCasePetitionerNames,
  };
};
