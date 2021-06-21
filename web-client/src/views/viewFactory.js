import { Button } from '../ustc-ui/Button/Button';
import { ErrorNotification } from './ErrorNotification';

const views = {
  Button,
  ErrorNotification,
};

export const getView = viewName => views[viewName];
