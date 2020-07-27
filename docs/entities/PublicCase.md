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
          docketNumber: 
            type: "string"
            flags: 
              presence: "required"
            rules: 
              - 
                name: "pattern"
                args: 
                  regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
          docketNumberSuffix: 
            type: "string"
            flags: 
              only: true
              presence: "optional"
            allow: 
              - "X"
              - "R"
              - "L"
              - "P"
              - "S"
              - "SL"
              - "W"
          docketRecord: 
            type: "array"
            rules: 
              - 
                name: "max"
                args: 
                  limit: 0
          documents: 
            type: "array"
            rules: 
              - 
                name: "max"
                args: 
                  limit: 0
          isSealed: 
            type: "boolean"
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
          name: "max"
          args: 
            limit: 4700
    contactPrimary: 
      type: "object"
      flags: 
        presence: "required"
    contactSecondary: 
      type: "object"
      flags: 
        presence: "optional"
      allow: 
        - null
    createdAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
    docketNumber: 
      type: "string"
      flags: 
        presence: "required"
        description: "Unique case identifier in XXXXX-YY format."
      rules: 
        - 
          name: "pattern"
          args: 
            regex: "/^([1-9]\\d{2,4}-\\d{2})$/"
    docketNumberSuffix: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      allow: 
        - null
        - "X"
        - "R"
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
    docketRecord: 
      type: "array"
      flags: 
        presence: "required"
        description: "List of DocketRecord Entities for the case."
      rules: 
        - 
          name: "unique"
          args: 
            comparator: [object Function]
      items: 
        - 
          type: "object"
          metas: 
            - 
              entityName: "PublicDocketRecord"
    documents: 
      type: "array"
      flags: 
        presence: "required"
        description: "List of Document Entities for the case."
      items: 
        - 
          type: "object"
          metas: 
            - 
              entityName: "PublicDocument"
    isSealed: 
      type: "boolean"
    receivedAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"

 ```
