import { IndexerInstance } from './indexer.core';

const Indexer = new IndexerInstance();

const [, , fromArg, toArg] = process.argv;

Indexer.scanBlocks({ from: Number(fromArg), to: toArg ? Number(toArg) : undefined });
