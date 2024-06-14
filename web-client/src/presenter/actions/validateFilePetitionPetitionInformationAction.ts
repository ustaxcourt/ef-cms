import { UploadPetitionStep1 } from '@shared/business/entities/startCase/UploadPetitionStep1';
import { state } from '@web-client/presenter/app.cerebral';

export const validateFilePetitionPetitionInformationAction = ({
  path,
  props,
  store,
}: ActionProps<{ petitionInformation: any }>) => {
  const { petitionInformation } = props;

  // move this logic to new action?
  petitionInformation.petitionReasons = (arr => (arr.length > 0 ? arr : ['']))(
    petitionInformation.petitionReasons.filter(r => r.length >= 1),
  );

  petitionInformation.petitionFacts = (arr => (arr.length > 0 ? arr : ['']))(
    petitionInformation.petitionFacts.filter(r => r.length >= 1),
  );

  store.set(state.form.petitionReasons, petitionInformation.petitionReasons);
  store.set(state.form.petitionFacts, petitionInformation.petitionFacts);

  let errors = new UploadPetitionStep1(
    petitionInformation,
  ).getFormattedValidationErrors();

  if (errors) {
    return path.error({
      errors,
    });
  }
  return path.success();
};
