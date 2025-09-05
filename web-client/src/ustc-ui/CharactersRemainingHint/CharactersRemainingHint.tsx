import React from 'react';

export const CharactersRemainingHint = ({
  maxCharacters,
  stringToCount = '',
}: {
  maxCharacters: number;
  stringToCount: string | null | undefined;
}) => {
  const charactersRemaining = maxCharacters - (stringToCount || '').length;

  return (
    <span
      aria-live="polite"
      className="usa-hint usa-character-count__message"
      id="with-hint-textarea-info"
    >
      {charactersRemaining} characters remaining
    </span>
  );
};

CharactersRemainingHint.displayName = 'CharactersRemainingHint';
