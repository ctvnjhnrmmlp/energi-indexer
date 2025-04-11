import { BlockRepository } from '../repositories/block.repository';

export class BlockService {
  private blockRepository: BlockRepository;

  constructor() {
    this.blockRepository = new BlockRepository();
  }

  async find() {
    let block = this.blockRepository.find();
    return block;
  }

  async findByNumber({ number }: { number: number }) {
    let block = this.blockRepository.findByNumber({ number });
    return block;
  }
}
