# MCP Agent

A TypeScript and React based assistant that uses the OpenAI SDK to interact with the MCP API.

## Setup

Install dependencies:

```bash
yarn install
```

Set your `OPENAI_API_KEY` environment variable. Optional variables:

- `MCP_API_URL` – URL of the API (default: `http://localhost:3000`)
- `MCP_USER` / `MCP_PASS` – credentials for `/auth/login` (default: `demo` / `demo`)

## Usage

During development run the server with `ts-node` and the React app with Vite:

```bash
yarn dev
```

To build the project and start the compiled server and client:

```bash
yarn build
yarn start
```

Open `http://localhost:3001` in your browser to use the chat.
