# demo

Different proofs are being generated for the same data between thhe browser and the server for the same exact inputs (https://github.com/Slokh/demo-issue/blob/main/packages/zk/src/index.ts#L57)

Three ways to run:
1. `bun run zk:test` - works as expected, correctly generates proof and verifies
2. `bun run api:dev` and go to http://localhost:3001/actions/test - works as expected, correctly generates proof and verifies
4. `bun run next:dev` and `bun run api:dev` and go to http://localhost:3000 - the proof generated is different than from the server, verification fails

