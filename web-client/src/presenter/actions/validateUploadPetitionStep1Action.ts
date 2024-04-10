import { UploadPetitionStep1 } from '@shared/business/entities/startCase/UploadPetitionStep1';
import { state } from '@web-client/presenter/app.cerebral';

export const validateUploadPetitionStep1Action = ({
  get,
  path,
}: ActionProps<{ selectedPage: number }>) => {
  const {
    petitionFacts,
    petitionFile,
    petitionFileSize,
    petitionReasons,
    petitionType,
    redactionAcknowledgement,
  } = get(state.form);

  const errors = new UploadPetitionStep1({
    acknowledgeChecked: redactionAcknowledgement,
    petitionFacts,
    petitionFile,
    petitionFileSize,
    petitionReasons,
    petitionType,
  }).getFormattedValidationErrors();

  if (errors) {
    return path.error({
      errors,
    });
  }
  return path.success();
};
