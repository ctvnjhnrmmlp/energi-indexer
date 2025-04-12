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

router.get('/block', async (req, res) => {
  const block = await Prisma.block.findFirst({
    orderBy: { number: 'desc' },
    include: { txs: true },
  });
  res.json(serializeBigInt(block));
});

router.get('/block/:number', async (req, res) => {
  const number = BigInt(req.params.number);
  const block = await Prisma.block.findUnique({
    where: { number: Number(number) },
    include: { txs: true },
  });
  res.json(serializeBigInt(block));
});

router.get('/stats', async (req, res) => {
  const txs = await Prisma.transaction.findMany();
  const total = txs.reduce(
    (acc, tx) => {
      acc.amount += Number(tx.amount);
      acc.count += 1;
      return acc;
    },
    { amount: 0, count: 0 }
  );
  res.json(serializeBigInt(total));
});

router.get('/stats/:range', async (req, res) => {
  const [start, end] = req.params.range.split(':').map((n) => BigInt(n));
  const txs = await Prisma.transaction.findMany({
    where: {
      blockNumber: { gte: Number(start), lte: Number(end) },
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
  res.json(serializeBigInt(total));
});

router.get('/tx', async (req, res) => {
  const tx = await Prisma.transaction.findFirst({
    orderBy: { blockNumber: 'desc' },
  });
  res.json(serializeBigInt(tx));
});

router.get('/tx/:hash', async (req, res) => {
  const tx = await Prisma.transaction.findUnique({
    where: { hash: req.params.hash },
  });
  res.json(serializeBigInt(tx));
});

router.post('/index', async (req, res) => {
  const { scan } = req.query;
  const [from, to] = (scan as string).split(':').map(Number);
  const { runIndexer } = await import('../../indexer/src/index');
  runIndexer(from, to);
  res.json({ status: 'Indexing started' });
});

export default router;
