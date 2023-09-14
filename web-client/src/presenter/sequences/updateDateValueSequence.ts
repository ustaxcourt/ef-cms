import { formatDateAction } from '@web-client/presenter/actions/formatDateAction';
import { setFormValueAction } from '../actions/setFormValueAction';

export const updateDateValueSequence = [formatDateAction, setFormValueAction];
