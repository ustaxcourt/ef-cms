import { environment } from '@web-api/environment';
import { shuffle } from 'lodash';

export const makeNewPassword = (
  validCharacterSets: string[] = [
    'characters',
    'lowercase',
    'numbers',
    'uppercase',
  ],
  length: number = 0,
): string => {
  const getRandomChar = charSet =>
    charSet.charAt(Math.floor(Math.random() * charSet.length));

  // get number between 12 and 20
  const passwordLength = length || 12 + Math.floor(Math.random() * 9);
  const availableCharacterSets = {
    characters: '^*.()@#%&/,><:;_~=+-',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  };
  const charSets = {};
  for (const chars of validCharacterSets) {
    if (chars in availableCharacterSets) {
      charSets[chars] = availableCharacterSets[chars];
    }
  }
  if (!Object.keys(charSets)) {
    return '';
  }
  const allCharacters = Object.keys(charSets)
    .map(key => charSets[key])
    .join('');

  // get at least one random char from each of the sets
  let result = Object.keys(key => getRandomChar(charSets[key])).join('');

  // build the password
  for (let i = result.length; i <= passwordLength; i++) {
    result += getRandomChar(allCharacters);
  }

  // shuffle the password
  return shuffle(result.split('')).join('');
};

export const getNewPasswordForEnvironment = (): string => {
  if (environment.stage === 'prod') {
    return makeNewPassword();
  }
  return environment.defaultAccountPass;
};
