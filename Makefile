
TSC := node_modules/.bin/tsc
DTSM := node_modules/.bin/dtsm

all: bin/retrace

node_modules: package.json
	npm install

typings: dtsm.json node_modules
	$(DTSM) install

bin/retrace: src/proguard-retrace.ts node_modules typings
	$(TSC) --out $@ $<
