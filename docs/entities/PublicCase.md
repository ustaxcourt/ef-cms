# PublicCase
 ```
---
  type: "object"
  whens: 
    - 
      is: 
        type: "object"
        flags: 
          unknown: true
        keys: 
          isSealed: 
            type: "any"
            flags: 
              only: true
            allow: 
              - 
                override: true
              - true
      then: 
        type: "object"
        keys: 
          caseCaption: 
            type: "any"
            flags: 
              presence: "forbidden"
          contactPrimary: 
            type: "any"
            flags: 
              presence: "forbidden"
          contactSecondary: 
            type: "any"
            flags: 
              presence: "forbidden"
          createdAt: 
            type: "any"
            flags: 
              presence: "forbidden"
          docketEntries: 
            type: "array"
            rules: 
              - 
                name: "max"
                args: 
                  limit: 0
          docketNumber: 
            type: "string"
            flags: 
              presence: "required"
            rules: 
              - 
                name: "min"
                args: 
                  limit: 1
              - 
                name: "pattern"
                args: 
                  regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
          docketNumberSuffix: 
            type: "string"
            flags: 
              only: true
              presence: "optional"
            rules: 
              - 
                name: "min"
                args: 
                  limit: 1
            allow: 
              - "X"
              - "R"
              - "D"
              - "L"
              - "P"
              - "S"
              - "SL"
              - "W"
          hasIrsPractitioner: 
            type: "boolean"
          isSealed: 
            type: "boolean"
          partyType: 
            type: "any"
            flags: 
              presence: "forbidden"
          receivedAt: 
            type: "any"
            flags: 
              presence: "forbidden"
  keys: 
    caseCaption: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "max"
          args: 
            limit: 4700
    contactPrimary: 
      type: "object"
      flags: 
        presence: "required"
      keys: 
        name: 
          type: "string"
          flags: 
            presence: "optional"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
            - 
              name: "max"
              args: 
                limit: 500
        state: 
          type: "string"
          flags: 
            only: true
            presence: "optional"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
          allow: 
            - "AK"
            - "AL"
            - "AR"
            - "AZ"
            - "CA"
            - "CO"
            - "CT"
            - "DC"
            - "DE"
            - "FL"
            - "GA"
            - "HI"
            - "IA"
            - "ID"
            - "IL"
            - "IN"
            - "KS"
            - "KY"
            - "LA"
            - "MA"
            - "MD"
            - "ME"
            - "MI"
            - "MN"
            - "MO"
            - "MS"
            - "MT"
            - "NC"
            - "ND"
            - "NE"
            - "NH"
            - "NJ"
            - "NM"
            - "NV"
            - "NY"
            - "OH"
            - "OK"
            - "OR"
            - "PA"
            - "RI"
            - "SC"
            - "SD"
            - "TN"
            - "TX"
            - "UT"
            - "VA"
            - "VT"
            - "WA"
            - "WI"
            - "WV"
            - "WY"
            - "AA"
            - "AE"
            - "AP"
            - "AS"
            - "FM"
            - "GU"
            - "MH"
            - "MP"
            - "PR"
            - "PW"
            - "VI"
            - "N/A"
    contactSecondary: 
      type: "object"
      flags: 
        presence: "optional"
      allow: 
        - null
      keys: 
        name: 
          type: "string"
          flags: 
            presence: "optional"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
            - 
              name: "max"
              args: 
                limit: 500
        state: 
          type: "string"
          flags: 
            only: true
            presence: "optional"
          rules: 
            - 
              name: "min"
              args: 
                limit: 1
          allow: 
            - "AK"
            - "AL"
            - "AR"
            - "AZ"
            - "CA"
            - "CO"
            - "CT"
            - "DC"
            - "DE"
            - "FL"
            - "GA"
            - "HI"
            - "IA"
            - "ID"
            - "IL"
            - "IN"
            - "KS"
            - "KY"
            - "LA"
            - "MA"
            - "MD"
            - "ME"
            - "MI"
            - "MN"
            - "MO"
            - "MS"
            - "MT"
            - "NC"
            - "ND"
            - "NE"
            - "NH"
            - "NJ"
            - "NM"
            - "NV"
            - "NY"
            - "OH"
            - "OK"
            - "OR"
            - "PA"
            - "RI"
            - "SC"
            - "SD"
            - "TN"
            - "TX"
            - "UT"
            - "VA"
            - "VT"
            - "WA"
            - "WI"
            - "WV"
            - "WY"
            - "AA"
            - "AE"
            - "AP"
            - "AS"
            - "FM"
            - "GU"
            - "MH"
            - "MP"
            - "PR"
            - "PW"
            - "VI"
            - "N/A"
    createdAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
    docketEntries: 
      type: "array"
      flags: 
        presence: "required"
        description: "List of DocketEntry Entities for the case."
      items: 
        - 
          type: "object"
          keys: 
            additionalInfo: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 500
            additionalInfo2: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 500
            createdAt: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "optional"
                description: "When the Document was added to the system."
            docketEntryId: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "guid"
                  args: 
                    options: 
                      version: 
                        - "uuidv4"
            docketNumber: 
              type: "string"
              flags: 
                presence: "optional"
                description: "Docket Number of the associated Case in XXXXX-YY format."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "pattern"
                  args: 
                    regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
            documentTitle: 
              type: "string"
              flags: 
                presence: "optional"
                description: "The title of this document."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
                - 
                  name: "max"
                  args: 
                    limit: 3000
            documentType: 
              type: "string"
              flags: 
                presence: "optional"
                description: "The type of this document."
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
            eventCode: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
            filedBy: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
              allow: 
                - ""
                - null
            filingDate: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "optional"
                description: "Date that this Document was filed."
            index: 
              type: "number"
              flags: 
                presence: "optional"
                description: "Index of this item in the Docket Record list."
              rules: 
                - 
                  name: "integer"
            isMinuteEntry: 
              type: "boolean"
              flags: 
                presence: "optional"
            isPaper: 
              type: "boolean"
              flags: 
                presence: "optional"
            isSealed: 
              type: "boolean"
              flags: 
                presence: "required"
              invalid: 
                - true
            isStricken: 
              type: "boolean"
              flags: 
                presence: "optional"
                description: "Indicates the item has been removed from the docket record."
            numberOfPages: 
              type: "number"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "integer"
              allow: 
                - null
            processingStatus: 
              type: "string"
              flags: 
                presence: "optional"
              rules: 
                - 
                  name: "min"
                  args: 
                    limit: 1
            receivedAt: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "optional"
            servedAt: 
              type: "date"
              flags: 
                format: 
                  - "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  - "YYYY-MM-DD"
                presence: "optional"
            servedParties: 
              type: "array"
              flags: 
                presence: "optional"
              items: 
                - 
                  type: "object"
                  keys: 
                    name: 
                      type: "string"
                      flags: 
                        presence: "optional"
                        description: "The name of a party from a contact, or \"IRS\""
                      rules: 
                        - 
                          name: "min"
                          args: 
                            limit: 1
    docketNumber: 
      type: "string"
      flags: 
        presence: "required"
        description: "Unique case identifier in XXXXX-YY format."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
        - 
          name: "pattern"
          args: 
            regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
    docketNumberSuffix: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
      allow: 
        - null
        - "X"
        - "R"
        - "D"
        - "L"
        - "P"
        - "S"
        - "SL"
        - "W"
    docketNumberWithSuffix: 
      type: "string"
      flags: 
        presence: "optional"
        description: "Auto-generated from docket number and the suffix."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
    hasIrsPractitioner: 
      type: "boolean"
      flags: 
        presence: "required"
    isSealed: 
      type: "boolean"
    partyType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
        description: "Party type of the case petitioner."
      rules: 
        - 
          name: "min"
          args: 
            limit: 1
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
    receivedAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"

 ```
