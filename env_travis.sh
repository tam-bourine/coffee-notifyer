sudo gem install travis
ENV_LINES=`cat .env | wc -l`
COUNT=0
while [ $COUNT -ne $ENV_LINES ]
do
  COUNT=`expr $COUNT + 1`
  SED_LINE=${COUNT}p
  VARIABLE_URL=`sed -n $SED_LINE .env`
  travis encrypt $VARIABLE_URL --add env.global
done
echo ENV VALIABLES ENCRYPTED
