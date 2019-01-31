import { state } from 'cerebral';

export default ({ store }) => {
  store.set(state.petition, {
    petitionFile: null,
    uploadsFinished: 0,
  });
};
