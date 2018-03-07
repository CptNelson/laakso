Game.NameGenerator = function() {
  //Array holding all the names. use names.push[name] to add names.

  var names = ["Ahti", "Aikamieli", "Aikio", "Airikka", "Ampuja", "Ano", "Arijoutsi", "Armas", "Arpia",
    "Asikka", "Auvo", "Hellikki", "Himottu", "Hirvas", "Hirvi", "Hopea", "Hyvälempi", "Hyväneuvo",
    "Hyväpaulo", "Hyväri", "Hyvätty", "Ihalempi", "Ihamuoto", "Ikitiera", "Ikopäivä", "Ikäheimo",
    "Ikävalko", "Ilakka", "Ilma", "Ilmari", "Ilmatoivia", "Janakka", "Jouko", "Jousia", "Joutsi",
    "Joutsimies", "Jurva", "Jutikka", "Kainu", "Kaivas", "Kaivattu", "Kaipia", "Kalamies", "Kalervo",
    "Kallas", "Kalpio", "Kare", "Kauko", "Kaukomieli", "Kaukovalta", "Keiho", "Keihäri", "Kekko", "Kokko",
    "Koira", "Kontio", "Kostia", "Kotarikko", "Koveri", "Kullervo", "Kulta", "Kultamies", "Kultimo",
    "Kukurtaja", "Kupias", "Kurikka", "Kuutamo", "Kylli", "Kyllikki", "Lalli", "Laso", "Laulaja",
    "Leinikka", "Leino", "Lemmikki", "Lemmitty", "Lemmäs", "Lempiä", "Lempo", "Liekko", "Lyylikki",
    "Löyliä", "Maanavilja", "Mainikki", "Meri", "Meripäivä", "Metso", "Meurakas", "Mieho", "Miekka",
    "Miela", "Mielenpito", "Mielikki", "Mielipäivä", "Mielitty", "Mielivalta", "Mielo", "Miemo",
    "Mietti", "Montaja", "Neuvo", "Nousia", "Nuolia", "Ora", "Osma", "Osmo", "Otava", "Otra", "Paasia",
    "Paaso", "Pekka", "Pekko", "Pellervo", "Peuro", "Puukko", "Päiviä", "Päivälapsi", "Päivö", "Rahikka",
    "Raita", "Rasantaja", "Rautia", "Repo", "Salme", "Sarijoutsi", "Satatieto", "Sauvo", "Seppo", "Soini",
    "Sotamieli", "Sotia", "Sotijalo", "Susi", "Suvi", "Säisä", "Talvikki", "Tammi", "Tapatora", "Tapavaino",
    "Tapo", "Tenho", "Terhi", "Terhikki", "Tiera", "Tietävä", "Toiva", "Toivas", "Toivelempi", "Toivettu",
    "Toivikki", "Toivio", "Toivottu", "Torio", "Tornia", "Tornio", "Tuiretuinen", "Tulo", "Tuntia", "Tuomikki",
    "Turo", "Tuuli", "Tuulikki", "Ukko", "Unaja", "Untamo", "Unti", "Unto", "Urho", "Urja", "Uro", "Usma",
    "Utujoutsi", "Vaania", "Vaino", "Vaito", "Valo", "Valta", "Valtari", "Vartia", "Vasara", "Venemies",
    "Vesa", "Vesi", "Vesivalo", "Vihas", "Vihavaino", "Vilja", "Viljakka", "Viljari", "Viljo", "Viti",
    "Väinä", "Väinö", "Väkimieli", "Väkiä", "Yijä", "Yö", "Äijäpäivä", "Äijö", "Äiniö"];

    encodeURI([names].join(""))
    return names[Math.floor(Math.random() * (names.length))];
};


