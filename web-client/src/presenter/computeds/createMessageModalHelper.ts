import { state } from 'cerebral';

export const createMessageModalHelper = get => {
  const users = get(state.users);

  const formattedUsers = (users || []).map(user => {
    if (user.role === 'judge' || user.role === 'legacyJudge') {
      const { judgeTitle, name } = user;

      return {
        ...user,
        name: `${judgeTitle} ${name}`,
      };
    } else {
      return user;
    }
  });
  return {
    formattedUsers,
  };
};
