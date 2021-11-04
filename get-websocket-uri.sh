#!/bin/sh

url=$(aws cloudformation describe-stacks --region us-west-1 --stack-name "john-websocket-example" | jq -r '.Stacks[0].Outputs |map(select(.OutputKey | test("WebSocketURI")))[0].OutputValue')
echo "Websocket URL $url"

printf "WEBSOCKET_URI=%s\n" "$url" >.stack-values.gen.mk
