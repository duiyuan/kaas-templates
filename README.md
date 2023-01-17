## Usages

- Commands


## Snippets

You can use those snippets in `.prdts`.

| Trigger           | content                                          |
| :---------------- | :----------------------------------------------- |
| set:seed          | random.reseed {seed}                             |
| set:gas           | chain.gaslimit {gas}                             |
| set:state         | state.set scope.contract_name {state}            |
| chain:run         | chain.run                                        |
| chain:info        | chain.info                                       |
| chain:deploy      | chain.deploy {contract}                          |
| viz:b#all         | viz.block #all                                   |
| viz:b#shard       | viz.block #shard                                 |
| viz:b#shard:block | viz.block #shard:block                           |
| viz:s             | viz.shard #g,n                                   |
| viz:a             | viz.addr @all,random,n                           |
| viz:t             | viz.txn {txn}                                    |
| viz:p             | viz.profiling                                    |
| viz:trace         | viz.trace {txn}                                  |
| viz:section       | viz.section {txn}                                |
| stopwatch         | stopwatch.restart + emptyline + stopwatch.report |
