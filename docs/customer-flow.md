# Customer request flow

- Product categories and original product records are unchanged.
- `lib/data/collection-groups.ts` defines six editorial collection selections. Bohem and Rustic have no assigned products yet and show a custom request link.
- `/hakkimizda` permanently redirects to `/biz-kimiz`; internal navigation uses the new path.
- Add the actual facility address, maps link and approved photographs to `lib/data/factory.ts`. Store locations are never used as a substitute factory address.
- Fabric tiles are explicitly illustrative. Replace the demo catalog in `lib/data/fabrics.ts` with approved, group-specific swatches and photographs when available. These previews do not establish stock or material specifications.
- Reference images remain local in memory. Nothing is uploaded to a server. Preparation produces a request number, formatted text and the selected image list.
- On compatible HTTPS devices, the customer invokes the native share sheet with the image files and request text, then selects WhatsApp and the recipient. Other devices open a prepared WhatsApp message and explain how to attach the selected files manually. Previews and downloadable originals stay available.
- Sharing is initiated by the customer; opening a share sheet is never treated as confirmation of delivery.

Sources: [WhatsApp click to chat](https://faq.whatsapp.com/5913398998672934), [MDN Web Share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share).

Validation: `node --test tests/custom-request.test.mjs`, `npm run lint`, `npm run build`.
