all: clean build

build:
	webpack

docs:
	codo -o doc --name "GameCore.coffee" --title "GameCore.coffee Documentation" src
	
serve:
	python -m SimpleHTTPServer 8000 .

dependens:
	npm install -g coffee-script
	npm install -g browserify
	npm install -g codo
	npm install -g uglify-js
