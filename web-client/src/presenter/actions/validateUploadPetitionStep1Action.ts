import { UploadPetitionStep1 } from '@shared/business/entities/startCase/UploadPetitionStep1';
import { state } from '@web-client/presenter/app.cerebral';

export const validateUploadPetitionStep1Action = ({
  path,
  props,
  store,
}: ActionProps<{ step1Data: any }>) => {
  const { step1Data } = props;

  // move this logic to new action?
  step1Data.petitionReasons = (arr => (arr.length > 0 ? arr : ['']))(
    step1Data.petitionReasons.filter(r => r.length >= 1),
  );

  step1Data.petitionFacts = (arr => (arr.length > 0 ? arr : ['']))(
    step1Data.petitionFacts.filter(r => r.length >= 1),
  );

  store.set(state.form.petitionReasons, step1Data.petitionReasons);
  store.set(state.form.petitionFacts, step1Data.petitionFacts);

  let errors = new UploadPetitionStep1(
    step1Data,
  ).getFormattedValidationErrors();
  console.log('errors', errors);
  if (errors) {
    return path.error({
      errors,
    });
  }
  return path.success();
};
