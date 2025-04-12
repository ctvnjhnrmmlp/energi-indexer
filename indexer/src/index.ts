import dotenv from 'dotenv';
import { createPublicClient, http } from 'viem';
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

async function scanBlock(blockNumber: bigint) {
  const block = await client.getBlock({
    blockNumber,
    includeTransactions: true,
  });

  await Prisma.block.upsert({
    where: { number: Number(block.number) },
    update: {},
    create: {
      number: Number(block.number),
      hash: block.hash,
      txs: {
        create: block.transactions.map((tx) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to ?? '',
          nonce: Number(tx.nonce),
          amount: Number(tx.value),
          blockNumber: Number(block.number),
        })),
      },
    },
  });
}

export async function runIndexer(from?: number, to?: number) {
  const latestBlock = Number(await client.getBlockNumber());
  const start = from ?? 0;
  const end = to ?? latestBlock;

  for (let i = start; i <= end; i++) {
    console.log(`Indexing block ${i}`);
    await scanBlock(BigInt(i));
  }
}
