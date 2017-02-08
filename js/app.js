//locations data for places to be shown on map
var placesData = [{
        title: 'Haridwar',
        location: {
            lat: 29.945690,
            lng: 78.164246
        },
        show: true,
        selected: false,
        venueId: '4deb5bc1fa76cc1b8afd1c47'
    },
    {
        title: 'Rishikesh-Lakshman Jhoola',
        location: {
            lat: 30.087160,
            lng: 78.268112
        },
        show: true,
        selected: false,
        venueId: '4dcff31745ddbe15f8adfb44'
    },
    {
        title: 'Jim Corbett National Park',
        location: {
            lat: 29.4259,
            lng: 79.25
        },
        show: true,
        selected: false,
        venueId: '4d185869bb64224b39b0c665'
    },
    {
        title: 'Dehradun',
        location: {
            lat: 30.3165,
            lng: 78.0322
        },
        show: true,
        selected: false,
        venueId: '4b4f4125f964a520dbfe26e3'
    },
    {
        title: 'Lansdowne',
        location: {
            lat: 29.8377,
            lng: 78.6871
        },
        show: true,
        selected: false,
        venueId: '4f7f92efe4b050ced509e8fd'
    },
    {
        title: 'Mussoorie Kempty Falls',
        location: {
            lat: 30.45,
            lng: 78.08
        },
        show: true,
        selected: false,
        venueId: '4e8fe25d02d5ee38b690c60c'
    },
    {
        title: 'Nainital',
        location: {
            lat: 29.393,
            lng: 79.4541
        },
        show: true,
        selected: false,
        venueId: '4c272921a852c9285ad4e76c'
    }
];


var model = function()

{

    var self = this;

    self.errorDisplay = ko.observable(" ");
    self.mapArray = [];

    for (var i = 0; i < placesData.length; i++) {
        var place = new google.maps.Marker({
            position: {
                lat: placesData[i].location.lat,
                lng: placesData[i].location.lng
            },
            map: map,
            title: placesData[i].title,
            show: ko.observable(placesData[i].show),
            selected: ko.observable(placesData[i].selected),
            venueid: placesData[i].venueId, // venue id used for foursquare
            animation: google.maps.Animation.DROP
        });

        self.mapArray.push(place);
    }



    // function to add API information to each marker
    self.addApiInfo = function(marker) {
        $.ajax({
            url: "https://api.foursquare.com/v2/venues/" + marker.venueid + '?client_id=CCZQELAVUD3U1YNBNR1WPDRUPFFPXZAERXL05QY24MMHINOS&client_secret=KT2BR1PYYPWSOVBZCY1V1AAVRITVZ0JZNZ0YLVBLP0ZQH3MM&v=20170208',
            dataType: "json",
            success: function(data) {
                // stores result to display the likes and ratings on the markers
                var result = data.response.venue;

                // to add likes and ratings to marker
                marker.likes = result.hasOwnProperty('likes') ? result.likes.summary : "";
                marker.rating = result.hasOwnProperty('rating') ? result.rating : "";
            },

            // warn if there is error in recievng json
            error: function(e) {
                self.errorDisplay("Foursquare data is unavailable. Please try again later.");
            }
        });
    };

    //function to add information about API to the markers
    var addMarkerInfo = function(marker) {

        //add API items to each marker
        self.addApiInfo(marker);

        //add the click event listener to marker
        marker.addListener('click', function() {
            //set this marker to the selected state

            self.setSelected(marker);
        });
    };

    //  iterate through mapArray and add marker api info  
    for (var i = 0; i < self.mapArray.length; i++) {
        addMarkerInfo(self.mapArray[i]);
    }

    // create a searchText for the input search field
    self.searchText = ko.observable('');


    //every keydown is called from input box
    self.filterList = function() {
        //variable for search text
        var currentText = self.searchText();
        infowindow.close();

        //list for user search
        if (currentText.length === 0) {
            self.setAllShow(true);
        } else {
            for (var i = 0; i < self.mapArray.length; i++) {
                // to check whether the searchText is there in the mapArray
                if (self.mapArray[i].title.toLowerCase().indexOf(currentText.toLowerCase()) > -1) {
                    self.mapArray[i].show(true);
                    self.mapArray[i].setVisible(true);
                } else {
                    self.mapArray[i].show(false);
                    self.mapArray[i].setVisible(false);
                }
            }
        }
        infowindow.close();
    };

    // to show all the markers
    self.setAllShow = function(marker) {
        for (var i = 0; i < self.mapArray.length; i++) {
            self.mapArray[i].show(marker);
            self.mapArray[i].setVisible(marker);
        }
    };
    // function to make all the markers unselected 
    self.setAllUnselected = function() {
        for (var i = 0; i < self.mapArray.length; i++) {
            self.mapArray[i].selected(false);
        }
    };

    self.currentLocation = self.mapArray[0];

    // function to make all the markers selected and show the likes and ratings

    self.setSelected = function(location) {
        self.setAllUnselected();
        location.selected(true);

        self.currentLocation = location;

        Likes = function() {
            if (self.currentLocation.likes === "" || self.currentLocation.likes === undefined) {
                return "Likes not available for this location";
            } else {
                return "Location has " + self.currentLocation.likes;
            }
        };
        // function to show rating and if not then no rating to display
        Rating = function() {
            if (self.currentLocation.rating === "" || self.currentLocation.rating === undefined) {
                return "Ratings not  available for this location";
            } else {
                return "Location is rated " + self.currentLocation.rating;
            }
        };

        var InfoWindow = "<h5>" + self.currentLocation.title + "</h5>" + "<div>" + Likes() + "</div>" + "<div>" + Rating() + "</div>";

        infowindow.setContent(InfoWindow);

        infowindow.open(map, location);
    };
};