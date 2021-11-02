#!/bin/sh

AWS_REGION=us-west-1 aws events put-events --entries "file://event-bridge-event.json"
