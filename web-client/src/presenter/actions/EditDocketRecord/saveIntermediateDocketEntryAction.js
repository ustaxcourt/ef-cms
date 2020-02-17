import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * update a docket record with the soon to be updated information
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const saveIntermediateDocketEntryAction = async ({
  applicationContext,
  get,
}) => {
  const { caseId, docketNumber } = get(state.caseDetail);
  const documentId = get(state.documentId);

  let entryMetadata = omit(
    {
      ...get(state.form),
    },
    ['workitems'],
  );

  entryMetadata = {
    ...entryMetadata,
    caseId,
    createdAt: entryMetadata.dateReceived,
    docketNumber,
    documentId,
    receivedAt: entryMetadata.dateReceived,
  };

  const caseDetail = await applicationContext
    .getUseCases()
    .saveIntermediateDocketEntryInteractor({
      applicationContext,
      entryMetadata,
    });

  return {
    caseDetail,
    caseId: docketNumber,
  };
};
