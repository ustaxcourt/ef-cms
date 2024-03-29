import { UploadPetitionStep1 } from '@shared/business/entities/startCase/UploadPetitionStep1';
import { state } from '@web-client/presenter/app.cerebral';

export const validateUploadPetitionStep1Action = ({
  get,
  path,
}: ActionProps<{ selectedPage: number }>) => {
  //TODO: Support generated file source
  const petitionFileSource = 'upload';
  const { petitionFile, petitionFileSize, redactionAcknowledgement } = get(
    state.form,
  );

  const errors = new UploadPetitionStep1({
    acknowledgeChecked: redactionAcknowledgement,
    petitionFile,
    petitionFileSize,
    petitionFileSource,
  }).getFormattedValidationErrors();

  if (errors) {
    return path.error({
      errors,
    });
  }
  return path.success();
};
