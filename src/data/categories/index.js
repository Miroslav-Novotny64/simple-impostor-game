import zvirataRaw from './zvirata.csv?raw';
import jidloRaw from './jidlo.csv?raw';
import mistaRaw from './mista.csv?raw';
import castiTelaRaw from './casti_tela.csv?raw';
import veciRaw from './veci.csv?raw';
import obleceniRaw from './obleceni.csv?raw';
import filmyRaw from './filmy.csv?raw';
import osobnostiRaw from './slavne_osobnosti.csv?raw';

const parseCSV = (csv) => {
  if (!csv) return [];
  return csv
    .trim()
    .split('\n')
    .map(line => {
      const parts = line.split(',');
      if (parts.length < 2) return null;
      const word = parts[0].trim();
      const hint = parts.slice(1).join(',').trim();
      return { word, hint };
    })
    .filter(item => item && item.word && item.hint);
};

export const CATEGORIES = {
  'Zvířata': parseCSV(zvirataRaw),
  'Jídlo': parseCSV(jidloRaw),
  'Místa': parseCSV(mistaRaw),
  'Části těla': parseCSV(castiTelaRaw),
  'Věci': parseCSV(veciRaw),
  'Oblečení': parseCSV(obleceniRaw),
  'Filmy/Seriály': parseCSV(filmyRaw),
  'Slavné osobnosti': parseCSV(osobnostiRaw),
};
