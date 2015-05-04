start: node_modules framer/framer.js
	npm run start

build: node_modules framer/framer.js
	npm run build

framer/framer.js: package.json
	make update-framer

update-framer: package.json
	npm run update-framer

node_modules: package.json
	npm install

clean:
	rm -rf framer/framer.{js,js.map} bundle.js node_modules

.PHONY: clean
