import { PublicCase } from '../../entities/cases/PublicCase';
import {
  SealedCase,
  caseContactAddressSealedFormatter,
  caseSealedFormatter,
} from '../../utilities/caseFilter';
import { decorateForCaseStatus } from '../../useCases/getCaseInteractor';
import { isSealedCase } from '../../entities/cases/Case';

/**
 * formatPublicCase takes a rawCase and formats to a public case
 * @param {object} providers the providers object
 * @param {string} providers.applicationContext the applicationContext
 * @param {string} providers.docketNumber the docket number of the case to get
 * @param {object} providers.rawCaseRecord the rawCaseRecord
 * @returns {object} the validated public case data
 */

export const formatPublicCase = ({
  applicationContext,
  rawCaseRecord,
}: {
  applicationContext: IApplicationContext;
  rawCaseRecord: RawCase;
}) => {
  let modifiedCaseRecord: SealedCase | RawCase = rawCaseRecord;

  if (isSealedCase(rawCaseRecord)) {
    modifiedCaseRecord = caseSealedFormatter(rawCaseRecord);
    modifiedCaseRecord.isSealed = true;
  } else {
    modifiedCaseRecord.isSealed = false;
  }

  rawCaseRecord = caseContactAddressSealedFormatter(rawCaseRecord, {});
  rawCaseRecord = decorateForCaseStatus(rawCaseRecord);

  const publicCaseDetail = new PublicCase(rawCaseRecord, {
    applicationContext,
  });

  return publicCaseDetail.validate().toRawObject();
};
