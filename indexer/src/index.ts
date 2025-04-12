import dotenv from 'dotenv';
import { Block, createPublicClient, http } from 'viem';
import Prisma from '../database/database';

dotenv.config();

const client = createPublicClient({
  transport: http('https://nodeapi.energi.network'),
  chain: {
    id: 39797,
    name: 'Energi',
    nativeCurrency: { name: 'Energi', symbol: 'NRG', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://nodeapi.energi.network'],
      },
    },
  },
});

const safeBigInt = (value: unknown): bigint | null => {
  try {
    if (value === null || value === undefined) return null;
    const val = typeof value === 'bigint' ? value : BigInt(value.toString());
    return val;
  } catch (err) {
    console.error(`Failed to convert to BigInt:`, value, err);
    return null;
  }
};

async function scanBlock(blockNumber: bigint) {
  try {
    const block = await client.getBlock({ blockNumber, includeTransactions: true });
    const blockNumberBigInt = safeBigInt(block.number);

    if (!blockNumberBigInt) {
      return;
    }

    const createdBlock = await Prisma.block.upsert({
      where: { number: Number(blockNumberBigInt) },
      update: { hash: block.hash },
      create: { number: Number(blockNumberBigInt), hash: block.hash },
    });

    const transactions = block.transactions
      .map((tx) => {
        const amount = safeBigInt(tx.value);
        const nonce = safeBigInt(tx.nonce);

        if (!amount || !nonce) {
          return null;
        }

        return {
          hash: tx.hash,
          from: tx.from,
          to: tx.to ?? '',
          nonce: Number(nonce),
          amount: amount.toString(),
          blockNumber: Number(blockNumberBigInt),
          blockId: createdBlock.id,
        };
      })
      .filter((tx): tx is NonNullable<typeof tx> => tx !== null);

    if (transactions.length > 0) {
      await Prisma.transaction.createMany({ data: transactions });
    }
  } catch (err) {
    console.error(`Error scanning block ${blockNumber}:`, err);
  }
}

async function getLatestIndexedBlock(): Promise<bigint | number> {
  const latest = await Prisma.block.findFirst({
    orderBy: { number: 'desc' },
    select: { number: true },
  });
  return latest?.number ?? 0;
}

async function processBlockRange(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    console.log(`Indexing block ${i}`);
    await scanBlock(BigInt(i));
  }
}

export async function runIndexer(fromArg?: number, toArg?: number) {
  try {
    const latestChainBlock = Number(await client.getBlockNumber());

    if (fromArg !== undefined && toArg !== undefined) {
      console.log(`Indexing blocks ${fromArg} to ${toArg}`);
      await processBlockRange(fromArg, toArg);
    } else if (fromArg !== undefined) {
      console.log(`Indexing from ${fromArg} to latest block ${latestChainBlock}`);
      await processBlockRange(fromArg, latestChainBlock);
      console.log('Subscribing to new blocks...');
      let current = latestChainBlock + 1;
      setInterval(async () => {
        const latestNow = Number(await client.getBlockNumber());
        if (latestNow >= current) {
          await processBlockRange(current, latestNow);
          current = latestNow + 1;
        }
      }, 15_000);
    } else {
      const fromDb = await getLatestIndexedBlock();
      const from = Number(fromDb) + 1;
      console.log(`Resuming indexing from DB. Starting at block ${from}`);
      await processBlockRange(from, latestChainBlock);
      console.log('Subscribing to new blocks...');
      let current = latestChainBlock + 1;
      setInterval(async () => {
        const latestNow = Number(await client.getBlockNumber());
        if (latestNow >= current) {
          await processBlockRange(current, latestNow);
          current = latestNow + 1;
        }
      }, 15_000);
    }
  } catch (error) {
    console.error('Error running indexer:', error);
  }
}
