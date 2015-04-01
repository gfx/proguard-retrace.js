NODE := node
TSC := node_modules/.bin/tsc
DTSM := node_modules/.bin/dtsm

all: bin/retrace

node_modules: package.json
	npm install
	touch $@

typings: dtsm.json node_modules
	$(DTSM) install
	touch $@

bin/retrace: src/proguard-retrace.ts node_modules typings
	$(TSC) --out $@.tmp $<
	echo '#!/usr/bin/env ' $(NODE) > $@
	cat $@.tmp >> $@
	rm $@.tmp
	chmod +x $@


test: bin/retrace
	bin/retrace test/mapping.txt test/stacktrace.txt

