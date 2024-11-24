import {
  IMercadoLibreCountry,
  MERCADO_LIBRE_SITES,
} from '../constants/mercado-libre-sites';
import { formatQuery } from './formatQuery.util';

export function getSiteIdByCountry(countryName: string): IMercadoLibreCountry {
  const formattedCountry = formatQuery(countryName);

  const site = MERCADO_LIBRE_SITES.find(
    (site) => formatQuery(site.country) === formattedCountry,
  );

  return site;
}
