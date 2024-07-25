import { UploadPetitionStep2 } from '@shared/business/entities/startCase/UploadPetitionStep2';
import { state } from '@web-client/presenter/app.cerebral';

export const validateUploadPetitionStep2Action = ({
  path,
  props,
  store,
}: ActionProps<{ createPetitionStep2Data: any }>) => {
  const { createPetitionStep2Data } = props;

  // move this logic to new action?
  createPetitionStep2Data.petitionReasons = (arr =>
    arr.length > 0 ? arr : [''])(
    createPetitionStep2Data.petitionReasons.filter(r => r.length >= 1),
  );

  createPetitionStep2Data.petitionFacts = (arr =>
    arr.length > 0 ? arr : [''])(
    createPetitionStep2Data.petitionFacts.filter(r => r.length >= 1),
  );

  store.set(
    state.form.petitionReasons,
    createPetitionStep2Data.petitionReasons,
  );
  store.set(state.form.petitionFacts, createPetitionStep2Data.petitionFacts);

  let errors = new UploadPetitionStep2(
    createPetitionStep2Data,
  ).getFormattedValidationErrors();
  if (errors) {
    return path.error({
      errors,
    });
  }
  return path.success();
};
