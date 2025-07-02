# MCP API

This NestJS project exposes a JSON-RPC endpoint at `/mcp` used by the agent in `../mcp-agent`.
It supports browsing books, managing a cart and placing orders. Authentication is handled via `/auth/login` and a demo user (`demo`/`demo`) is available.

## Setup

```bash
yarn install
```

## Running

Start the server in development mode:

```bash
yarn start:dev
```

The API listens on port 3000 by default.
