import { ConsolidatedCaseSummary } from '@shared/business/dto/cases/ConsolidatedCaseSummary';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { formatSealedAddresses } from '@shared/business/utilities/caseFilter';
import { getConsolidatedCases } from '@web-api/persistence/postgres/cases/getConsolidatedCases';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

export const getCaseByDocketNumber = async ({
  applicationContext: _applicationContext,
  docketNumber,
  includeConsolidatedCases = true,
  user = undefined, // Only needed to check permissions on sealed addresses for consolidated cases
}: {
  docketNumber: string;
  applicationContext: ServerApplicationContext;
  includeConsolidatedCases?: boolean;
  user?: UnknownAuthUser;
}): Promise<RawCase> => {
  const theCase = (
    await getCasesByDocketNumbers({
      docketNumbers: [docketNumber],
    })
  )[0];

  let consolidatedCases: Omit<
    RawCase,
    'consolidatedCases' | 'correspondence' | 'hearings' | 'docketEntries'
  >[] = [];
  if (includeConsolidatedCases) {
    consolidatedCases = await getConsolidatedCases({
      leadDocketNumber: theCase.leadDocketNumber!,
      excludeFields: ['correspondence', 'docketEntries', 'hearings'],
    });
    // This formatting should not be done here; we are mixing the data persistence layer with the interactor layer.
    // It was done here to quickly fix a high-severity bug.
    if (user) {
      consolidatedCases = consolidatedCases.map(c =>
        formatSealedAddresses(c, user),
      );
    }
  }

  return {
    ...theCase,
    consolidatedCases: consolidatedCases.map(
      c => new ConsolidatedCaseSummary(c),
    ),
  };
};
