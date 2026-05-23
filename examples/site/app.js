import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

const markdownPath = "../miniclaw.md";
const diagrams = [
  {
    elementId: "architecture-diagram",
    path: "../diagrams/miniclaw-architecture.mmd",
  },
  {
    elementId: "scheduler-diagram",
    path: "../diagrams/miniclaw-scheduler-flow.mmd",
  },
];

const markdownTarget = document.getElementById("markdown-content");

marked.setOptions({
  gfm: true,
  breaks: false,
});

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
});

async function fetchText(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.text();
}

async function renderDiagrams() {
  const diagramTexts = await Promise.all(diagrams.map((diagram) => fetchText(diagram.path)));

  for (const [index, source] of diagramTexts.entries()) {
    const config = diagrams[index];
    const element = document.getElementById(config.elementId);
    if (!element) {
      continue;
    }

    element.textContent = source.trim();
  }

  await mermaid.run({
    nodes: Array.from(document.querySelectorAll(".mermaid")),
  });
}

async function renderMarkdown() {
  const markdown = await fetchText(markdownPath);
  markdownTarget.innerHTML = marked.parse(markdown);
}

async function bootstrap() {
  try {
    await Promise.all([renderMarkdown(), renderDiagrams()]);
  } catch (error) {
    markdownTarget.innerHTML = `<p class="status">Unable to render the documentation site: ${error.message}</p>`;
  }
}

bootstrap();
