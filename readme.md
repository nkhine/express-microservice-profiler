# Express-microservice-profiler

## A small module that measures middleware speep

To install all the required modules run the following commands:

### As prerequisite you should have Node.js installed, it can be found on the official website https://nodejs.org

### Install globally
	npm install -g gulp
	npm install -g mocha

### Locally
	npm install

# Tests

Run unit tests once:

	#first cd to app directory

	cd app
	
	#then run 

	gulp unit
	gulp u (alias)

Automatically run unit tests on every change

	gulp unit:watch
	gulp uw (alias)

Check code style

	gulp code-style
	gulp cs (alias)

Continuously check code style

	gulp code-style:watch
	gulp csw (alias)

Use tags to limit files to check style in (supported by cs and csw tasks)

	Check a single ts file
	gulp cs --tags authorization.js

# Generate JSdoc

	gulp jsdoc