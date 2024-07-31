import { GeneratePetitionPdf } from '@shared/business/entities/startCase/GeneratePetitionPdf';
import { PETITION_TYPES } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const generatePetitionPdfAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const petition = get(state.petitionFormatted);

  const { petitionType } = petition;

  if (petitionType !== PETITION_TYPES.autoGenerated) return;

  const generatePetitionPdfEntity = new GeneratePetitionPdf(petition);
  const errors = generatePetitionPdfEntity.getFormattedValidationErrors();
  if (errors) {
    throw Error('Petition PDF generation failed due to invalid data.');
  }

  const generatePetitionPdfData = generatePetitionPdfEntity.toRawObject();
  const { fileId } = await applicationContext
    .getUseCases()
    .generatePetitionPdfInteractor(applicationContext, generatePetitionPdfData);

  store.set(state.petitionFormatted.petitionFileId, fileId);
};
