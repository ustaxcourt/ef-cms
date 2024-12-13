export const validateTrialSessionPlanningAction = ({
  path,
  props,
}: ActionProps<{ term: string; year: number }>) => {
  const { term, year } = props;

  if (!term || !year) {
    return path.error({
      errors: {
        term: !term ? 'Select a term' : undefined,
        year: !year ? 'Select a year' : undefined,
      },
    });
  }

  return path.success();
};
