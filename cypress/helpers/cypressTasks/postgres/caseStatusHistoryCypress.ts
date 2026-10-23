import {
  CASE_TYPES_MAP,
  PARTY_TYPES,
  PAYMENT_STATUS,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { getJsDateFromIso } from '@shared/business/utilities/DateHandler';
import { getCypressPostgresDb } from 'cypress/helpers/cypressTasks/postgres/getCypressPostgresDb';

export type CypressCaseStatusChange = {
  date: string;
  updatedCaseStatus: string;
};

export type CypressCaseWithStatusHistory = {
  docketNumber: string;
  procedureType: string;
  statusChanges: CypressCaseStatusChange[];
};

// received long before any dashboard timeframe, so the petitions charts do not change
const RECEIVED_AT = getJsDateFromIso('1997-06-16T16:00:00.000Z');

export const deleteCasesByDocketNumbers = async ({
  docketNumbers,
}: {
  docketNumbers: string[];
}): Promise<null> => {
  const POSTGRES_CLIENT = await getCypressPostgresDb();
  await POSTGRES_CLIENT.deleteFrom('dwCase')
    .where('docketNumber', 'in', docketNumbers)
    .execute();

  return null;
};

// writes case rows with a known status history, so tests can check the dashboard status-change counts
export const insertCasesWithStatusHistory = async ({
  cases,
}: {
  cases: CypressCaseWithStatusHistory[];
}): Promise<null> => {
  const POSTGRES_CLIENT = await getCypressPostgresDb();
  await POSTGRES_CLIENT.insertInto('dwCase')
    .values(
      cases.map(({ docketNumber, procedureType, statusChanges }) => ({
        caption: `Cypress Status History ${docketNumber}, Petitioner`,
        caseStatusHistory: JSON.stringify(
          statusChanges.map(change => ({ ...change, changedBy: 'Cypress' })),
        ),
        caseType: CASE_TYPES_MAP.deficiency,
        createdAt: RECEIVED_AT,
        docketNumber,
        partyType: PARTY_TYPES.petitioner,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        petitioners: JSON.stringify([]),
        procedureType,
        receivedAt: RECEIVED_AT,
        sortableDocketNumber: Case.getSortableDocketNumber(docketNumber)!,
        statistics: JSON.stringify([]),
        status: statusChanges[statusChanges.length - 1].updatedCaseStatus,
      })),
    )
    .execute();

  return null;
};
