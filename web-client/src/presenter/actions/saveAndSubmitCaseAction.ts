import { ElectronicCreatedCaseType } from '@shared/business/useCases/createCaseInteractor';
import { FileUploadProgressMapType } from '@shared/business/entities/EntityConstants';
import { PETITION_TYPES } from '@web-client/presenter/actions/setupPetitionStateAction';
import { state } from '@web-client/presenter/app.cerebral';

export const saveAndSubmitCaseAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps<{
  fileUploadProgressMap: FileUploadProgressMapType;
}>) => {
  const { fileUploadProgressMap } = props;
  const petitionMetadata: ElectronicCreatedCaseType = get(
    state.petitionFormatted,
  );

  let caseDetail;
  let stinFile;

  try {
    let {
      attachmentToPetitionFileId,
      corporateDisclosureFileId,
      petitionFileId,
      stinFileId,
    } = await applicationContext
      .getUseCases()
      .generateDocumentIds(applicationContext, {
        attachmentToPetitionUploadProgress:
          fileUploadProgressMap.attachmentToPetition,
        corporateDisclosureUploadProgress:
          fileUploadProgressMap.corporateDisclosure,
        petitionUploadProgress: fileUploadProgressMap.petition,
        stinUploadProgress: fileUploadProgressMap.stin,
      });

    stinFile = stinFileId;

    caseDetail = await applicationContext
      .getUseCases()
      .createCaseInteractor(applicationContext, {
        attachmentToPetitionFileId,
        corporateDisclosureFileId,
        petitionFileId:
          petitionMetadata.petitionType === PETITION_TYPES.userUploaded
            ? petitionFileId
            : petitionMetadata.petitionFileId!,
        petitionMetadata,
        stinFileId: stinFile,
      });
  } catch (err) {
    return path.error();
  }

  const addCoversheet = docketEntryId => {
    return applicationContext
      .getUseCases()
      .addCoversheetInteractor(applicationContext, {
        docketEntryId,
        docketNumber: caseDetail.docketNumber,
      });
  };

  const documentsThatNeedCoverSheet = caseDetail.docketEntries
    .filter(d => d.isFileAttached)
    .map(d => d.docketEntryId);

  // for security reasons, the STIN is not in the API response, but we already know the docketEntryId
  documentsThatNeedCoverSheet.push(stinFile);

  await Promise.all(documentsThatNeedCoverSheet.map(addCoversheet));

  return path.success({
    alertSuccess: {
      message:
        'Your case has been created and your documents sent to the U.S. Tax Court.',
      title: `Your case has been assigned docket number ${caseDetail.docketNumber}`,
    },
    caseDetail,
  });
};
