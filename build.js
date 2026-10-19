#!/usr/bin/env node
/**
 * Build script for the Feelochamp static site.
 *
 * Resolves the page templates in src/ into deployable HTML files.
 * Bootstrap 5 (assets/) is linked, not inlined, so it loads once and
 * is shared/cached across all pages.
 *
 * Usage:
 *   node build.js            -> relative links (index.html / spiele.html)
 *                                for GitHub Pages / any static host
 *   node build.js artifact   -> absolute claude.ai artifact links,
 *                                used only when publishing to Claude Artifacts
 */
const fs = require("fs");
const path = require("path");

const dir = __dirname;
const mode = process.argv[2] || "relative";

const ARTIFACT_HOME_URL = "https://claude.ai/code/artifact/37760093-ef79-47f2-8f58-d1f4152b59b4";
const ARTIFACT_SPIELE_URL = "https://claude.ai/code/artifact/6f9f5e88-003d-46ad-a0ec-49276b67a568";

const HOME_URL = mode === "artifact" ? ARTIFACT_HOME_URL : "index.html";
const SPIELE_URL = mode === "artifact" ? ARTIFACT_SPIELE_URL : "spiele.html";
// Not yet published as their own Claude Artifacts, so always relative.
const AUFSTEIGER_URL = "aufsteiger.html";
const START_URL = "start.html";
const REGELN_URL = "regeln.html";
const SPIELSTAND_URL = "spielstand.html";
const ALLETIPS_URL = "alletips.html";
const TABELLE_URL = "tabelle.html";
const PLAYOFF_URL = "playoff.html";
const TURNIERBAUM_URL = "turnierbaum.html";
const TEAMS_URL = "teams.html";
const KALENDER_URL = "kalender.html";
const STATISTIK_URL = "statistik.html";
const VERLAUF_URL = "verlauf.html";
const VERLAUF2_URL = "verlauf2.html";

function build(templateFile, outFile, replacements) {
  let tpl = fs.readFileSync(path.join(dir, "src", templateFile), "utf8");
  for (const [token, value] of Object.entries(replacements)) {
    tpl = tpl.split(token).join(value);
  }
  fs.writeFileSync(path.join(dir, outFile), tpl, "utf8");
  console.log(`built ${outFile} (${tpl.length.toLocaleString()} bytes)`);
}

// Tippbewerb-Umschalter im Logo (/EL ▾): springt zu den anderen Feelochamp-Tippbewerben.
// Farben je Bewerb in assets/brand-switch.css (.bs-<code>), übernommen von einseitensprung.at/feelochamp/.
const COMPETITIONS = [
  { code: "EL",   name: "Europa League",              href: "https://einseitensprung.at/el/" },
  { code: "CL",   name: "Champions League",           href: "https://einseitensprung.at/cl/" },
  { code: "NL",   name: "Nations League",             href: "https://einseitensprung.at/nl/" },
  { code: "DB",   name: "Deutsche Bundesliga",        href: "https://einseitensprung.at/db/" },
  { code: "OEL",  name: "Österreichische Bundesliga", href: "https://einseitensprung.at/oel/" },
  { code: "ZWA",  name: "2. Liga Österreich",         href: "https://einseitensprung.at/zwa/" },
  { code: "JUMP", name: "Alle Tippbewerbe",           href: "https://einseitensprung.at/feelochamp/" },
];
const CURRENT_COMPETITION = "EL";
const BRAND_SWITCH = `<div class="dropdown brand-switch">
        <button class="brand-suffix bs-${CURRENT_COMPETITION.toLowerCase()} dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Tippbewerb wechseln">/${CURRENT_COMPETITION}</button>
        <ul class="dropdown-menu brand-switch-menu">
          <li class="brand-switch-head">Tippbewerb wechseln</li>
${COMPETITIONS.map(c => {
  const inner = `<span class="bs-code">/${c.code}</span><span class="bs-name">${c.name}</span>`;
  const sep = c.code === "JUMP" ? `          <li class="bs-sep" role="separator"></li>\n` : "";
  return sep + (c.code === CURRENT_COMPETITION
    ? `          <li><span class="dropdown-item bs-${c.code.toLowerCase()} active" aria-current="page">${inner}<span class="bs-dot" aria-hidden="true"></span></span></li>`
    : `          <li><a class="dropdown-item bs-${c.code.toLowerCase()}" href="${c.href}">${inner}</a></li>`);
}).join("\n")}
        </ul>
      </div>`;

const COMMON = { "{{BRAND_SWITCH}}": BRAND_SWITCH, "{{HOME_URL}}": HOME_URL, "{{SPIELE_URL}}": SPIELE_URL, "{{AUFSTEIGER_URL}}": AUFSTEIGER_URL, "{{START_URL}}": START_URL, "{{REGELN_URL}}": REGELN_URL, "{{SPIELSTAND_URL}}": SPIELSTAND_URL, "{{ALLETIPS_URL}}": ALLETIPS_URL, "{{TABELLE_URL}}": TABELLE_URL, "{{PLAYOFF_URL}}": PLAYOFF_URL, "{{TURNIERBAUM_URL}}": TURNIERBAUM_URL, "{{TEAMS_URL}}": TEAMS_URL, "{{KALENDER_URL}}": KALENDER_URL, "{{STATISTIK_URL}}": STATISTIK_URL, "{{VERLAUF_URL}}": VERLAUF_URL, "{{VERLAUF2_URL}}": VERLAUF2_URL };

build("index.template.html", "index.html", COMMON);
build("spiele.template.html", "spiele.html", COMMON);
build("aufsteiger.template.html", "aufsteiger.html", COMMON);
build("start.template.html", "start.html", COMMON);
build("regeln.template.html", "regeln.html", COMMON);
build("spielstand.template.html", "spielstand.html", COMMON);
build("alletips.template.html", "alletips.html", COMMON);
build("tabelle.template.html", "tabelle.html", COMMON);
build("playoff.template.html", "playoff.html", COMMON);
build("turnierbaum.template.html", "turnierbaum.html", COMMON);
build("teams.template.html", "teams.html", COMMON);
build("kalender.template.html", "kalender.html", COMMON);
build("statistik.template.html", "statistik.html", COMMON);
build("verlauf.template.html", "verlauf.html", COMMON);
build("verlauf2.template.html", "verlauf2.html", COMMON);
