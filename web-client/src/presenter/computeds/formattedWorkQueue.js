import _ from 'lodash';
import { state } from 'cerebral';
import moment from 'moment';

export const formatWorkItem = workItem => {
  const result = _.cloneDeep(workItem);
  result.createdAtFormatted = moment(result.createdAt).format('L');
  result.messages.forEach(
    message =>
      (message.createdAtFormatted = moment(message.createdAt).format('L')),
  );
  return result;
};

export const formattedWorkQueue = get => {
  const workItems = get(state.workQueue);
  return workItems.map(formatWorkItem);
};
