include ../.stack-values.gen.mk

WSCAT=yarn run wscat

all:
	echo "(check the Makefile for available rules)"

NUM_WSCATS=$(strip $(shell ps -o command |grep 'yarn run wscat' |grep -v grep |wc -l))
USER_ID=cli-user-$(NUM_WSCATS)
USER_AGENT=wscat \#$(NUM_WSCATS)

connect_client:
	$(WSCAT) -c $(WEBSOCKET_URI) -H "User-Agent: $(USER_AGENT)" -H "UserId: $(USER_ID)"
