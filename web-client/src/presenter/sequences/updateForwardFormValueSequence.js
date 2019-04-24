/* eslint-disable sort-keys-fix/sort-keys-fix */
import { clearSectionAction } from '../actions/ForwardForm/clearSectionAction';
import { clearUsersAction } from '../actions/clearUsersAction';
import { getUsersInSectionSequence } from './getUsersInSectionSequence';
import { isChambersPathAction } from '../actions/ForwardForm/isChambersPathAction';
import { props, state } from 'cerebral';
import { runKeyPathAction } from '../actions/runKeyPathAction';
import { set } from 'cerebral/factories';
import { setForwardFormValueAction } from '../actions/ForwardForm/setForwardFormValueAction';
import { setSectionAction } from '../actions/ForwardForm/setSectionAction';

export const updateForwardFormValueSequence = [
  runKeyPathAction,
  {
    section: [
      isChambersPathAction,
      {
        yes: [
          set(state.workItemMetadata.showChambersSelect, true),
          clearSectionAction,
          set(state[props.form].assigneeId, ''),
          clearUsersAction,
        ],
        no: [
          set(state.workItemMetadata.showChambersSelect, false),
          setForwardFormValueAction,
          ...getUsersInSectionSequence,
        ],
      },
    ],
    chambers: [setSectionAction, ...getUsersInSectionSequence],
    default: [setForwardFormValueAction],
  },
];
