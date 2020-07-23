# CaseInternal
 ```
---
  type: "object"
  dependencies: 
    - 
      rel: "or"
      peers: 
        - "preferredTrialCity"
        - "requestForPlaceOfTrialFile"
        - "orderDesignatingPlaceOfTrial"
  keys: 
    caseCaption: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "max"
          args: 
            limit: 4700
    caseType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "CDP (Lien/Levy)"
        - "Deficiency"
        - "Declaratory Judgment (Exempt Organization)"
        - "Declaratory Judgment (Retirement Plan)"
        - "Innocent Spouse"
        - "Interest Abatement"
        - "Other"
        - "Partnership (BBA Section 1101)"
        - "Partnership (Section 6226)"
        - "Partnership (Section 6228)"
        - "Passport"
        - "Whistleblower"
        - "Worker Classification"
    hasVerifiedIrsNotice: 
      type: "boolean"
      flags: 
        presence: "required"
    irsNoticeDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
        description: "Last date that the petitioner is allowed to file before."
      rules: 
        - 
          name: "max"
          args: 
            date: "now"
      allow: 
        - null
    mailingDate: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "max"
          args: 
            limit: 25
    noticeOfAttachments: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the notice of attachments."
    orderDesignatingPlaceOfTrial: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the Order Designating Place of Trial."
    orderForAmendedPetition: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the order for amended Petition."
    orderForAmendedPetitionAndFilingFee: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the order for amended Petition And filing fee."
    orderForFilingFee: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the order for filing fee."
    orderForOds: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the order for ODS."
    orderForRatification: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the Order for Ratification."
    orderToShowCause: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Reminder for clerks to review the Order to Show Cause."
    partyType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "Conservator"
        - "Corporation"
        - "Custodian"
        - "Donor"
        - "Estate with an executor/personal representative/fiduciary/etc."
        - "Estate without an executor/personal representative/fiduciary/etc."
        - "Guardian"
        - "Next friend for a legally incompetent person (without a guardian, conservator, or other like fiduciary)"
        - "Next friend for a minor (without a guardian, conservator, or other like fiduciary)"
        - "Partnership (as the Tax Matters Partner)"
        - "Partnership (as a partnership representative under the BBA regime)"
        - "Partnership (as a partner other than Tax Matters Partner)"
        - "Petitioner"
        - "Petitioner & deceased spouse"
        - "Petitioner & spouse"
        - "Surviving spouse"
        - "Transferee"
        - "Trust"
    ownershipDisclosureFile: 
      type: "object"
      whens: 
        - 
          ref: 
            path: 
              - "partyType"
          is: 
            type: "any"
            flags: 
              presence: "required"
              only: true
            allow: 
              - "Corporation"
              - "Partnership (as the Tax Matters Partner)"
              - "Partnership (as a partnership representative under the BBA regime)"
              - "Partnership (as a partner other than Tax Matters Partner)"
          then: 
            type: "any"
            whens: 
              - 
                ref: 
                  path: 
                    - "orderForOds"
                is: 
                  type: "any"
                  invalid: 
                    - true
                then: 
                  type: "any"
                  flags: 
                    presence: "required"
                otherwise: 
                  type: "any"
                  flags: 
                    presence: "optional"
                  allow: 
                    - null
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    ownershipDisclosureFileSize: 
      type: "number"
      rules: 
        - 
          name: "integer"
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 262144000
      whens: 
        - 
          ref: 
            path: 
              - "ownershipDisclosureFile"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    petitionFile: 
      type: "object"
      flags: 
        presence: "required"
    petitionFileSize: 
      type: "number"
      rules: 
        - 
          name: "integer"
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 262144000
      whens: 
        - 
          ref: 
            path: 
              - "petitionFile"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    petitionPaymentStatus: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "Status of the case fee payment."
      allow: 
        - "Paid"
        - "Not Paid"
        - "Waived"
    applicationForWaiverOfFilingFeeFile: 
      type: "object"
      whens: 
        - 
          ref: 
            path: 
              - "petitionPaymentStatus"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - "Waived"
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    applicationForWaiverOfFilingFeeFileSize: 
      type: "number"
      rules: 
        - 
          name: "integer"
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 262144000
      whens: 
        - 
          ref: 
            path: 
              - "applicationForWaiverOfFilingFeeFile"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    petitionPaymentDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
      rules: 
        - 
          name: "max"
          args: 
            date: "now"
      whens: 
        - 
          ref: 
            path: 
              - "petitionPaymentStatus"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - "Paid"
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    petitionPaymentMethod: 
      type: "string"
      flags: 
        description: "How the petitioner paid the case fee."
      rules: 
        - 
          name: "max"
          args: 
            limit: 50
      whens: 
        - 
          ref: 
            path: 
              - "petitionPaymentStatus"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - "Paid"
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    petitionPaymentWaivedDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        description: "When the case fee was waived."
      whens: 
        - 
          ref: 
            path: 
              - "petitionPaymentStatus"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - "Waived"
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    preferredTrialCity: 
      type: "alternatives"
      matches: 
        - 
          ref: 
            path: 
              - "requestForPlaceOfTrialFile"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "string"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    procedureType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "Regular"
        - "Small"
    receivedAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "required"
      rules: 
        - 
          name: "max"
          args: 
            date: "now"
    requestForPlaceOfTrialFile: 
      type: "alternatives"
      matches: 
        - 
          ref: 
            path: 
              - "preferredTrialCity"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "object"
            flags: 
              presence: "required"
          otherwise: 
            type: "object"
            flags: 
              presence: "optional"
    requestForPlaceOfTrialFileSize: 
      type: "number"
      rules: 
        - 
          name: "integer"
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 262144000
      whens: 
        - 
          ref: 
            path: 
              - "requestForPlaceOfTrialFile"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    statistics: 
      type: "array"
      flags: 
        description: "List of Statistic Entities for the case."
      whens: 
        - 
          ref: 
            path: 
              - "hasVerifiedIrsNotice"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - true
          then: 
            type: "any"
            whens: 
              - 
                ref: 
                  path: 
                    - "caseType"
                is: 
                  type: "any"
                  flags: 
                    only: true
                    presence: "required"
                  allow: 
                    - 
                      override: true
                    - "Deficiency"
                then: 
                  type: "array"
                  flags: 
                    presence: "required"
                  rules: 
                    - 
                      name: "min"
                      args: 
                        limit: 1
                otherwise: 
                  type: "any"
                  flags: 
                    presence: "optional"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
      items: 
        - 
          type: "object"
          metas: 
            - 
              entityName: "Statistic"
    stinFile: 
      type: "object"
      flags: 
        presence: "optional"
    stinFileSize: 
      type: "number"
      rules: 
        - 
          name: "integer"
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 262144000
      whens: 
        - 
          ref: 
            path: 
              - "stinFile"
          is: 
            type: "any"
            flags: 
              presence: "required"
            invalid: 
              - null
          then: 
            type: "any"
            flags: 
              presence: "required"
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    useSameAsPrimary: 
      type: "boolean"
      flags: 
        presence: "optional"
        description: "Whether to use the same address for the primary and secondary petitioner contact information (used only in data entry and QC process)."

 ```
