import { UploadPetitionStep2 } from '@shared/business/entities/startCase/UploadPetitionStep2';
import { state } from '@web-client/presenter/app.cerebral';

export const validateUploadPetitionStep2Action = ({
  path,
  props,
  store,
}: ActionProps<{ step2Data: any }>) => {
  const { step2Data } = props;

  // move this logic to new action?
  step2Data.petitionReasons = (arr => (arr.length > 0 ? arr : ['']))(
    step2Data.petitionReasons.filter(r => r.length >= 1),
  );

  step2Data.petitionFacts = (arr => (arr.length > 0 ? arr : ['']))(
    step2Data.petitionFacts.filter(r => r.length >= 1),
  );

  store.set(state.form.petitionReasons, step2Data.petitionReasons);
  store.set(state.form.petitionFacts, step2Data.petitionFacts);

  let errors = new UploadPetitionStep2(
    step2Data,
  ).getFormattedValidationErrors();
  if (errors) {
    return path.error({
      errors,
    });
  }
  return path.success();
};
