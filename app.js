const TRIPS_API =
  "https://turisticky-kruzok-api.dominikturcek.workers.dev/api/public/trips";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1100&q=88";

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MÁJ",
  "JÚN",
  "JÚL",
  "AUG",
  "SEP",
  "OKT",
  "NOV",
  "DEC"
];

const DIFFICULTY = {
  easy: "ĽAHKÁ",
  medium: "STREDNÁ",
  hard: "ŤAŽKÁ"
};

const STATUS = {
  planned: "PLÁNOVANÝ",
  current: "AKTUÁLNY",
  completed: "USKUTOČNENÝ"
};


// =====================================================
// POMOCNÉ FUNKCIE
// =====================================================

function text(id, value) {
  const element =
    document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}


function parseTripDate(value) {
  if (!value) {
    return null;
  }

  const parts =
    String(value)
      .split("-")
      .map(Number);

  if (
    parts.length !== 3 ||
    parts.some(Number.isNaN)
  ) {
    return null;
  }

  const date =
    new Date(
      parts[0],
      parts[1] - 1,
      parts[2]
    );

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}


function dateTimestamp(value) {
  return (
    parseTripDate(value)?.getTime() ??
    Number.POSITIVE_INFINITY
  );
}


function longDate(value) {
  const date =
    parseTripDate(value);

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


function shortDate(value) {
  const date =
    parseTripDate(value);

  if (!date) {
    return "Dátum bude doplnený";
  }

  return new Intl.DateTimeFormat(
    "sk-SK",
    {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    }
  ).format(date);
}


function headerDate(value) {
  const date =
    parseTripDate(value);

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


function difficulty(value) {
  return (
    DIFFICULTY[value] ||
    String(value || "—")
      .toLocaleUpperCase("sk-SK")
  );
}


function statusLabel(value) {
  return (
    STATUS[value] ||
    String(value || "")
      .toLocaleUpperCase("sk-SK")
  );
}


function tripUrl(trip) {
  return (
    `/turisticky-kruzok/vylet/?id=` +
    encodeURIComponent(trip.id)
  );
}


function tripTime(trip) {
  if (
    trip.time_from &&
    trip.time_to
  ) {
    return (
      `${trip.time_from} – ${trip.time_to}`
    );
  }

  if (trip.time_from) {
    return trip.time_from;
  }

  if (trip.time_to) {
    return trip.time_to;
  }

  return "Čas bude doplnený";
}


function tripImage(trip) {
  return (
    trip.image_url ||
    FALLBACK_IMAGE
  );
}


function makeCardAccessible(
  article,
  trip
) {
  const openTrip = () => {
    window.location.href =
      tripUrl(trip);
  };

  article.setAttribute(
    "role",
    "link"
  );

  article.setAttribute(
    "tabindex",
    "0"
  );

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
}


// =====================================================
// NAJBLIŽŠÍ / AKTUÁLNY VÝLET
// =====================================================

function renderMainTrip(trip) {
  const detailButton =
    document.getElementById(
      "nextTripDetailButton"
    );

  const statusBadge =
    document.getElementById(
      "nextTripStatus"
    );

  const image =
    document.getElementById(
      "nextTripImage"
    );


  if (!trip) {
    text(
      "nextTripSectionTitle",
      "🥾  NAJBLIŽŠÍ VÝLET"
    );

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
      "🥾 Vzdialenosť bude doplnená"
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
      detailButton.hidden = true;
    }

    if (statusBadge) {
      statusBadge.hidden = true;
    }

    return;
  }


  const isCurrent =
    trip.status === "current";


  text(
    "nextTripSectionTitle",
    isCurrent
      ? "🥾  AKTUÁLNY VÝLET"
      : "🥾  NAJBLIŽŠÍ VÝLET"
  );


  text(
    "nextTripHeaderDate",
    headerDate(trip.trip_date)
  );


  text(
    "nextTripName",
    trip.name || "Výlet"
  );


  text(
    "nextTripRoute",
    `📍 ${
      trip.route ||
      "Trasa bude doplnená"
    }`
  );


  text(
    "nextTripDate",
    `📅 ${longDate(trip.trip_date)}`
  );


  text(
    "nextTripTime",
    `🕘 ${tripTime(trip)}`
  );


  text(
    "nextTripDistance",
    `🥾 ${
      trip.distance_km != null
        ? `${trip.distance_km} km`
        : "Vzdialenosť bude doplnená"
    }`
  );


  text(
    "nextTripElevation",
    `↗ ${
      trip.elevation_m != null
        ? `${trip.elevation_m} m prevýšenie`
        : "Prevýšenie bude doplnené"
    }`
  );


  text(
    "nextTripDifficulty",
    difficulty(trip.difficulty)
  );


  if (image) {
    image.style.backgroundImage =
      `url("${tripImage(trip)}")`;
  }


  if (detailButton) {
    detailButton.hidden = false;
    detailButton.href =
      tripUrl(trip);
  }


  if (statusBadge) {
    statusBadge.textContent =
      statusLabel(trip.status);

    statusBadge.className =
      `tripStatusBadge ${trip.status}`;

    statusBadge.hidden = false;
  }
}


// =====================================================
// KARTA PLÁNOVANÉHO VÝLETU
// =====================================================

function createPlannedCard(trip) {
  const article =
    document.createElement("article");

  makeCardAccessible(
    article,
    trip
  );


  const photo =
    document.createElement("div");

  photo.className =
    "cardPhoto";

  photo.style.backgroundImage =
    `url("${tripImage(trip)}")`;


  const date =
    parseTripDate(
      trip.trip_date
    );


  const dateBox =
    document.createElement("time");


  const day =
    document.createElement("b");

  day.textContent =
    date
      ? date.getDate()
      : "—";


  dateBox.appendChild(day);


  dateBox.appendChild(
    document.createTextNode(
      date
        ? MONTHS[date.getMonth()]
        : ""
    )
  );


  photo.appendChild(
    dateBox
  );


  const name =
    document.createElement("h3");

  name.textContent =
    trip.name || "Výlet";


  const route =
    document.createElement("p");

  route.textContent =
    `📍 ${
      trip.route ||
      "Trasa bude doplnená"
    }`;


  const meta =
    document.createElement("small");

  meta.textContent =
    `⛰ ${difficulty(
      trip.difficulty
    )} NÁROČNOSŤ`;


  article.append(
    photo,
    name,
    route,
    meta
  );


  return article;
}


// =====================================================
// KARTA USKUTOČNENÉHO VÝLETU
// =====================================================

function createCompletedCard(trip) {
  const article =
    document.createElement("article");

  makeCardAccessible(
    article,
    trip
  );


  const photo =
    document.createElement("div");

  photo.className =
    "donePhoto";

  photo.style.backgroundImage =
    `url("${tripImage(trip)}")`;


  const date =
    document.createElement("span");

  date.className =
    "doneDate";

  date.textContent =
    shortDate(
      trip.trip_date
    );


  const name =
    document.createElement("h3");

  name.textContent =
    trip.name || "Výlet";


  const info =
    document.createElement("p");

  const pieces = [];

  if (trip.distance_km != null) {
    pieces.push(
      `${trip.distance_km} km`
    );
  }

  if (trip.elevation_m != null) {
    pieces.push(
      `↗ ${trip.elevation_m} m`
    );
  }

  info.textContent =
    pieces.join(" · ");


  article.append(
    photo,
    date,
    name
  );


  if (pieces.length > 0) {
    article.appendChild(info);
  }


  return article;
}


// =====================================================
// PLÁNOVANÉ VÝLETY
// =====================================================

function renderPlannedTrips(
  plannedTrips,
  mainTrip
) {
  const container =
    document.getElementById(
      "plannedTrips"
    );

  if (!container) {
    return;
  }

  container.replaceChildren();


  const remaining =
    plannedTrips.filter(
      trip =>
        Number(trip.id) !==
        Number(mainTrip?.id)
    );


  if (remaining.length === 0) {
    const message =
      document.createElement("p");

    message.className =
      "emptyMessage";

    message.textContent =
      "Ďalšie plánované výlety zatiaľ nie sú zverejnené.";

    container.appendChild(
      message
    );

    return;
  }


  remaining
    .slice(0, 4)
    .forEach(
      trip => {
        container.appendChild(
          createPlannedCard(trip)
        );
      }
    );
}


// =====================================================
// USKUTOČNENÉ VÝLETY
// =====================================================

function renderCompletedTrips(
  completedTrips
) {
  const container =
    document.getElementById(
      "completedTrips"
    );

  if (!container) {
    return;
  }

  container.replaceChildren();


  if (
    completedTrips.length === 0
  ) {
    const message =
      document.createElement("p");

    message.className =
      "emptyMessage";

    message.textContent =
      "Zatiaľ nemáme žiadny uskutočnený výlet.";

    container.appendChild(
      message
    );

    return;
  }


  completedTrips
    .slice(0, 4)
    .forEach(
      trip => {
        container.appendChild(
          createCompletedCard(trip)
        );
      }
    );
}


// =====================================================
// ŠTATISTIKY
// =====================================================

function renderStats(
  completedTrips
) {
  text(
    "completedTripsCount",
    String(completedTrips.length)
  );


  const totalDistance =
    completedTrips.reduce(
      (sum, trip) => {
        const distance =
          Number(
            trip.distance_km
          );

        return (
          sum +
          (
            Number.isFinite(distance)
              ? distance
              : 0
          )
        );
      },
      0
    );


  const formattedDistance =
    Number.isInteger(totalDistance)
      ? String(totalDistance)
      : totalDistance
          .toFixed(1)
          .replace(".", ",");


  text(
    "completedDistance",
    `${formattedDistance} km`
  );
}


// =====================================================
// CHYBOVÝ STAV
// =====================================================

function renderLoadError() {
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
    detailButton.hidden = true;
  }


  const statusBadge =
    document.getElementById(
      "nextTripStatus"
    );

  if (statusBadge) {
    statusBadge.hidden = true;
  }


  const planned =
    document.getElementById(
      "plannedTrips"
    );

  if (planned) {
    planned.innerHTML =
      '<p class="emptyMessage errorMessage">Plánované výlety sa momentálne nepodarilo načítať.</p>';
  }


  const completed =
    document.getElementById(
      "completedTrips"
    );

  if (completed) {
    completed.innerHTML =
      '<p class="emptyMessage errorMessage">Uskutočnené výlety sa momentálne nepodarilo načítať.</p>';
  }


  text(
    "completedTripsCount",
    "—"
  );

  text(
    "completedDistance",
    "— km"
  );
}


