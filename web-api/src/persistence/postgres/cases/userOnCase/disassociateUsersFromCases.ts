import { pgDeleteFrom } from '../../utils/operation/pgDeleteFrom';

export const disassociateUsersFromCases = async (
  disassociations: { docketNumber: string; userId: string }[],
): Promise<void> => {
  await pgDeleteFrom({
    table: 'dwUserOnCase',
    where: qb =>
      qb.where(cb =>
        cb.or(
          disassociations.map(pair =>
            cb.and([
              cb('docketNumber', '=', pair.docketNumber),
              cb('userId', '=', pair.userId),
            ]),
          ),
        ),
      ),
  });
};
