import { Case, isSealedCase } from '@shared/business/entities/cases/Case';
import { PublicCase } from '@shared/business/entities/cases/PublicCase';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  caseContactAddressSealedFormatter,
  caseSealedFormatter,
} from '@shared/business/utilities/caseFilter';
import { decorateForCaseStatus } from '@shared/business/useCases/getCaseInteractor';

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
  applicationContext: ServerApplicationContext;
  rawCaseRecord?: Case;
}) => {
  if (isSealedCase(rawCaseRecord)) {
    rawCaseRecord = caseSealedFormatter(rawCaseRecord);
    rawCaseRecord.isSealed = true;
  } else {
    rawCaseRecord.isSealed = false;
  }

  rawCaseRecord = caseContactAddressSealedFormatter(rawCaseRecord, {});
  rawCaseRecord = decorateForCaseStatus(rawCaseRecord);

  const publicCaseDetail = new PublicCase(rawCaseRecord, {
    applicationContext,
  });

  return publicCaseDetail.validate().toRawObject();
};
