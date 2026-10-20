# Proposal: Fill System Specification and Define Sign Translation Capability

## Why

The project currently has a template for the system specification (`docs/sysspec.md`) and fragmented notes across `docs/PROJECT_PROPOSAL.md`, `docs/SYSTEM_SPECS.md`, `README.md`, and `pitch/pitch.html`. To proceed with structured development, the system requirements, architecture, non-manual marker processing, and milestone roadmap must be formally consolidated into `docs/sysspec.md` and established as an authoritative OpenSpec capability.

## What Changes

- Populate `docs/sysspec.md` with complete, grounded specifications derived directly from project documents without unsupported assumptions.
- Establish the initial OpenSpec capability `sign-translation` defining core functional and non-functional requirements (multimodal tracking, gesture activity detection, sentence synthesis, bidirectional communication).
- Align project documentation across `docs/sysspec.md`, `docs/SYSTEM_SPECS.md`, and OpenSpec specifications.

## Capabilities

### New Capabilities
- `sign-translation`: Captures hand gestures and facial blendshapes simultaneously, buffers signs, detects sentence completion pauses, synthesizes German sentences, and enables bidirectional text/speech exchange between deaf and hearing users.

### Modified Capabilities
<!-- None. Initial project specification. -->

## Impact

- Documentation: Populates `docs/sysspec.md` and creates `openspec/specs/sign-translation/spec.md`.
- Code/APIs: No immediate code modifications in this planning phase. Guides future implementation of computer vision pipelines, ML models, and React PWA.
