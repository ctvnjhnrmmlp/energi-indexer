import { exec } from 'child_process';

export class IndexerService {
  async index({ from, to }: { from: number; to: number }) {
    exec(`node ../indexer/index.js ${from} ${to || ''}`);
  }
}
