const TRIPS_API =
  "https://turisticky-kruzok-api.dominikturcek.workers.dev/api/public/trips";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1100&q=88";

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MÁJ", "JÚN",
  "JÚL", "AUG", "SEP", "OKT", "NOV", "DEC"
];

const DIFFICULTY = {
  easy: "ĽAHKÁ",
  medium: "STREDNÁ",
  hard: "ŤAŽKÁ"
};


// =====================================================
// DÁTUMY
// =====================================================

function parseTripDate(value) {
  if (!value) return null;

  const parts = value.split("-").map(Number);

  if (
    parts.length !== 3 ||
    parts.some(Number.isNaN)
  ) {
    return null;
  }

  return new Date(
    parts[0],
    parts[1] - 1,
    parts[2]
  );
}


function longDate(value) {
  const date = parseTripDate(value);

  if (!date) {
    return "Dátum bude doplnený";
  }

  return new Intl.DateTimeFormat(
    "sk-SK",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  ).format(date);
}


function headerDate(value) {
  const date = parseTripDate(value);

  if (!date) {
    return "DÁTUM BUDE DOPLNENÝ";
  }

  return new Intl.DateTimeFormat(
    "sk-SK",
    {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  )
    .format(date)
    .toLocaleUpperCase("sk-SK");
}


// =====================================================
// NÁROČNOSŤ
// =====================================================

function difficulty(value) {
  return (
    DIFFICULTY[value] ||
    String(value || "—").toLocaleUpperCase("sk-SK")
  );
}


// =====================================================
// POMOCNÁ FUNKCIA
// =====================================================

function text(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}


// =====================================================
// NAJBLIŽŠÍ VÝLET
// =====================================================

function renderNextTrip(trip) {

  const detailButton =
    document.getElementById("nextTripDetailButton");


  // Ak zatiaľ nemáme žiadny plánovaný výlet
  if (!trip) {

    text(
      "nextTripHeaderDate",
      "ĎALŠÍ VÝLET PRIPRAVUJEME"
    );

    text(
      "nextTripName",
      "Ďalší výlet pripravujeme"
    );

    text(
      "nextTripRoute",
      "📍 Podrobnosti zverejníme čoskoro"
    );

    text(
      "nextTripDate",
      "📅 Termín bude doplnený"
    );

    text(
      "nextTripTime",
      "🕘 Čas bude doplnený"
    );

    text(
      "nextTripDistance",
      "🥾 Trasa bude doplnená"
    );

    text(
      "nextTripElevation",
      "↗ Prevýšenie bude doplnené"
    );

    text(
      "nextTripDifficulty",
      "—"
    );

    if (detailButton) {
      detailButton.style.display = "none";
    }

    return;
  }


  // =====================================================
  // ODKAZ NA DETAIL VÝLETU
  // =====================================================

  if (detailButton) {

    detailButton.style.display = "inline-block";

    detailButton.href =
      `/turisticky-kruzok/vylet/?id=${encodeURIComponent(trip.id)}`;
  }


  // =====================================================
  // DÁTUM V ZELENEJ HLAVIČKE
  // =====================================================

  text(
    "nextTripHeaderDate",
    headerDate(trip.trip_date)
  );


  // =====================================================
  // NÁZOV
  // =====================================================

  text(
    "nextTripName",
    trip.name || "Výlet"
  );


  // =====================================================
  // TRASA
  // =====================================================

  text(
    "nextTripRoute",
    `📍 ${
      trip.route ||
      "Trasa bude doplnená"
    }`
  );


  // =====================================================
  // DÁTUM
  // =====================================================

  text(
    "nextTripDate",
    `📅 ${longDate(trip.trip_date)}`
  );


  // =====================================================
  // ČAS
  // =====================================================

  let tripTime =
    "Čas bude doplnený";

  if (
    trip.time_from &&
    trip.time_to
  ) {

    tripTime =
      `${trip.time_from} – ${trip.time_to}`;

  } else if (trip.time_from) {

    tripTime =
      trip.time_from;

  } else if (trip.time_to) {

    tripTime =
      trip.time_to;
  }


  text(
    "nextTripTime",
    `🕘 ${tripTime}`
  );


  // =====================================================
  // VZDIALENOSŤ
  // =====================================================

  text(
    "nextTripDistance",
    `🥾 ${
      trip.distance_km != null
        ? trip.distance_km + " km"
        : "Vzdialenosť bude doplnená"
    }`
  );


  // =====================================================
  // PREVÝŠENIE
  // =====================================================

  text(
    "nextTripElevation",
    `↗ ${
      trip.elevation_m != null
        ? trip.elevation_m + " m prevýšenie"
        : "Prevýšenie bude doplnené"
    }`
  );


  // =====================================================
  // NÁROČNOSŤ
  // =====================================================

  text(
    "nextTripDifficulty",
    difficulty(trip.difficulty)
  );


  // =====================================================
  // OBRÁZOK
  // =====================================================

  const image =
    document.getElementById("nextTripImage");

  if (image) {

    image.style.backgroundImage =
      `url("${
        trip.image_url ||
        FALLBACK_IMAGE
      }")`;
  }
}


// =====================================================
// KARTA PLÁNOVANÉHO VÝLETU
// =====================================================

function tripCard(trip) {

  const article =
    document.createElement("article");


  // =====================================================
  // OBRÁZOK
  // =====================================================

  const photo =
    document.createElement("div");

  photo.className =
    "cardPhoto";

  photo.style.backgroundImage =
    `url("${
      trip.image_url ||
      FALLBACK_IMAGE
    }")`;


  // =====================================================
  // DÁTUM NA OBRÁZKU
  // =====================================================

  const date =
    parseTripDate(
      trip.trip_date
    );


  const time =
    document.createElement("time");


  const day =
    document.createElement("b");


  day.textContent =
    date
      ? date.getDate()
      : "—";


  time.appendChild(day);


  time.appendChild(
    document.createTextNode(
      date
        ? MONTHS[date.getMonth()]
        : ""
    )
  );


  photo.appendChild(time);


  // =====================================================
  // NÁZOV
  // =====================================================

  const name =
    document.createElement("h3");

  name.textContent =
    trip.name || "Výlet";


  // =====================================================
  // TRASA
  // =====================================================

  const route =
    document.createElement("p");

  route.textContent =
    `📍 ${
      trip.route ||
      "Trasa bude doplnená"
    }`;


  // =====================================================
  // NÁROČNOSŤ
  // =====================================================

  const diff =
    document.createElement("small");

  diff.textContent =
    `⛰ ${difficulty(
      trip.difficulty
    )} NÁROČNOSŤ`;


  // =====================================================
  // CELÁ KARTA BUDE KLIKATEĽNÁ
  // =====================================================

  article.style.cursor =
    "pointer";

  article.setAttribute(
    "role",
    "link"
  );

  article.setAttribute(
    "tabindex",
    "0"
  );


  const openTrip = () => {

    window.location.href =
      `/turisticky-kruzok/vylet/?id=${encodeURIComponent(trip.id)}`;
  };


  article.addEventListener(
    "click",
    openTrip
  );


  article.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        openTrip();
      }
    }
  );


  article.append(
    photo,
    name,
    route,
    diff
  );


  return article;
}


