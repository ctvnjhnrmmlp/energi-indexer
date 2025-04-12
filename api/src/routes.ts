import express from 'express';
import Prisma from '../database/database';

const router = express.Router();

// Get latest block
router.get('/block', async (req, res) => {
  const block = await Prisma.block.findFirst({
    orderBy: { number: 'desc' },
    include: { txs: true },
  });
  res.json(block);
});

// Get block by number
router.get('/block/:number', async (req, res) => {
  const number = BigInt(req.params.number);
  const block = await Prisma.block.findUnique({
    where: { number: Number(number) },
    include: { txs: true },
  });
  res.json(block);
});

// Get total transaction stats
router.get('/stats', async (req, res) => {
  const txs = await Prisma.transaction.findMany();

  const total = txs.reduce(
    (acc, tx) => {
      acc.amount += BigInt(tx.amount); // Convert from string to BigInt
      acc.count += 1;
      return acc;
    },
    { amount: BigInt(0), count: 0 }
  );

  res.json({
    amount: total.amount.toString(), // Send as string to prevent overflow
    count: total.count,
  });
});

// Get stats within a block range
router.get('/stats/:range', async (req, res) => {
  const [start, end] = req.params.range.split(':').map((n) => BigInt(n));
  const txs = await Prisma.transaction.findMany({
    where: {
      blockNumber: {
        gte: Number(start),
        lte: Number(end),
      },
    },
  });

  const total = txs.reduce(
    (acc, tx) => {
      acc.amount += BigInt(tx.amount);
      acc.count += 1;
      return acc;
    },
    { amount: BigInt(0), count: 0 }
  );

  res.json({
    amount: total.amount.toString(),
    count: total.count,
  });
});

// Get latest transaction
router.get('/tx', async (req, res) => {
  const tx = await Prisma.transaction.findFirst({
    orderBy: { blockNumber: 'desc' },
  });
  res.json(tx);
});

// Get transaction by hash
router.get('/tx/:hash', async (req, res) => {
  const tx = await Prisma.transaction.findUnique({
    where: { hash: req.params.hash },
  });
  res.json(tx);
});

// Start the indexer
router.post('/index', async (req, res) => {
  const { scan } = req.query;
  const [from, to] = (scan as string).split(':').map(Number);

  const { runIndexer } = await import('../../indexer/src/index');
  runIndexer(from, to);

  res.json({ status: 'Indexing started' });
});

export default router;
