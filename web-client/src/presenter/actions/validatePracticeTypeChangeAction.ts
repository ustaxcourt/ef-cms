import { state } from '@web-client/presenter/app.cerebral';

export const validatePracticeTypeChangeAction = ({
  get,
  path,
}: ActionProps) => {
  const openCases = get(state.practitionerInformationHelper.openCasesTotal);

  if (openCases !== 0) {
    return path.error({
      errors: {
        invalidPracticeTypeChange:
          'Practitioner has to be withdrawn from all open cases to change practice type.',
      },
    });
  }

  return path.success();
};
