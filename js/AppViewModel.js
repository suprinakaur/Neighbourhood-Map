var map,largeInfowindow,marker,map_centre,bounds; 
var markers = [];
var defaultIcon,clickedIcon;

function initMap()
{
   
    map_centre = new google.maps.LatLng(30.066753,79.01929969999992);
    map = new google.maps.Map(document.getElementById("map"),
    {
        center: map_centre,
        zoom: 8
    });

    defaultIcon = makeMarkerIcon('2f4f4f'); //grey color default icon
    clickedIcon = makeMarkerIcon('FF7F50'); //coral color default icon

    google.maps.event.addDomListener(window, 'resize', resize);
    //array of locations in Uttarakhand
    var locations =
        [
        {   title: 'Haridwar-Rajaji National Park',
            location: {lat: 29.945690 , lng: 78.164246},
            markerRef: null,
            venueId: '4d96edc3af3d236a713716c7'
        },
        {   title: 'Rishikesh-Lakshman Jhoola',
            location: {lat: 30.087160 , lng: 78.268112 },
            markerRef: null,
            venueId: '4dcff31745ddbe15f8adfb44'
        },
        {   title: 'Kedarnath-temple',
            location: {lat: 30.734627 , lng:  79.066895 },
            markerRef: null,
            venueId: '4c1b17253b2ab7137f163325'
        },
        {   title: 'Jim Corbett National Park',
            location: {lat: 29.4259 , lng: 79.25 },
            markerRef: null,
            venueId: '4d185869bb64224b39b0c665'
        },
        {   title: 'Mussoorie',
            location: {lat: 30.45 , lng: 78.08 },
            markerRef: null,
            venueId:'4c7d57088da18cfa61159fce'
        },
        {   title: 'Shivpuri',
            location: {lat: 30.136 , lng: 78.3885 },
            markerRef: null,
            venueId: '513b22f7e4b00e247e5dc245'
        },
        {   title: 'Nainital Lake',
            location: {lat: 29.393 , lng: 79.4541 },
            markerRef: null,
            venueId: '4d0dfe2ee0b98cfa9346df93'
        },
        {   title: 'Ranikhet',
            location: {lat: 29.6434 , lng: 79.4322 },
            markerRef: null,
            venueId: '53590c3f498ef775eb0c1f10'
        },
        {   title: 'Lansdowne',
            location: {lat: 29.8377 , lng: 78.6871 },
            markerRef: null,
            venueId: '4f7f92efe4b050ced509e8fd'
        },
        {   title: 'Tehri-Dam',
            location: {lat: 30.3778 , lng: 78.4806 },
            markerRef: null,
            venueId: '519863d2498e6409a1585775'
        },
        {   title: 'Dehradun',
            location: {lat: 30.3165 , lng: 78.0322 },
            markerRef: null,
            venueId: ''
        },
        {   title: 'Roorkee-nescafe',
            location: {lat: 29.8603 , lng: 77.8933 },
            markerRef: null,
            venueId: '4d9b6025422ea1cd7a2dfb4c'
        },
        {   title: 'Pauri',
            location: {lat: 29.8688, lng: 78.8383 },
            markerRef: null,
            venueId: '536f8e83498e22fdbabf96b1'
        }
    ];

    largeInfowindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();

    for (var i = 0,len = locations.length; i < len; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        var venueId = locations[i].venueId;

        marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            icon: defaultIcon,
            venueId: venueId,
            likes:"",
            animation: google.maps.Animation.DROP,
            id: i
        });
      
        apiData(marker);
        locations[i].markerRef = marker;
        markers.push(marker);
        marker.addListener('click', function() {
            this.setIcon(clickedIcon);
            populateInfoWindow(this, largeInfowindow);
        });
        bounds.extend(markers[i].position);
    }

    function resize(){
     
        map.setCenter(map_centre);
        map.fitBounds(bounds);
    }


    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21,34));
        return markerImage;
    }

    function AppViewModel() {
        var self = this; 
        self.SomeValue = ko.observable("Hide list"); 
        self.visibleVal = ko.observable(1);
        self.ShowLessMore = function(){
            if (self.SomeValue() == "Hide list"){
                self.SomeValue("Show List");
                self.visibleVal(0);
            }
            else if(self.SomeValue() == "Show List"){
                self.SomeValue("Hide list");
                self.visibleVal(1);
            }
        };

        self.changeOpacity = ko.pureComputed(function(){
            return self.visibleVal() ? "normal" : "transparent";
        });

        self.locations = ko.observableArray (locations);

        self.liClick = function (location){
            location.markerRef.setIcon(clickedIcon);
            populateInfoWindow(location.markerRef,largeInfowindow);
        };

        self.colorVal = ko.observable(false);
        self.clickHeart = ko.observable(0);
        self.changeColor = ko.pureComputed(function (){
    
            return self.colorVal() ? "coral" : "grey";
        });

        self.colorChanger = function(){
            this.colorVal() ? self.colorVal(false) : self.colorVal(true);
            this.colorVal() ? self.clickHeart(1) : self.clickHeart(0);
        };


        self.filter = ko.observable('');

        self.filteredItems = ko.computed(function(){
            var filter = self.filter().toLowerCase();
            if(!filter){
              
                for (marker in self.locations()){
                   
                    self.locations()[marker].markerRef.setVisible(true);
                }
                return self.locations();

            }
            else {
               
                return ko.utils.arrayFilter(self.locations(), function(item) {
                    var match =  stringWith(item.title.toLowerCase(), filter);
                    item.markerRef.setVisible(match);
                    return match;
                });
            }

        },self);


    }

    ko.applyBindings(new AppViewModel());

}

function googleError(){
    alert("Error! Map won't load!");


}

function stringWith (string, startsWith) {

    return (string.indexOf(startsWith) >= 0);
}


function populateInfoWindow(marker, infowindow) {

    if(infowindow.marker){
        infowindow.marker.setIcon(defaultIcon);
    }
    if (infowindow.marker != marker) {

        infowindow.marker = marker;
        var setContentInfo = '<h4>' + marker.title + '</h4>'+'<div>'+LikesOrNot(marker)+'</div>';
        infowindow.setContent(setContentInfo);
        infowindow.open(map, marker);

        infowindow.addListener('closeclick',function(){
            infowindow.marker = null;
            marker.setIcon(defaultIcon);
        });
    }
}

function apiData (marker){
 
    $.ajax({
        //url built from the required marker's venue id, client id and client secret
        url: "https://api.foursquare.com/v2/venues/" + marker.venueId +
        "?client_id=CCZQELAVUD3U1YNBNR1WPDRUPFFPXZAERXL05QY24MMHINOS&client_secret=KT2BR1PYYPWSOVBZCY1V1AAVRITVZ0JZNZ0YLVBLP0ZQH3MM&v=20160131",
        //datatype format
        dataType: "json",
        //on success, perform the following operations
        success: function(info){
            //store marker's likes
            console.log(info);
            marker.likes = info.response.venue.likes.summary;
        },
        
       
    });
}

function LikesOrNot(marker){
   
    if(marker.likes === "" || marker.likes === undefined){
        return "No data available!";
    }
    else {
        return marker.likes;
    }
}














