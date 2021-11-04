#!/bin/sh

if [ "$#" -ne 2 ]; then
	echo "Usage:"
	echo "./send-event.sh bob hello"
	exit 1
fi

TO=$1
MESSAGE=$2

JSON="{ \\\"to\\\": \\\"$TO\\\", \\\"message\\\": \\\"$MESSAGE\\\" }"
AWS_REGION=us-west-1 aws events put-events --entries "[{\"EventBusName\":\"websocket-test-bus\", \"Source\": \"local-dev\", \"DetailType\": \"example-event\", \"Detail\": \"$JSON\"}]"
