import { state } from '@web-client/presenter/app.cerebral';

export const setupFilesExternalDocumentUploadAction = ({
  get,
}: ActionProps<{
  files: any;
}>) => {
  const petitionMetadata = get(state.form);
  const {
    primaryDocumentFile,
    secondaryDocumentFile,
    secondarySupportingDocuments,
    supportingDocuments,
  } = petitionMetadata;

  console.log('petitionMetadata', petitionMetadata);
  const primarySupportingDocs = {};
  const secondarySupportingDocs = {};

  supportingDocuments.forEach((supportingDoc, index) => {
    primarySupportingDocs[`primarySupporting${index}`] =
      supportingDoc.supportingDocumentFile;
  });

  secondarySupportingDocuments.forEach((supportingDoc, index) => {
    secondarySupportingDocs[`secondarySupporting${index}`] =
      supportingDoc.supportingDocumentFile;
  });

  const files = {
    files: {
      primary: primaryDocumentFile,
      secondary: secondaryDocumentFile,
      ...primarySupportingDocs,
      ...secondarySupportingDocs,
    },
  };
  return files;
};
