// Downloads the curated basic signs from the HandsUp collection on Kulturpool
// and generates public/signs/signs.json.
//
// Usage: node scripts/fetch-signs.mjs [path/to/config.json]

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SEARCH_URL = 'https://api.kulturpool.at/search/';
const PROVIDER_FILTER = 'dataProvider:=`equalizent ST GmbH`';
const PAGE_SIZE = 250;
const EXPECTED_RIGHTS = 'creativecommons.org/licenses/by-sa/4.0';
const LICENSE = {
  license: 'CC BY-SA 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(scriptDir, '../public/signs');
const configPath = path.resolve(process.argv[2] ?? path.join(scriptDir, 'basic-signs.config.json'));

async function fetchCollection() {
  const documents = [];
  for (let page = 1; ; page += 1) {
    const params = new URLSearchParams({
      q: '*',
      filter_by: PROVIDER_FILTER,
      per_page: String(PAGE_SIZE),
      page: String(page),
    });
    const response = await fetch(`${SEARCH_URL}?${params}`);
    if (!response.ok) {
      throw new Error(`Kulturpool search failed with HTTP ${response.status}`);
    }
    const { hits } = await response.json();
    if (hits.length === 0) {
      return documents;
    }
    documents.push(...hits.map((hit) => hit.document));
  }
}

function normalize(title) {
  return title.trim().toLocaleLowerCase('de');
}

function resolveEntry(entry, documents) {
  if (entry.identifier) {
    const match = documents.find((doc) => doc.identifier.includes(entry.identifier));
    return match ? { match } : { problem: `"${entry.title}": no object ${entry.identifier}` };
  }

  const matches = documents.filter((doc) => normalize(doc.title[0]) === normalize(entry.title));
  if (matches.length === 0) {
    return { problem: `"${entry.title}": not found` };
  }
  if (matches.length > 1) {
    const candidates = matches
      .map((doc) => `${doc.identifier[0]} (${doc.isShownBy.split('/').pop()})`)
      .join(', ');
    return { problem: `"${entry.title}": ambiguous, set "identifier" to one of ${candidates}` };
  }
  return { match: matches[0] };
}

async function download(url, expectedType) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.startsWith(expectedType)) {
    throw new Error(`${url} returned "${contentType}", expected ${expectedType}`);
  }
  const data = Buffer.from(await response.arrayBuffer());
  if (data.length === 0) {
    throw new Error(`${url} returned an empty file`);
  }
  return data;
}

async function main() {
  const config = JSON.parse(await readFile(configPath, 'utf8'));
  const documents = await fetchCollection();
  console.log(`Fetched ${documents.length} objects from Kulturpool`);

  const resolved = config.map((entry) => ({ entry, ...resolveEntry(entry, documents) }));
  const problems = resolved.flatMap(({ problem }) => (problem ? [problem] : []));
  for (const { entry, match } of resolved) {
    if (match && !match.edmRights.includes(EXPECTED_RIGHTS)) {
      problems.push(`"${entry.title}": unexpected license ${match.edmRights}`);
    }
  }
  if (problems.length > 0) {
    throw new Error(`Cannot resolve the config:\n- ${problems.join('\n- ')}`);
  }

  // Everything is held in memory first so a failed download leaves existing files untouched.
  const signs = [];
  const files = [];
  for (const { entry, match } of resolved) {
    const id = match.identifier[0].match(/(\d+)$/)[1];
    // handsup-web.eu has an invalid HTTPS certificate, so the video is fetched over HTTP.
    const videoUrl = match.isShownBy.replace(/^https:/, 'http:');
    const video = `signs/videos/${id}.mp4`;
    const poster = `signs/posters/${id}.webp`;

    files.push(
      [video, await download(videoUrl, 'video/mp4')],
      [poster, await download(match.previewImage, 'image/')],
    );
    signs.push({
      id,
      gloss: entry.title,
      category: entry.category,
      video,
      poster,
      creator: match.creator[0],
      sourceUrl: `https://kulturpool.at/en/objects/${match.id}`,
      ...LICENSE,
    });
    console.log(`Downloaded ${entry.title} (${id})`);
  }

  await rm(path.join(outputDir, 'videos'), { recursive: true, force: true });
  await rm(path.join(outputDir, 'posters'), { recursive: true, force: true });
  await mkdir(path.join(outputDir, 'videos'), { recursive: true });
  await mkdir(path.join(outputDir, 'posters'), { recursive: true });
  for (const [relativePath, data] of files) {
    await writeFile(path.join(outputDir, '..', relativePath), data);
  }
  await writeFile(path.join(outputDir, 'signs.json'), `${JSON.stringify(signs, null, 2)}\n`);
  console.log(`Wrote ${signs.length} signs to ${outputDir}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
