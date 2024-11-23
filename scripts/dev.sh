echo "DEV MODE: $*"
tsc && nodemon --watch src --watch include --ext ts,json --exec 'node --loader ts-node/esm' src/index.ts -- $*