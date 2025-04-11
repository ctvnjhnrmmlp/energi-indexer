import Prisma from '../../database/database';

export class StatRepository {
  async find() {
    let txs = await Prisma.transaction.findMany();
    const txCount = txs.length;
    const sum = txs.reduce((acc, tx) => acc + Number(tx.amount), 0);
  }
}
