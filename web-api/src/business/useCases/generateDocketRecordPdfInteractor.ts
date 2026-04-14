import {
  Case,
  getPractitionersRepresenting,
} from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { type ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { type UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { sortDocketEntryTable } from '@web-client/presenter/computeds/formattedDocketEntries';
import { verifyCaseForUser } from '@web-api/persistence/postgres/cases/userOnCase/verifyCaseForUser';
import {
  DocketEntryRelation,
  MOTION_DISPOSITION_VERBIAGE,
} from '@shared/business/entities/EntityConstants';
import { concat } from 'lodash';
import {
  type FormattedCaseDetail,
  type FormattedCaseDetailDocketEntry,
} from '@shared/business/utilities/getFormattedCaseDetail';

type DocketRecordPdfCaseDetail = Omit<
  FormattedCaseDetail,
  'formattedDocketEntries' | 'petitioners'
> & {
  formattedDocketEntries: (FormattedCaseDetailDocketEntry & {
    relatedDocketEntries: {
      docketEntryIndex: number | undefined;
      dispositionText: string[];
    }[];
  })[];
  petitioners: (TPetitioner & {
    index: number;
    counselDetails: {
      name: string;
      email?: string;
      phone?: string;
    }[];
  })[];
};

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
    userId: authorizedUser?.userId || '',
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

  const formattedDocketEntries = formattedCaseDetail.formattedDocketEntries.map(
    docketEntry => {
      const formattedDocketEntry = {
        ...docketEntry,
        numberOfPages: docketEntry.numberOfPages || 0,
      };

      let relatedDocketEntries: {
        docketEntryIndex: number | undefined;
        dispositionText: string[];
      }[] = [];
      if (docketEntry.affectedByDocketEntries) {
        relatedDocketEntries = processRelatedDocketEntries(
          docketEntry.affectedByDocketEntries,
          caseEntity,
          'MOTION',
        );
      }

      if (docketEntry.affectedDocketEntries) {
        relatedDocketEntries = concat(
          relatedDocketEntries,
          processRelatedDocketEntries(
            docketEntry.affectedDocketEntries,
            caseEntity,
            'ORDER',
          ),
        );
      }

      return { ...formattedDocketEntry, relatedDocketEntries };
    },
  );

  const sortedDocketEntries = sortDocketEntryTable(
    formattedDocketEntries,
    docketRecordTableSort && docketRecordTableSort.sortField,
    docketRecordTableSort && docketRecordTableSort.sortOrder,
  );

  const formattedPetitioners = formattedCaseDetail.petitioners.map(
    (petitioner, index) => {
      const counselDetails: {
        name: string;
        email?: string;
        phone?: string;
      }[] = [];
      const practitioners =
        getPractitionersRepresenting(
          formattedCaseDetail as RawCase,
          petitioner.contactId,
        ) || [];
      if (practitioners.length > 0) {
        for (const practitioner of practitioners) {
          counselDetails.push({
            email: practitioner.email,
            name: practitioner.formattedName,
            phone: practitioner.contact?.phone,
          });
        }
      } else {
        counselDetails.push({
          name: 'None',
        });
      }
      return { ...petitioner, counselDetails, index };
    },
  );

  const caseDetail: DocketRecordPdfCaseDetail = {
    ...formattedCaseDetail,
    formattedDocketEntries: sortedDocketEntries,
    petitioners: formattedPetitioners,
  };

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseEntity);

  const pdf = await applicationContext.getDocumentGenerators().docketRecord({
    applicationContext,
    data: {
      caseCaptionExtension,
      caseDetail,
      caseTitle,
      docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
        docketNumber: caseEntity.docketNumber,
        docketNumberSuffix: caseEntity.docketNumberSuffix,
      }),
      entries: sortedDocketEntries.filter(d => d.isOnDocketRecord),
      includePartyDetail,
    },
  });

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    file: pdf,
    useTempBucket: true,
  });
};

const processRelatedDocketEntries = (
  relatedDocketEntries: DocketEntryRelation[],
  caseEntity: RawCase,
  relationshipType: 'ORDER' | 'MOTION',
) => {
  return relatedDocketEntries.map(affectedEntry => {
    const relatedEntry = caseEntity.docketEntries.find(
      entry => entry.docketEntryId === affectedEntry.docketEntryId,
    );

    const dispositionText = MOTION_DISPOSITION_VERBIAGE[
      affectedEntry.disposition
    ][relationshipType].map(d => `${d} #${relatedEntry?.index}`);

    return {
      docketEntryIndex: relatedEntry?.index,
      dispositionText,
    };
  });
};
