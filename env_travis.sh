# read .travis.yml
TRAVIS_GLOBAL=`cat .travis.yml | grep global:`
TRAVIS_ENV=`cat .travis.yml | grep env:`
if [ -z "$TRAVIS_ENV" ] && [ -z "$TRAVIS_GLOBAL" ]; then
  # install travis
  sudo gem install travis
  # read lines of .env file
  ENV_LINES=`cat .env | wc -l`
  COUNT=0
  # read .env and encrypt
  while [ $COUNT -ne $ENV_LINES ]
  do
    COUNT=`expr $COUNT + 1`
    SED_LINE=${COUNT}p
    VARIABLE_URL=`sed -n $SED_LINE .env`
    travis encrypt $VARIABLE_URL --add env.global
  done
  echo ENV VALIABLES ENCRYPTED
fi
echo ALREADY VALIABLES ENCRYPTED