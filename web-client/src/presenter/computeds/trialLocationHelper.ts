import { Case } from '@shared/business/entities/cases/Case';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const trialLocationHelper = (
  get: Get,
): {
  location: string;
  formattedEligibleCases: any[];
} => {
  // const permissions = get(state.permissions)!;
  const { eligibleCases, location } = get(state.trialLocationPage);

  const formattedEligibleCases = eligibleCases.map(c => {
    let privatePractitioners: string[] = [];
    if (c.privatePractitioners) {
      privatePractitioners = c.privatePractitioners.map(practitioner => {
        return practitioner.name;
      });
    }
    let irsPractitioners: string[] = [];
    if (c.irsPractitioners) {
      irsPractitioners = c.irsPractitioners.map(practitioner => {
        return practitioner.name;
      });
    }

    const caseTitle = Case.getCaseTitle(c.caseCaption);

    return { ...c, caseTitle, irsPractitioners, privatePractitioners };
  });

  const trialCityFormatted = location.replace('-', ', ');

  // const pageSize = 100;

  return { formattedEligibleCases, location: trialCityFormatted };
};
