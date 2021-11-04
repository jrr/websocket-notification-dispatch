# Websocket Spike

Goal: try out using AWS' [simple-websockets-chat-app](https://github.com/aws-samples/simple-websockets-chat-app) as a base for app's browser notification needs.

Major goals:

- client apps connect to websocket API, providing their identity
- arbitrary events come in on event bridge, targeting a specific user
- connected clients receive messages meant for them

## todo (immediate):

- [x] deploy and test the default starter kit behavior
- [x] add event bridge and another lambda to handle it
- [x] send bridge event to everybody
- [x] add some kind of identity on client connect (header?), store in dynamo
- ~~[] ability to write messages to particular clients (writing on websocket)~~
- [x] ability to send messages to particular clients (from bridge event)

## todo (further research)

- local websockets in express servers?

## todo (in productionalized version)

- efficient use of dynamo. (need to look up by connectionId sometimes and by cognitoId other times. https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html )
- test with local dynamo https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html
- typescript. (raw JS is way faster than dockerized lambdas, especially on cold start. try local TS -> JS build?)

## Notes

---

```
make connect_client USER_ID=Bob
```

Functions:

- onconnect - inserts row in table
- ondisconnect - deletes from table by key connectionId
- sendmessage - scans table for all connectionIds, sends message to everyone. (leftover from AWS example, not needed for proof of concept)
- onevent - scans table for all records, sends event message to matching userIds. (future: efficient lookup. GSI?)
