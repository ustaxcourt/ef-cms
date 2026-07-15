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
import { RawPublicContact } from '@shared/business/entities/cases/PublicContact';
import { state } from '@web-client/presenter/app.cerebral';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Role } from '@shared/business/entities/EntityConstants';

// getPractitionerByBarNumberInteractor returns different types depending on whether the user is logged in or not
const isPractitionerForInternalUser = (
  detail: PractitionerDetail | RawPublicContact | undefined,
  applicationContext: ClientApplicationContext,
  role: Role,
): detail is PractitionerDetail => {
  return (
    detail !== undefined &&
    applicationContext.getUtilities().isInternalUser(role)
  );
};

export const getPractitionerDetailAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps<{ barNumber: string }>) => {
  const { barNumber } = props;
  const user = get(state.user);

  const practitionerResult = await applicationContext
    .getUseCases()
    .getPractitionerByBarNumberInteractor(applicationContext, {
      barNumber,
    });

  const practitionerDetail: PractitionerDetail | RawPublicContact | undefined =
    Array.isArray(practitionerResult)
      ? (practitionerResult[0] as RawPublicContact | undefined)
      : (practitionerResult as PractitionerDetail | undefined);

  if (
    isPractitionerForInternalUser(
      practitionerDetail,
      applicationContext,
      user.role,
    )
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
