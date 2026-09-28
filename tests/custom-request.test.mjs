import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

function loadModule(path) {
  const context = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, context);
  return context.exports;
}
const { validateReferenceFiles, buildCustomRequestMessage } = loadModule("lib/custom-request.ts");
const { fabricGroups, resolveFabric } = loadModule("lib/data/fabrics.ts");
const valid = { type: "image/png", size: 1024 };

test("accepts supported images and rejects invalid files, excessive count and oversized batches", () => {
  assert.equal(validateReferenceFiles([]), null);
  assert.equal(validateReferenceFiles([valid, { type: "image/jpeg", size: 2048 }, { type: "image/webp", size: 2048 }]), null);
  assert.ok(validateReferenceFiles(Array(7).fill(valid)));
  assert.ok(validateReferenceFiles([{ type: "image/svg+xml", size: 100 }]));
  assert.ok(validateReferenceFiles([{ ...valid, size: 0 }]));
  assert.ok(validateReferenceFiles([{ ...valid, size: 8 * 1024 * 1024 + 1 }]));
  assert.ok(validateReferenceFiles(Array(4).fill({ ...valid, size: 7 * 1024 * 1024 })));
  assert.equal(validateReferenceFiles(Array(3).fill({ ...valid, size: 8 * 1024 * 1024 })), null);
});

test("request text binds all details and reference filenames to the same request number", () => {
  const message = buildCustomRequestMessage({ name: "Test Kullanıcı", phone: "05000000000", product: "Vera Montessori", dimensions: "100 × 200 cm", fabric: "Teddy · Krem", message: "Ölçü ve kumaş seçeneklerini görüşmek istiyorum." }, "OMR-TEST1234", ["ürün.png", "çizim.jpg"]);
  for (const value of ["OMR-TEST1234", "Test Kullanıcı", "05000000000", "Vera Montessori", "100 × 200 cm", "Teddy · Krem", "1. ürün.png", "2. çizim.jpg"]) assert.ok(message.includes(value));
  assert.ok(message.split("\n").length >= 9);
  assert.ok(!message.includes("undefined"));
});

test("optional request values are omitted cleanly", () => {
  const message = buildCustomRequestMessage({ name: "Test", phone: "05000000000", product: "", dimensions: "", fabric: "", message: "Özel tasarım talebi" }, "OMR-EMPTY", []);
  assert.ok(!message.includes("Referans görseller"));
  assert.ok(!message.includes("Ölçüler:"));
});

test("all eight fabric groups resolve valid selections and reject unknown identifiers", () => {
  assert.equal(fabricGroups.length, 8);
  for (const group of fabricGroups) assert.equal(resolveFabric(group.slug, "krem").group.name, group.name);
  assert.equal(resolveFabric("unknown", "krem"), null);
  assert.equal(resolveFabric("teddy", "unknown"), null);
  assert.equal(resolveFabric(undefined, undefined), null);
});
