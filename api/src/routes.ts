import express from 'express';
import Prisma from '../database/database';

const router = express.Router();

router.get('/block', async (req, res) => {
  const block = await Prisma.block.findFirst({
    orderBy: { number: 'desc' },
    // include: { transactions: true },
  });
  res.json(block);
});

router.get('/block/:number', async (req, res) => {
  const number = parseInt(req.params.number);
  const block = await Prisma.block.findUnique({
    where: { number },
    // include: { transactions: true },
  });
  res.json(block);
});

router.get('/stats', async (req, res) => {
  const txs = await Prisma.transaction.findMany();
  const total = txs.reduce(
    // @ts-ignore
    (acc, tx) => {
      acc.amount += tx.amount;
      acc.count += 1;
      return acc;
    },
    { amount: 0, count: 0 }
  );

  res.json(total);
});

router.get('/stats/:range', async (req, res) => {
  const [start, end] = req.params.range.split(':').map(Number);
  const txs = await Prisma.transaction.findMany({
    where: {
      blockNumber: { gte: start, lte: end },
    },
  });

  const total = txs.reduce(
    // @ts-ignore

    (acc, tx) => {
      acc.amount += tx.amount;
      acc.count += 1;
      return acc;
    },
    { amount: 0, count: 0 }
  );

  res.json(total);
});

router.get('/tx', async (req, res) => {
  const tx = await Prisma.transaction.findFirst({
    orderBy: { blockNumber: 'desc' },
  });
  res.json(tx);
});

router.get('/tx/:hash', async (req, res) => {
  const tx = await Prisma.transaction.findUnique({
    where: { hash: req.params.hash },
  });
  res.json(tx);
});

router.post('/index', async (req, res) => {
  const { scan } = req.query;
  const [from, to] = (scan as string).split(':').map(Number);

  const { runIndexer } = await import('../../indexer/src/index');
  runIndexer(from, to);

  res.json({ status: 'Indexing started' });
});

export default router;
