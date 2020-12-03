import { Button } from '../ustc-ui/Button/Button';
import { ErrorNotification } from './ErrorNotification';

// TODO: Gradually add more views as needed
const views = {
  Button,
  ErrorNotification,
};

export const getView = viewName => views[viewName];
