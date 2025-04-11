import dotenv from 'dotenv';
import { createPublicClient, http } from 'viem';
import Prisma from '../../database/database';

dotenv.config();

export class IndexerInstance {
  public client;

  constructor() {
    this.client = createPublicClient({
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
  }

  public async scanBlocks({ from, to }: { from: number; to?: number }) {
    const latest = to ?? this.client.getBlockNumber();

    for (let i = from; i <= Number(latest); i++) {
      const block = await this.client.getBlock({
        blockNumber: BigInt(i),
      });
      const txs = block.transactions;

      await Prisma.block.create({
        data: {
          number: i,
          hash: block.hash,
          txs: {
            create: txs.map((hash) => ({
              hash,
              from: '',
              to: '',
              nonce: 0,
              amount: 0,
              blockNumber: i,
            })),
          },
        },
      });
    }
  }
}
