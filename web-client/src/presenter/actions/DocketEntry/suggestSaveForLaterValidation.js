export const suggestSaveForLaterValidationAction = ({ props }) => {
  if (props.errors.primaryDocumentFile) {
    return {
      errors: {
        primaryDocumentFile:
          'Scan or upload a document to serve, or click Save for Later to serve at a later time',
      },
    };
  }
};
