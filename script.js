
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
let lat, lng = 0.0;

const stops = [
  { name: "Campus Housing", lat: 39.74826511866739, lng: -105.22111495352556, funFact: "Welcome to Campus Housing! Most freshmen live here during their first year. It's a great way to meet new friends and be right in the heart of campus life."},
  { name: "Mines Dining Hall", lat: 39.74864769731091, lng: -105.2214090874086, funFact: "Just a short walk away is the Mines Dining Hall, where students gather for meals, coffee breaks, and social time. It's the central hub for eating on campus." },
  { name: "Student Support and Community", lat: 39.748906, lng: -105.221917, funFact: "Here you'll find offices dedicated to student wellness, diversity programs, and academic support. Mines makes sure you're never on your own — there's always help if you need it."  },
  { name: "Academic Buildings (1)", lat: 39.749520, lng: -105.221809, funFact: "Brown Hall is one of the most important academic buildings at Mines. It houses many classrooms, computer labs, and faculty offices for disciplines like engineering, physics, and computer science. Additionally, it holds the Maker Space where you are able to 3d print and craft various things. You'll likely have your first-year classes here!" }, 
  { name: "Student Recreation Center", lat: 39.74967627631938, lng: -105.22257902132645, funFact: "Take a break from studying at the Rec Center! Whether it's lifting weights, playing basketball, or joining an intramural team, there's always something active happening here." },
  { name: "Ben Parker Student Center", lat: 39.7502421305587, lng: -105.22318118861799, funFact: "The Student Center holds The \"Periodic Table\" which is the social heartbeat of Mines. Grab food, meet for club meetings, attend events, or just hang out between classes." }, 
  { name: "Campus Library and Housing", lat: 39.751473031196014, lng: -105.2234631558418, funFact: "Arthur Lakes Library is perfect for studying, research, and group projects. Nearby housing options, called the \"Trads\" give students a convenient place to live close to academic resources." },
  { name: "Guggenheim Hall", lat: 39.751257, lng: -105.222349, funFact: "Built in 1906 with a major gift from Simon Guggenheim, this iconic building features a gold-leafed dome and once housed a museum, library, and classrooms. Today, it stands as a symbol of Mines' history and the legacy of Colorado's mineral wealth. " },
  { name: "Kafadar Commons", lat: 39.75121544675948,lng: -105.22152486379171, funFact: "Kafadar Commons — or \"Kaf\" — is the grassy open space where students relax, play frisbee, or enjoy events like E-Days. It's the heart of outdoor campus life." },
  { name: "Academic Buildings (2)", lat: 39.75231274085103, lng: -105.22070920902605, funFact: "This second set of academic buildings (Hill Hall, Statton Hall, and Chauvent Hall) includes departments like geology, materials science, and environmental engineering. Some of Mines' most famous research happens here!" },
  { name: "Academic Building (3)", lat: 39.75162837004105, lng: -105.22050598386501, funFact: "This newer academic space, named Coors-Tek, is home to specialized labs and classrooms for advanced courses. Expect to spend more time here as you move into major-specific studies." },
  { name: "Student Support Services", lat: 39.748984253433946, lng: -105.22053401143191, funFact: "Near The Starzer Center, you'll find the Mines Writing Center, where students can get help with essays, reports, and projects. Nearby is the President's House, a historic campus home that symbolizes Mines' long-standing traditions and leadership."}
];

const buildingCoordinates = {
  "AH": {name: "Alderson Hall", lat: 39.75060062333236, lng: -105.22095712675213},
  "LB": {name: "Arthur Lakes Library", lat :39.75156750186049, lng: -105.22302142606492},
  "VC": {name: "Beck Venture Center", lat: 39.75111973555342, lng: -105.21771579935759},
  "SC": {name: "Ben H. Parker Student Center", lat: 39.749753648507706, lng: -105.22308140125382},
  "BE": {name: "Berthoud Hall", lat: 39.750425497113085, lng: -105.22238186560564},
  "BB": {name: "Brown Hall", lat: 39.74996383347052, lng: -105.22149608241227},
  "BBW": {name: "Brown Hall West", lat: 39.74958995692275, lng: -105.22209586061557},
  "CTLM": {name: "Center for Technology and Learning Media", lat: 39.75068000176023, lng: -105.21948176070593},
  "CH": { name: "Chauvenet Hall", lat: 39.75184897031731, lng: -105.22273950534914},
  "CO": {name: "Coolbaugh Hall", lat: 39.75234401610809, lng: -105.22274160224116},
  "CK": { name: "CoorsTek Center", lat: 39.750711036468246, lng:  -105.22111556064941},
  "EMI": {name: "Earth Mechanics Institute", lat: 39.75102556820169, lng: -105.22577542291957},
  "EH": {name: "Engineering Hall", lat: 39.752643601479235, lng: -105.2202662362475},
  "GC": {name: "Green Center", lat: 39.75138033699135, lng: -105.2206617272932},
  "GH": {name: "Guggenheim Hall", lat: 39.75098001423123, lng: -105.22267199529637},
  "HH": { name: "Hill Hall", lat: 39.7522091986264, lng: -105.22109201006752 },
  "IM": {name: "Intramural Fields", lat: 39.748570964653524, lng: -105.22341341681604},
  "LB": {name: "Labriola Innovation Hub", lat: 39.7511327443204, lng: -105.22587749995499},
  "MZ": {name: "Marquez Hall", lat: 39.75086908183251, lng: -105.22007027776368},
  "MC": { name: "McNeil Hall", lat: 39.75121866915423, lng: -105.22404611710994},
  "SH": {name: "Stratton Hall", lat: 39.752022706078996, lng: -105.22188511071849},
  "RC": {name: "Student Recreation Center", lat: 39.74960309702438, lng: -105.22263514186936},
  "GY": {name: "Volk Gymnasium", lat: 39.75175660291034, lng: -105.22412935817596}
};



