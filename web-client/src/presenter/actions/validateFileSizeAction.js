import { limitFileSize } from '../../views/limitFileSize';
import { state } from 'cerebral';

/**
 * validates whether the given file size does not exceed the set max upload limit
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of valid or invalid)
 * @param {object} providers.props the cerebral store used for getting the props.file
 * @param {object} providers.get the cerebral get function used for getting the state.constants
 * @returns {object} path.valid or path.invalid
 */
export const validateFileSizeAction = ({ get, path, props }) => {
  const constants = get(state.constants);
  const { file } = props;

  const isFileSizeValid = limitFileSize(
    file,
    constants.MAX_FILE_SIZE_MB,
    () => null,
  );

  if (isFileSizeValid) {
    return path.valid();
  } else {
    return path.invalid();
  }
};
