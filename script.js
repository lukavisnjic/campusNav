
const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");

//Toggle Sidebar Collapse
sidebarToggler.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed")
});



//Maps 
let map, directionsService, directionsRenderer;
 /* The map works only when it first starts up but works perfectly after that*/
let currentStopIndex = 0;

const stops = [
  { name: "Campus Housing", lat: 39.74826511866739, lng: -105.22111495352556 },
  { name: "Mines Dining Hall", lat: 39.74864769731091, lng: -105.2214090874086 },
  { name: "Student Support and Community", lat: 39.748906, lng: -105.221917 },
  { name: "Academic Buildings (1)", lat: 39.749520, lng: -105.221809}, 
  { name: "Student Recreation Center", lat: 39.74967627631938, lng: -105.22257902132645},
  { name: "Ben Parker Student Center", lat: 39.7502421305587, lng: -105.22318118861799}, 
  { name: "Campus Library and Housing", lat: 39.751473031196014, lng: -105.2234631558418},
  { name: "Guggenheim Hall", lat: 39.751257, lng: -105.222349},
  { name: "Kafadar Commons", lat: 39.75121544675948,lng: -105.22152486379171},
  { name: "Academic Buildings (2)", lat: 39.75231274085103, lng: -105.22070920902605},
  { name: "Academic Building (3)", lat: 39.75162837004105, lng: -105.22050598386501},
  { name: "Student Support Services", lat: 39.748984253433946, lng: -105.22053401143191}
];



function initMap() {
  // Initialize the map
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.740, lng: -105.222 }, // Default center for the map
    zoom: 16,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // Input fields and checkbox
  const originInput = document.getElementById("origin-input");
  const destinationInput = document.getElementById("destination-input");
  const useLocationCheckbox = document.getElementById("use-location");

  // Set up Google Places Autocomplete for the inputs
  new google.maps.places.Autocomplete(originInput);
  new google.maps.places.Autocomplete(destinationInput);

  // Check if geolocation is available and set the user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("User location set:", userLocation);  // Log user location
      },
      () => {
        alert("Could not get your location.");
      }
    );
  } else {
    alert("Geolocation not supported by this browser.");
  }

  // Event listener for "Use My Location" checkbox
  useLocationCheckbox.addEventListener("change", () => {
    if (useLocationCheckbox.checked) {
      // Disable origin input and set placeholder text
      originInput.disabled = true;
      originInput.placeholder = "Using your location...";

      // Set user location when the checkbox is checked
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("User location set from checkbox:", userLocation);
        },
        () => {
          alert("Could not get your location.");
          useLocationCheckbox.checked = false;
          originInput.disabled = false;
          originInput.placeholder = "Enter starting location";
        }
      );
    } else {
      // Reset the origin input when unchecked
      originInput.disabled = false;
      originInput.placeholder = "Enter starting location";
      userLocation = null;
    }
  });
}


function getRoute() {
  window.onload = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("User location set:", userLocation);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Could not get your location.");
        }
      );
    } else {
      alert("Geolocation not supported by this browser.");
    }
  };
  
  const destination = document.getElementById("destination-input").value;
  const useLocation = document.getElementById("use-location").checked;
  const originText = document.getElementById("origin-input").value;
  const directionsPanel = document.getElementById("directions-panel");

  let origin = useLocation ? userLocation : originText;

  if (!userLocation) {
    console.log("User location is not yet available.");
    return;
  }

  if (!origin || !destination) {
    alert("Please provide both origin and destination.");
    return;
  }

  directionsService.route(
    {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.WALKING,
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
        document.getElementById("directions-panel").classList.add("block");
        // Show worded directions
        const steps = response.routes[0].legs[0].steps;
        directionsPanel.innerHTML = "<h3>Directions:</h3>";
        for (let i = 0; i < steps.length; i++) {
            directionsPanel.innerHTML += `<p>${steps[i].instructions}</p>`;
        }
      } else {
        alert("Directions request failed due to " + status);
        console.error("Directions error:", status);
      }
    }
  );
}

function guideToNextStop() {
  
  window.onload = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("User location set:", userLocation);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Could not get your location.");
        }
      );
    } else {
      alert("Geolocation not supported by this browser.");
    }
  };

  if (currentStopIndex >= stops.length) {
    alert("Tour complete!");
    return;
  }

  if (!userLocation) {
    console.log("User location is not yet available.");
    return;
  }

  const stop = stops[currentStopIndex];

  const request = {
    origin: userLocation,
    destination: { lat: stop.lat, lng: stop.lng },
    travelMode: google.maps.TravelMode.WALKING,
  };

  directionsService.route(request, (result, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(result);  // Render directions on the map and panel
      userLocation = request.destination;
      currentStopIndex++;
    } else {
      alert("Directions request failed: " + status);
    }
  });
}s

