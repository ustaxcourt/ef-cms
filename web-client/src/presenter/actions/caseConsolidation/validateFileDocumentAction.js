import { isEmpty } from 'lodash';
import { state } from 'cerebral';

export const validateFileDocumentAction = ({ get, path }) => {
  const casesToFileDocument = get(state.modal.casesToFileDocument);

  if (!isEmpty(casesToFileDocument)) {
    return path.success();
  } else {
    console.log('ayyy');
    return path.error({ error: 'Select a case' });
  }
};
