
all:
	echo "(check the Makefile for available rules)"

deploy:
	sam deploy

describe-stack:
	aws cloudformation describe-stacks --region us-west-1 --stack-name john-websocket-example | jq -r '.Stacks[0].Outputs'

# log-event-handler
# dump-dynamo
# connect client

AWS_TAIL=aws logs tail --format short --region us-west-1 --follow

log-event-bus:
	${AWS_TAIL} /aws/events/websocket-test-bus

log-onconnect:
	${AWS_TAIL} /aws/lambda/websocket-test-onconnect

log-onevent:
	${AWS_TAIL} /aws/lambda/websocket-test-onevent

log-ondisconnect:
	${AWS_TAIL} /aws/lambda/websocket-test-ondisconnect

log-sendmessage:
	${AWS_TAIL} /aws/lambda/websocket-test-sendmessage

dump-dynamo:
	aws dynamodb scan --table-name simplechat_connections --region us-west-1 --output text
