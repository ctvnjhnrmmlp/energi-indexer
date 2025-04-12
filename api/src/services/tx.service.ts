import { TxRepository } from '../repositories/tx.repository';

export class TxService {
  private txRepository: TxRepository;

  constructor() {
    this.txRepository = new TxRepository();
  }

  async findFirst() {
    const tx = await this.txRepository.findFirst();
    return tx;
  }

  async findByHash({ hash }: { hash: string }) {
    const tx = await this.txRepository.findByHash({ hash });
    return tx;
  }
}
