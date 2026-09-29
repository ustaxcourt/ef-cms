import { isFiledByPractitionerName } from '@shared/business/entities/docketEntry/isFiledByPractitionerName';
import { state } from '@web-client/presenter/app.cerebral';

export const isFiledByPractitionerNameAction = ({
  get,
  path,
}: ActionProps): unknown => {
  return isFiledByPractitionerName({
    docketEntry: get(state.form),
    user: get(state.user),
  })
    ? path.yes()
    : path.no();
};