function restartTour() {
  currentStopIndex = 0;
  directionsRenderer.set('directions', null); // Clear previous directions
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        alert("Tour restarted! Click 'Next Stop' to begin again.");
      },
      () => {
        alert("Could not get your location.");
      }
    );
  } else {
    alert("Geolocation not supported by this browser.");
  }
}


function resetMap() {
  // Reset the map to initial state
  if (directionsRenderer) {
    directionsRenderer.setDirections({ routes: [] }); // Clear previous directions
  }else{
    console.log("DirectionRenderer is uninitialized")
  }
  if (map) {
    map.setCenter({ lat: 39.740, lng: -105.222 }); // Reset map center
    map.setZoom(16); // Reset zoom level
  }else{
    console.log("Map is uninitialized");
  }
  // Clear any ongoing user location updates
  userLocation = null;
}

// Listen for changes when navigating between sections
window.addEventListener("hashchange", function() {
  // Reset the map when switching sections
  resetMap();
});

document.getElementById("next-stop-btn").addEventListener("click", guideToNextStop);
document.getElementById("restart-tour-btn").addEventListener("click", restartTour);
window.onload = initMap;


// FLOOR PLAN HIGHLIGHTS
function highlightRoom() {
    let input = document.getElementById("roomInput").value.trim().toUpperCase();
    console.log(input);
    // Define room mapping
    let rooms = {
        "183": "HH183",
        "181": "HH181",
        "178": "HH178",
        "178A": "HH178A",
        "178B": "HH178B",
        "178C": "HH178C",
        "177": "HH177",
        "176": "HH176",
        "176B": "HH176B",
        "176C": "HH176C",
        "176D": "HH176D",
        "176F": "HH176F",
        "175": "HH175",
        "174": "HH174",
        "173": "HH173",
        "172": "HH172",
        "171": "HH171",
        "170": "HH170",
        "162": "HH162",
        "161": "HH161",
        "160": "HH160",
        "164": "HH164",
        "151": "HH151",
        "151A": "HH151A",
        "150": "HH150",
        "139": "HH139",
        "137": "HH137",
        "133": "HH133",
        "132": "HH132",
        "131A": "HH131A",
        "131": "HH31",
        "129A": "HH129A",
        "129B": "HH129B",
        "128": "HH128",
        "128A": "HH128A",
        "128B": "HH128B",
        "126": "HH126",
        "125B": "HH125B",
        "125A": "HH125A",
        "125C": "HH125C",
        "125": "HH125",
        "124": "HH124",
        "122": "HH122",
        "120": "HH120",
        "123": "HH123",
        "123A": "HH123A",
        "123B": "HH123B",
        "118": "HH118",
        "121": "HH121",
        "121B": "HH121B",
        "121A": "HH121A",
        "112": "HH112",
        "114": "HH114",
        "116": "HH116",
        "119": "HH119",
        "106": "HH106",
        "104": "HH104",
        "102": "HH102",
        "115": "HH115",
        "113": "HH113",
        "111A": "HH111A",
        "111": "HH111",
        "109": "HH109",
        "108": "HH108",
        "108A": "HH108A",
        "107": "HH107",
        "136": "HH136",
        "105": "HH105",
        "103": "HH103",
        "102": "HH102",
        "101": "HH101",
        "140": "HH140",
        "141": "HH141",
        "144": "HH144",
        "149": "HH149",
        "179": "HH179",
        "251": "HH251",
        "220": "HH220",
        "211": "HH211",
        "351": "HH351",
        "315": "HH315"
    };

    // Hide all rooms first
    document.querySelectorAll('.highlight').forEach(room => room.classList.add('hidden'));
    
    if (input == "") {
        emptyPopup();
    }
    else if (rooms[input]) {

        document.getElementById(rooms[input]).classList.remove('hidden');


    } else {
            showPopup();

    }
}

function emptyPopup() {
    document.getElementById("emptyPopup").style.display = "block";
}

function closeEmptyPopup() {
    document.getElementById("emptyPopup").style.display = "none";
}

function showPopup() {
    document.getElementById("errorPopup").style.display = "block";
}

function closePopup() {
    document.getElementById("errorPopup").style.display = "none";
}