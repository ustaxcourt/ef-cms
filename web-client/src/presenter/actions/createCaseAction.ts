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
  const petitionMetadata = get(state.form); // todo: type
  const { atpFiles, corporateDisclosureFile, petitionFile, stinFile } =
    petitionMetadata;

  const form = omit(
    {
      ...petitionMetadata,
    },
    'trialCities',
  );

  const user = applicationContext.getCurrentUser();
  form.contactPrimary.email = user.email;

  const atpFilesMetadata = {}; // todo: type

  // todo: is check necessary?
  if (atpFiles) {
    atpFiles.forEach((fileName, index) => {
      let key = `atp${index}`;

      const progressFunction = setupPercentDone(
        {
          [key]: fileName,
        },
        store,
      );

      atpFilesMetadata[key] = {
        file: fileName,
        progressFunction: progressFunction[key],
      };
    });
  }

  const progressFunctions = setupPercentDone(
    {
      corporate: corporateDisclosureFile,
      petition: petitionFile,
      stin: stinFile,
    },
    store,
  );

  console.log('atpFilesMetadata', atpFilesMetadata);

  let filePetitionResult; //todo: type
  try {
    filePetitionResult = await applicationContext
      .getUseCases()
      .filePetitionInteractor(applicationContext, {
        atpFilesMetadata,
        corporateDisclosureFile,
        corporateDisclosureUploadProgress: progressFunctions.corporate,
        petitionFile,
        petitionMetadata: form,
        petitionUploadProgress: progressFunctions.petition,
        stinFile,
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
