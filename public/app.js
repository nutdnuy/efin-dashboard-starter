import { parseCSV } from "/src/data.js";
import { buildDashboard } from "/src/metrics.js";
const $ = (id) => document.getElementById(id);
let payload, model, chosen;
const fmt = (n, suffix = "") =>
  Number.isFinite(n)
    ? n.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }) + suffix
    : "—";
function status(text, error = false) {
  $("message").textContent = text;
  $("message").className = "notice" + (error ? " error" : "");
}
function node(tag, text, cls) {
  const n = document.createElement(tag);
  if (text !== undefined) n.textContent = text;
  if (cls) n.className = cls;
  return n;
}
function render() {
  if (!payload) return;
  try {
    model = buildDashboard(payload.rows, {
      ...payload.config,
      lookbackPeriods: Number($("lookback").value),
    });
  } catch (e) {
    model = null;
    status(e.message, true);
    clearResults();
    return;
  }
  const demo = payload.source.type === "demo";
  $("title").textContent = payload.config.title;
  $("mode").textContent = demo ? "SYNTHETIC / DEMO" : "CSV / LOCAL";
  $("benchmark").textContent = model.benchmark;
  $("asof").textContent = model.asOf || "—";
  $("coverage").textContent =
    model.records.length + " / " + payload.config.symbols.length;
  $("source").textContent = "แหล่งข้อมูล: " + payload.source.label;
  $("age").textContent =
    model.status === "stale"
      ? "ข้อมูลเก่าตามเกณฑ์ที่ตั้งไว้"
      : model.status === "partial"
        ? "ข้อมูลบางรายการไม่ครบ"
        : "ผ่านการตรวจความครบถ้วน";
  status(
    (demo
      ? "ข้อมูลจำลองสำหรับฝึกเรียน ไม่ใช่ราคาจริง · "
      : "ข้อมูล CSV ของคุณ · ") +
      (model.warnings.length
        ? model.warnings.join(" · ")
        : "คำนวณจากวันที่ตรงกันกับ Benchmark"),
  );
  if (!model.records.find((r) => r.symbol === chosen))
    chosen = model.records[0]?.symbol;
  const list = [...model.records].sort((a, b) =>
    $("sort").value === "excess"
      ? b.excessPct - a.excessPct
      : $("sort").value === "return"
        ? b.returnPct - a.returnPct
        : a.symbol.localeCompare(b.symbol),
  );
  $("rows").replaceChildren();
  for (const r of list) {
    const tr = node("tr", undefined, r.symbol === chosen ? "chosen" : "");
    const td = node("td");
    const b = node("button", r.symbol, "symbol");
    b.type = "button";
    b.setAttribute("aria-pressed", String(r.symbol === chosen));
    b.onclick = () => {
      chosen = r.symbol;
      render();
    };
    td.append(b);
    tr.append(td);
    for (const [v, suffix] of [
      [r.close, ""],
      [r.returnPct, "%"],
      [r.benchmarkReturnPct, "%"],
      [r.excessPct, ""],
    ]) {
      const cell = node("td", fmt(v, suffix));
      if (suffix || v === r.excessPct)
        cell.className = v < 0 ? "negative" : v > 0 ? "positive" : "";
      tr.append(cell);
    }
    tr.append(node("td", r.asOf));
    $("rows").append(tr);
  }
  if (!list.length) {
    const tr = node("tr");
    const td = node(
      "td",
      "ไม่มีหุ้นที่คำนวณได้ในช่วงนี้ — ตรวจ watchlist, Benchmark และจำนวนคาบข้อมูล",
    );
    td.colSpan = 6;
    tr.append(td);
    $("rows").append(tr);
  }
  draw(model.records.find((r) => r.symbol === chosen));
  $("export").disabled = !model.records.length;
}
function clearResults() {
  for (const id of [
    "asof",
    "benchmark",
    "coverage",
    "source",
    "selected",
    "age",
  ])
    $(id).textContent = "—";
  $("mode").textContent = "UNAVAILABLE";
  $("preview-note").textContent = "";
  $("rows").replaceChildren();
  draw();
  $("export").disabled = true;
}
function svgEl(tag, attrs = {}, text) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  if (text !== undefined) el.textContent = text;
  return el;
}
function draw(record) {
  const host = $("chart");
  host.replaceChildren();
  $("selected").textContent = record?.symbol || "—";
  if (!record) {
    host.append(node("p", "ยังไม่มีข้อมูลเพียงพอสำหรับกราฟ", "empty"));
    host.setAttribute("aria-label", "ไม่มีข้อมูลกราฟ");
    return;
  }
  const series = record.series,
    W = Math.max(280, host.clientWidth),
    H = 250,
    pad = { l: 48, r: 18, t: 15, b: 34 };
  let lo = Math.min(...series.flatMap((p) => [p.value, p.benchmarkValue])),
    hi = Math.max(...series.flatMap((p) => [p.value, p.benchmarkValue]));
  const delta = Math.max((hi - lo) * 0.12, 1);
  lo -= delta;
  hi += delta;
  const x = (i) =>
      pad.l + (i / Math.max(1, series.length - 1)) * (W - pad.l - pad.r),
    y = (v) => H - pad.b - ((v - lo) / (hi - lo)) * (H - pad.t - pad.b);
  const svg = svgEl("svg", {
    viewBox: "0 0 " + W + " " + H,
    "aria-hidden": "true",
  });
  for (let i = 0; i < 5; i++) {
    const value = lo + ((hi - lo) * i) / 4;
    svg.append(
      svgEl("line", {
        x1: pad.l,
        y1: y(value),
        x2: W - pad.r,
        y2: y(value),
        class: "grid",
      }),
    );
    svg.append(
      svgEl(
        "text",
        { x: pad.l - 8, y: y(value) + 4, "text-anchor": "end" },
        value.toFixed(1),
      ),
    );
  }
  svg.append(svgEl("text", { x: pad.l, y: H - 6 }, series[0].date));
  svg.append(
    svgEl(
      "text",
      { x: W - pad.r, y: H - 6, "text-anchor": "end" },
      series.at(-1).date,
    ),
  );
  for (const [key, cls] of [
    ["benchmarkValue", "benchmark-line"],
    ["value", "asset-line"],
  ]) {
    const d = series
      .map(
        (p, i) =>
          (i ? "L" : "M") + x(i).toFixed(2) + "," + y(p[key]).toFixed(2),
      )
      .join(" ");
    svg.append(svgEl("path", { d, class: cls }));
  }
  host.append(svg);
  host.setAttribute(
    "aria-label",
    record.symbol +
      " เทียบ " +
      model.benchmark +
      " จาก " +
      series[0].date +
      " ถึง " +
      series.at(-1).date +
      " ผลตอบแทน " +
      fmt(record.returnPct, "%") +
      " benchmark " +
      fmt(record.benchmarkReturnPct, "%"),
  );
}
async function load() {
  $("reload").disabled = true;
  status("กำลังโหลด snapshot…");
  try {
    const r = await fetch("/api/snapshot");
    const next = await r.json();
    if (!r.ok) throw new Error(next.error || "โหลดไม่สำเร็จ");
    payload = next;
    const n = String(payload.config.lookbackPeriods);
    if (![...$("lookback").options].some((o) => o.value === n))
      $("lookback").append(new Option(n + " คาบ", n));
    $("lookback").value = n;
    $("preview-note").textContent = "";
    render();
  } catch (e) {
    payload = null;
    model = null;
    status("โหลดข้อมูลไม่สำเร็จ: " + e.message, true);
    clearResults();
  } finally {
    $("reload").disabled = false;
  }
}
$("reload").onclick = load;
$("lookback").onchange = render;
$("sort").onchange = render;
$("upload").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file || !payload) return;
  try {
    if (file.size > 1048576) throw new Error("ไฟล์ใหญ่เกิน 1 MiB");
    const rows = parseCSV(await file.text());
    const candidate = buildDashboard(rows, {
      ...payload.config,
      lookbackPeriods: Number($("lookback").value),
    });
    if (!candidate.records.length)
      throw new Error(
        "ไม่พบหุ้นใน config ที่คำนวณได้ ตรวจชื่อหุ้น Benchmark และจำนวนข้อมูล",
      );
    payload = {
      ...payload,
      rows,
      source: { type: "csv-preview", label: file.name },
    };
    $("preview-note").textContent =
      "CSV นี้ใช้เฉพาะแท็บปัจจุบัน ยังไม่บันทึกลงโปรเจกต์ · ใช้ npm run import เพื่อเก็บ snapshot";
    render();
  } catch (err) {
    status("ไม่รับไฟล์นี้; คงชุดข้อมูลเดิม: " + err.message, true);
  } finally {
    e.target.value = "";
  }
};
$("export").onclick = () => {
  if (!model) return;
  const blob = new Blob(
    [JSON.stringify({ source: payload.source, ...model }, null, 2)],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const a = node("a");
  a.href = url;
  a.download = "dashboard-report.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
};
load();
new ResizeObserver(() => {
  if (model) draw(model.records.find((r) => r.symbol === chosen));
}).observe($("chart"));
