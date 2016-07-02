export PATH := ./node_modules/.bin:$(PATH)

.PHONY: build
build: build/stickymap.js build/index.html

.PHONY: clean
clean:
	@rm -rf build

node_modules/.time: package.json
	@npm install --silent
	@touch $@

build/index.html: doc/index.html
	@mkdir -p build
	@cp $< $@

build/stickymap.js: src/*.js node_modules/.time
	@mkdir -p build
	@browserify src/index.js --standalone stickymap --outfile $@;
