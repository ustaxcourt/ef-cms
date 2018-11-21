import { state } from 'cerebral';
import Case from '../../../../business/src/entities/Case';

export default async ({ applicationContext, get, store }) => {
  const user = get(state.user);
  const caseInitiator = get(state.petition);
  const useCases = applicationContext.getUseCases();
  const policy = await useCases.getDocumentPolicy({ applicationContext });

  const { documentId: petitionFileId } = await useCases.createDocumentMetadata({
    applicationContext,
    userToken: user.token,
    documentType: Case.documentTypes.petitionFile,
  });

  const {
    documentId: requestForPlaceOfTrialId,
  } = await useCases.createDocumentMetadata({
    applicationContext,
    userToken: user.token,
    documentType: Case.documentTypes.requestForPlaceOfTrial,
  });

  const {
    documentId: statementOfTaxpayerIdentificationNumberId,
  } = await useCases.createDocumentMetadata({
    applicationContext,
    userToken: user.token,
    documentType: Case.documentTypes.statementOfTaxpayerIdentificationNumber,
  });

  await useCases.uploadToS3({
    policy,
    documentId: petitionFileId,
    file: caseInitiator.petitionFile,
  });
  store.set(state.petition.uploadsFinished, 1);

  await useCases.uploadToS3({
    policy,
    documentId: requestForPlaceOfTrialId,
    file: caseInitiator.requestForPlaceOfTrial,
  });
  store.set(state.petition.uploadsFinished, 2);

  await useCases.uploadToS3({
    policy,
    documentId: statementOfTaxpayerIdentificationNumberId,
    file: caseInitiator.statementOfTaxpayerIdentificationNumber,
  });
  store.set(state.petition.uploadsFinished, 3);

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
