import express from 'express';
import Prisma from '../database/database';

const router = express.Router();

const serializeBigInt = (data: unknown): unknown => {
  if (data === null || data === undefined) return data;
  if (typeof data === 'bigint') return data.toString();
  if (Array.isArray(data)) return data.map(serializeBigInt);
  if (typeof data === 'object') {
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, serializeBigInt(value)]));
  }
  return data;
};

const respond = (res: express.Response, data: unknown) => {
  res.json(serializeBigInt(data));
};

router.get('/block', async (_req, res) => {
  try {
    const block = await Prisma.block.findFirst({
      orderBy: { number: 'desc' },
      include: { txs: true },
    });
    respond(res, block);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch latest block' });
  }
});

router.get('/block/:number', async (req, res) => {
  try {
    const number = Number(req.params.number);

    if (isNaN(number)) {
      res.status(400).json({ error: 'Invalid block number' });
      return;
    }

    const block = await Prisma.block.findUnique({
      where: { number },
      include: { txs: true },
    });

    if (!block) {
      res.status(404).json({ error: 'Block not found' });
      return;
    }

    respond(res, block);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch block' });
  }
});

router.get('/stats', async (_req, res) => {
  try {
    const txs = await Prisma.transaction.findMany();
    const total = txs.reduce(
      (acc, tx) => {
        acc.amount += Number(tx.amount);
        acc.count += 1;
        return acc;
      },
      { amount: 0, count: 0 }
    );
    respond(res, total);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to calculate stats' });
  }
});

router.get('/stats/:range', async (req, res) => {
  try {
    const [start, end] = req.params.range.split(':').map(Number);

    if (isNaN(start) || isNaN(end)) {
      res.status(400).json({ error: 'Invalid range format. Use /stats/start:end' });
      return;
    }

    const txs = await Prisma.transaction.findMany({
      where: {
        blockNumber: { gte: start, lte: end },
      },
    });

    const total = txs.reduce(
      (acc, tx) => {
        acc.amount += Number(tx.amount);
        acc.count += 1;
        return acc;
      },
      { amount: 0, count: 0 }
    );
    respond(res, total);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to calculate stats in range' });
  }
});

router.get('/tx', async (_req, res) => {
  try {
    const tx = await Prisma.transaction.findFirst({
      orderBy: { blockNumber: 'desc' },
    });
    respond(res, tx);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch latest transaction' });
  }
});

router.get('/tx/:hash', async (req, res) => {
  try {
    const tx = await Prisma.transaction.findUnique({
      where: { hash: req.params.hash },
    });

    if (!tx) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    respond(res, tx);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

router.post('/index', async (req, res) => {
  try {
    const { auth_token, scan } = req.query;

    if (!auth_token || auth_token !== process.env.AUTH_TOKEN) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { runIndexer } = await import('../../indexer/src/index');

    if (scan) {
      const [fromStr, toStr] = (scan as string).split(':');
      const from = Number(fromStr);
      const to = typeof toStr === 'string' ? Number(toStr) : undefined;

      if (isNaN(from) || (toStr && isNaN(to!))) {
        res.status(400).json({ error: 'Invalid scan range format. Use from[:to]' });
        return;
      }

      runIndexer(from, to);
    } else {
      runIndexer();
    }

    res.json({ status: 'Indexing started' });
  } catch (error) {
    console.error('Error starting indexer:', error);
    res.status(500).json({ error: 'Failed to start indexer' });
  }
});

export default router;
