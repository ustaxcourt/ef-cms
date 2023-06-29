/**
 *
 */
export function pinkLog(...args): void {
  const pink: string = '\x1b[35m';
  const resetToDefault: string = '\x1b[0m';
  const interpolateCharacter: string = '%s';

  for (let i = 0; i < args.length; i++) {
    if (i === args.length - 1) {
      console.log(
        pink + interpolateCharacter + resetToDefault,
        JSON.stringify(args[i], null, 2),
      );
    } else {
      console.log(
        pink + interpolateCharacter,
        JSON.stringify(args[i], null, 2),
      );
    }
  }
}
