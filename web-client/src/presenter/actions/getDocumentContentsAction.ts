/**
 * gets documentContents based on props.docketEntryIdToEdit
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the cerebral props object
 * @param {object} providers.props the cerebral props object
 * @returns {object} the document contents
 */
export const getDocumentContentsAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { caseDetail, docketEntryIdToEdit } = props;

  if (docketEntryIdToEdit) {
    const docketEntry = caseDetail.docketEntries.find(
      d => d.docketEntryId === docketEntryIdToEdit,
    );

    if (docketEntry) {
      const { documentContents, richText } = await applicationContext
        .getUseCases()
        .getDocumentContentsForDocketEntryInteractor(applicationContext, {
          documentContentsId: docketEntry.documentContentsId,
        });

      return { documentContents, richText };
    }
  }
};
