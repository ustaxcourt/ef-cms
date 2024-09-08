import { generateDocketRecordPdfInteractor } from '@web-api/business/useCases/generateDocketRecordPdfInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * used for generating a printable PDF of a docket record
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const generatePublicDocketRecordPdfLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await generateDocketRecordPdfInteractor(
        applicationContext,
        {
          ...JSON.parse(event.body),
          includePartyDetail: false,
        },
        undefined,
      );
    },
    { logResults: false },
  );
