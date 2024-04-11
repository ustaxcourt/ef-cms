import { UploadPetitionStep3 } from '@shared/business/entities/startCase/UploadPetitionStep3';
import { state } from '@web-client/presenter/app.cerebral';

export const validateUploadPetitionStep3Action = ({
  get,
}: ActionProps<{ selectedPage: number }>) => {
  const { hasIrsNotice } = get(state.form);
  const irsNotices = get(state.irsNoticeUploadFormInfo);
  console.log('irsNotices', irsNotices);

  const errors = new UploadPetitionStep3({
    hasIrsNotice,
    irsNotices,
  }).getFormattedValidationErrors();

  console.log('errors', errors);
};
