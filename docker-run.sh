#!/bin/bash

docker run -t --rm \
-e 'TWIT_CONSUMER_KEY=XXX' \
-e 'TWIT_CONSUMER_SECRET=XXX' \
-e 'TWIT_ACCESS_TOKEN=XXX' \
-e 'TWIT_ACCESS_TOKEN_SECRET=XXX' \
shopify-notifier \
node dist/app.js --url=XXX --productRegex=XXX --recipientId=XXX
