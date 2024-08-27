import { setSingletonSequenceNameAction } from '@web-client/presenter/actions/setSingletonSequenceNameAction';
import { unsetSingletonSequenceNameAction } from '@web-client/presenter/actions/unsetSingletonSequenceNameAction';

export const singletonSequenceDecorator = (
  sequenceName: string,
  actionsList: any[],
): any[] => {
  return [
    () => ({ sequenceName }),
    setSingletonSequenceNameAction,
    {
      alreadyRunning: [],
      execute: [...actionsList, unsetSingletonSequenceNameAction],
    },
  ];
};
