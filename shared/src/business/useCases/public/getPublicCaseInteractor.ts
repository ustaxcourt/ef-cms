import {
  caseContactAddressSealedFormatter,
  caseSealedFormatter,
} from '../../utilities/caseFilter';
import { Case, isSealedCase } from '../../entities/cases/Case';
import { decorateForCaseStatus } from '../getCaseInteractor';
import { NotFoundError } from '../../../errors/errors';
import { PublicCase } from '../../entities/cases/PublicCase';

/**
 * getPublicCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to get
 * @returns {object} the case data
 */
export const getPublicCaseInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber }: { docketNumber: string },
) => {
  let rawCaseRecord: any = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: Case.formatDocketNumber(docketNumber),
    });

  if (!rawCaseRecord.docketNumber && !rawCaseRecord.entityName) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }
  rawCaseRecord.isSealed = isSealedCase(rawCaseRecord);
  if (isSealedCase(rawCaseRecord)) {
    rawCaseRecord = caseSealedFormatter(rawCaseRecord);
  }

  rawCaseRecord = caseContactAddressSealedFormatter(rawCaseRecord, {});
  rawCaseRecord = decorateForCaseStatus(rawCaseRecord);

  const publicCaseDetail = new PublicCase(rawCaseRecord, {
    applicationContext,
  });

  return publicCaseDetail.validate().toRawObject();
};
