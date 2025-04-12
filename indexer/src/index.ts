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

const safeBigInt = (value: unknown): BigInt | null => {
  if (value === null || value === undefined) {
    console.error(`Value is null or undefined: ${value}`);
    return null;
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
    if (typeof value === 'bigint') return value;
    const valueStr = String(value).trim();
    if (!valueStr || isNaN(Number(valueStr))) {
      console.error(`Invalid value for BigInt conversion: ${valueStr}`);
      return null;
    }
    try {
      return BigInt(valueStr);
    } catch (e) {
      console.error(`Failed to convert value to BigInt: ${valueStr}`, e);
      return null;
    }
  }
  console.error(`Invalid type for BigInt conversion: ${typeof value}`);
  return null;
};

async function scanBlock(blockNumber: bigint) {
  try {
    const block = await client.getBlock({
      blockNumber,
      includeTransactions: true,
    });
    const blockNumberBigInt = safeBigInt(block.number);
    if (!blockNumberBigInt) {
      console.error(`Invalid block number: ${block.number}`);
      return;
    }
    const createdBlock = await Prisma.block.upsert({
      where: { number: Number(blockNumberBigInt) },
      update: {
        hash: block.hash,
      },
      create: {
        number: Number(blockNumberBigInt),
        hash: block.hash,
      },
    });
    const transactions = block.transactions
      .map((tx) => {
        console.log(`Processing transaction: ${tx.hash}, Value: ${tx.value}`);

        const amountBigInt = safeBigInt(tx.value);
        if (!amountBigInt) {
          console.error(`Skipping invalid transaction ${tx.hash}: Invalid amount`);
          return null;
        }
        const nonceBigInt = safeBigInt(tx.nonce);
        if (!nonceBigInt) {
          console.error(`Skipping invalid transaction ${tx.hash}: Invalid nonce`);
          return null;
        }
        return {
          hash: tx.hash,
          from: tx.from,
          to: tx.to ?? '',
          nonce: Number(nonceBigInt),
          amount: amountBigInt.toString(),
          blockNumber: Number(blockNumberBigInt),
          blockId: createdBlock.id,
        };
      })
      .filter((tx): tx is NonNullable<typeof tx> => tx !== null);
    if (transactions.length > 0) {
      await Prisma.transaction.createMany({
        data: transactions,
      });
    }
  } catch (error) {
    console.error(`Error processing block ${blockNumber}:`, error);
  }
}

export async function runIndexer(from?: number, to?: number) {
  try {
    const latestBlock = Number(await client.getBlockNumber());
    const start = from ?? 0;
    const end = to ?? latestBlock;
    console.log(`Indexing blocks from ${start} to ${end}`);
    for (let i = start; i <= end; i++) {
      console.log(`Indexing block ${i}`);
      await scanBlock(BigInt(i));
    }
    console.log('Indexing complete');
  } catch (error) {
    console.error('Error in runIndexer:', error);
  }
}
