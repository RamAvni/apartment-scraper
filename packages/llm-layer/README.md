good commands:

## ggml-org/gemma-4-E4B-it-GGUF:Q4_0 (aka Gemma4)

```bash
podman run -d --gpus=all -v llama:/root/.cache -p 1111:8080 --name llama ghcr.io/ggml-org/llama.cpp:server-cuda13 -hf ggml-org/gemma-4-E4B-it-GGUF:Q4_0 --host 0.0.0.0 --parallel 1 --spec-type draft-mtp --spec-draft-n-max 3
```

## dicta-il/DictaLM-3.0-1.7B-Thinking-GGUF

```bash
podman run -d --gpus=all -v llama:/root/.cache -p 1111:8080 --name llama ghcr.io/ggml-org/llama.cpp:server-cuda13 -hf dicta-il/DictaLM-3.0-1.7B-Thinking-GGUF --host 0.0.0.0 --parallel 1 --spec-type draft-mtp --spec-draft-n-max 3
```
