import { Case, getPractitionersRepresenting } from '../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getCaseCaptionMeta } from '../utilities/getCaseCaptionMeta';

/**
 * generateDocketRecordPdfInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number for the docket record to be generated
 * @returns {Uint8Array} docket record pdf
 */
export const generateDocketRecordPdfInteractor = async (
  applicationContext,
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
) => {
  const user = applicationContext.getCurrentUser();
  const isDirectlyAssociated = await applicationContext
    .getPersistenceGateway()
    .verifyCaseForUser({
      applicationContext,
      docketNumber,
      userId: user.userId,
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
    if (user.userId) {
      const isAuthorizedToViewSealedCase = isAuthorized(
        user,
        ROLE_PERMISSIONS.VIEW_SEALED_CASE,
      );

      if (
        isAuthorizedToViewSealedCase ||
        isDirectlyAssociated ||
        isIndirectlyAssociated
      ) {
        caseEntity = new Case(caseSource, { applicationContext });
      } else {
        // unassociated user viewing sealed case
        throw new UnauthorizedError('Unauthorized to view sealed case.');
      }
    } else {
      //public user
      throw new UnauthorizedError('Unauthorized to view sealed case.');
    }
  } else {
    caseEntity = new Case(caseSource, { applicationContext });
  }

  const formattedCaseDetail = applicationContext
    .getUtilities()
    .getFormattedCaseDetail({
      applicationContext,
      caseDetail: caseEntity,
      docketRecordSort,
    });

  formattedCaseDetail.petitioners.forEach(petitioner => {
    petitioner.counselDetails = [];

    const practitioners = getPractitionersRepresenting(
      formattedCaseDetail,
      petitioner.contactId,
    );

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
