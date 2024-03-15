export type PasswordConfig = {
  length: number;
  lower: number;
  upper: number;
  digits: number;
  special: number;
};

export function generatePassword(config: PasswordConfig): string {
  const charSets: { [key: string]: string } = {
    digits: '0123456789',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    special: '!@#$',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  };

  const getRandomChar = (charSet: string) =>
    charSet[Math.floor(Math.random() * charSet.length)];

  const password: string[] = [];

  const addChars = (charSet: string, count: number) => {
    for (let i = 0; i < count; i++) {
      password.push(getRandomChar(charSet));
    }
  };

  const includeChars = (type: keyof PasswordConfig) => {
    if (config[type] > 0) {
      addChars(charSets[type], config[type]);
    }
  };

  includeChars('lower');
  includeChars('upper');
  includeChars('digits');
  includeChars('special');

  const remainingLength = config.length - password.length;

  if (remainingLength > 0) {
    const remainingCharSets: string[] = [];
    if (config.lower > 0) remainingCharSets.push(charSets.lower);
    if (config.upper > 0) remainingCharSets.push(charSets.upper);
    if (config.digits > 0) remainingCharSets.push(charSets.digits);
    if (config.special > 0) remainingCharSets.push(charSets.special);

    const allChars = remainingCharSets.join('');
    addChars(allChars, remainingLength);
  }

  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join('');
}
