import Prisma from '../../../indexer/database/database';

export class BlockRepository {
  async find() {
    let block = await Prisma.block.findFirst({
      orderBy: {
        number: 'desc',
      },
      include: {
        txs: true,
      },
    });
    return block;
  }

  async findByNumber({ number }: { number: number }) {
    let block = await Prisma.block.findFirst({
      where: {
        number,
      },
      include: {
        txs: true,
      },
    });
    return block;
  }
}
