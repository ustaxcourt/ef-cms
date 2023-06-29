/**
 * gets the document size key, value pair based on props
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral store used for getting the props.documentType and props.file
 * @returns {object} object containing the documentType and file
 */
export const getFormValueDocumentSizeAction = ({ props }: ActionProps) => {
  const { documentType, file } = props;

  return {
    key: `${documentType}Size`,
    value: file.size,
  };
};
