import Prisma from '../../database/database';

export class TxRepository {
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
