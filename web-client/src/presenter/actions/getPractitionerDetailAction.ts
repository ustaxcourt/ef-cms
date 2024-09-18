/**
 * Fetches the details about a practitioner
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getPractitionerDetail use case
 * @param {object} providers.props the cerebral props object containing the props.barNumber
 * @returns {object} containing practitionerDetail
 */

import { getPractitionerCasesInteractor } from '@shared/proxies/practitioners/getPractionerCasesProxy';

export const getPractitionerDetailAction = async ({
  applicationContext,
  props,
}: ActionProps<{ barNumber: string }>) => {
  const { barNumber } = props;

  const practitionerDetail = await applicationContext
    .getUseCases()
    .getPractitionerByBarNumberInteractor(applicationContext, {
      barNumber,
    });

  const { closedCases, openCases } = await getPractitionerCasesInteractor(
    applicationContext,
    { userId: practitionerDetail.userId },
  );

  console.log(closedCases, openCases);

  practitionerDetail.openCases = openCases;
  practitionerDetail.closedCases = closedCases;

  console.log(practitionerDetail);

  return { practitionerDetail };
};
