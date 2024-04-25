import { toggleShowPasswordAction } from '@web-client/presenter/actions/toggleShowPasswordAction';

export const toggleShowPasswordSequence = [
  toggleShowPasswordAction,
] as unknown as (props: { passwordType: string }) => void;
