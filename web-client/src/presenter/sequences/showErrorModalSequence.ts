import { logErrorAction } from '@web-client/presenter/actions/logErrorAction';
import { setModalMessageAction } from '@web-client/presenter/actions/setModalMessageAction';
import { setModalTitleAction } from '@web-client/presenter/actions/setModalTitleAction';
import { setShowModalFactoryAction } from '@web-client/presenter/actions/setShowModalFactoryAction';

export const showErrorModalSequence = [
  setModalTitleAction,
  setModalMessageAction,
  logErrorAction,
  setShowModalFactoryAction('GenericErrorModal'),
] as unknown as (props: {
  message: string;
  title: string;
  errorToLog?: any;
}) => void;
