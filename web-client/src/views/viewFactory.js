import { Button } from '../ustc-ui/Button/Button';
import { CaseNotes } from './CaseDetail/CaseNotes';
import { ErrorNotification } from './ErrorNotification';

import { CaseNotes as CaseNotesOld } from './CaseDetail/CaseNotes.old';

import { isCodeDisabled } from '../../../codeToggles';

// TODO: Gradually add more views as needed
const views = {
  Button,
  CaseNotes,
  ErrorNotification,
};

if (isCodeDisabled(6979)) {
  views.CaseNotes = CaseNotesOld;
}

export { views };
