all: clean build.maketemp build.coffee build.browserify build.uglify build.fixsourcemaps

build.maketemp:
	mkdir .tmp

build.removetemp:
	rm -rf .tmp

build.coffee:
	coffee -m -b -o .tmp src

build.browserify:
	cd .tmp && browserify -d -e *.js > ../dist/gamecore.js

build.uglify:
	uglifyjs dist/gamecore.js -o dist/gamecore.min.js

build.compress:
	gzip -n -9 -c  dist/gamecore.min.js > dist/gamecore.min.js.gz

build.fixsourcemaps:
	python tools/fixSourcemaps.py

clean:
	rm -rf .tmp
	rm -rf dist/gamecore.js

docs:
	codo -o doc --name "GameCore.coffee" --title "GameCore.coffee Documentation" src
	
dependens:
	npm install -g coffee-script
	npm install -g browserify
	npm install -g codo
	npm install -g uglify-js
