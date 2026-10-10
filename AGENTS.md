<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Keep the studio presentation as one editorial homepage with section anchors and accessible detail dialogs, because visitors can explore the service offering without losing context.
- Keep all visual styling in the global semantic design system and use the shared Button for actions, so the presentation stays consistent.
- Distinguish conceptual generated imagery from the company's real portfolio; only verified original contact destinations may be used, to avoid false business claims.
- Load the R3F viewer lazily after hydration and near-viewport entry while retaining homepage SSR, so 3D does not slow the first screen or cross browser/server boundaries.
- Use a bespoke extruded conceptual window assembly with physical materials and local Lightformer illumination; it is not a catalog-certified engineering model, because no proprietary model is supplied.
- Use drei CameraControls for orbit, dolly and touch gestures with on-demand rendering, because maintained controls avoid custom gesture bugs and unnecessary continuous GPU work.
