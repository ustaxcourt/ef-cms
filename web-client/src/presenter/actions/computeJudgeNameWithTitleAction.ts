import { state } from '@web-client/presenter/app.cerebral';

/**
 * computes a judges name with their title
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {function} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @returns {object} object containing judgeWithTitle
 */
export const computeJudgeNameWithTitleAction = ({
  get,
  props,
}: ActionProps) => {
  const judge = props.judge || get(state.form.judge);
  const judges = get(state.judges);
  let judgeWithTitle = judge;

  const foundJudge = judges.find(_judge => _judge.name === judge);

  if (foundJudge) {
    judgeWithTitle = `${foundJudge.judgeTitle} ${foundJudge.name}`;
  }

  return {
    judgeWithTitle,
  };
};
