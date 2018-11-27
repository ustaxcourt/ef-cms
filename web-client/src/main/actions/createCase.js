import { state } from 'cerebral';
import Case from '../../../../business/src/entities/Case';

export default async ({ applicationContext, get }) => {
  const user = get(state.user);
  const caseInitiator = get(state.petition);
  const useCases = applicationContext.getUseCases();

  const {
    petitionFileId,
    requestForPlaceOfTrialId,
    statementOfTaxpayerIdentificationNumberId,
  } = await useCases.uploadCasePdfs({
    applicationContext,
    caseInitiator,
    user,
  });

  await useCases.createCase({
    applicationContext,
    documents: [
      {
        documentId: petitionFileId,
        documentType: Case.documentTypes.petitionFile,
      },
      {
        documentId: requestForPlaceOfTrialId,
        documentType: Case.documentTypes.requestForPlaceOfTrial,
      },
      {
        documentId: statementOfTaxpayerIdentificationNumberId,
        documentType:
          Case.documentTypes.statementOfTaxpayerIdentificationNumber,
      },
    ],
    userId: user.userId,
  });
};
