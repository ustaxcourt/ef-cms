import { set, toggle } from 'cerebral/factories';
import { state } from 'cerebral';

export const toggleUsaBannerDetails = [toggle(state`usaBanner.showDetails`)];

export const gotoHome = [set(state`currentPage`, 'Home')];
export const gotoLogIn = [set(state`currentPage`, 'LogIn')];
export const gotoFilePetition = [set(state`currentPage`, 'FilePetition')];
export const gotoStyleGuide = [set(state`currentPage`, 'StyleGuide')];
