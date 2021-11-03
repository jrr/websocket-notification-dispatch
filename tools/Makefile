
WEBSOCKET_URI=wss://h627krjgbi.execute-api.us-west-1.amazonaws.com/Prod


WSCAT=yarn run wscat

all:
	echo "(check the Makefile for available rules)"

NUM_WSCATS=$(strip $(shell ps -o command |grep 'yarn run wscat' |grep -v grep |wc -l))

test:
	echo "num cats: '$(NUM_WSCATS)'"

connect_client:
	$(WSCAT) -c $(WEBSOCKET_URI) -H "User-Agent: wscat #$(NUM_WSCATS)"