import { omit } from 'lodash';
import { setupPercentDone } from './createCaseFromPaperAction';
import { state } from '@web-client/presenter/app.cerebral';
/**
 * invokes the filePetition useCase.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function used for getting petition
 * @param {object} providers.path the next object in the path
 * @param {object} providers.store the cerebral store object
 * @returns {object} the next path based on if creation was successful or error
 */
export const createCaseAction = async ({
  applicationContext,
  get,
  path,
  store,
}: ActionProps) => {
  const petitionMetadata = get(state.form);
  const {
    attachmentToPetitionFiles,
    corporateDisclosureFile,
    petitionFile,
    stinFile,
  } = petitionMetadata;

  const form = omit(petitionMetadata, 'trialCities');

  const user = applicationContext.getCurrentUser();
  form.contactPrimary.email = user.email;

  const progressFunctions = setupPercentDone(
    {
      atp: attachmentToPetitionFiles,
      corporate: corporateDisclosureFile,
      petition: petitionFile,
      stin: stinFile,
    },
    store,
    get,
  );

  const atpUploadsInfo = Object.keys(progressFunctions)
    .map(key => {
      if (key.startsWith('atp')) {
        return progressFunctions[key];
      }
    })
    .filter(val => !!val);

  console.log('progressFunctions', progressFunctions);
  let filePetitionResult;
  try {
    filePetitionResult = await applicationContext
      .getUseCases()
      .filePetitionInteractor(applicationContext, {
        atpUploadProgress: atpUploadsInfo,
        corporateDisclosureUploadProgress: progressFunctions.corporate,
        petitionMetadata: form,
        petitionUploadProgress: progressFunctions.petition,
        stinUploadProgress: progressFunctions.stin,
      });
  } catch (err) {
    return path.error();
  }
  const { caseDetail, stinFileId } = filePetitionResult;

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
  documentsThatNeedCoverSheet.push(stinFileId);

  await Promise.all(documentsThatNeedCoverSheet.map(addCoversheet));

  return path.success({
    caseDetail,
  });
};
