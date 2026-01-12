
export function getMaintenanceMode(): Promise<
  { current: boolean } | undefined
> {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return Promise.resolve({ current: true });
  }

  return Promise.resolve({ current: false });
}