// =====================================================
// NAČÍTANIE VÝLETOV
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
      data?.ok !== true ||
      !Array.isArray(data.trips)
    ) {
      throw new Error(
        "API vrátilo neočakávaný formát dát."
      );
    }


    const allTrips =
      data.trips;


    // ---------------------------------------------
    // AKTUÁLNY VÝLET
    // ---------------------------------------------

    const currentTrips =
      allTrips
        .filter(
          trip =>
            trip.status ===
            "current"
        )
        .sort(
          (a, b) =>
            dateTimestamp(
              a.trip_date
            ) -
            dateTimestamp(
              b.trip_date
            )
        );


    // ---------------------------------------------
    // PLÁNOVANÉ
    // ---------------------------------------------

    const plannedTrips =
      allTrips
        .filter(
          trip =>
            trip.status ===
            "planned"
        )
        .sort(
          (a, b) =>
            dateTimestamp(
              a.trip_date
            ) -
            dateTimestamp(
              b.trip_date
            )
        );


    // ---------------------------------------------
    // USKUTOČNENÉ
    // ---------------------------------------------

    const completedTrips =
      allTrips
        .filter(
          trip =>
            trip.status ===
            "completed"
        )
        .sort(
          (a, b) =>
            dateTimestamp(
              b.trip_date
            ) -
            dateTimestamp(
              a.trip_date
            )
        );


    /*
     * Ak administrátor označil výlet
     * ako current, má prioritu.
     *
     * Ak current neexistuje,
     * použijeme prvý planned.
     */

    const mainTrip =
      currentTrips[0] ||
      plannedTrips[0] ||
      null;


    renderMainTrip(
      mainTrip
    );


    renderPlannedTrips(
      plannedTrips,
      mainTrip
    );


    renderCompletedTrips(
      completedTrips
    );


    renderStats(
      completedTrips
    );
  }

  catch (error) {
    console.error(
      "Nepodarilo sa načítať výlety:",
      error
    );

    renderLoadError();
  }
}


// =====================================================
// SPUSTENIE
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  loadTrips
);
