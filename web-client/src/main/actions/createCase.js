import { state } from 'cerebral';
import Case from '../../../../business/src/entities/Case';

export default async ({
  applicationContext,
  get,
  props: { uploadResults },
}) => {
  const useCases = applicationContext.getUseCases();
  await useCases.createCase({
    applicationContext,
    documents: [
      {
        documentId: uploadResults.petitionFileId,
        documentType: Case.documentTypes.petitionFile,
      },
      {
        documentId: uploadResults.requestForPlaceOfTrialId,
        documentType: Case.documentTypes.requestForPlaceOfTrial,
      },
      {
        documentId: uploadResults.statementOfTaxpayerIdentificationNumberId,
        documentType:
          Case.documentTypes.statementOfTaxpayerIdentificationNumber,
      },
    ],
    user: get(state.user),
  });
};
