import { TxRepository } from '../repositories/tx.repository';

export class StatService {
  private txRepository: TxRepository;

  constructor() {
    this.txRepository = new TxRepository();
  }

  async find() {
    const txs = await this.txRepository.findMany();
    const txCount = txs.length;
    const sum = txs.reduce((acc, tx) => acc + Number(tx.amount), 0);
    return {
      totalAmount: sum,
      totalTx: txCount,
    };
  }

  async findByRange({ start, end }: { start: number; end: number }) {
    const txs = await this.txRepository.findByRange({ start, end });
    const txCount = txs.length;
    const sum = txs.reduce((acc, tx) => acc + Number(tx.amount), 0);
    return {
      totalAmount: sum,
      totalTx: txCount,
    };
  }
}
