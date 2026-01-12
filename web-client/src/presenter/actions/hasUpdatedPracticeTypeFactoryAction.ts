import { state } from '@web-client/presenter/app.cerebral';
export const hasUpdatedPracticeTypeFactoryAction = formField => {
  const hasUpdatedPracticeTypeAction = ({ get, path }: ActionProps) => {
    const updatedPracticeType = get(state.form[formField]);
    const originalPracticeType = get(state.form.originalPracticeType);

    return updatedPracticeType !== originalPracticeType
      ? path.yes()
      : path.no();
  };

  return hasUpdatedPracticeTypeAction;
};
