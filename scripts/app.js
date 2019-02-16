 window.addEventListener('load', () => {
     let long;
     let lat;
     let temperatureDescription = document.querySelector('.temperature-description');
     let temperatureDegree = document.querySelector('.temperature-degree');
     let locationTimezone = document.querySelector('.location-timezone');
     let temperatureSection = document.querySelector('.temperature');
     let degree = document.querySelector('.degree');

     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(position => {
             long = position.coords.longitude;
             lat = position.coords.latitude;

             const proxy = "https://cors-anywhere.herokuapp.com/";
             const api = `${proxy}https://api.darksky.net/forecast/f1bc1a5750c2ea93d9b8f46c994413a4/${lat},${long}?units=uk2`;

             fetch(api)
                 .then(response => {
                     return response.json();
                 })
                 .then(data => {
                     console.log(data);
                     const { temperature, summary, icon } = data.currently;

                     temperatureDegree.textContent = Math.floor(temperature);
                     temperatureDescription.textContent = summary;
                     locationTimezone.textContent = data.timezone;

                     let fahrenheit = temperature * 1.8 + 32;

                     setIcons(icon, document.querySelector('.icon'));

                     temperatureSection.addEventListener('click', () => {
                         if (degree.textContent === 'C') {
                             degree.textContent = 'F';
                             temperatureDegree.textContent = Math.floor(fahrenheit);
                         } else {
                             degree.textContent = 'C';
                             temperatureDegree.textContent = Math.floor(temperature);
                         }
                     });
                 });
         });
     }



     function setIcons(icon, iconID) {
         const skycons = new Skycons({ color: 'white' });
         const currentIcon = icon.replace(/-/g, "_").toUpperCase();
         skycons.play();
         return skycons.set(iconID, Skycons[currentIcon]);
     }
 });

 /* function convertDegrees(tempUnits) {
        return tempUnits * 1.8 + 32;
    }

    tempDisplay.addEventListener('click', () => {
        if (degreeSymbol.textContent === 'C') {
            degreeSymbol.textContent = 'F';
            tempDisplay.textContent = Math.floor(convertDegrees(temp));
            maxTemp.textContent = Math.floor(convertDegrees(temp_max));
            minTemp.textContent = Math.floor(convertDegrees(temp_min));

        } else {
            degreeSymbol.textContent = 'C';
            tempDisplay.textContent = Math.floor(temp);
            maxTemp.textContent = `${temp_max}`;
            minTemp.textContent = `${temp_min}`;
        }
        console.log(tempDisplay);
    }); */