export const suggestSaveForLaterValidationAction = ({ props }: ActionProps) => {
  if (props.errors && props.errors.primaryDocumentFile) {
    return {
      errors: {
        ...props.errors,
        primaryDocumentFile:
          'Scan or upload a document to serve, or click Save for Later to serve at a later time',
      },
    };
  }
};
