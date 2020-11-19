import { Button } from '../ustc-ui/Button/Button';
import { CaseNotes } from './CaseDetail/CaseNotes';
import { ErrorNotification } from './ErrorNotification';

import { CaseNotes as CaseNotes6979 } from './CaseDetail/CaseNotes.6979';

import { isCodeEnabled } from '../../../codeToggles';

// TODO: Gradually add more views as needed
const views = {
  Button,
  CaseNotes,
  ErrorNotification,
};

if (isCodeEnabled(6979)) {
  views.CaseNotes = CaseNotes6979;
}

export const getView = viewName => views[viewName];
