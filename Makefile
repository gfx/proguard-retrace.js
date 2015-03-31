
TSC := node_modules/.bin/tsc

all: bin/retrace

bin/retrace: src/proguard-retrace.ts
	$(TSC) --out $@ $<
