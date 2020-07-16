# CaseExternal
 ```
---
  type: "object"
  keys: 
    businessType: 
      type: "string"
      flags: 
        only: true
        presence: "optional"
      allow: 
        - "Corporation"
        - "Partnership (as the Tax Matters Partner)"
        - "Partnership (as a partnership representative under the BBA regime)"
        - "Partnership (as a partner other than Tax Matters Partner)"
        - null
    contactPrimary: 
      type: "object"
      flags: 
        presence: "optional"
    contactSecondary: 
      type: "object"
      flags: 
        presence: "optional"
    countryType: 
      type: "string"
      flags: 
        presence: "optional"
    filingType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "Myself"
        - "Myself and my spouse"
        - "A business"
        - "Other"
        - "Individual petitioner"
        - "Petitioner and spouse"
    hasIrsNotice: 
      type: "boolean"
      flags: 
        presence: "required"
    caseType: 
      type: "string"
      whens: 
        - 
          ref: 
            path: 
              - "hasIrsNotice"
          is: 
            type: "any"
            flags: 
              presence: "required"
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
    ownershipDisclosureFile: 
      type: "object"
      whens: 
        - 
          ref: 
            path: 
              - "filingType"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - "A business"
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
      flags: 
        presence: "required"
      matches: 
        - 
          schema: 
            type: "string"
            flags: 
              only: true
            allow: 
              - "Fresno, California"
              - "Tallahassee, Florida"
              - "Pocatello, Idaho"
              - "Peoria, Illinois"
              - "Wichita, Kansas"
              - "Shreveport, Louisiana"
              - "Portland, Maine"
              - "Billings, Montana"
              - "Albany, New York"
              - "Syracuse, New York"
              - "Bismarck, North Dakota"
              - "Aberdeen, South Dakota"
              - "Burlington, Vermont"
              - "Roanoke, Virginia"
              - "Cheyenne, Wyoming"
              - "Birmingham, Alabama"
              - "Mobile, Alabama"
              - "Anchorage, Alaska"
              - "Phoenix, Arizona"
              - "Little Rock, Arkansas"
              - "Los Angeles, California"
              - "San Diego, California"
              - "San Francisco, California"
              - "Denver, Colorado"
              - "Hartford, Connecticut"
              - "Washington, District of Columbia"
              - "Jacksonville, Florida"
              - "Miami, Florida"
              - "Tampa, Florida"
              - "Atlanta, Georgia"
              - "Honolulu, Hawaii"
              - "Boise, Idaho"
              - "Chicago, Illinois"
              - "Indianapolis, Indiana"
              - "Des Moines, Iowa"
              - "Louisville, Kentucky"
              - "New Orleans, Louisiana"
              - "Baltimore, Maryland"
              - "Boston, Massachusetts"
              - "Detroit, Michigan"
              - "St. Paul, Minnesota"
              - "Jackson, Mississippi"
              - "Kansas City, Missouri"
              - "St. Louis, Missouri"
              - "Helena, Montana"
              - "Omaha, Nebraska"
              - "Las Vegas, Nevada"
              - "Reno, Nevada"
              - "Albuquerque, New Mexico"
              - "Buffalo, New York"
              - "New York City, New York"
              - "Winston-Salem, North Carolina"
              - "Cincinnati, Ohio"
              - "Cleveland, Ohio"
              - "Columbus, Ohio"
              - "Oklahoma City, Oklahoma"
              - "Portland, Oregon"
              - "Philadelphia, Pennsylvania"
              - "Pittsburgh, Pennsylvania"
              - "Columbia, South Carolina"
              - "Knoxville, Tennessee"
              - "Memphis, Tennessee"
              - "Nashville, Tennessee"
              - "Dallas, Texas"
              - "El Paso, Texas"
              - "Houston, Texas"
              - "Lubbock, Texas"
              - "San Antonio, Texas"
              - "Salt Lake City, Utah"
              - "Richmond, Virginia"
              - "Seattle, Washington"
              - "Spokane, Washington"
              - "Charleston, West Virginia"
              - "Milwaukee, Wisconsin"
              - null
        - 
          schema: 
            type: "string"
            rules: 
              - 
                name: "pattern"
                args: 
                  regex: "/^[a-zA-Z ]+, [a-zA-Z ]+, [0-9]+$/"
    procedureType: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "Regular"
        - "Small"
    stinFile: 
      type: "object"
      flags: 
        presence: "required"
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

 ```
