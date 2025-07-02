# MCP Bookstore

This repository contains a demo bookstore API and a small agent that interacts with it using the OpenAI SDK.

## Directories

- **mcp-api** – NestJS backend exposing a JSON-RPC interface under `/mcp`.
- **mcp-agent** – Web-based agent that calls the API using OpenAI tool calling.

## Getting Started

1. Install dependencies for both projects:

```bash
cd mcp-api && yarn install
cd ../mcp-agent && yarn install
```

2. Start the API server:

```bash
cd mcp-api
yarn start:dev
```

3. In another terminal run the agent and open `http://localhost:3001` in your browser:

```bash
cd mcp-agent
yarn start
```

The demo user credentials are `demo` / `demo`.
See each directory's README for more details.
