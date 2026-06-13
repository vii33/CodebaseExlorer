# Codebase Explorer

Generated documentation examples live in `examples/`.
The static documentation site entry point is `examples/site/index.html`.
GitHub Pages compatibility files are mirrored under `docs/`.

## Report-generation instructions

Generated reports must be delivered as a static HTML report with Mermaid diagrams stored as separate `.mmd` files in a diagram subfolder and linked from the HTML. Do not hide diagrams in unrelated Markdown-only outputs or require readers to hunt for unlabeled diagram assets.

Every generated report must start with these sections, in this exact order:

1. A `Management summary` headline.
2. A maximum 50-word paragraph explaining what the codebase does.
3. A high-level package diagram rendered from a linked Mermaid file, with a soft maximum of 7 boxes.
4. A high-level external interaction diagram rendered from a linked Mermaid file from a business perspective, showing how external users/systems interact with the software, with a soft maximum of 7 boxes.
5. A high-level internal data-flow diagram rendered from a linked Mermaid file, with a soft maximum of 7 boxes.
6. A high-level data-model diagram rendered from a linked Mermaid file, with a soft maximum of 5 entities.

Every generated report must end with a `Technical stack and runtime specifications` headline. Move frameworks, languages, libraries, runtime platforms, storage, deployment, and tooling details into that final section. Keep that section concise and scannable with bullet points instead of prose paragraphs.

Every generated report must also include:

- A `Codebase metrics` section with a table of the five most important files for understanding the system, their line counts, and their percentage share of the overall codebase. Choose narratively important files that support the rest of the report, not random large files.
- A `Things that caught attention` section for special behavior, unusual quirks, surprising implementation choices, or obvious bugs noticed during analysis.
- Cross-section continuity: if a file is important enough to appear in metrics, it should also make sense in the architecture, runtime, task, risk, or attention sections.

Diagram requirements:

- Store Mermaid diagram sources as separate `.mmd` files under a diagram subfolder such as `diagrams/`.
- Link each diagram source from the generated static HTML and render or visibly load it in the HTML page.
- If the generator supports Mermaid directly in the browser, load Mermaid in the HTML and populate `<pre class="mermaid">` blocks from the linked `.mmd` files.
- If the generator pre-renders diagrams, keep the `.mmd` sources in the diagram subfolder and link them from the HTML alongside the visible rendered diagrams.
- Keep diagrams high-level and readable. The box/entity limits are soft caps intended to force summarization, not exhaustive inventory.
- Use Mermaid classes, colors, and/or shape differences to distinguish different system categories when the analysis identifies them, such as humans, core application services, local tools, external systems, and storage.
