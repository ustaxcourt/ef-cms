import {
  Case,
  getPractitionersRepresenting,
} from '../../../../shared/src/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseCaptionMeta } from '../../../../shared/src/business/utilities/getCaseCaptionMeta';

export const generateDocketRecordPdfInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    docketRecordSort,
    includePartyDetail = false,
    isIndirectlyAssociated = false,
  }: {
    docketNumber: string;
    docketRecordSort?: string;
    includePartyDetail: boolean;
    isIndirectlyAssociated?: boolean;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!authorizedUser) {
    throw new UnauthorizedError('Unauthorized to generate docket record.');
  }
  const isDirectlyAssociated = await applicationContext
    .getPersistenceGateway()
    .verifyCaseForUser({
      applicationContext,
      docketNumber,
      userId: authorizedUser.userId,
    });

  const caseSource = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  let caseEntity;

  const isSealedCase = applicationContext
    .getUtilities()
    .isSealedCase(caseSource);

  if (isSealedCase) {
    if (authorizedUser.userId) {
      const isAuthorizedToViewSealedCase = isAuthorized(
        authorizedUser,
        ROLE_PERMISSIONS.VIEW_SEALED_CASE,
      );

      if (
        isAuthorizedToViewSealedCase ||
        isDirectlyAssociated ||
        isIndirectlyAssociated
      ) {
        caseEntity = new Case(caseSource, { authorizedUser });
      } else {
        // unassociated user viewing sealed case
        throw new UnauthorizedError('Unauthorized to view sealed case.');
      }
    } else {
      //public user
      throw new UnauthorizedError('Unauthorized to view sealed case.');
    }
  } else {
    caseEntity = new Case(caseSource, { authorizedUser });
  }

  const formattedCaseDetail = applicationContext
    .getUtilities()
    .getFormattedCaseDetail({
      applicationContext,
      authorizedUser,
      caseDetail: caseEntity,
      docketRecordSort,
    });

  formattedCaseDetail.petitioners.forEach(petitioner => {
    petitioner.counselDetails = [];

    const practitioners =
      getPractitionersRepresenting(formattedCaseDetail, petitioner.contactId) ||
      [];

    if (practitioners.length > 0) {
      practitioners.forEach(practitioner => {
        petitioner.counselDetails.push({
          email: practitioner.email,
          name: practitioner.formattedName,
          phone: practitioner.contact.phone,
        });
      });
    } else {
      petitioner.counselDetails.push({
        name: 'None',
      });
    }
  });

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseEntity);

  const pdf = await applicationContext.getDocumentGenerators().docketRecord({
    applicationContext,
    data: {
      caseCaptionExtension,
      caseDetail: formattedCaseDetail,
      caseTitle,
      docketNumberWithSuffix: `${caseEntity.docketNumber}${
        caseEntity.docketNumberSuffix || ''
      }`,
      entries: formattedCaseDetail.formattedDocketEntries.filter(
        d => d.isOnDocketRecord,
      ),
      includePartyDetail,
    },
  });

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    file: pdf,
    useTempBucket: true,
  });
};
