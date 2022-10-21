import { NotFoundError } from '../../../errors/errors';
import { PublicCase } from '../../entities/cases/PublicCase';
import {
  caseContactAddressSealedFormatter,
  caseSealedFormatter,
} from '../../utilities/caseFilter';
import { decorateForCaseStatus } from '../../useCases/getCaseInteractor';
import { isSealedCase } from '../../entities/cases/Case';

// TODO: WRITE UNNNNNNIIIIIIITTTTTTT TEST!!!!!!!!!!!

/**
 * formatPublicCase takes a rawCase and formats to a public case
 *
 * @param {object} providers the providers object
 * @param {string} providers.applicationContext the applicationContext
 * @param {string} providers.docketNumber the docket number of the case to get
 * @param {object} providers.rawCaseRecord the rawCaseRecord
 * @returns {object} the validated public case data
 */
export const formatPublicCase = ({
  applicationContext,
  docketNumber,
  rawCaseRecord,
}: {
  applicationContext: IApplicationContext;
  rawCaseRecord?: TCase;
  docketNumber: string;
}) => {
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
