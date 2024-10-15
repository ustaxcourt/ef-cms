/**
 * Fetches the details about a practitioner
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getPractitionerDetail use case
 * @param {object} providers.props the cerebral props object containing the props.barNumber
 * @returns {object} containing practitionerDetail
 */

import {
  PractitionerAllCasesInfo,
  PractitionerDetail,
} from '@web-client/presenter/state';
import { state } from '@web-client/presenter/app.cerebral';

export const getPractitionerDetailAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps<{ barNumber: string }>) => {
  const { barNumber } = props;
  const user = get(state.user);

  const practitionerDetail: PractitionerDetail = await applicationContext
    .getUseCases()
    .getPractitionerByBarNumberInteractor(applicationContext, {
      barNumber,
    });

  if (
    practitionerDetail &&
    applicationContext.getUtilities().isInternalUser(user.role)
  ) {
    const { closedCases, openCases } = await applicationContext
      .getUseCases()
      .getPractitionerCasesInteractor(applicationContext, {
        userId: practitionerDetail.userId,
      });

    const openCaseInfo: PractitionerAllCasesInfo = {
      allCases: openCases,
      currentPage: 0,
    };
    const closedCaseInfo: PractitionerAllCasesInfo = {
      allCases: closedCases,
      currentPage: 0,
    };
    practitionerDetail.openCaseInfo = openCaseInfo;
    practitionerDetail.closedCaseInfo = closedCaseInfo;
  }

  return { practitionerDetail };
};
