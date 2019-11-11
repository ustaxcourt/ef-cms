/**
 * remove the pending item from the case detail
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @returns {object} the new props
 */
export const removeCaseDetailPendingItemAction = ({ props }) => {
  const { caseDetail, documentId } = props;

  const combinedCaseDetailWithForm = { ...caseDetail };

  combinedCaseDetailWithForm.documents = caseDetail.documents.map(document => {
    if (document.documentId === documentId) {
      return {
        ...document,
        pending: false,
      };
    }

    return document;
  });

  return {
    combinedCaseDetailWithForm,
  };
};