function initMap() {
  // Initialize the map
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.75042, lng: -105.22260 }, // Default center for the map
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
  

  // Event listener for "Use My Location" checkbox
  useLocationCheckbox.addEventListener("change", () => {
    if (useLocationCheckbox.checked) {
      // Disable origin input and set placeholder text
      originInput.disabled = true;
      originInput.placeholder = "Using your location...";

      // Set user location when the checkbox is checked
      if (lat == 0.0 && lng == 0.0) {
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
       } else {
        navigator.geolocation.getCurrentPosition(function(position) {
          sessionStorage.setItem("lat", position.coords.latitude);
          sessionStorage.setItem("lng", position.coords.longitude);
        });
       }
    } else {
      // Reset the origin input when unchecked
      originInput.disabled = false;
      originInput.placeholder = "Enter starting location";
      userLocation = null;
    }
  });

  window.map = map;
  window.directionsService = directionsService;
  window.directionsRenderer = directionsRenderer;

}


function getRoute() {
  window.onload = function () {
    const lat = sessionStorage.getItem("lat");
    const lng = sessionStorage.getItem("lng");
    if (lat && lng) {
      console.log("Reusing saved coordinates:", lat, lng);
    } else {
      // fallback: re-request location
    }
  };
  
  const destination = document.getElementById("destination-input").value;
  const useLocation = document.getElementById("use-location").checked;
  const originText = document.getElementById("origin-input").value;
  const directionsPanel = document.getElementById("directions-panel");

  // Get location and store in variables
  let origin;

  if (useLocation) {
    const lat = sessionStorage.getItem("lat");
    const lng = sessionStorage.getItem("lng");

    if (lat && lng) {
      origin = { lat: parseFloat(lat), lng: parseFloat(lng) };
    } else {
      // Fallback if location is missing
      origin = originText;
    }
  } else {
    origin = originText;
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
    if (currentStopIndex >= stops.length) {
      alert("Tour complete!");
      return;
    }
  
    // Try to get user location from sessionStorage
    let origin;
    const lat = sessionStorage.getItem("lat");
    const lng = sessionStorage.getItem("lng");
  
    if (lat && lng) {
      origin = { lat: parseFloat(lat), lng: parseFloat(lng) };
    } else {
      alert("User location not available. Make sure to enable location first.");
      return;
    }
  
    const stop = stops[currentStopIndex];
  
    const request = {
      origin: origin,
      destination: { lat: stop.lat, lng: stop.lng },
      travelMode: google.maps.TravelMode.WALKING,
    };
  
    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);
  
        // Update sessionStorage to new stop
        sessionStorage.setItem("lat", stop.lat);
        sessionStorage.setItem("lng", stop.lng);
  
        // Display fun fact and directions
        const directionsPanel = document.getElementById("directions-panel");
        const factsPanel = document.getElementById("facts-panel");
        directionsPanel.classList.add("block");
        factsPanel.classList.add("block");
        directionsPanel.innerHTML = `
          <h3>Next Stop: ${stop.name}</h3>
          <h4>Directions:</h4>
        `;
        factsPanel.innerHTML=`
        <h4>Fun Facts: ${stop.funFact}</h4>
        `;

        const steps = result.routes[0].legs[0].steps;
        for (let i = 0; i < steps.length; i++) {
          directionsPanel.innerHTML += `<p>${steps[i].instructions}</p>`;
        }
        
        currentStopIndex++;
      } else {
        alert("Directions request failed: " + status);
      }
    });
  }

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


document.getElementById("next-stop-btn").addEventListener("click", guideToNextStop);
document.getElementById("restart-tour-btn").addEventListener("click", restartTour);
// window.onload = initMap;


// FLOOR PLAN HIGHLIGHTS

