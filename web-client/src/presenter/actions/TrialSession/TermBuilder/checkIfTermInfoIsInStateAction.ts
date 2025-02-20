import { state } from '@web-client/presenter/app.cerebral';

export const checkIfTermInfoIsInStateAction = ({ get, path }: ActionProps) => {
  const termBuilderInformation = get(state.termBuilderInformation);
  if (!termBuilderInformation) return path.doesNotExist();
  return path.exist();
};
