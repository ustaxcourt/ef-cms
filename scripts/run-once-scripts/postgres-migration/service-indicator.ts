import { practitioners } from '@web-api/persistence/postgres/utils/seed/fixtures/practitioners';
import { usersOnCase } from '@web-api/persistence/postgres/utils/seed/fixtures/users/usersOnCase';

async function main() {
  const newUsersOnCase = usersOnCase.map(user => {
    const maybeServiceIndicator =
      practitioners.find(p => {
        return p.userId === user.userId;
      })?.serviceIndicator || undefined;

    if (maybeServiceIndicator) {
      user.serviceIndicatorOnCase = maybeServiceIndicator;
    }

    return user;
  });
  console.log('newUsersOnCase', newUsersOnCase);
}

main();
