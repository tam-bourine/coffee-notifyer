[![Build Status](https://travis-ci.org/tam-bourine/coffee-notifyer.svg?branch=master)](https://travis-ci.org/tam-bourine/coffee-notifyer)
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)

# coffee-notifyer

## Usage
AWS IoT Enterpriseでボタン押したらLambda走るやつです
Lambda環境はServerlessFrameworkで構成してます

## Development
### init
clone 後
1. `yarn`
2. `.env` に `WEBHOOK_DEV` `WEBHOOK_OSAKA` `WEBHOOK_TOKYO` をセット
3. `yarn initTravis`
