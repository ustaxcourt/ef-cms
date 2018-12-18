import { state } from 'cerebral';

export default ({ store }) => {
  store.set(state.document, {
    file: null,
    uploadsFinished: 0,
  });
};
