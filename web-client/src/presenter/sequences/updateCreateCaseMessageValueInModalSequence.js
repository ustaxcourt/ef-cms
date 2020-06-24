/* eslint-disable sort-keys-fix/sort-keys-fix */
import { clearUsersAction } from '../actions/clearUsersAction';
import { getUsersInSectionSequence } from './getUsersInSectionSequence';
import { isChambersPathAction } from '../actions/ForwardForm/isChambersPathAction';
import { props, state } from 'cerebral';
import { runKeyPathAction } from '../actions/runKeyPathAction';
import { set } from 'cerebral/factories';

// TODO: refactor this
export const updateCreateCaseMessageValueInModalSequence = [
  ({ props: sequenceProps }) => ({
    form: 'modal.form',
    section: sequenceProps.value,
  }),
  runKeyPathAction,
  {
    toSection: [
      isChambersPathAction,
      {
        yes: [
          set(state.modal.showChambersSelect, true),
          set(state.modal.form.toSection, ''),
          set(state.modal.form.assigneeId, ''),
          clearUsersAction,
        ],
        no: [
          set(state.modal.showChambersSelect, false),
          set(state.modal.form.toSection, props.value),
          ...getUsersInSectionSequence,
        ],
      },
    ],
    chambers: [
      set(state.modal.form.toSection, props.value),
      ...getUsersInSectionSequence,
    ],
    default: [set(state.modal.form[props.key], props.value)],
  },
];
