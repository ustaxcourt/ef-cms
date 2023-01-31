
#!/bin/bash -e

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
