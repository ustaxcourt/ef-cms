import { setFormValueAction } from '../actions/setFormValueAction';
import { updateOrderForDesignatingPlaceOfTrialAction } from '../actions/updateOrderForDesignatingPlaceOfTrialAction';

export const updateOrderForDesignatingPlaceOfTrialSequence = [
  setFormValueAction,
  updateOrderForDesignatingPlaceOfTrialAction,
];
