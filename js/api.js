async function getAyah(surah, ayah) {
  const response = await fetch(
    `https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?language=ar`
  );

  const data = await response.json();
  return data.verse.text_uthmani;
}
