// Datos reales de países: nombre (es/en), región/subregión y fronteras
// terrestres (código ISO 3166-1 alpha-3 de los países con los que limita por
// tierra). Fuente: dataset "world-countries" (basado en restcountries.com /
// Wikipedia).
export const COUNTRIES = [
  {
    "code": "AFG",
    "name": "Afganistán",
    "region": "Asia",
    "subregion": "Southern Asia",
    "lat": 33,
    "lng": 65,
    "borders": [
      "IRN",
      "PAK",
      "TKM",
      "UZB",
      "TJK",
      "CHN"
    ],
    "nameEn": "Afghanistan"
  },
  {
    "code": "ALB",
    "name": "Albania",
    "region": "Europe",
    "subregion": "Southeast Europe",
    "lat": 41,
    "lng": 20,
    "borders": [
      "MNE",
      "GRC",
      "MKD",
      "UNK"
    ],
    "nameEn": "Albania"
  },
  {
    "code": "DEU",
    "name": "Alemania",
    "region": "Europe",
    "subregion": "Western Europe",
    "lat": 51,
    "lng": 9,
    "borders": [
      "AUT",
      "BEL",
      "CZE",
      "DNK",
      "FRA",
      "LUX",
      "NLD",
      "POL",
      "CHE"
    ],
    "nameEn": "Germany"
  },
  {
    "code": "AND",
    "name": "Andorra",
    "region": "Europe",
    "subregion": "Southern Europe",
    "lat": 42.5,
    "lng": 1.5,
    "borders": [
      "FRA",
      "ESP"
    ],
    "nameEn": "Andorra"
  },
  {
    "code": "AGO",
    "name": "Angola",
    "region": "Africa",
    "subregion": "Middle Africa",
    "lat": -12.5,
    "lng": 18.5,
    "borders": [
      "COG",
      "COD",
      "ZMB",
      "NAM"
    ],
    "nameEn": "Angola"
  },
  {
    "code": "ATG",
    "name": "Antigua y Barbuda",
    "region": "Americas",
    "subregion": "Caribbean",
    "lat": 17.05,
    "lng": -61.8,
    "borders": [],
    "nameEn": "Antigua and Barbuda"
  },
  {
    "code": "SAU",
    "name": "Arabia Saudí",
    "region": "Asia",
    "subregion": "Western Asia",
    "lat": 25,
    "lng": 45,
    "borders": [
      "IRQ",
      "JOR",
      "KWT",
      "OMN",
      "QAT",
      "ARE",
      "YEM"
    ],
    "nameEn": "Saudi Arabia"
  },
  {
    "code": "DZA",
    "name": "Argelia",
    "region": "Africa",
    "subregion": "Northern Africa",
    "lat": 28,
    "lng": 3,
    "borders": [
      "TUN",
      "LBY",
      "NER",
      "ESH",
      "MRT",
      "MLI",
      "MAR"
    ],
    "nameEn": "Algeria"
  },
  {
    "code": "ARG",
    "name": "Argentina",
    "region": "Americas",
    "subregion": "South America",
    "lat": -34,
    "lng": -64,
    "borders": [
      "BOL",
      "BRA",
      "CHL",
      "PRY",
      "URY"
    ],
    "nameEn": "Argentina"
  },
  {
    "code": "ARM",
    "name": "Armenia",
    "region": "Asia",
    "subregion": "Western Asia",
    "lat": 40,
    "lng": 45,
    "borders": [
      "AZE",
      "GEO",
      "IRN",
      "TUR"
    ],
    "nameEn": "Armenia"
  },
  {
    "code": "AUS",
    "name": "Australia",
    "region": "Oceania",
    "subregion": "Australia and New Zealand",
    "lat": -27,
    "lng": 133,
    "borders": [],
    "nameEn": "Australia"
  },
  {
    "code": "AUT",
    "name": "Austria",
    "region": "Europe",
    "subregion": "Central Europe",
    "lat": 47.33333333,
    "lng": 13.33333333,
    "borders": [
      "CZE",
      "DEU",
      "HUN",
      "ITA",
      "LIE",
      "SVK",
      "SVN",
      "CHE"
    ],
    "nameEn": "Austria"
  },
  {
    "code": "AZE",
    "name": "Azerbaiyán",
    "region": "Asia",
    "subregion": "Western Asia",
    "lat": 40.5,
    "lng": 47.5,
    "borders": [
      "ARM",
      "GEO",
      "IRN",
      "RUS",
      "TUR"
    ],
    "nameEn": "Azerbaijan"
  },
  {
    "code": "BHS",
    "name": "Bahamas",
    "region": "Americas",
    "subregion": "Caribbean",
    "lat": 24.25,
    "lng": -76,
    "borders": [],
    "nameEn": "Bahamas"
  },
  {
    "code": "BHR",
    "name": "Bahrein",
    "region": "Asia",
    "subregion": "Western Asia",
    "lat": 26,
    "lng": 50.55,
    "borders": [],
    "nameEn": "Bahrain"
  },
  {
    "code": "BGD",
    "name": "Bangladesh",
    "region": "Asia",
    "subregion": "Southern Asia",
    "lat": 24,
    "lng": 90,
    "borders": [
      "MMR",
      "IND"
    ],
    "nameEn": "Bangladesh"
  },
  {
    "code": "BRB",
    "name": "Barbados",
    "region": "Americas",
    "subregion": "Caribbean",
    "lat": 13.16666666,
    "lng": -59.53333333,
    "borders": [],
    "nameEn": "Barbados"
  },
  {
    "code": "BEL",
    "name": "Bélgica",
    "region": "Europe",
    "subregion": "Western Europe",
    "lat": 50.83333333,
    "lng": 4,
    "borders": [
      "FRA",
      "DEU",
      "LUX",
      "NLD"
    ],
    "nameEn": "Belgium"
  },
  {
    "code": "BLZ",
    "name": "Belice",
    "region": "Americas",
    "subregion": "Central America",
    "lat": 17.25,
    "lng": -88.75,
    "borders": [
      "GTM",
      "MEX"
    ],
    "nameEn": "Belize"
  },
  {
    "code": "BEN",
    "name": "Benín",
    "region": "Africa",
    "subregion": "Western Africa",
    "lat": 9.5,
    "lng": 2.25,
    "borders": [
      "BFA",
      "NER",
      "NGA",
      "TGO"
    ],
    "nameEn": "Benin"
  },
  {
    "code": "BLR",
    "name": "Bielorrusia",
    "region": "Europe",
    "subregion": "Eastern Europe",
    "lat": 53,
    "lng": 28,
    "borders": [
      "LVA",
      "LTU",
      "POL",
      "RUS",
      "UKR"
    ],
    "nameEn": "Belarus"
  },
  {
    "code": "BOL",
    "name": "Bolivia",
    "region": "Americas",
    "subregion": "South America",
    "lat": -17,
    "lng": -65,
    "borders": [
      "ARG",
      "BRA",
      "CHL",
      "PRY",
      "PER"
    ],
    "nameEn": "Bolivia"
  },
  {
    "code": "BIH",
    "name": "Bosnia y Herzegovina",
    "region": "Europe",
    "subregion": "Southeast Europe",
    "lat": 44,
    "lng": 18,
    "borders": [
      "HRV",
      "MNE",
      "SRB"
    ],
    "nameEn": "Bosnia and Herzegovina"
  },
  {
    "code": "BWA",
    "name": "Botswana",
    "region": "Africa",
    "subregion": "Southern Africa",
    "lat": -22,
    "lng": 24,
    "borders": [
      "NAM",
      "ZAF",
      "ZMB",
      "ZWE"
    ],
    "nameEn": "Botswana"
  },
  {
    "code": "BRA",
    "name": "Brasil",
    "region": "Americas",
    "subregion": "South America",
    "lat": -10,
    "lng": -55,
    "borders": [
      "ARG",
      "BOL",
      "COL",
      "GUF",
      "GUY",
      "PRY",
      "PER",
      "SUR",
      "URY",
      "VEN"
    ],
    "nameEn": "Brazil"
  },
  {
    "code": "BRN",
    "name": "Brunei",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "lat": 4.5,
    "lng": 114.66666666,
    "borders": [
      "MYS"
    ],
    "nameEn": "Brunei"
  },
  {
    "code": "BGR",
    "name": "Bulgaria",
    "region": "Europe",
    "subregion": "Southeast Europe",
    "lat": 43,
    "lng": 25,
    "borders": [
      "GRC",
      "MKD",
      "ROU",
      "SRB",
      "TUR"
    ],
    "nameEn": "Bulgaria"
  },
  {
    "code": "BFA",
    "name": "Burkina Faso",
    "region": "Africa",
    "subregion": "Western Africa",
    "lat": 13,
    "lng": -2,
    "borders": [
      "BEN",
      "CIV",
      "GHA",
      "MLI",
      "NER",
      "TGO"
    ],
    "nameEn": "Burkina Faso"
  },
  {
    "code": "BDI",
    "name": "Burundi",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": -3.5,
    "lng": 30,
    "borders": [
      "COD",
      "RWA",
      "TZA"
    ],
    "nameEn": "Burundi"
  },
  {
    "code": "BTN",
    "name": "Bután",
    "region": "Asia",
    "subregion": "Southern Asia",
    "lat": 27.5,
    "lng": 90.5,
    "borders": [
      "CHN",
      "IND"
    ],
    "nameEn": "Bhutan"
  },
  {
    "code": "CPV",
    "name": "Cabo Verde",
    "region": "Africa",
    "subregion": "Western Africa",
    "lat": 16,
    "lng": -24,
    "borders": [],
    "nameEn": "Cape Verde"
  },
  {
    "code": "KHM",
    "name": "Camboya",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "lat": 13,
    "lng": 105,
    "borders": [
      "LAO",
      "THA",
      "VNM"
    ],
    "nameEn": "Cambodia"
  },
  {
    "code": "CMR",
    "name": "Camerún",
    "region": "Africa",
    "subregion": "Middle Africa",
    "lat": 6,
    "lng": 12,
    "borders": [
      "CAF",
      "TCD",
      "COG",
      "GNQ",
      "GAB",
      "NGA"
    ],
    "nameEn": "Cameroon"
  },
  {
    "code": "CAN",
    "name": "Canadá",
    "region": "Americas",
    "subregion": "North America",
    "lat": 60,
    "lng": -95,
    "borders": [
      "USA"
    ],
    "nameEn": "Canada"
  },
  {
    "code": "QAT",
    "name": "Catar",
    "region": "Asia",
    "subregion": "Western Asia",
    "lat": 25.5,
    "lng": 51.25,
    "borders": [
      "SAU"
    ],
    "nameEn": "Qatar"
  },
  {
    "code": "TCD",
    "name": "Chad",
    "region": "Africa",
    "subregion": "Middle Africa",
    "lat": 15,
    "lng": 19,
    "borders": [
      "CMR",
      "CAF",
      "LBY",
      "NER",
      "NGA",
      "SDN"
    ],
    "nameEn": "Chad"
  },
  {
    "code": "CZE",
    "name": "Chequia",
    "region": "Europe",
    "subregion": "Central Europe",
    "lat": 49.75,
    "lng": 15.5,
    "borders": [
      "AUT",
      "DEU",
      "POL",
      "SVK"
    ],
    "nameEn": "Czechia"
  },
  {
    "code": "CHL",
    "name": "Chile",
    "region": "Americas",
    "subregion": "South America",
    "lat": -30,
    "lng": -71,
    "borders": [
      "ARG",
      "BOL",
      "PER"
    ],
    "nameEn": "Chile"
  },
  {
    "code": "CHN",
    "name": "China",
    "region": "Asia",
    "subregion": "Eastern Asia",
    "lat": 35,
    "lng": 105,
    "borders": [
      "AFG",
      "BTN",
      "MMR",
      "HKG",
      "IND",
      "KAZ",
      "NPL",
      "PRK",
      "KGZ",
      "LAO",
      "MAC",
      "MNG",
      "PAK",
      "RUS",
      "TJK",
      "VNM"
    ],
    "nameEn": "China"
  },
  {
    "code": "CYP",
    "name": "Chipre",
    "region": "Europe",
    "subregion": "Southern Europe",
    "lat": 35,
    "lng": 33,
    "borders": [],
    "nameEn": "Cyprus"
  },
  {
    "code": "VAT",
    "name": "Ciudad del Vaticano",
    "region": "Europe",
    "subregion": "Southern Europe",
    "lat": 41.9,
    "lng": 12.45,
    "borders": [
      "ITA"
    ],
    "nameEn": "Vatican City"
  },
  {
    "code": "COL",
    "name": "Colombia",
    "region": "Americas",
    "subregion": "South America",
    "lat": 4,
    "lng": -72,
    "borders": [
      "BRA",
      "ECU",
      "PAN",
      "PER",
      "VEN"
    ],
    "nameEn": "Colombia"
  },
  {
    "code": "COM",
    "name": "Comoras",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": -12.16666666,
    "lng": 44.25,
    "borders": [],
    "nameEn": "Comoros"
  },
  {
    "code": "COG",
    "name": "Congo",
    "region": "Africa",
    "subregion": "Middle Africa",
    "lat": -1,
    "lng": 15,
    "borders": [
      "AGO",
      "CMR",
      "CAF",
      "COD",
      "GAB"
    ],
    "nameEn": "Republic of the Congo"
  },
  {
    "code": "COD",
    "name": "Congo (Rep. Dem.)",
    "region": "Africa",
    "subregion": "Middle Africa",
    "lat": 0,
    "lng": 25,
    "borders": [
      "AGO",
      "BDI",
      "CAF",
      "COG",
      "RWA",
      "SSD",
      "TZA",
      "UGA",
      "ZMB"
    ],
    "nameEn": "DR Congo"
  },
  {
    "code": "PRK",
    "name": "Corea del Norte",
    "region": "Asia",
    "subregion": "Eastern Asia",
    "lat": 40,
    "lng": 127,
    "borders": [
      "CHN",
      "KOR",
      "RUS"
    ],
    "nameEn": "North Korea"
  },
  {
    "code": "KOR",
    "name": "Corea del Sur",
    "region": "Asia",
    "subregion": "Eastern Asia",
    "lat": 37,
    "lng": 127.5,
    "borders": [
      "PRK"
    ],
    "nameEn": "South Korea"
  },
  {
    "code": "CIV",
    "name": "Costa de Marfil",
    "region": "Africa",
    "subregion": "Western Africa",
    "lat": 8,
    "lng": -5,
    "borders": [
      "BFA",
      "GHA",
      "GIN",
      "LBR",
      "MLI"
    ],
    "nameEn": "Ivory Coast"
  },
  {
    "code": "CRI",
    "name": "Costa Rica",
    "region": "Americas",
    "subregion": "Central America",
    "lat": 10,
    "lng": -84,
    "borders": [
      "NIC",
      "PAN"
    ],
    "nameEn": "Costa Rica"
  },
  {
    "code": "HRV",
    "name": "Croacia",
    "region": "Europe",
    "subregion": "Southeast Europe",
    "lat": 45.16666666,
    "lng": 15.5,
    "borders": [
      "BIH",
      "HUN",
      "MNE",
      "SRB",
      "SVN"
    ],
    "nameEn": "Croatia"
  },
  {
    "code": "CUB",
    "name": "Cuba",
    "region": "Americas",
    "subregion": "Caribbean",
    "lat": 21.5,
    "lng": -80,
    "borders": [],
    "nameEn": "Cuba"
  },
  {
    "code": "DNK",
    "name": "Dinamarca",
    "region": "Europe",
    "subregion": "Northern Europe",
    "lat": 56,
    "lng": 10,
    "borders": [
      "DEU"
    ],
    "nameEn": "Denmark"
  },
  {
    "code": "DJI",
    "name": "Djibouti",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": 11.5,
    "lng": 43,
    "borders": [
      "ERI",
      "ETH",
      "SOM"
    ],
    "nameEn": "Djibouti"
  },
  {
    "code": "DMA",
    "name": "Dominica",
    "region": "Americas",
    "subregion": "Caribbean",
    "lat": 15.41666666,
    "lng": -61.33333333,
    "borders": [],
    "nameEn": "Dominica"
  },
  {
    "code": "ECU",
    "name": "Ecuador",
    "region": "Americas",
    "subregion": "South America",
    "lat": -2,
    "lng": -77.5,
    "borders": [
      "COL",
      "PER"
    ],
    "nameEn": "Ecuador"
  },
  {
    "code": "EGY",
    "name": "Egipto",
    "region": "Africa",
    "subregion": "Northern Africa",
    "lat": 27,
    "lng": 30,
    "borders": [
      "ISR",
      "LBY",
      "PSE",
      "SDN"
    ],
    "nameEn": "Egypt"
  },
  {
    "code": "SLV",
    "name": "El Salvador",
    "region": "Americas",
    "subregion": "Central America",
    "lat": 13.83333333,
    "lng": -88.91666666,
    "borders": [
      "GTM",
      "HND"
    ],
    "nameEn": "El Salvador"
  },
  {
    "code": "ARE",
    "name": "Emiratos Árabes Unidos",
    "region": "Asia",
    "subregion": "Western Asia",
    "lat": 24,
    "lng": 54,
    "borders": [
      "OMN",
      "SAU"
    ],
    "nameEn": "United Arab Emirates"
  },
  {
    "code": "ERI",
    "name": "Eritrea",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": 15,
    "lng": 39,
    "borders": [
      "DJI",
      "ETH",
      "SDN"
    ],
    "nameEn": "Eritrea"
  },
  {
    "code": "SVK",
    "name": "Eslovaquia",
    "region": "Europe",
    "subregion": "Central Europe",
    "lat": 48.66666666,
    "lng": 19.5,
    "borders": [
      "AUT",
      "CZE",
      "HUN",
      "POL",
      "UKR"
    ],
    "nameEn": "Slovakia"
  },
  {
    "code": "SVN",
    "name": "Eslovenia",
    "region": "Europe",
    "subregion": "Central Europe",
    "lat": 46.11666666,
    "lng": 14.81666666,
    "borders": [
      "AUT",
      "HRV",
      "ITA",
      "HUN"
    ],
    "nameEn": "Slovenia"
  },
  {
    "code": "ESP",
    "name": "España",
    "region": "Europe",
    "subregion": "Southern Europe",
    "lat": 40,
    "lng": -4,
    "borders": [
      "AND",
      "FRA",
      "GIB",
      "PRT",
      "MAR"
    ],
    "nameEn": "Spain"
  },
  {
    "code": "USA",
    "name": "Estados Unidos",
    "region": "Americas",
    "subregion": "North America",
    "lat": 38,
    "lng": -97,
    "borders": [
      "CAN",
      "MEX"
    ],
    "nameEn": "United States"
  },
  {
    "code": "EST",
    "name": "Estonia",
    "region": "Europe",
    "subregion": "Northern Europe",
    "lat": 59,
    "lng": 26,
    "borders": [
      "LVA",
      "RUS"
    ],
    "nameEn": "Estonia"
  },
  {
    "code": "ETH",
    "name": "Etiopía",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": 8,
    "lng": 38,
    "borders": [
      "DJI",
      "ERI",
      "KEN",
      "SOM",
      "SSD",
      "SDN"
    ],
    "nameEn": "Ethiopia"
  },
  {
    "code": "PHL",
    "name": "Filipinas",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "lat": 13,
    "lng": 122,
    "borders": [],
    "nameEn": "Philippines"
  },
  {
    "code": "FIN",
    "name": "Finlandia",
    "region": "Europe",
    "subregion": "Northern Europe",
    "lat": 64,
    "lng": 26,
    "borders": [
      "NOR",
      "SWE",
      "RUS"
    ],
    "nameEn": "Finland"
  },
  {
    "code": "FJI",
    "name": "Fiyi",
    "region": "Oceania",
    "subregion": "Melanesia",
    "lat": -18,
    "lng": 175,
    "borders": [],
    "nameEn": "Fiji"
  },
  {
    "code": "FRA",
    "name": "Francia",
    "region": "Europe",
    "subregion": "Western Europe",
    "lat": 46,
    "lng": 2,
    "borders": [
      "AND",
      "BEL",
      "DEU",
      "ITA",
      "LUX",
      "MCO",
      "ESP",
      "CHE"
    ],
    "nameEn": "France"
  },
  {
    "code": "GAB",
    "name": "Gabón",
    "region": "Africa",
    "subregion": "Middle Africa",
    "lat": -1,
    "lng": 11.75,
    "borders": [
      "CMR",
      "COG",
      "GNQ"
    ],
    "nameEn": "Gabon"
  },
  {
    "code": "GMB",
    "name": "Gambia",
    "region": "Africa",
    "subregion": "Western Africa",
    "lat": 13.46666666,
    "lng": -16.56666666,
    "borders": [
      "SEN"
    ],
    "nameEn": "Gambia"
  },
  {
    "code": "GEO",
    "name": "Georgia",
    "region": "Asia",
    "subregion": "Western Asia",
    "lat": 42,
    "lng": 43.5,
    "borders": [
      "ARM",
      "AZE",
      "RUS",
      "TUR"
    ],
    "nameEn": "Georgia"
  },
  {
    "code": "GHA",
    "name": "Ghana",
    "region": "Africa",
    "subregion": "Western Africa",
    "lat": 8,
    "lng": -2,
    "borders": [
      "BFA",
      "CIV",
      "TGO"
    ],
    "nameEn": "Ghana"
  },
  {
    "code": "GRC",
    "name": "Grecia",
    "region": "Europe",
    "subregion": "Southern Europe",
    "lat": 39,
    "lng": 22,
    "borders": [
      "ALB",
      "BGR",
      "TUR",
      "MKD"
    ],
    "nameEn": "Greece"
  },
  {
    "code": "GRD",
    "name": "Grenada",
    "region": "Americas",
    "subregion": "Caribbean",
    "lat": 12.11666666,
    "lng": -61.66666666,
    "borders": [],
    "nameEn": "Grenada"
  },
  {
    "code": "GTM",
    "name": "Guatemala",
    "region": "Americas",
    "subregion": "Central America",
    "lat": 15.5,
    "lng": -90.25,
    "borders": [
      "BLZ",
      "SLV",
      "HND",
      "MEX"
    ],
    "nameEn": "Guatemala"
  },
  {
    "code": "GIN",
    "name": "Guinea",
    "region": "Africa",
    "subregion": "Western Africa",
    "lat": 11,
    "lng": -10,
    "borders": [
      "CIV",
      "GNB",
      "LBR",
      "MLI",
      "SEN",
      "SLE"
    ],
    "nameEn": "Guinea"
  },
  {
    "code": "GNQ",
    "name": "Guinea Ecuatorial",
    "region": "Africa",
    "subregion": "Middle Africa",
    "lat": 2,
    "lng": 10,
    "borders": [
      "CMR",
      "GAB"
    ],
    "nameEn": "Equatorial Guinea"
  },
  {
    "code": "GNB",
    "name": "Guinea-Bisáu",
    "region": "Africa",
    "subregion": "Western Africa",
    "lat": 12,
    "lng": -15,
    "borders": [
      "GIN",
      "SEN"
    ],
    "nameEn": "Guinea-Bissau"
  },
  {
    "code": "GUY",
    "name": "Guyana",
    "region": "Americas",
    "subregion": "South America",
    "lat": 5,
    "lng": -59,
    "borders": [
      "BRA",
      "SUR",
      "VEN"
    ],
    "nameEn": "Guyana"
  },
  {
    "code": "HTI",
    "name": "Haití",
    "region": "Americas",
    "subregion": "Caribbean",
    "lat": 19,
    "lng": -72.41666666,
    "borders": [
      "DOM"
    ],
    "nameEn": "Haiti"
  },
  {
    "code": "HND",
    "name": "Honduras",
    "region": "Americas",
    "subregion": "Central America",
    "lat": 15,
    "lng": -86.5,
    "borders": [
      "GTM",
      "SLV",
      "NIC"
    ],
    "nameEn": "Honduras"
  },
  {
    "code": "HUN",
    "name": "Hungría",
    "region": "Europe",
    "subregion": "Central Europe",
    "lat": 47,
    "lng": 20,
    "borders": [
      "AUT",
      "HRV",
      "ROU",
      "SRB",
      "SVK",
      "SVN",
      "UKR"
    ],
    "nameEn": "Hungary"
  },
  {
    "code": "IND",
    "name": "India",
    "region": "Asia",
    "subregion": "Southern Asia",
    "lat": 20,
    "lng": 77,
    "borders": [
      "BGD",
      "BTN",
      "MMR",
      "CHN",
      "NPL",
      "PAK"
    ],
    "nameEn": "India"
  },
  {
    "code": "IDN",
    "name": "Indonesia",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "lat": -5,
    "lng": 120,
    "borders": [
      "TLS",
      "MYS",
      "PNG"
    ],
    "nameEn": "Indonesia"
  },
  {
    "code": "IRQ",
    "name": "Irak",
    "region": "Asia",
    "subregion": "Western Asia",
    "lat": 33,
    "lng": 44,
    "borders": [
      "IRN",
      "JOR",
      "KWT",
      "SAU",
      "SYR",
      "TUR"
    ],
    "nameEn": "Iraq"
  },
  {
    "code": "IRN",
    "name": "Iran",
    "region": "Asia",
    "subregion": "Southern Asia",
    "lat": 32,
    "lng": 53,
    "borders": [
      "AFG",
      "ARM",
      "AZE",
      "IRQ",
      "PAK",
      "TUR",
      "TKM"
    ],
    "nameEn": "Iran"
  },
  {
    "code": "IRL",
    "name": "Irlanda",
    "region": "Europe",
    "subregion": "Northern Europe",
    "lat": 53,
    "lng": -8,
    "borders": [
      "GBR"
    ],
    "nameEn": "Ireland"
  },
  {
    "code": "ISL",
    "name": "Islandia",
    "region": "Europe",
    "subregion": "Northern Europe",
    "lat": 65,
    "lng": -18,
    "borders": [],
    "nameEn": "Iceland"
  },
  {
    "code": "MHL",
    "name": "Islas Marshall",
    "region": "Oceania",
    "subregion": "Micronesia",
    "lat": 9,
    "lng": 168,
    "borders": [],
    "nameEn": "Marshall Islands"
  },
  {
    "code": "SLB",
    "name": "Islas Salomón",
    "region": "Oceania",
    "subregion": "Melanesia",
    "lat": -8,
    "lng": 159,
    "borders": [],
    "nameEn": "Solomon Islands"
  },
  {
    "code": "ISR",
    "name": "Israel",
    "region": "Asia",
    "subregion": "Western Asia",
    "lat": 31.47,
    "lng": 35.13,
    "borders": [
      "EGY",
      "JOR",
      "LBN",
      "PSE",
      "SYR"
    ],
    "nameEn": "Israel"
  },
  {
    "code": "ITA",
    "name": "Italia",
    "region": "Europe",
    "subregion": "Southern Europe",
    "lat": 42.83333333,
    "lng": 12.83333333,
    "borders": [
      "AUT",
      "FRA",
      "SMR",
      "SVN",
      "CHE",
      "VAT"
    ],
    "nameEn": "Italy"
  },
  {
    "code": "JAM",
    "name": "Jamaica",
    "region": "Americas",
    "subregion": "Caribbean",
    "lat": 18.25,
    "lng": -77.5,
    "borders": [],
    "nameEn": "Jamaica"
  },
  {
    "code": "JPN",
    "name": "Japón",
    "region": "Asia",
    "subregion": "Eastern Asia",
    "lat": 36,
    "lng": 138,
    "borders": [],
    "nameEn": "Japan"
  },
  {
    "code": "JOR",
    "name": "Jordania",
    "region": "Asia",
    "subregion": "Western Asia",
    "lat": 31,
    "lng": 36,
    "borders": [
      "IRQ",
      "ISR",
      "PSE",
      "SAU",
      "SYR"
    ],
    "nameEn": "Jordan"
  },
  {
    "code": "KAZ",
    "name": "Kazajistán",
    "region": "Asia",
    "subregion": "Central Asia",
    "lat": 48,
    "lng": 68,
    "borders": [
      "CHN",
      "KGZ",
      "RUS",
      "TKM",
      "UZB"
    ],
    "nameEn": "Kazakhstan"
  },
  {
    "code": "KEN",
    "name": "Kenia",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": 1,
    "lng": 38,
    "borders": [
      "ETH",
      "SOM",
      "SSD",
      "TZA",
      "UGA"
    ],
    "nameEn": "Kenya"
  },
  {
    "code": "KGZ",
    "name": "Kirguizistán",
    "region": "Asia",
    "subregion": "Central Asia",
    "lat": 41,
    "lng": 75,
    "borders": [
      "CHN",
      "KAZ",
      "TJK",
      "UZB"
    ],
    "nameEn": "Kyrgyzstan"
  },
  {
    "code": "KIR",
    "name": "Kiribati",
    "region": "Oceania",
    "subregion": "Micronesia",
    "lat": 1.41666666,
    "lng": 173,
    "borders": [],
    "nameEn": "Kiribati"
  },
  {
    "code": "UNK",
    "name": "Kosovo",
    "region": "Europe",
    "subregion": "Southeast Europe",
    "lat": 42.666667,
    "lng": 21.166667,
    "borders": [
      "ALB",
      "MKD",
      "MNE",
      "SRB"
    ],
    "nameEn": "Kosovo"
  },
  {
    "code": "KWT",
    "name": "Kuwait",
    "region": "Asia",
    "subregion": "Western Asia",
    "lat": 29.5,
    "lng": 45.75,
    "borders": [
      "IRQ",
      "SAU"
    ],
    "nameEn": "Kuwait"
  },
  {
    "code": "LAO",
    "name": "Laos",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "lat": 18,
    "lng": 105,
    "borders": [
      "MMR",
      "KHM",
      "CHN",
      "THA",
      "VNM"
    ],
    "nameEn": "Laos"
  },
  {
    "code": "LSO",
    "name": "Lesotho",
    "region": "Africa",
    "subregion": "Southern Africa",
    "lat": -29.5,
    "lng": 28.5,
    "borders": [
      "ZAF"
    ],
    "nameEn": "Lesotho"
  },
  {
    "code": "LVA",
    "name": "Letonia",
    "region": "Europe",
    "subregion": "Northern Europe",
    "lat": 57,
    "lng": 25,
    "borders": [
      "BLR",
      "EST",
      "LTU",
      "RUS"
    ],
    "nameEn": "Latvia"
  },
  {
    "code": "LBN",
    "name": "Líbano",
    "region": "Asia",
    "subregion": "Western Asia",
    "lat": 33.83333333,
    "lng": 35.83333333,
    "borders": [
      "ISR",
      "SYR"
    ],
    "nameEn": "Lebanon"
  },
  {
    "code": "LBR",
    "name": "Liberia",
    "region": "Africa",
    "subregion": "Western Africa",
    "lat": 6.5,
    "lng": -9.5,
    "borders": [
      "GIN",
      "CIV",
      "SLE"
    ],
    "nameEn": "Liberia"
  },
  {
    "code": "LBY",
    "name": "Libia",
    "region": "Africa",
    "subregion": "Northern Africa",
    "lat": 25,
    "lng": 17,
    "borders": [
      "DZA",
      "TCD",
      "EGY",
      "NER",
      "SDN",
      "TUN"
    ],
    "nameEn": "Libya"
  },
  {
    "code": "LIE",
    "name": "Liechtenstein",
    "region": "Europe",
    "subregion": "Western Europe",
    "lat": 47.26666666,
    "lng": 9.53333333,
    "borders": [
      "AUT",
      "CHE"
    ],
    "nameEn": "Liechtenstein"
  },
  {
    "code": "LTU",
    "name": "Lituania",
    "region": "Europe",
    "subregion": "Northern Europe",
    "lat": 56,
    "lng": 24,
    "borders": [
      "BLR",
      "LVA",
      "POL",
      "RUS"
    ],
    "nameEn": "Lithuania"
  },
  {
    "code": "LUX",
    "name": "Luxemburgo",
    "region": "Europe",
    "subregion": "Western Europe",
    "lat": 49.75,
    "lng": 6.16666666,
    "borders": [
      "BEL",
      "FRA",
      "DEU"
    ],
    "nameEn": "Luxembourg"
  },
  {
    "code": "MKD",
    "name": "Macedonia del Norte",
    "region": "Europe",
    "subregion": "Southeast Europe",
    "lat": 41.83333333,
    "lng": 22,
    "borders": [
      "ALB",
      "BGR",
      "GRC",
      "UNK",
      "SRB"
    ],
    "nameEn": "North Macedonia"
  },
  {
    "code": "MDG",
    "name": "Madagascar",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": -20,
    "lng": 47,
    "borders": [],
    "nameEn": "Madagascar"
  },
  {
    "code": "MYS",
    "name": "Malasia",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "lat": 2.5,
    "lng": 112.5,
    "borders": [
      "BRN",
      "IDN",
      "THA"
    ],
    "nameEn": "Malaysia"
  },
  {
    "code": "MWI",
    "name": "Malawi",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": -13.5,
    "lng": 34,
    "borders": [
      "MOZ",
      "TZA",
      "ZMB"
    ],
    "nameEn": "Malawi"
  },
  {
    "code": "MDV",
    "name": "Maldivas",
    "region": "Asia",
    "subregion": "Southern Asia",
    "lat": 3.25,
    "lng": 73,
    "borders": [],
    "nameEn": "Maldives"
  },
  {
    "code": "MLI",
    "name": "Mali",
    "region": "Africa",
    "subregion": "Western Africa",
    "lat": 17,
    "lng": -4,
    "borders": [
      "DZA",
      "BFA",
      "GIN",
      "CIV",
      "MRT",
      "NER",
      "SEN"
    ],
    "nameEn": "Mali"
  },
  {
    "code": "MLT",
    "name": "Malta",
    "region": "Europe",
    "subregion": "Southern Europe",
    "lat": 35.83333333,
    "lng": 14.58333333,
    "borders": [],
    "nameEn": "Malta"
  },
  {
    "code": "MAR",
    "name": "Marruecos",
    "region": "Africa",
    "subregion": "Northern Africa",
    "lat": 32,
    "lng": -5,
    "borders": [
      "DZA",
      "ESH",
      "ESP"
    ],
    "nameEn": "Morocco"
  },
  {
    "code": "MUS",
    "name": "Mauricio",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": -20.28333333,
    "lng": 57.55,
    "borders": [],
    "nameEn": "Mauritius"
  },
  {
    "code": "MRT",
    "name": "Mauritania",
    "region": "Africa",
    "subregion": "Western Africa",
    "lat": 20,
    "lng": -12,
    "borders": [
      "DZA",
      "MLI",
      "SEN",
      "ESH"
    ],
    "nameEn": "Mauritania"
  },
  {
    "code": "MEX",
    "name": "México",
    "region": "Americas",
    "subregion": "North America",
    "lat": 23,
    "lng": -102,
    "borders": [
      "BLZ",
      "GTM",
      "USA"
    ],
    "nameEn": "Mexico"
  },
  {
    "code": "FSM",
    "name": "Micronesia",
    "region": "Oceania",
    "subregion": "Micronesia",
    "lat": 6.91666666,
    "lng": 158.25,
    "borders": [],
    "nameEn": "Micronesia"
  },
  {
    "code": "MDA",
    "name": "Moldavia",
    "region": "Europe",
    "subregion": "Eastern Europe",
    "lat": 47,
    "lng": 29,
    "borders": [
      "ROU",
      "UKR"
    ],
    "nameEn": "Moldova"
  },
  {
    "code": "MCO",
    "name": "Mónaco",
    "region": "Europe",
    "subregion": "Western Europe",
    "lat": 43.73333333,
    "lng": 7.4,
    "borders": [
      "FRA"
    ],
    "nameEn": "Monaco"
  },
  {
    "code": "MNG",
    "name": "Mongolia",
    "region": "Asia",
    "subregion": "Eastern Asia",
    "lat": 46,
    "lng": 105,
    "borders": [
      "CHN",
      "RUS"
    ],
    "nameEn": "Mongolia"
  },
  {
    "code": "MNE",
    "name": "Montenegro",
    "region": "Europe",
    "subregion": "Southeast Europe",
    "lat": 42.5,
    "lng": 19.3,
    "borders": [
      "ALB",
      "BIH",
      "HRV",
      "UNK",
      "SRB"
    ],
    "nameEn": "Montenegro"
  },
  {
    "code": "MOZ",
    "name": "Mozambique",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": -18.25,
    "lng": 35,
    "borders": [
      "MWI",
      "ZAF",
      "SWZ",
      "TZA",
      "ZMB",
      "ZWE"
    ],
    "nameEn": "Mozambique"
  },
  {
    "code": "MMR",
    "name": "Myanmar",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "lat": 22,
    "lng": 98,
    "borders": [
      "BGD",
      "CHN",
      "IND",
      "LAO",
      "THA"
    ],
    "nameEn": "Myanmar"
  },
  {
    "code": "NAM",
    "name": "Namibia",
    "region": "Africa",
    "subregion": "Southern Africa",
    "lat": -22,
    "lng": 17,
    "borders": [
      "AGO",
      "BWA",
      "ZAF",
      "ZMB"
    ],
    "nameEn": "Namibia"
  },
  {
    "code": "NRU",
    "name": "Nauru",
    "region": "Oceania",
    "subregion": "Micronesia",
    "lat": -0.53333333,
    "lng": 166.91666666,
    "borders": [],
    "nameEn": "Nauru"
  },
  {
    "code": "NPL",
    "name": "Nepal",
    "region": "Asia",
    "subregion": "Southern Asia",
    "lat": 28,
    "lng": 84,
    "borders": [
      "CHN",
      "IND"
    ],
    "nameEn": "Nepal"
  },
  {
    "code": "NIC",
    "name": "Nicaragua",
    "region": "Americas",
    "subregion": "Central America",
    "lat": 13,
    "lng": -85,
    "borders": [
      "CRI",
      "HND"
    ],
    "nameEn": "Nicaragua"
  },
  {
    "code": "NER",
    "name": "Níger",
    "region": "Africa",
    "subregion": "Western Africa",
    "lat": 16,
    "lng": 8,
    "borders": [
      "DZA",
      "BEN",
      "BFA",
      "TCD",
      "LBY",
      "MLI",
      "NGA"
    ],
    "nameEn": "Niger"
  },
  {
    "code": "NGA",
    "name": "Nigeria",
    "region": "Africa",
    "subregion": "Western Africa",
    "lat": 10,
    "lng": 8,
    "borders": [
      "BEN",
      "CMR",
      "TCD",
      "NER"
    ],
    "nameEn": "Nigeria"
  },
  {
    "code": "NOR",
    "name": "Noruega",
    "region": "Europe",
    "subregion": "Northern Europe",
    "lat": 62,
    "lng": 10,
    "borders": [
      "FIN",
      "SWE",
      "RUS"
    ],
    "nameEn": "Norway"
  },
  {
    "code": "NZL",
    "name": "Nueva Zelanda",
    "region": "Oceania",
    "subregion": "Australia and New Zealand",
    "lat": -41,
    "lng": 174,
    "borders": [],
    "nameEn": "New Zealand"
  },
  {
    "code": "OMN",
    "name": "Omán",
    "region": "Asia",
    "subregion": "Western Asia",
    "lat": 21,
    "lng": 57,
    "borders": [
      "SAU",
      "ARE",
      "YEM"
    ],
    "nameEn": "Oman"
  },
  {
    "code": "NLD",
    "name": "Países Bajos",
    "region": "Europe",
    "subregion": "Western Europe",
    "lat": 52.5,
    "lng": 5.75,
    "borders": [
      "BEL",
      "DEU"
    ],
    "nameEn": "Netherlands"
  },
  {
    "code": "PAK",
    "name": "Pakistán",
    "region": "Asia",
    "subregion": "Southern Asia",
    "lat": 30,
    "lng": 70,
    "borders": [
      "AFG",
      "CHN",
      "IND",
      "IRN"
    ],
    "nameEn": "Pakistan"
  },
  {
    "code": "PLW",
    "name": "Palau",
    "region": "Oceania",
    "subregion": "Micronesia",
    "lat": 7.5,
    "lng": 134.5,
    "borders": [],
    "nameEn": "Palau"
  },
  {
    "code": "PAN",
    "name": "Panamá",
    "region": "Americas",
    "subregion": "Central America",
    "lat": 9,
    "lng": -80,
    "borders": [
      "COL",
      "CRI"
    ],
    "nameEn": "Panama"
  },
  {
    "code": "PNG",
    "name": "Papúa Nueva Guinea",
    "region": "Oceania",
    "subregion": "Melanesia",
    "lat": -6,
    "lng": 147,
    "borders": [
      "IDN"
    ],
    "nameEn": "Papua New Guinea"
  },
  {
    "code": "PRY",
    "name": "Paraguay",
    "region": "Americas",
    "subregion": "South America",
    "lat": -23,
    "lng": -58,
    "borders": [
      "ARG",
      "BOL",
      "BRA"
    ],
    "nameEn": "Paraguay"
  },
  {
    "code": "PER",
    "name": "Perú",
    "region": "Americas",
    "subregion": "South America",
    "lat": -10,
    "lng": -76,
    "borders": [
      "BOL",
      "BRA",
      "CHL",
      "COL",
      "ECU"
    ],
    "nameEn": "Peru"
  },
  {
    "code": "POL",
    "name": "Polonia",
    "region": "Europe",
    "subregion": "Central Europe",
    "lat": 52,
    "lng": 20,
    "borders": [
      "BLR",
      "CZE",
      "DEU",
      "LTU",
      "RUS",
      "SVK",
      "UKR"
    ],
    "nameEn": "Poland"
  },
  {
    "code": "PRT",
    "name": "Portugal",
    "region": "Europe",
    "subregion": "Southern Europe",
    "lat": 39.5,
    "lng": -8,
    "borders": [
      "ESP"
    ],
    "nameEn": "Portugal"
  },
  {
    "code": "GBR",
    "name": "Reino Unido",
    "region": "Europe",
    "subregion": "Northern Europe",
    "lat": 54,
    "lng": -2,
    "borders": [
      "IRL"
    ],
    "nameEn": "United Kingdom"
  },
  {
    "code": "CAF",
    "name": "República Centroafricana",
    "region": "Africa",
    "subregion": "Middle Africa",
    "lat": 7,
    "lng": 21,
    "borders": [
      "CMR",
      "TCD",
      "COD",
      "COG",
      "SSD",
      "SDN"
    ],
    "nameEn": "Central African Republic"
  },
  {
    "code": "DOM",
    "name": "República Dominicana",
    "region": "Americas",
    "subregion": "Caribbean",
    "lat": 19,
    "lng": -70.66666666,
    "borders": [
      "HTI"
    ],
    "nameEn": "Dominican Republic"
  },
  {
    "code": "RWA",
    "name": "Ruanda",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": -2,
    "lng": 30,
    "borders": [
      "BDI",
      "COD",
      "TZA",
      "UGA"
    ],
    "nameEn": "Rwanda"
  },
  {
    "code": "ROU",
    "name": "Rumania",
    "region": "Europe",
    "subregion": "Southeast Europe",
    "lat": 46,
    "lng": 25,
    "borders": [
      "BGR",
      "HUN",
      "MDA",
      "SRB",
      "UKR"
    ],
    "nameEn": "Romania"
  },
  {
    "code": "RUS",
    "name": "Rusia",
    "region": "Europe",
    "subregion": "Eastern Europe",
    "lat": 60,
    "lng": 100,
    "borders": [
      "AZE",
      "BLR",
      "CHN",
      "EST",
      "FIN",
      "GEO",
      "KAZ",
      "PRK",
      "LVA",
      "LTU",
      "MNG",
      "NOR",
      "POL",
      "UKR"
    ],
    "nameEn": "Russia"
  },
  {
    "code": "WSM",
    "name": "Samoa",
    "region": "Oceania",
    "subregion": "Polynesia",
    "lat": -13.58333333,
    "lng": -172.33333333,
    "borders": [],
    "nameEn": "Samoa"
  },
  {
    "code": "KNA",
    "name": "San Cristóbal y Nieves",
    "region": "Americas",
    "subregion": "Caribbean",
    "lat": 17.33333333,
    "lng": -62.75,
    "borders": [],
    "nameEn": "Saint Kitts and Nevis"
  },
  {
    "code": "SMR",
    "name": "San Marino",
    "region": "Europe",
    "subregion": "Southern Europe",
    "lat": 43.76666666,
    "lng": 12.41666666,
    "borders": [
      "ITA"
    ],
    "nameEn": "San Marino"
  },
  {
    "code": "VCT",
    "name": "San Vicente y Granadinas",
    "region": "Americas",
    "subregion": "Caribbean",
    "lat": 13.25,
    "lng": -61.2,
    "borders": [],
    "nameEn": "Saint Vincent and the Grenadines"
  },
  {
    "code": "LCA",
    "name": "Santa Lucía",
    "region": "Americas",
    "subregion": "Caribbean",
    "lat": 13.88333333,
    "lng": -60.96666666,
    "borders": [],
    "nameEn": "Saint Lucia"
  },
  {
    "code": "STP",
    "name": "Santo Tomé y Príncipe",
    "region": "Africa",
    "subregion": "Middle Africa",
    "lat": 1,
    "lng": 7,
    "borders": [],
    "nameEn": "São Tomé and Príncipe"
  },
  {
    "code": "SEN",
    "name": "Senegal",
    "region": "Africa",
    "subregion": "Western Africa",
    "lat": 14,
    "lng": -14,
    "borders": [
      "GMB",
      "GIN",
      "GNB",
      "MLI",
      "MRT"
    ],
    "nameEn": "Senegal"
  },
  {
    "code": "SRB",
    "name": "Serbia",
    "region": "Europe",
    "subregion": "Southeast Europe",
    "lat": 44,
    "lng": 21,
    "borders": [
      "BIH",
      "BGR",
      "HRV",
      "HUN",
      "UNK",
      "MKD",
      "MNE",
      "ROU"
    ],
    "nameEn": "Serbia"
  },
  {
    "code": "SYC",
    "name": "Seychelles",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": -4.58333333,
    "lng": 55.66666666,
    "borders": [],
    "nameEn": "Seychelles"
  },
  {
    "code": "SLE",
    "name": "Sierra Leone",
    "region": "Africa",
    "subregion": "Western Africa",
    "lat": 8.5,
    "lng": -11.5,
    "borders": [
      "GIN",
      "LBR"
    ],
    "nameEn": "Sierra Leone"
  },
  {
    "code": "SGP",
    "name": "Singapur",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "lat": 1.36666666,
    "lng": 103.8,
    "borders": [],
    "nameEn": "Singapore"
  },
  {
    "code": "SYR",
    "name": "Siria",
    "region": "Asia",
    "subregion": "Western Asia",
    "lat": 35,
    "lng": 38,
    "borders": [
      "IRQ",
      "ISR",
      "JOR",
      "LBN",
      "TUR"
    ],
    "nameEn": "Syria"
  },
  {
    "code": "SOM",
    "name": "Somalia",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": 10,
    "lng": 49,
    "borders": [
      "DJI",
      "ETH",
      "KEN"
    ],
    "nameEn": "Somalia"
  },
  {
    "code": "LKA",
    "name": "Sri Lanka",
    "region": "Asia",
    "subregion": "Southern Asia",
    "lat": 7,
    "lng": 81,
    "borders": [
      "IND"
    ],
    "nameEn": "Sri Lanka"
  },
  {
    "code": "SWZ",
    "name": "Suazilandia",
    "region": "Africa",
    "subregion": "Southern Africa",
    "lat": -26.5,
    "lng": 31.5,
    "borders": [
      "MOZ",
      "ZAF"
    ],
    "nameEn": "Eswatini"
  },
  {
    "code": "ZAF",
    "name": "Sudáfrica",
    "region": "Africa",
    "subregion": "Southern Africa",
    "lat": -29,
    "lng": 24,
    "borders": [
      "BWA",
      "LSO",
      "MOZ",
      "NAM",
      "SWZ",
      "ZWE"
    ],
    "nameEn": "South Africa"
  },
  {
    "code": "SDN",
    "name": "Sudán",
    "region": "Africa",
    "subregion": "Northern Africa",
    "lat": 15,
    "lng": 30,
    "borders": [
      "CAF",
      "TCD",
      "EGY",
      "ERI",
      "ETH",
      "LBY",
      "SSD"
    ],
    "nameEn": "Sudan"
  },
  {
    "code": "SSD",
    "name": "Sudán del Sur",
    "region": "Africa",
    "subregion": "Middle Africa",
    "lat": 7,
    "lng": 30,
    "borders": [
      "CAF",
      "COD",
      "ETH",
      "KEN",
      "SDN",
      "UGA"
    ],
    "nameEn": "South Sudan"
  },
  {
    "code": "SWE",
    "name": "Suecia",
    "region": "Europe",
    "subregion": "Northern Europe",
    "lat": 62,
    "lng": 15,
    "borders": [
      "FIN",
      "NOR"
    ],
    "nameEn": "Sweden"
  },
  {
    "code": "CHE",
    "name": "Suiza",
    "region": "Europe",
    "subregion": "Western Europe",
    "lat": 47,
    "lng": 8,
    "borders": [
      "AUT",
      "FRA",
      "ITA",
      "LIE",
      "DEU"
    ],
    "nameEn": "Switzerland"
  },
  {
    "code": "SUR",
    "name": "Surinam",
    "region": "Americas",
    "subregion": "South America",
    "lat": 4,
    "lng": -56,
    "borders": [
      "BRA",
      "GUF",
      "GUY"
    ],
    "nameEn": "Suriname"
  },
  {
    "code": "THA",
    "name": "Tailandia",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "lat": 15,
    "lng": 100,
    "borders": [
      "MMR",
      "KHM",
      "LAO",
      "MYS"
    ],
    "nameEn": "Thailand"
  },
  {
    "code": "TZA",
    "name": "Tanzania",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": -6,
    "lng": 35,
    "borders": [
      "BDI",
      "COD",
      "KEN",
      "MWI",
      "MOZ",
      "RWA",
      "UGA",
      "ZMB"
    ],
    "nameEn": "Tanzania"
  },
  {
    "code": "TJK",
    "name": "Tayikistán",
    "region": "Asia",
    "subregion": "Central Asia",
    "lat": 39,
    "lng": 71,
    "borders": [
      "AFG",
      "CHN",
      "KGZ",
      "UZB"
    ],
    "nameEn": "Tajikistan"
  },
  {
    "code": "TLS",
    "name": "Timor Oriental",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "lat": -8.83333333,
    "lng": 125.91666666,
    "borders": [
      "IDN"
    ],
    "nameEn": "Timor-Leste"
  },
  {
    "code": "TGO",
    "name": "Togo",
    "region": "Africa",
    "subregion": "Western Africa",
    "lat": 8,
    "lng": 1.16666666,
    "borders": [
      "BEN",
      "BFA",
      "GHA"
    ],
    "nameEn": "Togo"
  },
  {
    "code": "TON",
    "name": "Tonga",
    "region": "Oceania",
    "subregion": "Polynesia",
    "lat": -20,
    "lng": -175,
    "borders": [],
    "nameEn": "Tonga"
  },
  {
    "code": "TTO",
    "name": "Trinidad y Tobago",
    "region": "Americas",
    "subregion": "Caribbean",
    "lat": 11,
    "lng": -61,
    "borders": [],
    "nameEn": "Trinidad and Tobago"
  },
  {
    "code": "TUN",
    "name": "Túnez",
    "region": "Africa",
    "subregion": "Northern Africa",
    "lat": 34,
    "lng": 9,
    "borders": [
      "DZA",
      "LBY"
    ],
    "nameEn": "Tunisia"
  },
  {
    "code": "TKM",
    "name": "Turkmenistán",
    "region": "Asia",
    "subregion": "Central Asia",
    "lat": 40,
    "lng": 60,
    "borders": [
      "AFG",
      "IRN",
      "KAZ",
      "UZB"
    ],
    "nameEn": "Turkmenistan"
  },
  {
    "code": "TUR",
    "name": "Turquía",
    "region": "Asia",
    "subregion": "Western Asia",
    "lat": 39,
    "lng": 35,
    "borders": [
      "ARM",
      "AZE",
      "BGR",
      "GEO",
      "GRC",
      "IRN",
      "IRQ",
      "SYR"
    ],
    "nameEn": "Türkiye"
  },
  {
    "code": "TUV",
    "name": "Tuvalu",
    "region": "Oceania",
    "subregion": "Polynesia",
    "lat": -8,
    "lng": 178,
    "borders": [],
    "nameEn": "Tuvalu"
  },
  {
    "code": "UKR",
    "name": "Ucrania",
    "region": "Europe",
    "subregion": "Eastern Europe",
    "lat": 49,
    "lng": 32,
    "borders": [
      "BLR",
      "HUN",
      "MDA",
      "POL",
      "ROU",
      "RUS",
      "SVK"
    ],
    "nameEn": "Ukraine"
  },
  {
    "code": "UGA",
    "name": "Uganda",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": 1,
    "lng": 32,
    "borders": [
      "COD",
      "KEN",
      "RWA",
      "SSD",
      "TZA"
    ],
    "nameEn": "Uganda"
  },
  {
    "code": "URY",
    "name": "Uruguay",
    "region": "Americas",
    "subregion": "South America",
    "lat": -33,
    "lng": -56,
    "borders": [
      "ARG",
      "BRA"
    ],
    "nameEn": "Uruguay"
  },
  {
    "code": "UZB",
    "name": "Uzbekistán",
    "region": "Asia",
    "subregion": "Central Asia",
    "lat": 41,
    "lng": 64,
    "borders": [
      "AFG",
      "KAZ",
      "KGZ",
      "TJK",
      "TKM"
    ],
    "nameEn": "Uzbekistan"
  },
  {
    "code": "VUT",
    "name": "Vanuatu",
    "region": "Oceania",
    "subregion": "Melanesia",
    "lat": -16,
    "lng": 167,
    "borders": [],
    "nameEn": "Vanuatu"
  },
  {
    "code": "VEN",
    "name": "Venezuela",
    "region": "Americas",
    "subregion": "South America",
    "lat": 8,
    "lng": -66,
    "borders": [
      "BRA",
      "COL",
      "GUY"
    ],
    "nameEn": "Venezuela"
  },
  {
    "code": "VNM",
    "name": "Vietnam",
    "region": "Asia",
    "subregion": "South-Eastern Asia",
    "lat": 16.16666666,
    "lng": 107.83333333,
    "borders": [
      "KHM",
      "CHN",
      "LAO"
    ],
    "nameEn": "Vietnam"
  },
  {
    "code": "YEM",
    "name": "Yemen",
    "region": "Asia",
    "subregion": "Western Asia",
    "lat": 15,
    "lng": 48,
    "borders": [
      "OMN",
      "SAU"
    ],
    "nameEn": "Yemen"
  },
  {
    "code": "ZMB",
    "name": "Zambia",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": -15,
    "lng": 30,
    "borders": [
      "AGO",
      "BWA",
      "COD",
      "MWI",
      "MOZ",
      "NAM",
      "TZA",
      "ZWE"
    ],
    "nameEn": "Zambia"
  },
  {
    "code": "ZWE",
    "name": "Zimbabue",
    "region": "Africa",
    "subregion": "Eastern Africa",
    "lat": -20,
    "lng": 30,
    "borders": [
      "BWA",
      "MOZ",
      "ZAF",
      "ZMB"
    ],
    "nameEn": "Zimbabwe"
  }
];
