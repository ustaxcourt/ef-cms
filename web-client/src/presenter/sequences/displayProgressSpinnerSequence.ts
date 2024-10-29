import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';

export const displayProgressSpinnerSequence = showProgressSequenceDecorator([
  async ({ props }: ActionProps<{ timeInSeconds: number }>) =>
    await new Promise(resolve =>
      setTimeout(() => resolve(null), props.timeInSeconds * 1000),
    ),
]) as unknown as (props: { timeInSeconds: number }) => void;
