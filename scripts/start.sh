echo "START MODE: $*"
tsc && node --loader ts-node/esm src/index.ts -- $*