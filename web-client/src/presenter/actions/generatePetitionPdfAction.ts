import { FORMATS } from '@shared/business/utilities/DateHandler';
import { PETITION_TYPES } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const generatePetitionPdfAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const petition = get(state.petitionFormatted);

  const { petitionType } = petition;

  if (petitionType === PETITION_TYPES.autoGenerated) {
    const { fileId } = await applicationContext
      .getUseCases()
      .generatePetitionPdfInteractor(applicationContext, {
        ...petition,
        // do this in interactor
        noticeIssuedDate: applicationContext
          .getUtilities()
          .formatDateString(petition.noticeIssuedDate || '', FORMATS.MMDDYY),
      });

    store.set(state.petitionFormatted.petitionFileId, fileId);
  }
};
