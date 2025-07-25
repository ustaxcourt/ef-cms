import {
  Case,
  getPractitionersRepresenting,
} from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { sortDocketEntryTable } from '@web-client/presenter/computeds/formattedDocketEntries';
import { verifyCaseForUser } from '@web-api/persistence/postgres/cases/userOnCase/verifyCaseForUser';

export const generateDocketRecordPdfInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    docketRecordSort,
    docketRecordTableSort,
    includePartyDetail = false,
    isIndirectlyAssociated = false,
  }: {
    docketNumber: string;
    docketRecordSort?: string;
    docketRecordTableSort?: { sortField: string; sortOrder: 'asc' | 'desc' };
    includePartyDetail: boolean;
    isIndirectlyAssociated?: boolean;
  },
  authorizedUser: UnknownAuthUser,
) => {
  const isDirectlyAssociated = await verifyCaseForUser({
    docketNumber,
    userId: authorizedUser?.userId,
  });

  const caseSource = await getCaseByDocketNumber({
    docketNumber,
  });

  let caseEntity;

  const isSealedCase = applicationContext
    .getUtilities()
    .isSealedCase(caseSource);

  if (isSealedCase) {
    if (authorizedUser?.userId) {
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

  formattedCaseDetail.formattedDocketEntries =
    formattedCaseDetail.formattedDocketEntries.map(docketEntry => ({
      ...docketEntry,
      numberOfPages: docketEntry.numberOfPages || 0,
    }));

  const sortedDocketEntries = sortDocketEntryTable(
    formattedCaseDetail.formattedDocketEntries,
    docketRecordTableSort && docketRecordTableSort.sortField,
    docketRecordTableSort && docketRecordTableSort.sortOrder,
  );

  formattedCaseDetail.formattedDocketEntries = sortedDocketEntries;

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
      docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
        docketNumber: caseEntity.docketNumber,
        docketNumberSuffix: caseEntity.docketNumberSuffix,
      }),
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
