import { Button } from '../ustc-ui/Button/Button';
import { ErrorNotification } from './ErrorNotification';
import { SuccessNotification } from './SuccessNotification';

const views = {
  Button,
  ErrorNotification,
  SuccessNotification,
};

export const getView = viewName => views[viewName];
