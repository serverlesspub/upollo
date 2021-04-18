STACKNAME := AppsyncHelloWorldStack
KEY := $(shell aws cloudformation describe-stacks --stack-name $(STACKNAME) --query 'Stacks[].Outputs[?OutputKey==`APIKEY`].OutputValue' --output text)
URL := $(shell aws cloudformation describe-stacks --stack-name $(STACKNAME) --query 'Stacks[].Outputs[?OutputKey==`GRAPHQLENDPOINT`].OutputValue' --output text)
request: 
	@curl \
	-H 'x-api-key: $(KEY)' \
	-d '{"query": "query { hello }"}' \
	$(URL)
	@echo
