// ──────────────── COMPLETE LIST OF COUNTRIES AND US STATES FOR SEARCH ────────────────
window.allCountries = [
  // Europe
  { name: "Serbia", capital: "Belgrade", population: "6.9M", language: "Serbian", flag: "🇷🇸", continent: "Europe" },
  { name: "Germany", capital: "Berlin", population: "83M", language: "German", flag: "🇩🇪", continent: "Europe" },
  { name: "France", capital: "Paris", population: "68M", language: "French", flag: "🇫🇷", continent: "Europe" },
  { name: "Italy", capital: "Rome", population: "59M", language: "Italian", flag: "🇮🇹", continent: "Europe" },
  { name: "United Kingdom", capital: "London", population: "67M", language: "English", flag: "🇬🇧", continent: "Europe" },
  { name: "Spain", capital: "Madrid", population: "47M", language: "Spanish", flag: "🇪🇸", continent: "Europe" },
  { name: "Portugal", capital: "Lisbon", population: "10M", language: "Portuguese", flag: "🇵🇹", continent: "Europe" },
  { name: "Netherlands", capital: "Amsterdam", population: "17M", language: "Dutch", flag: "🇳🇱", continent: "Europe" },
  { name: "Belgium", capital: "Brussels", population: "11M", language: "Dutch/French/German", flag: "🇧🇪", continent: "Europe" },
  { name: "Switzerland", capital: "Bern", population: "8.7M", language: "German/French/Italian", flag: "🇨🇭", continent: "Europe" },
  { name: "Austria", capital: "Vienna", population: "9M", language: "German", flag: "🇦🇹", continent: "Europe" },
  { name: "Poland", capital: "Warsaw", population: "38M", language: "Polish", flag: "🇵🇱", continent: "Europe" },
  { name: "Czech Republic", capital: "Prague", population: "10.7M", language: "Czech", flag: "🇨🇿", continent: "Europe" },
  { name: "Sweden", capital: "Stockholm", population: "10.4M", language: "Swedish", flag: "🇸🇪", continent: "Europe" },
  { name: "Norway", capital: "Oslo", population: "5.4M", language: "Norwegian", flag: "🇳🇴", continent: "Europe" },
  { name: "Denmark", capital: "Copenhagen", population: "5.8M", language: "Danish", flag: "🇩🇰", continent: "Europe" },
  { name: "Finland", capital: "Helsinki", population: "5.5M", language: "Finnish/Swedish", flag: "🇫🇮", continent: "Europe" },
  { name: "Ireland", capital: "Dublin", population: "5M", language: "English/Irish", flag: "🇮🇪", continent: "Europe" },
  { name: "Greece", capital: "Athens", population: "10.4M", language: "Greek", flag: "🇬🇷", continent: "Europe" },
  { name: "Hungary", capital: "Budapest", population: "9.6M", language: "Hungarian", flag: "🇭🇺", continent: "Europe" },
  { name: "Romania", capital: "Bucharest", population: "19M", language: "Romanian", flag: "🇷🇴", continent: "Europe" },
  { name: "Bulgaria", capital: "Sofia", population: "6.9M", language: "Bulgarian", flag: "🇧🇬", continent: "Europe" },
  { name: "Croatia", capital: "Zagreb", population: "3.9M", language: "Croatian", flag: "🇭🇷", continent: "Europe" },
  { name: "Slovakia", capital: "Bratislava", population: "5.4M", language: "Slovak", flag: "🇸🇰", continent: "Europe" },
  { name: "Slovenia", capital: "Ljubljana", population: "2.1M", language: "Slovenian", flag: "🇸🇮", continent: "Europe" },
  // Africa (subset for brevity, you can extend)
  { name: "South Africa", capital: "Pretoria", population: "60M", language: "11 Official", flag: "🇿🇦", continent: "Africa" },
  { name: "Egypt", capital: "Cairo", population: "104M", language: "Arabic", flag: "🇪🇬", continent: "Africa" },
  { name: "Nigeria", capital: "Abuja", population: "218M", language: "English", flag: "🇳🇬", continent: "Africa" },
  { name: "Kenya", capital: "Nairobi", population: "55M", language: "Swahili/English", flag: "🇰🇪", continent: "Africa" },
  { name: "Morocco", capital: "Rabat", population: "37M", language: "Arabic/Berber", flag: "🇲🇦", continent: "Africa" },
  // Asia (subset)
  { name: "Japan", capital: "Tokyo", population: "125M", language: "Japanese", flag: "🇯🇵", continent: "Asia" },
  { name: "China", capital: "Beijing", population: "1.4B", language: "Chinese", flag: "🇨🇳", continent: "Asia" },
  { name: "India", capital: "New Delhi", population: "1.4B", language: "Hindi/English", flag: "🇮🇳", continent: "Asia" },
  { name: "South Korea", capital: "Seoul", population: "52M", language: "Korean", flag: "🇰🇷", continent: "Asia" },
  { name: "Thailand", capital: "Bangkok", population: "70M", language: "Thai", flag: "🇹🇭", continent: "Asia" },
  { name: "Vietnam", capital: "Hanoi", population: "99M", language: "Vietnamese", flag: "🇻🇳", continent: "Asia" },
  { name: "Indonesia", capital: "Jakarta", population: "277M", language: "Indonesian", flag: "🇮🇩", continent: "Asia" },
  { name: "Philippines", capital: "Manila", population: "115M", language: "Filipino/English", flag: "🇵🇭", continent: "Asia" },
  { name: "Turkey", capital: "Ankara", population: "85M", language: "Turkish", flag: "🇹🇷", continent: "Asia" },
  // North America (countries)
  { name: "Canada", capital: "Ottawa", population: "39M", language: "English/French", flag: "🇨🇦", continent: "North America" },
  { name: "Mexico", capital: "Mexico City", population: "129M", language: "Spanish", flag: "🇲🇽", continent: "North America" },
  // South America
  { name: "Brazil", capital: "Brasília", population: "214M", language: "Portuguese", flag: "🇧🇷", continent: "South America" },
  { name: "Argentina", capital: "Buenos Aires", population: "46M", language: "Spanish", flag: "🇦🇷", continent: "South America" },
  // Oceania
  { name: "Australia", capital: "Canberra", population: "26M", language: "English", flag: "🇦🇺", continent: "Oceania" },
  { name: "New Zealand", capital: "Wellington", population: "5M", language: "English/Māori", flag: "🇳🇿", continent: "Oceania" },
  // USA States (each as separate entry)
  { name: "USA-Alabama", capital: "Montgomery", population: "5M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Alaska", capital: "Juneau", population: "0.7M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Arizona", capital: "Phoenix", population: "7.4M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Arkansas", capital: "Little Rock", population: "3M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-California", capital: "Sacramento", population: "39.5M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Colorado", capital: "Denver", population: "5.8M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Connecticut", capital: "Hartford", population: "3.6M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Delaware", capital: "Dover", population: "1M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Florida", capital: "Tallahassee", population: "22M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Georgia", capital: "Atlanta", population: "10.9M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Hawaii", capital: "Honolulu", population: "1.4M", language: "English/Hawaiian", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Idaho", capital: "Boise", population: "1.9M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Illinois", capital: "Springfield", population: "12.6M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Indiana", capital: "Indianapolis", population: "6.8M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Iowa", capital: "Des Moines", population: "3.2M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Kansas", capital: "Topeka", population: "2.9M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Kentucky", capital: "Frankfort", population: "4.5M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Louisiana", capital: "Baton Rouge", population: "4.6M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Maine", capital: "Augusta", population: "1.4M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Maryland", capital: "Annapolis", population: "6.2M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Massachusetts", capital: "Boston", population: "7M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Michigan", capital: "Lansing", population: "10M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Minnesota", capital: "Saint Paul", population: "5.7M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Mississippi", capital: "Jackson", population: "2.9M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Missouri", capital: "Jefferson City", population: "6.2M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Montana", capital: "Helena", population: "1.1M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Nebraska", capital: "Lincoln", population: "2M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Nevada", capital: "Carson City", population: "3.2M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-New Hampshire", capital: "Concord", population: "1.4M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-New Jersey", capital: "Trenton", population: "9.3M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-New Mexico", capital: "Santa Fe", population: "2.1M", language: "English/Spanish", flag: "🇺🇸", continent: "North America" },
  { name: "USA-New York", capital: "Albany", population: "19.8M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-North Carolina", capital: "Raleigh", population: "10.7M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-North Dakota", capital: "Bismarck", population: "0.8M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Ohio", capital: "Columbus", population: "11.8M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Oklahoma", capital: "Oklahoma City", population: "4M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Oregon", capital: "Salem", population: "4.2M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Pennsylvania", capital: "Harrisburg", population: "13M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Rhode Island", capital: "Providence", population: "1.1M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-South Carolina", capital: "Columbia", population: "5.2M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-South Dakota", capital: "Pierre", population: "0.9M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Tennessee", capital: "Nashville", population: "7M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Texas", capital: "Austin", population: "30M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Utah", capital: "Salt Lake City", population: "3.4M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Vermont", capital: "Montpelier", population: "0.6M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Virginia", capital: "Richmond", population: "8.7M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Washington", capital: "Olympia", population: "7.8M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-West Virginia", capital: "Charleston", population: "1.8M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Wisconsin", capital: "Madison", population: "5.9M", language: "English", flag: "🇺🇸", continent: "North America" },
  { name: "USA-Wyoming", capital: "Cheyenne", population: "0.6M", language: "English", flag: "🇺🇸", continent: "North America" },
  // You can add many more countries... this is a starter list.
  // Full list would contain ~193 UN members + 50 states = 243 entries.
  // I've included the structure so you can easily copy-paste missing ones.
];

// ──────────────── POLYGONS FOR COLLECTED TERRITORIES (green overlay) ────────────────
window.allPolygons = {
  "Serbia": [
    [ [20.0, 44.5], [19.5, 44.8], [19.0, 44.0], [19.5, 43.5], [20.5, 43.0], [21.5, 43.0], [22.0, 43.5], [22.5, 44.0], [22.0, 44.8], [21.5, 45.2], [20.5, 45.2], [20.0, 44.5] ]
  ],
  "Germany": [
    [ [6.0, 47.5], [7.0, 47.5], [8.0, 48.0], [9.0, 48.2], [10.0, 48.0], [11.0, 48.5], [12.0, 48.5], [13.0, 48.0], [14.0, 48.0], [15.0, 47.5], [15.0, 47.0], [14.5, 46.5], [13.5, 46.5], [12.5, 46.5], [11.5, 46.0], [10.5, 46.0], [9.5, 46.5], [8.5, 46.5], [7.5, 46.5], [6.5, 47.0], [6.0, 47.5] ]
  ],
  "Japan": [
    [ [130.0, 32.0], [131.0, 33.0], [132.0, 34.0], [133.0, 35.0], [134.0, 35.5], [135.0, 35.5], [136.0, 36.0], [137.0, 36.5], [138.0, 37.0], [139.0, 38.0], [140.0, 39.0], [141.0, 40.0], [142.0, 41.0], [143.0, 42.0], [144.0, 43.0], [145.0, 44.0], [145.5, 44.5], [145.0, 45.0], [144.0, 44.5], [143.0, 44.0], [142.0, 43.0], [141.0, 42.0], [140.0, 41.0], [139.0, 40.0], [138.0, 39.0], [137.0, 38.0], [136.0, 37.0], [135.0, 36.5], [134.0, 36.0], [133.0, 35.0], [132.0, 34.0], [131.0, 33.0], [130.0, 32.0] ]
  ],
  "USA-California": [
    [ [-124.4, 42.0], [-124.0, 41.5], [-123.5, 40.5], [-123.0, 40.0], [-122.5, 39.5], [-121.5, 39.0], [-120.5, 39.0], [-120.0, 38.5], [-119.5, 38.0], [-119.0, 37.5], [-118.5, 37.0], [-118.0, 36.5], [-117.5, 36.0], [-117.0, 35.5], [-116.5, 35.0], [-116.0, 34.5], [-115.5, 34.0], [-115.0, 33.5], [-114.5, 33.0], [-114.0, 32.5], [-114.5, 32.0], [-115.5, 32.0], [-116.5, 32.5], [-117.0, 33.0], [-117.5, 33.5], [-118.0, 34.0], [-118.5, 34.5], [-119.0, 35.0], [-119.5, 35.5], [-120.0, 36.0], [-120.5, 36.5], [-121.0, 37.0], [-121.5, 37.5], [-122.0, 38.0], [-122.5, 38.5], [-123.0, 39.0], [-123.5, 39.5], [-124.0, 40.0], [-124.4, 40.5], [-124.4, 42.0] ]
  ]
};