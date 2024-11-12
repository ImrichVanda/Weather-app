const weatherForm=document.querySelector(".weatherForm");
const cityInput=document.querySelector(".cityInput");
const card= document.querySelector(".card");
const apiKey= "9fb732501a8f17140263753777e29315";


weatherForm.addEventListener("submit", async event => {
    event.preventDefault(); //prevent page refresh

    const city = cityInput.value;

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter a city!");
    }
});

async function getWeatherData(city){
    //Use Geocoding API to get latitude and longitude of the city
    const geoUrl=`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const geoResponse= await fetch(geoUrl);

    if(!geoUrl.response.ok){
        throw new Error("Could not fetch location data");
    }

    const geoData= await geoResponse.json();

    // Check if we have valid data
    if(!geoData.length){
        throw new Error("Location not found. Please check the city name.");
    }

    const {lat, lon} = geoData[0];

    //Use the coordinates to get the weather data

    const weatherUrl= `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const weatherResponse= await fetch(weatherUrl);

   if(!weatherResponse.ok){
    throw new Error("Could not fetch weather data");
   }

   return await weatherResponse.json();
}

function displayWeatherInfo(data){
    
    const temperature = (data.main.temp - 273.15).toFixed(1); // Convert from Kelvin to Celsius
    const weatherDescription = data.weather[0].description;
    const cityName = data.name;
    const humidity = data.main.humidity;

    card.innerHTML = `
    <h1 class="cityDisplay">${cityName}</h1>
    <p class="tempDisplay">Temperature: ${temperature}°C</p>
    <p class="humidityDisplay">Humidity: ${humidity}%</p>
    <p class="descDisplay">${weatherDescription}</p>
`;

card.style.display = "flex";
}

function getWeatherEmoji(weatherId){

}

function displayError(message){

    const errorDisplay= document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);

}
