import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const externalConsolidatedCaseGroupHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
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
        if (!currentCase.petitioners?.length && currentCase.isSealed) {
          return `${currentCase.docketNumber} Sealed Case`;
        }
        const formattedPetitioners = currentCase.petitioners
          .map(ptr => ptr.name)
          .join(' & ');

        return `${currentCase.docketNumber} ${formattedPetitioners}`;
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
      const combinedPartiesList = [
        ...(memberCase.petitioners ?? []),
        ...(memberCase.privatePractitioners ?? []),
        ...(memberCase.irsPractitioners ?? []),
      ];

      if (!combinedPartiesList.length && memberCase.isSealed) {
        consolidatedGroupServiceParties[i] = ['Sealed Case'];
      } else {
        consolidatedGroupServiceParties[i] = [];
        combinedPartiesList.forEach(party => {
          consolidatedGroupServiceParties[i].push(
            `${party.name}, ${roleToDisplay(party)}`,
          );
        });
      }
    });
  }

  return {
    consolidatedGroupServiceParties,
    formattedConsolidatedCaseList,
    formattedCurrentCasePetitionerNames,
  };
};
