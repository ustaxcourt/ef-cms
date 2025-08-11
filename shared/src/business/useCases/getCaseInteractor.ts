import { Case } from '@shared/business/entities/cases/Case';
import { CaseFactory } from '@shared/business/entities/cases/CaseFactory';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { v4 } from 'uuid';

export const getCaseInteractor = async (
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      `Invalid User attempting to view docket Number: ${docketNumber}`,
    );
  }

  const caseRecord = await getCaseByDocketNumber({
    docketNumber: Case.formatDocketNumber(docketNumber),
    user: authorizedUser,
  });
  const isValidCase = Boolean(caseRecord?.docketNumber);

  if (!isValidCase) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  // ** BELOW IS CODE TO ADD ORDERS LOCALLY -------- NEEDS TO BE REMOVED BEFORE STAGING **

  if (
    caseRecord.docketNumber === '104-17' &&
    caseRecord.docketEntries.length < 10000
  ) {
    // use multiple cases to add to
    const rawOrder = caseRecord.docketEntries.find(
      entry => entry.docketEntryId === '1f1aa3f7-e2e3-43e6-885d-4ce341588c76',
    );
    const orders = Array.from({ length: 500 }, (_, i) => ({
      ...rawOrder,
      docketEntryId: v4(),
      index: caseRecord.docketEntries.length + i,
    }));
    await upsertDocketEntries(orders);
  }

  return CaseFactory.getCase({ rawCase: caseRecord, user: authorizedUser });
};
