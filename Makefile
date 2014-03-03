
all: bin/retrace

bin/retrace: src/proguard-retrace.ts
	tsc --out $@ $<
