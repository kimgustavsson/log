---
title: "The case for smaller models"
description: "Bigger used to mean better. In 2026, a model a fraction of the size can match it on the tasks that actually matter."
date: 2026-06-29
tags: ["ai", "edge-ai"]
---

In the last post, I wrote about why AI is moving out of the cloud and onto the device next to you. The obvious question is: how? A phone doesn't have a data center's worth of GPUs. This is where small language models come in.

## What "small" means here

A Small Language Model (SLM) is the same basic technology as a large one (a transformer, trained on text, predicting the next token) just with far fewer parameters. Parameters are the internal numbers a model adjusts during training; roughly speaking, more of them means more capacity to represent patterns. Frontier models run into the trillions. SLMs are usually a few hundred million to around 10 billion.[^1]

For a while, "small" meant "worse." You used a small model only when you had no other choice, and you accepted weaker answers as the cost of running locally. That tradeoff has shifted.

## Why the gap closed

Three things changed, and none of them are about adding more parameters.

**Better training data.** Instead of scraping the entire internet, several small-model teams trained on heavily filtered, high-quality data: textbooks, verified code, curated reasoning examples. Microsoft's Phi-4, at 14 billion parameters, matches or beats much larger models on several reasoning, math, and coding benchmarks, according to Microsoft's own technical report.[^2] The lesson is that data quality substitutes for some raw scale, at least on well-defined tasks.

**Distillation.** Many small models are trained to mimic the outputs of a larger "teacher" model, inheriting some of its judgment without inheriting its size.

**Quantization.** This is a compression step applied after training: it reduces the precision of a model's internal numbers (say, from 16-bit to 4-bit) to shrink memory use, with some quality cost depending on the method used.[^3] This is what lets a multi-billion-parameter model actually fit on a phone or laptop.

## What you still give up

Small models aren't a free upgrade. They still lag on long, open-ended reasoning, on tasks that need very broad world knowledge, and on holding context across a long, messy conversation. A pattern I'm seeing discussed more in 2026 isn't "replace the big model," it's routing: simple, well-defined requests go to a local SLM, and only the harder, ambiguous ones get sent to a large cloud model. I haven't found a single authoritative source quantifying how common this is in production yet, so take it as an emerging practice rather than settled fact.

## What I'm taking from this

The interesting shift isn't that small models got bigger. It's that the field figured out how much of "intelligence," for a given task, was actually coming from data quality and compression tricks rather than sheer scale. That's a more useful lesson than the benchmark numbers themselves.

Next up: a look at where edge AI is actually deployed today, outside the demos.

[^1]: Parameter ranges and definitions per technical guides to small language models published in 2026; general usage, not a single authoritative source.
[^2]: Abdin et al., "Phi-4 Technical Report," Microsoft Research, 2024 (updated 2026). [arXiv:2412.08905](https://arxiv.org/pdf/2412.08905).
[^3]: "Model Quantization: Concepts, Methods, and Why It Matters," NVIDIA Technical Blog. [Link](https://developer.nvidia.com/blog/model-quantization-concepts-methods-and-why-it-matters/).
