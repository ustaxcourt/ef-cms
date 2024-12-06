import {EligibleCase} from '@shared/business/entities/cases/EligibleCase';
import {Get} from 'cerebral';
import {state} from '@web-client/presenter/app.cerebral';
import {caseDetailHelper} from "@web-client/presenter/computeds/caseDetailHelper";
import {formatCase} from "@shared/business/utilities/getFormattedCaseDetail";
import {UnknownAuthUser} from "@shared/business/entities/authUser/AuthUser";

export const trialLocationHelper = (
    get: Get,
    applicationContext,
): {
    location: string;
    eligibleCases: EligibleCase[];
} => {
    // const permissions = get(state.permissions)!;
    const {eligibleCases, location} = get(state.trialLocationPage);
    const {formattedEligibleCases} = eligibleCases.map(c => {
        formatCase,
            caseDetail,
            authorizedUser: get(state.user);
    })

    const trialCityFormatted = location.replace('-', ', ');

    // const pageSize = 100;

    return {formattedEligibleCases, location: trialCityFormatted};
};
