# Demo Anchor Payload Investigation — v0.1

**Version:** 0.1
**Date:** 2026-07-13
**Status:** Read-only investigation, no code changes from this note. Companion to the F5 truth-pass fix on the same branch (`fix/demo-anchor-truth-pass`).
**Scope:** Can the demo's KasWare anchor flow be made to carry a real FORAY payload, and how does the real WP-2 path attach one.

---

## Answer up front (3b)

**Yes.** KasWare's injected `sendKaspa` method already accepts an optional `payload` field — confirmed both in KasWare's published docs and directly in the KasWare extension's own open-source TypeScript. The demo's current call (`window.kasware.sendKaspa(walletAddress, 20000000)`, `foray-tx-review-v41.html` line ~5651) simply never passes it. This is not a "needs a different signing mechanism" situation — it is a missing third argument on a call the demo already makes.

---

## 3a — How the real WP-2 path attaches the payload

Source: `~/foray-api`, branch `feat/wp2-real-anchoring` (read via `git show`, not checked out; this branch is not yet merged to `main`). `lib/foray-abh.mjs` and `lib/foray-anchor.mjs`.

1. **`lib/foray-abh.mjs`** builds the Anchored Batch Header (ABH) and computes a 32-byte commitment:
   `anchored_value = SHA-256(0x02 ‖ serialize(batch_header))` — `computeAnchoredValue(header)`.

2. **`lib/foray-anchor.mjs`**, `buildSignedAnchorTransaction(privateKeyHex, anchoredValue)`, constructs a 1-input/1-output **self-send** transaction — structurally the same shape as the demo's KasWare transaction — but sets Kaspa's native transaction `payload` field directly:
   ```js
   const tx = {
     version: 0,
     inputs: [...],
     outputs: [{ value: outputAmount, scriptPublicKey: spk }],
     lockTime: 0n,
     subnetworkId: Buffer.alloc(20, 0),
     gas: 0n,
     payload: Buffer.from(anchoredValue),   // <-- the commitment goes here
   };
   ```
   The wire-format (RpcTransaction JSON) version hex-encodes it: `payload: Buffer.from(anchoredValue).toString('hex')`.
3. The input is signed with `signInput` (Schnorr, via `lib/kaspa-tx.mjs`) over the transaction including the payload field, then handed to the broadcast queue (never broadcast directly by the Worker — separate M4 broadcaster process, per `foray-anchor-broadcast-architecture-v0_1.md`).

**Key fact:** Kaspa transactions have a first-class `payload` byte-array field, independent of inputs/outputs/scripts. The real path's only structural difference from the demo's self-send is that this field is populated with the ABH commitment hash; everything else (self-send, one input, one output) is the same pattern the demo already uses.

## 3b — Does KasWare's injected API support a payload field?

**(i) Yes.** Confirmed two ways:

- **Docs** (`docs.kasware.xyz/wallet/developer-documentation/kaspa/kaspa-transaction.md`): `sendKaspa(toAddress, sompi, options)`, where `options` is `{ priorityFee?: number, payload?: string }`, described as "Optional data to attach to the transaction."
- **Source** (`kasware-wallet/extension`, `src/content-script/pageProvider/index.ts`, public repo, read via `gh search code`):
  ```ts
  sendKaspa = async (toAddress: string, sompi: number, options?: { priorityFee: number; payload?: string }) => { ... }
  ```
  Traced through to the background wallet controller (`src/background/controller/provider/controller.ts`): `return await wallet.sendKaspa(rawtx, false, undefined, { payload });` — the payload genuinely threads into transaction construction, not just the type signature.
  KasWare's own official example dApp (`kasware-wallet/dapp-demo`, `src/App.tsx`) ships a working `SendKaspa` component with a live payload text input calling `window.kasware.sendKaspa(toAddress, kasAmount * 1e8, { priorityFee: 10000, payload })` — this is a real, exercised code path in KasWare's own reference integration, not a documented-but-unused field.

**(ii) Constraints, as best determined without a live signing test:**
  - `payload` is typed as a plain `string`. Convention elsewhere in the extension's own codebase (`src/ui/utils/payload/index.ts`, which decodes IGRA/Kasplex L2 payloads) treats stored transaction payloads as **hex strings** representing raw bytes — matching the real WP-2 path's own `Buffer.from(anchoredValue).toString('hex')` convention. The exact encoding contract for `sendKaspa`'s `payload` argument specifically (raw UTF-8 vs. hex-decoded) was not nailed down with full certainty from static reading alone — worth a one-line live test (send a known hex string, inspect the resulting transaction's on-chain payload bytes via an explorer) before shipping, but this is a verification step, not an open design question.
  - Kaspa's storage-mass/fee model scales with payload length (mirrored in the real path's `calcAnchorTransactionFee(inputAmount, anchoredValue.length)`), so a longer payload costs more — irrelevant at 32 bytes (a SHA-256 hash), trivial either way.
  - No evidence of a KasWare-side hard truncation or rejection of the payload field beyond whatever the underlying Kaspa network's own mass/consensus rules impose.

**(iii) Nearest alternatives** (not needed given (i) is yes, but recorded for completeness per the task's ask):
  - **`signPskt`** (partial/PSKT signing): lets a dApp construct and get the wallet to sign an existing transaction object it built itself, rather than delegating the whole build to `sendKaspa`. Feasibility: works, but is strictly more machinery than needed here — `sendKaspa`'s own `payload` option already does the job with far less integration surface (no need to hand-construct a transaction object, compute change, or select a UTXO in the browser).
  - **Route demo anchors through the Worker's real signer, on testnet:** reuse `lib/foray-anchor.mjs`'s `buildSignedAnchorTransaction` (currently mainnet-only, per its REST endpoint constant) against Testnet 10, broadcasting via the Worker instead of the user's own wallet. Feasibility: technically straightforward (the module already parameterizes almost everything it needs) but changes the demo's actual trust story — the transaction would no longer be signed by the user's own connected wallet, which is arguably a *bigger* UX/claims change than the current gap. Given (i) is yes, this path is unnecessary complexity for what's actually a one-argument fix to the existing `sendKaspa` call.

## Practical implication (not a code change in this task — for a future fix)

The most direct remediation of F5's root cause, if/when the Operator wants the demo to carry a real commitment, is almost certainly:
```js
const txResponse = await window.kasware.sendKaspa(
  walletAddress,
  20000000,
  { payload: merkleRoot }   // merkleRoot already computed client-side, just never passed
);
```
`merkleRoot` is already computed in the existing code (`computeTransactionHash(transactionData)`, `foray-tx-review-v41.html` line ~5644) — it is discarded today, only ever surfacing in the UI's `foray.merkle_root` display field, never sent anywhere. This investigation does not implement that change (out of scope for this read-only step) — flagging it as a concrete, low-effort follow-on for the Operator to decide on.
