/**
 * gets documentContents based on props.docketEntryIdToEdit
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the cerebral props object
 * @param {object} providers.props the cerebral props object
 * @returns {object} the document contents
 */
export const getDocumentContentsAction = ({ applicationContext, props }) => {
  const { docketEntryIdToEdit } = props;
  const { caseDetail } = state;

  const { documentContentsId } = caseDetail.docketEntries.find(
    d => d.docketEntryId === docketEntryIdToEdit,
  );

  if (docketEntryIdToEdit && documentContentsId) {
    const documentContents = applicationContext
      .getUseCases()
      .getDocumentContentsForDocketEntry({
        applicationContext,
        docketEntryId: docketEntryIdToEdit,
      });

    return { documentContents };
  }
};
