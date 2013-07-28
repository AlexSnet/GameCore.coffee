all: clean build.maketemp build.coffee build.browserify docs

build.maketemp:
	mkdir .tmp

build.removetemp:
	rm -rf .tmp

build.coffee:
	coffee -m -b -o .tmp src

build.browserify:
	cd .tmp && browserify -d -e *.js > ../dist/gamecore.js

clean:
	rm -rf .tmp
	rm -rf dist/gamecore.js

docs:
	codo -o doc --name "GameCore.coffee" --title "GameCore.coffee Documentation" src

dependens:
	npm install -g coffee-script
	npm install -g browserify
	npm install -g codo
