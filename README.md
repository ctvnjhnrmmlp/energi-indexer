# EVM Blockchain Explorer

_A lightweight, real-time blockchain explorer for any **EVM-compatible** chain — built for simplicity, speed, and clarity._

> A minimalistic EVM Explorer — Built for developers, analysts, and enthusiasts.

## Overview

**EVM Blockchain Explorer** is a responsive, real-time tool for navigating any **Ethereum Virtual Machine (EVM)** compatible blockchain. Users can instantly view transactions, track wallet activity, and inspect block data with a streamlined UI.

It solves the challenge of bloated or overly complex explorers by focusing on:

- Real-time data fetching
- Intuitive UX
- Easy deployment on any EVM-compatible network

Ideal for developers building on EVM chains, blockchain educators, or users who want a focused, no-frills explorer experience.

## Why This Project?

Many existing explorers:

- Are too complex for new users
- Tie users to specific chains
- Offer more data than needed for simple queries

This project was inspired by the need for a **lightweight, chain-agnostic** explorer that is:

- Easy to deploy on custom or test EVM chains
- Minimal in design
- Fast and responsive

## Features

- **Real-time block and transaction tracking**
- View individual **transaction details**
- Explore **wallet address activity**
- View **block metadata and contents**
- Blazing fast & minimal UI
- Works with **any EVM-compatible chain**

## Roadmap

- [x] MVP: Real-time block & transaction tracking
- [x] Wallet & block views
- [ ] Dark mode & UI themes
- [ ] Add support for contract verification & decoding
- [ ] Deploy as a Docker container
- [ ] Integration with decentralized hosting (IPFS/Filecoin)

## Tech Stack

**Blockchain:**
Viem · Ethers.js

**Web/Backend:**
Express.js · Node.js · React (Planned)

**UI:**
Tailwind CSS (Planned for UI Revamp)

**Hosting:**
Vercel / Docker-ready (upcoming)

## Getting Started

### Prerequisites

- Node.js & npm
- Git
- RPC endpoint for the EVM chain

### Installation

```bash
git clone https://github.com/yourusername/evm-explorer.git
cd evm-explorer
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with the following:

```env
RPC_URL=https://your-evm-node-endpoint
PORT=3000
```

## Usage

```bash
# Run development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Architecture

```
[Frontend (Planned: React/Tailwind)]
     ↕
[Backend (Node.js + Express + Viem)]
     ↕
[Blockchain RPC Node (EVM-compatible)]
```

## Deployment

- **Cloud:** Easy deployment on Vercel, Render, or any Node-compatible cloud service
- **Blockchain:** Works with any EVM-compatible RPC (Ethereum, BSC, Polygon, Arbitrum, etc.)

## Contributing

1. Fork this repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).

## Credits

- Inspired by Etherscan, Viem, and the need for dev-friendly tools
- Built by John Rommel Octaviano
- Powered by the EVM ecosystem
