/**
 * invokes the path in the sequence depending on if a document is being edited or created anew
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @param {object} providers.props the cerebral props object
 * @returns {object} the edit path if editing, new path otherwise
 */
export const getIsEditDocumentAction = ({ path, props }) => {
  const { documentIdToEdit } = props;

  const isEditing = !!documentIdToEdit;

  if (isEditing) {
    return path['edit']();
  } else {
    return path['new']();
  }
};
