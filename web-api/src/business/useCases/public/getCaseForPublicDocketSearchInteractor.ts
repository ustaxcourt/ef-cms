import {
  Case,
  isSealedCase,
} from '../../../../../shared/src/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { PublicCase } from '../../../../../shared/src/business/entities/cases/PublicCase';
import { ServerApplicationContext } from '@web-api/applicationContext';

/**
 * getCaseForPublicDocketSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to get
 * @returns {object} the case data
 */
export const getCaseForPublicDocketSearchInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: Case.formatDocketNumber(docketNumber),
    });

  if (!caseRecord) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  let caseDetailRaw;

  if (isSealedCase(caseRecord)) {
    const error = new UnauthorizedError(`Case ${docketNumber} is sealed.`);
    error.skipLogging = true;
    throw error;
  } else {
    caseDetailRaw = new PublicCase(caseRecord, {
      authorizedUser: undefined,
    })
      .validate()
      .toRawObject();
  }
  return caseDetailRaw;
};