// Hill Highlights
function hillHighlightRoom() {
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

// Highlight McNeil Rooms
function mcneilHighlightRoom() {
  let input = document.getElementById("roomInput").value.trim().toUpperCase();
  console.log(input);
  // Define room mapping
  let rooms = new Set(["105", "107", "108", "109", "111", "112", "113", 
  "114", "115", "116", "117", "118", "119", "121", "122", "123", "124", "125", "126",
  "127", "128", "129", "130", "131", "132", "133", "134", "135", "136",
  "137", "138", "139", "140", "141", "142", "204", "213", "214", "217",
   "218", "219", "215", "216", "220", "221", "222", "223", "313", "314",
   "317", "318", "319", "315", "316", "320", "321", "322", "323"]);


  // Hide all rooms first
  document.querySelectorAll('.highlight').forEach(room => room.classList.add('hidden'));
  const firstDigit = input.charAt(0); // get the first character

if (firstDigit == '2' &&  rooms.has(input)) {
  document.getElementById('floor2').scrollIntoView({ behavior: 'smooth' });
} else if (firstDigit == '3' &&  rooms.has(input)) {
  document.getElementById('floor3').scrollIntoView({ behavior: 'smooth' });
} else {
window.scrollTo({ top: 0, behavior: 'smooth' });
}


  if (input == "") {
      emptyPopup();
  }
  else if (rooms.has(input)) {
      document.getElementById(input).classList.remove('hidden');
  } else {
          showPopup();

  }
}

// Chauvenet Highlight 
function chauvenetHighlightRoom() {
  let input = document.getElementById("roomInput").value.trim().toUpperCase();
  console.log(input);
  // Define room mapping
  let rooms = new Set(["132", "130", "128", "126", "124", "122", "120", "133", "131", "127",
       "125", "123", "123A", "119", "117", "156", "155", "151", "149", "147", "145",
       "141", "141A", "141B", "141C", "143", "143A", "143B", "143C", "161", "161A",
       "158", "160", "180", "182", "184", "186", "194", "194A", "177", "196", "179",
       "192", "178", "187", "197", "195", "193", "189", "178A", "187A", "234", "232",
       "236", "224", "222", "220", "226", "230", "235", "233", "231", "223", "221", "217", "215",
       "263", "265", "267", "269", "271", "273", "276", "262", "264", "266", "268", "270", "272",
       "274", "275", "278", "279", "280", "68", "66", "42", "42A", "42B", "44", "46", "48", 
       "70", "70A", "73", "50A", "50", "54", "65", "69", "67", "65", "51", "57", "60", "57A",
       "57A", "53", "57B", "55", "59", "61", "63", "50B"
  ]);
  
  document.querySelectorAll('.highlight').forEach(room => room.classList.add('hidden'));
  const firstDigit = input.charAt(0); // get the first character

if (firstDigit == '2' &&  rooms.has(input)) {
  document.getElementById('floor2').scrollIntoView({ behavior: 'smooth' });
} else if (firstDigit != '1' &&  rooms.has(input)) {
  document.getElementById('floor3').scrollIntoView({ behavior: 'smooth' });
} else {
window.scrollTo({ top: 0, behavior: 'smooth' });
}

  if (input == "") {
      emptyPopup();
  }
  else if (rooms.has(input)) {
      document.getElementById(input).classList.remove('hidden');
  } else {
          showPopup();

  }
}

document.getElementById('backToTop').addEventListener('click', function() {
  window.scrollTo({
      top: 0,
      behavior: 'smooth' 
  });
});

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

// Schedule Viewer

function addClassBox() {
  const container = document.getElementById("class-inputs");
  const div = document.createElement("div");
  div.className = "class-input";
  div.innerHTML = `<input type="text" class="class-box" placeholder="Enter class (e.g., CK 151)" />`;
  container.appendChild(div);
}

function routeClasses() {
  // Use the global renderer
  if (!directionsRenderer) {
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
  } else {
    directionsRenderer.setMap(map); // Re-attach if needed
  }

  const inputs = document.querySelectorAll(".class-box");
  const waypoints = [];

  // Step 1: Collect destinations
  inputs.forEach(input => {
    const value = input.value.trim().toUpperCase();
    if (value === "") return;

    const code = value.split(" ")[0];
    const building = buildingCoordinates[code];

    if (building) {
      waypoints.push({
        location: new google.maps.LatLng(building.lat, building.lng),
        stopover: true
      });
    }
  });

  if (waypoints.length === 0) {
    alert("No valid class destinations.");
    return;
  }

  const useLocation = document.getElementById("use-location").checked;
  const originInput = document.getElementById("origin-input").value;

  function buildRoute(origin) {
    const request = {
      origin: origin,
      destination: waypoints[waypoints.length - 1].location,
      waypoints: waypoints.slice(0, -1),
      travelMode: google.maps.TravelMode.WALKING,
    };

    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);
        console.log("Directions displayed successfully");
      } else {
        alert("Directions failed: " + status);
        console.error("Directions error:", status);
      }
    });
  }

  // Step 2: Get origin
  if (useLocation && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        buildRoute(userLoc);
      },
      () => alert("Could not get your location.")
    );
  } else if (originInput) {
    buildRoute(originInput);  // Let Google Maps geocode it
  } else {
    alert("Provide a starting location or enable location.");
  }
}




window.initMap = initMap;
window.locateMultipleBoxes = locateMultipleBoxes;
window.addClassBox = addClassBox;
window.routeClasses = routeClasses;