// =====================================================
// PLÁNOVANÉ VÝLETY
// =====================================================

function renderPlannedTrips(
  trips,
  nextTrip
) {

  const container =
    document.getElementById(
      "plannedTrips"
    );


  if (!container) return;


  container.replaceChildren();


  /*
   * Najbližší výlet je už zobrazený
   * vo veľkej karte.
   *
   * Preto ho v sekcii plánovaných
   * výletov druhýkrát nezobrazujeme.
   */

  const remaining =
    trips.filter(
      trip =>
        trip.id !== nextTrip?.id
    );


  if (remaining.length === 0) {

    const paragraph =
      document.createElement("p");


    paragraph.textContent =
      "Ďalšie plánované výlety zatiaľ nie sú zverejnené.";


    paragraph.style.padding =
      "0 14px";


    container.appendChild(
      paragraph
    );


    return;
  }


  /*
   * Na titulke zobrazíme
   * maximálne 4 ďalšie výlety.
   */

  remaining
    .slice(0, 4)
    .forEach(
      trip => {

        container.appendChild(
          tripCard(trip)
        );

      }
    );
}


// =====================================================
// NAČÍTANIE DÁT Z CLOUDFLARE WORKERA
// =====================================================

async function loadTrips() {

  try {

    const response =
      await fetch(
        TRIPS_API,
        {
          headers: {
            Accept:
              "application/json"
          }
        }
      );


    if (!response.ok) {

      throw new Error(
        `API vrátilo HTTP ${response.status}`
      );
    }


    const data =
      await response.json();


    if (
      !data.ok ||
      !Array.isArray(data.trips)
    ) {

      throw new Error(
        "API vrátilo neočakávaný formát dát."
      );
    }


    // =====================================================
    // IBA PLÁNOVANÉ VÝLETY
    // =====================================================

    const planned =
      data.trips
        .filter(
          trip =>
            trip.status === "planned"
        )
        .sort(
          (a, b) => {

            const dateA =
              parseTripDate(
                a.trip_date
              )?.getTime()
              ?? Infinity;


            const dateB =
              parseTripDate(
                b.trip_date
              )?.getTime()
              ?? Infinity;


            return (
              dateA - dateB
            );
          }
        );


    // =====================================================
    // NAJBLIŽŠÍ VÝLET
    // =====================================================

    const nextTrip =
      planned[0] || null;


    renderNextTrip(
      nextTrip
    );


    renderPlannedTrips(
      planned,
      nextTrip
    );

  }

  catch (error) {

    console.error(
      "Nepodarilo sa načítať výlety:",
      error
    );


    text(
      "nextTripHeaderDate",
      "VÝLETY SA NEPODARILO NAČÍTAŤ"
    );


    text(
      "nextTripName",
      "Údaje sú dočasne nedostupné"
    );


    text(
      "nextTripRoute",
      "📍 Skús stránku načítať znova."
    );


    const detailButton =
      document.getElementById(
        "nextTripDetailButton"
      );


    if (detailButton) {
      detailButton.style.display =
        "none";
    }


    const container =
      document.getElementById(
        "plannedTrips"
      );


    if (container) {

      container.replaceChildren();


      const paragraph =
        document.createElement("p");


      paragraph.textContent =
        "Plánované výlety sa momentálne nepodarilo načítať.";


      paragraph.style.padding =
        "0 14px";


      container.appendChild(
        paragraph
      );
    }
  }
}


// =====================================================
// SPUSTENIE
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  loadTrips
);
