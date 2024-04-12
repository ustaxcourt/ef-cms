import { UploadPetitionStep3 } from '@shared/business/entities/startCase/UploadPetitionStep3';
import { state } from '@web-client/presenter/app.cerebral';

export const validateUploadPetitionStep3Action = ({
  get,
  path,
}: ActionProps<{ selectedPage: number }>) => {
  const { caseType, hasIrsNotice } = get(state.form);
  const irsNotices = get(state.irsNoticeUploadFormInfo);

  console.log('hasIrsNotice', hasIrsNotice);
  console.log('caseType', caseType);
  const errors = new UploadPetitionStep3({
    caseType,
    hasIrsNotice,
    irsNotices,
  }).getFormattedValidationErrors();

  return errors
    ? path.error({
        errors,
      })
    : path.success();
};
