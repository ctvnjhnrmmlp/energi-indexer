import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class IndexerService {
  async index({ from, to }: { from: number; to?: number }) {
    const scriptPath = path.resolve(__dirname, '../../indexer/core/index.js');
    const command = `node ${scriptPath} ${from} ${to ?? ''}`;
    console.log('Executing:', command);
    await execAsync(command);
  }
}
