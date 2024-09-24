/**
 * Fetches the details about a practitioner
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getPractitionerDetail use case
 * @param {object} providers.props the cerebral props object containing the props.barNumber
 * @returns {object} containing practitionerDetail
 */

import {
  PractitionerCaseDetail,
  PractitionerDetail,
} from '@web-client/presenter/state';
import { getPractitionerCasesInteractor } from '@shared/proxies/practitioners/getPractionerCasesProxy';

export const getPractitionerDetailAction = async ({
  applicationContext,
  props,
}: ActionProps<{ barNumber: string }>) => {
  const { barNumber } = props;

  const practitionerDetail: PractitionerDetail = await applicationContext
    .getUseCases()
    .getPractitionerByBarNumberInteractor(applicationContext, {
      barNumber,
    });

  const { closedCases, openCases } = await getPractitionerCasesInteractor(
    applicationContext,
    { userId: practitionerDetail.userId },
  );

  const openCaseDetail: PractitionerCaseDetail = {
    allCases: openCases,
    currentPage: 0,
  };
  const closedCaseDetail: PractitionerCaseDetail = {
    allCases: closedCases,
    currentPage: 0,
  };
  practitionerDetail.openCaseDetail = openCaseDetail;
  practitionerDetail.closedCaseDetails = closedCaseDetail;

  return { practitionerDetail };
};
