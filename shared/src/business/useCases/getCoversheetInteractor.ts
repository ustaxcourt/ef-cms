import { Case } from '../entities/cases/Case';
import { generateCoverSheetData } from '@shared/business/useCases/generateCoverSheetData';

export const getCoversheetInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketEntryId,
    docketNumber,
  }: {
    docketEntryId: string;
    docketNumber: string;
  },
) => {
  console.log('getCoversheetInteractor', {
    docketEntryId,
    docketNumber,
  });
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseRecord, { applicationContext });

  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  const coverSheetData = await generateCoverSheetData({
    applicationContext,
    caseEntity,
    docketEntryEntity,
    filingDateUpdated: false,
  });

  const results = await applicationContext.getDocumentGenerators().coverSheet({
    applicationContext,
    data: coverSheetData,
  });

  return results;
};
