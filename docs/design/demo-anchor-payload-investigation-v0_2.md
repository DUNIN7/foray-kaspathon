# Demo Anchor Payload Investigation — v0.2

**Version:** 0.2 (supersedes v0.1)
**Date:** 2026-07-13
**Status:** Encoding settled by two live tests; a related divergence bug found and fixed in the same session. Companion to the D1 implementation on branch `d1/demo-real-anchor`.
**Scope:** Same as v0.1 — can the demo's KasWare anchor flow carry a real FORAY payload, and how does the real WP-2 path attach one — extended with the empirical encoding result and the display/export divergence fix that came out of verifying it.

---

## What changed from v0.1

v0.1 answered "does KasWare's `sendKaspa` accept a payload?" (yes) and flagged the exact hex-vs-UTF-8 encoding as unconfirmed, "worth a one-line live test." Two live tests later, the encoding is settled — and the process of running them surfaced a second, unrelated bug: the value the demo *displayed* as "Merkle Root" was never the value that got hashed and anchored. Both are recorded here.

## Payload encoding — settled by two live TN10 transactions

| Round | Sent as `options.payload` | On-chain payload (hex) | Decoded (UTF-8) |
|---|---|---|---|
| 1 | bare 64-char hex string | 128 hex chars (64 bytes) | the original 64-char hex string, verbatim |
| 2 | `0x`-prefixed 64-char hex string | 132 hex chars (66 bytes) | `"0x" + the original 64-char hex string`, verbatim |

**Conclusion: KasWare's `sendKaspa` `options.payload` UTF-8-encodes the given string exactly as given, unconditionally.** There is no hex-decode path for this specific option — round 2 tested the hypothesis that a `"0x"` prefix (a convention found elsewhere in KasWare's own extension source, `src/ui/utils/payload/index.ts`'s `isHexString`/`toBytes` helper, used for decoding IGRA/Kasplex L2 payloads) would trigger byte-decoding. It didn't; the prefix just became two more literal characters in the on-chain text.

**Raw 32-byte payloads are not reachable through this API.** A JS string passed to `options.payload` gets UTF-8-encoded by KasWare internally. UTF-8 encodes any code point ≥ 0x80 as 2+ bytes, so a string built byte-for-byte from arbitrary binary (e.g. `String.fromCharCode` over each hash byte) does not survive re-encoding — on average roughly half the bytes of a SHA-256 hash fall in that range. There is no string constructible on the caller's side that reliably round-trips to arbitrary raw bytes through this specific option. (A `Uint8Array` argument was not offered by the documented/typed signature — only `string` — and wasn't tested directly since the two string-based rounds already established the encoding behavior conclusively.)

**Decision (Operator, 2026-07-13): accept the ASCII-hex-text form as the demo's anchor format.** The demo sends the bare 64-char hex hash (round-1 form, no prefix) as `options.payload`. On-chain, this lands as 64 bytes of ASCII text — ASCII/UTF-8-decodable back to the exact same 64-char hex string shown on the page. This is a real, independently verifiable anchor: fetch the transaction from `api-tn10.kaspa.org`, hex-decode the `payload` field, UTF-8-decode the result, and it reads as the transaction's hash in plain text.

**This deliberately deviates from the real WP-2 path's convention.** WP-2 (`lib/foray-anchor.mjs`, `foray-api`, read-only reference) sets Kaspa's native `payload` field directly to the raw 32-byte hash (`payload: Buffer.from(anchoredValue)`), hex-encoding only for the outer wire-format JSON transport to the node. The demo's on-chain payload is therefore 64 bytes of hex-text, not 32 raw bytes — same information content (the same hash, recoverable exactly), different wire representation, because KasWare's injected API gives the caller no way to request the latter. This is documented here explicitly so it's never mistaken for a discrepancy or a bug later.

## The divergence bug (found verifying round 1, in scope per Operator instruction)

Verifying round 1's on-chain payload against the page surfaced a second issue: the on-page "Merkle Root" display and the "Copy Details" export showed **different values for the same transaction** — because they were never the same computation.

- **On-page display** (`transactionData.merkle_root`) came from `migrateToV41`'s normalization step, using `deterministicHash` — a hand-rolled, non-cryptographic 32-bit word-mixing function, labeled `"sha256:"` but not SHA-256 in any sense, computed once at load/migration time.
- **Copy Details / anchor payload** came from a separate function, `computeTransactionHash`, using real `crypto.subtle` SHA-256 — but recomputed fresh on every anchor click, over the full `transactionData` JSON *including* its own already-set (fake) `merkle_root` field.

Two different algorithms over two different inputs, never reconciled, sharing a UI label. Neither one was a corrupted copy of the other — they were unrelated from the start. This meant no anchor, however correctly encoded, could ever be verified against what the page displayed: the payload always carried the `computeTransactionHash` value, and the page always showed the `deterministicHash` value.

**Fix, this session:**
1. New shared function `computeRealTransactionHash(txData)`: real SHA-256 via `crypto.subtle`, with `merkle_root` and `blockchain_anchor` stripped from the input first (the same strip-then-hash shape `migrateToV41` already used, now with a real hash function).
2. Computed exactly **once**, inside `migrateToV41`, at load time. `migrateToV41` is now `async`; its three call sites (`useEffect` sessionStorage auto-load ×2, `parseJSON`) now `await` it.
3. Every consumer — the Transaction Metadata display, Copy Details, and the `sendKaspa` payload — reads `transactionData.merkle_root` directly. Nothing recomputes it anymore. They cannot diverge again because there is only one computation left.
4. `computeTransactionHash` (the old anchor-time recomputation) is removed entirely.
5. User-visible label relabeled `"Merkle Root"` → `"Transaction Hash (SHA-256)"` in both places it was shown (Transaction Metadata panel, Copy Details export) — it is a flat hash over the transaction, not a Merkle tree structure; the old label overclaimed a data structure that was never built. The underlying field/variable names (`merkle_root`) are unchanged in code, per Operator instruction — only the user-visible label changed.

**`deterministicHash` itself is untouched and still used for 11 other fields** (entity hash, per-component hashes, formula IDs, audit data hash, attestor/evidence hashes) — all still labeled `"sha256:"`, none of them real SHA-256, none fixed in this session. Full inventory, with which ones actually reach a user-visible label vs. only the raw JSON export, reported separately at Stop Point 2 for Operator scoping.

## Alternatives (carried forward from v0.1, still not needed)

Unchanged from v0.1 — recorded for completeness, not pursued, since the ASCII-hex-text form is now the accepted, live-verified anchor format:
- **`signPskt`** (partial/PSKT signing): more integration machinery than `sendKaspa`'s `payload` option requires; no longer relevant now that the payload path itself is confirmed working (in its settled text-encoded form).
- **Route demo anchors through the Worker's real signer, on testnet:** would allow a genuine raw-32-byte payload (reusing `lib/foray-anchor.mjs` against TN10 instead of mainnet), but changes the demo's trust story — the transaction would no longer be signed by the user's own connected wallet. Recorded as a future option if byte-identical parity with the WP-2 wire format is ever required; not pursued here since the wallet-signed, ASCII-hex-text anchor already satisfies independent verifiability.
