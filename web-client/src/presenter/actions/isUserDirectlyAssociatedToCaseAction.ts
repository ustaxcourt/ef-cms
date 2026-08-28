import { canUserFileFirstIrsFiling } from '@shared/business/utilities/canUserFileFirstIrsFiling';
import { state } from '@web-client/presenter/app.cerebral';

export const isUserDirectlyAssociatedToCaseAction = ({
  props,
  path,
  get,
}: ActionProps) => {
  const user = get(state.user);
  const { caseDetail } = props;

  if (props.isDirectlyAssociated || canUserFileFirstIrsFiling(user, caseDetail))
    return path.yes();
  return path.no();
};
