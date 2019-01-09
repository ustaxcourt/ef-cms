import { state } from 'cerebral';

export default ({ path, get }) => {
  const document = get(state.document);

  if (!document.documentType || document.documentType === 'Select')
    return path.error({
      alertError: {
        title: 'Document type not selected',
        message: 'The document type must be selected.',
      },
    });

  if (!document.file)
    return path.error({
      alertError: {
        title: 'File not found',
        message: 'A file must be selected.',
      },
    });

  return path.success();
};
