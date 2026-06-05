#!/usr/bin/env zsh

# This script migrates environment files to support the --aws-only flag
# and adds IRS_SUPERUSER_PASS scaffolding if missing.

# Ensure we are running from the project root
if [[ ! -d "./scripts/env/environments" ]]; then
  echo "Error: This script must be run from the project root."
  exit 1
fi

for f in ./scripts/env/environments/*.env; do
  [[ -f "$f" ]] || continue
  [[ "$f" == *"00-common"* ]] && continue

  modified=0

  # 1. Add bail block after export ENV="${ENV}" if missing
  if grep -qF 'export ENV="${ENV}"' "$f"; then
    if ! grep -qF 'AWS_ONLY' "$f"; then
      perl -i -pe 's/(export ENV="\${ENV}")/$1\n\nif [[ -n "\$AWS_ONLY" ]]; then\n  return 0\nfi/g' "$f"
      modified=1
    fi
  fi

  # 2. Fix typo ${$IRS_SUPERUSER_PASS}
  if grep -q '\${\$IRS_SUPERUSER_PASS}' "$f"; then
    sed -i '' 's/\${\$IRS_SUPERUSER_PASS}/${IRS_SUPERUSER_PASS}/g' "$f"
    modified=1
  fi

  # 3. Add IRS_SUPERUSER_PASS="" scaffolding if missing
  if grep -q 'IRS_SUPERUSER_EMAIL=' "$f" && ! grep -q '^IRS_SUPERUSER_PASS=' "$f"; then
    # Insert after IRS_SUPERUSER_EMAIL line
    sed -i '' '/IRS_SUPERUSER_EMAIL=/a\
IRS_SUPERUSER_PASS=""' "$f"
    modified=1
  fi

  # 4. Add the echo line for IRS_SUPERUSER_PASS if missing
  if grep -q 'IRS_SUPERUSER_EMAIL=' "$f"; then
     if ! grep -qF "IRS_SUPERUSER_PASS='" "$f"; then
        perl -i -pe 's/(if \[\[ -n "\$IRS_SUPERUSER_EMAIL" \]\]; then.*?fi\n)/$1\[\[ -n "\$IRS_SUPERUSER_PASS" \]\] && echo "IRS_SUPERUSER_PASS='\''\${IRS_SUPERUSER_PASS}'\''" >> .env\n/sg' "$f"
        modified=1
     fi
  fi

  if [[ $modified -eq 1 ]]; then
    echo "Updated $f"
  fi
done
