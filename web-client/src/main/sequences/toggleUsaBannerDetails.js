import { toggle } from 'cerebral/factories';
import { state } from 'cerebral';

export const toggleUsaBannerDetails = [toggle(state`usaBanner.showDetails`)];
