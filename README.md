# Codebase Explorer

Generated documentation examples live in `examples/`.
The static documentation site entry point is `examples/site/index.html`.
GitHub Pages compatibility files are mirrored under `docs/`.

## Report-generation instructions

Generated reports must be delivered as a static HTML report with Mermaid diagrams stored as separate `.mmd` files in a diagram subfolder and linked from the HTML. Do not hide diagrams in unrelated Markdown-only outputs or require readers to hunt for unlabeled diagram assets.

Every generated report must start with these sections, in this exact order:

1. A maximum 50-word paragraph explaining what the codebase does.
2. A paragraph describing the frameworks, languages, libraries, runtime platforms, storage, deployment, and tooling used.
3. A high-level package diagram rendered from a linked Mermaid file, with a soft maximum of 7 boxes.
4. A high-level external interaction diagram rendered from a linked Mermaid file from a business perspective, showing how external users/systems interact with the software, with a soft maximum of 7 boxes.
5. A high-level internal data-flow diagram rendered from a linked Mermaid file, with a soft maximum of 7 boxes.
6. A high-level data-model diagram rendered from a linked Mermaid file, with a soft maximum of 5 entities.

Diagram requirements:

- Store Mermaid diagram sources as separate `.mmd` files under a diagram subfolder such as `diagrams/`.
- Link each diagram source from the generated static HTML and render or visibly load it in the HTML page.
- If the generator supports Mermaid directly in the browser, load Mermaid in the HTML and populate `<pre class="mermaid">` blocks from the linked `.mmd` files.
- If the generator pre-renders diagrams, keep the `.mmd` sources in the diagram subfolder and link them from the HTML alongside the visible rendered diagrams.
- Keep diagrams high-level and readable. The box/entity limits are soft caps intended to force summarization, not exhaustive inventory.
