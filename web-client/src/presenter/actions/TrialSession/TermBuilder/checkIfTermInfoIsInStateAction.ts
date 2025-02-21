import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const checkIfTermInfoIsInStateAction = ({ get, path }: ActionProps) => {
  const termBuilderInformation = get(
    state[STATE_KEYS.TERM_BUILDER_INFORMATION],
  );
  if (!termBuilderInformation) return path.doesNotExist();
  return path.exist();
};
