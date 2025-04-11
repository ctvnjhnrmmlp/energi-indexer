import Prisma from '../../database/database';

export class TxRepository {
  async findFirst() {
    const tx = await Prisma.transaction.findFirst({
      orderBy: {
        blockNumber: 'desc',
      },
    });
    return tx;
  }

  async findByHash({ hash }: { hash: string }) {
    const tx = await Prisma.transaction.findUnique({
      where: {
        hash,
      },
    });
    return tx;
  }

  async findMany() {
    const txs = await Prisma.transaction.findMany();
    return txs;
  }

  async findByRange({ start, end }: { start: number; end: number }) {
    const txs = await Prisma.transaction.findMany({
      where: {
        blockNumber: {
          gte: start,
          lte: end,
        },
      },
    });
    return txs;
  }
}
