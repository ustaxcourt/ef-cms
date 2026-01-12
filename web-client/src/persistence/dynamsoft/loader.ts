export async function loadDWTLibrary() {
  // loading dwt will add a DWT object to the window
  await import('dwt');
}
