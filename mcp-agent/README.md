# MCP Agent

A simple web-based assistant that uses the OpenAI SDK to interact with the MCP API.

## Setup

Install dependencies:

```bash
yarn install
```

Set your `OPENAI_API_KEY` environment variable. Optional variables:

- `MCP_API_URL` – URL of the API (default: `http://localhost:3000`)
- `MCP_USER` / `MCP_PASS` – credentials for `/auth/login` (default: `demo` / `demo`)

## Usage

Start the agent and open `http://localhost:3001` in your browser:

```bash
yarn start
```
