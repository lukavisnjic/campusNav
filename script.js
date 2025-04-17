
const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");

//Toggle Sidebar Collapse
sidebarToggler.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed")
});



//Maps 
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 39.749813324170674, lng: -105.22261410670298 }, // Campus Center Coordinates
      zoom: 16,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const originInput = document.getElementById("origin-input");
    const destinationInput = document.getElementById("destination-input");
    const useLocationCheckbox = document.getElementById("use-location");

    new google.maps.places.Autocomplete(originInput);
    new google.maps.places.Autocomplete(destinationInput);

    useLocationCheckbox.addEventListener("change", () => {
      if (useLocationCheckbox.checked) {
        originInput.disabled = true;
        originInput.placeholder = "Using your location...";
        navigator.geolocation.getCurrentPosition(
          (position) => {
            userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
          },
          () => {
            alert("Could not get your location.");
            useLocationCheckbox.checked = false;
            originInput.disabled = false;
            originInput.placeholder = "Enter starting location";
          }
        );
      } else {
        originInput.disabled = false;
        originInput.placeholder = "Enter starting location";
        userLocation = null;
      }
    });
  }

function getRoute() {
    const destination = document.getElementById("destination-input").value;
    const useLocation = document.getElementById("use-location").checked;
    const originText = document.getElementById("origin-input").value;

    let origin = useLocation ? userLocation : originText;

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
        } else {
            alert("Directions request failed due to " + status);
            console.error("Directions error:", status);
        }
        }
    );
}