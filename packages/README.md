# The Ollama Server package

This server allows the node server, of the `server` package, to be able to use `ollamajs` and make http calls to it.

> [!NOTE]
> The logger will log the prompt, but won't log the result until another prompt is made. This is probably a bug.

> [!NOTE]
> All `ollama` pnpm scripts rely on the docker container being up either by yourself, or by using `pnpm dev`
