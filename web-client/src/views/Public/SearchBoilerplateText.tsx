import { emptyUserState } from '@web-client/presenter/state/userState';
import {
  ROLES,
  PRACTICE_TYPE,
} from '@shared/business/entities/EntityConstants';
import React from 'react';

export function SearchBoilerplateText({
  formTypeText,
  isOpinion = false,
  user = { ...emptyUserState },
}) {
  const practitionerRoles = new Set([
    ROLES.privatePractitioner,
    ROLES.irsPractitioner,
    ROLES.inactivePractitioner,
  ]);

  const practitionerTypes = new Set([
    PRACTICE_TYPE.Private,
    PRACTICE_TYPE.IRS,
    PRACTICE_TYPE.DOJ,
  ]);

  const isPractitionerUser =
    practitionerRoles.has((user as any)?.role) ||
    practitionerTypes.has((user as any)?.practiceType);

  const showBullets =
    isPractitionerUser ||
    (formTypeText !== 'an order' && formTypeText !== 'an opinion') ||
    !user?.userId;

  return (
    <>
      <p className="margin-top-0">
        Anyone can search for {formTypeText} in our system for cases filed{' '}
        <span className="text-semibold">on or after May 1, 1986</span>.
        {isOpinion && (
          <>
            {' '}
            Any online sourced citations in opinions filed after July 1, 2016
            can be viewed directly from the associated docket record.
          </>
        )}
      </p>
      {/* Only render bullets if external user, not an order, not an opinion */}
      {showBullets && (
        <ul>
          <li>
            {' '}
            If you aren’t affiliated with a case, you will only see limited
            information about that case.
          </li>
          {!isOpinion && (
            <li>
              Sealed cases and affiliated documents will not display in search
              results.
            </li>
          )}
        </ul>
      )}
    </>
  );
}

SearchBoilerplateText.displayName = 'SearchBoilerplateText';
