import { toggleShowPasswordAction } from '@web-client/presenter/actions/toggleShowPasswordAction';

export const toggleShowPasswordSequence = [
  toggleShowPasswordAction,
] as unknown as (passwordType: string) => void;
