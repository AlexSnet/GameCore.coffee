all: clean build docs

build:
	mkdir .tmp
	coffee -m -b -o .tmp src
	cd .tmp && browserify -d -e *.js > ../dist/gamecore.js
	rm -rf .tmp

clean:
	rm -rf .tmp
	rm -rf dist/gamecore.js

docs:
	codo -o doc src

dependens:
	npm install -g coffee-script
	npm install -g browserify
	npm install -g codo
