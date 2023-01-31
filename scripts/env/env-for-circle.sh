./check-env-variables.sh \
  "CIRCLE_BRANCH"

# 1. set ENV
case $CIRCLE_BRANCH in

  develop)
    ENV="dev"
    ;;

  irs)
    ENV="irs"
    ;;

  prod)
    ENV="prod"
    ;;

  migration)
    ENV="mig"
    ;;

  test)
    ENV="test"
    ;;

  staging)
    ENV="stg"
    ;;

  experimental1)
    ENV="exp1"
    ;;

  experimental2)
    ENV="exp2"
    ;;

  experimental3)
    ENV="exp3"
    ;;

  experimental4)
    ENV="exp4"
    ;;

  experimental5)
    ENV="exp5"
    ;;

  *)
    ENV="unknown"
    ;;
esac

echo $ENV

# 2. call load from secrets
. ./scripts/load-environment-from-secrets.sh

# 3. echo out the .env file it created?
# for macOS sed -i '' -e 's/^/export /g' .env
sed -i 's/^/export /g' .env

cat .env
