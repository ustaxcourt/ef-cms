import { state } from 'cerebral';

export const consolidatedCaseServiceInitiateHelper = get => {
  const formattedCaseDetail = get(state.formattedCaseDetail);
  return formattedCaseDetail.consolidatedCases.map(consolidatedCase => {
    return {
      checked: true,
      docketNumber: consolidatedCase.docketNumber,
      enabled: false,
      petitioners: consolidatedCase.petitioners.reduce((acc, current) => {
        if (consolidatedCase.petitioners.length === 1) {
          //one petitioner, so no need for an &
          return current.name;
        }

        const concatenatedPetitionersName = acc + current.name;

        if (
          current ===
          consolidatedCase.petitioners[consolidatedCase.petitioners.length - 1]
        ) {
          //this is the last petitioner, no need for an ending &
          return concatenatedPetitionersName;
        }

        return concatenatedPetitionersName + ' & ';
      }, ''),
    };
  });
};
