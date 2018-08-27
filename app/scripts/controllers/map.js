'use strict';

r360.photonPlaceAutoCompleteControl = function (options) {
  return new r360.PhotonPlaceAutoCompleteControl(options);
};

r360.PhotonPlaceAutoCompleteControl = L.Control.extend({

  initialize: function(options){

    this.options = JSON.parse(JSON.stringify(r360.config.photonPlaceAutoCompleteOptions));

    if ( typeof options !== "undefined" ) {

      if ( r360.has(options, 'position'))    this.options.position    = options.position;
      if ( r360.has(options, 'label'))       this.options.label       = options.label;
      if ( r360.has(options, 'country'))     this.options.country     = options.country;
      if ( r360.has(options, 'reset'))       this.options.reset       = options.reset;
      if ( r360.has(options, 'serviceUrl'))  this.options.serviceUrl  = options.serviceUrl;
      if ( r360.has(options, 'reverse'))     this.options.reverse     = options.reverse;
      if ( r360.has(options, 'placeholder')) this.options.placeholder = options.placeholder;
      if ( r360.has(options, 'width'))       this.options.width       = options.width;
      if ( r360.has(options, 'maxRows'))     this.options.maxRows     = options.maxRows;
      if ( r360.has(options, 'image'))       this.options.image       = options.image;
      if ( r360.has(options, 'index'))       this.options.index       = options.index;
      if ( r360.has(options, 'autoHide'))    this.options.autoHide      = options.autoHide;
      if ( r360.has(options, 'options')) {

        this.options.options    = options.options;
        this.options.travelType = r360.has(this.options.options, 'init') ? this.options.options.init : 'walk';
      }
    }
  },

  toggleOptions : function(container){

    var that = this;

    if ( typeof container == 'undefined' )
      $('#' + that.options.id + '-options').slideToggle();
    else
      $(container).find('#' + that.options.id + '-options').slideToggle();
  },

  onAdd: function(map){

    var that = this;
    var i18n            = r360.config.i18n;
    var countrySelector =  "";
    var nameContainer   = L.DomUtil.create('div', that._container);
    that.options.map    = map;
    that.options.id     = $(map._container).attr("id") + r360.Util.generateId(10);

    map.on("resize", that.onResize.bind(that));

    // calculate the width in dependency to the number of buttons attached to the field
    var width = that.options.width;
    // if ( that.options.reset ) width += 44;
    // if ( that.options.reverse ) width += 37;
    var style = 'style="width:'+ width +'px;"';

    that.options.input =
      '<div class="input-group autocomplete" '+style+'> \
                <input id="autocomplete-'+that.options.id+'" style="color: black;width:'+width+'" \
                type="text" class="form-control r360-autocomplete" placeholder="' + that.options.placeholder + '" onclick="this.select()">';

    if ( that.options.image ) {

      that.options.input +=
        '<span id="'+that.options.id+'-image" class="input-group-addon btn-autocomplete-marker"> \
                    <img style="height:22px;" src="'+that.options.image+'"> \
                 </span>';
    }

    var optionsHtml = [];
    // if ( that.options.options ) {

    that.options.input +=
      '<span id="'+that.options.id+'-options-button" class="input-group-btn travel-type-buttons" ' + (!that.options.options ? 'style="display: none;"' : '') + '> \
                    <button class="btn btn-autocomplete" type="button" title="' + i18n.get('settings') + '"><i class="fa fa-cog fa-fw"></i></button> \
                </span>';

    optionsHtml.push('<div id="'+that.options.id+'-options" class="text-center" style="color: black;width:'+width+'; display: block;">');
    optionsHtml.push('  <div class="btn-group text-center">');

    if ( that.options.options && that.options.options.walk )
      optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
        + (this.options.travelType == 'walk' ? 'active' : '') +
        '" travel-type="walk"><span class="fa fa-male travel-type-icon"></span> <span lang="en">Walk</span><span lang="no">Gå</span><span lang="de">zu Fuß</span></button>');

    if ( that.options.options && that.options.options.bike )
      optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
        + (this.options.travelType == 'bike' ? 'active' : '') +
        '" travel-type="bike"><span class="fa fa-bicycle travel-type-icon"></span> <span lang="en">Bike</span><span lang="no">Sykle</span><span lang="de">Fahrrad</span></button>');

    if ( that.options.options && that.options.options.rentbike )
      optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
        + (this.options.travelType == 'rentbike' ? 'active' : '') +
        '" travel-type="rentbike"> \
                <span class="fa fa-bicycle travel-type-icon"></span> <span lang="en">Hire Bike</span><span lang="no">Bysykkel</span><span lang="de">Leihfahrrad</span>\
            </button>');

    if ( that.options.options && that.options.options.rentandreturnbike )
      optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
        + (this.options.travelType == 'rentandreturnbike' ? 'active' : '') +
        '" travel-type="rentandreturnbike"> \
                <span class="fa fa-bicycle travel-type-icon"></span> <span lang="en">Hire & Return Bike</span><span lang="no">Bysykkel</span><span lang="de">Leihfahrrad</span>\
            </button>');

    if ( that.options.options && that.options.options.ebike )
      optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
        + (this.options.travelType == 'ebike' ? 'active' : '') +
        '" travel-type="ebike"><span class="fa fa-bicycle travel-type-icon"></span> <span lang="en">E-Bike</span><span lang="no">Elsykkel</span><span lang="de">E-Fahrrad</span></button>');

    if ( that.options.options && that.options.options.transit )
      optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
        + (this.options.travelType == 'transit' ? 'active' : '') +
        '" travel-type="transit"><span class="map-icon-train-station travel-type-icon"></span> <span lang="en">Transit</span><span lang="de" title="Öffentlicher Personennahverkehr">ÖPNV</span></button>');

    if ( that.options.options && that.options.options.biketransit )
      optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
        + (this.options.travelType == 'bike' ? 'active' : '') +
        '" travel-type="biketransit" title="Öffentlicher Personennahverkehr und Fahrrad"><span class="map-icon-train-station travel-type-icon"></span><span> + </span><span class="fa fa-bicycle travel-type-icon"></span></button>');

    if ( that.options.options && that.options.options.car )
      optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
        + (this.options.travelType == 'car' ? 'active' : '') +
        '" travel-type="car"><span class="fa fa-car"></span> <span lang="en">Car</span><span lang="de">Auto</span></button>');

    optionsHtml.push('  </div>');
    optionsHtml.push('</div>');
    // }

    // add a reset button to the input field
    // if ( that.options.reset ) {

    that.options.input +=
      '<span id="'+that.options.id+'-reverse" ' + (!that.options.reverse ? 'style="display: none;"' : '') + '" class="input-group-btn"> \
                    <button class="btn btn-autocomplete" type="button" title="' + i18n.get('reverse') + '"><i class="fa fa-arrows-v fa-fw"></i></button> \
                </span>';

    that.options.input +=
      '<span id="'+that.options.id+'-reset" ' + (!that.options.reset ? 'style="display: none;"' : '') + '" class="input-group-btn"> \
                    <button class="btn btn-autocomplete" type="button" title="' + i18n.get('reset') + '"><i class="fa fa-times fa-fw"></i></button> \
                </span>';
    // }
    // if ( that.options.reverse ) {


    // }

    that.options.input += '</div>';
    if ( that.options.options ) that.options.input += optionsHtml.join('');

    // add the control to the map
    $(nameContainer).append(that.options.input);

    $(nameContainer).find('#' + that.options.id + '-reset').click(function(){ that.options.onReset(); });
    $(nameContainer).find('#' + that.options.id + '-reverse').click(function(){ that.options.onReverse(); });
    $(nameContainer).find('#' + that.options.id + '-options-button').click(
      function(){
        // slide in or out on the click of the options button
        $('#' + that.options.id + '-options').slideToggle();
      });

    $(nameContainer).find('.travel-type-button').click(function(){

      $(nameContainer).find('.travel-type-button').removeClass('active');
      $(this).addClass('active');

      if ( that.options.autoHide ) {

        setTimeout(function() {
          $('#' + that.options.id + '-options').slideToggle();
        }, 300);
      }

      that.options.travelType = $(this).attr('travel-type');
      that.options.onTravelTypeChange();
    });

    // no click on the map, if click on container
    L.DomEvent.disableClickPropagation(nameContainer);

    if ( r360.has(that.options, 'country' ) ) countrySelector += " AND country:" + that.options.country;

    $(nameContainer).find("#autocomplete-" + that.options.id).autocomplete({

      source: function( request, response ) {

        that.source = this;

        //var requestElements = request.term.split(" ");
        //var numbers = new Array();
        var requestString = request.term;
        //var numberString = "";

        // for(var i = 0; i < requestElements.length; i++){

        //     if(requestElements[i].search(".*[0-9].*") != -1)
        //         numbers.push(requestElements[i]);
        //     else
        //         requestString += requestElements[i] + " ";
        // }

        // if ( numbers.length > 0 ) {
        //     numberString += " OR ";

        //     for(var j = 0; j < numbers.length; j++){
        //         var n = "(postcode : " + numbers[j] + " OR housenumber : " + numbers[j] + " OR street : " + numbers[j] + ") ";
        //         numberString +=  n;
        //     }
        // }

        $.ajax({
          url: "https://service.route360.net/geocode/api/",
          // dataType: "jsonp",
          // jsonp: 'json.wrf',
          async: false,
          data: {
            // wt:'json',
            // indent : true,
            // rows: that.options.maxRows,
            // qt: 'en',
            // q:  "(" + requestString + numberString + ")" + countrySelector
            q : requestString,
            limit : that.options.maxRows
            // lat : that.options.map.getCenter().lat,
            // lon : that.options.map.getCenter().lng
          },
          success: function( data ) {

            var places = new Array();
            response( $.map( data.features, function( feature ) {

              if ( feature.osm_key == "boundary" ) return;

              var place           = {};
              var firstRow        = [];
              var secondRow       = [];
              place.name          = feature.properties.name;
              place.city          = feature.properties.city;
              place.street        = feature.properties.street;
              place.housenumber   = feature.properties.housenumber;
              place.country       = feature.properties.country;
              place.postalCode    = feature.properties.postcode;
              if (place.name)       firstRow.push(place.name);
              if (place.city)       firstRow.push(place.city);
              if (place.street)     secondRow.push(place.street);
              if (place.housenumber) secondRow.push(place.housenumber);
              if (place.postalCode) secondRow.push(place.postalCode);
              if (place.city)       secondRow.push(place.city);

              // only show country if undefined
              // if ( !r360.has(that.options, 'country') && place.country )
              secondRow.push(place.country);

              // if same looking object is in list already: return
              if ( _.contains(places, firstRow.join() + secondRow.join()) ) return;
              else places.push(firstRow.join() + secondRow.join());

              return {
                label       : firstRow.join(", "),
                value       : firstRow.join(", "),
                firstRow    : firstRow.join(", "),
                secondRow   : secondRow.join(" "),
                term        : request.term,
                index       : that.options.index,
                latlng      : new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
              }
            }));
          }
        });
      },
      minLength: 2,

      select: function( event, ui ) {
        that.options.value = ui.item;
        that.options.onSelect(ui.item);
      }
    })
      .data("ui-autocomplete")._renderItem = function( ul, item ) {

      // this has been copied from here: https://github.com/angular-ui/bootstrap/blob/master/src/typeahead/typeahead.js
      // thank you angular bootstrap team
      function escapeRegexp(queryToEscape) {
        return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
      }

      var highlightedFirstRow =
        item.term ? (item.firstRow).replace(new RegExp(escapeRegexp(item.term), 'gi'), '<strong>$&</strong>') : item.firstRow;

      var highlightedSecondRow =
        item.term ? (item.secondRow).replace(new RegExp(escapeRegexp(item.term), 'gi'), '<strong>$&</strong>') : item.secondRow;

      var html = "<a><span class='address-row1'>"+ highlightedFirstRow + "</span><br/><span class='address-row2'>  " + highlightedSecondRow + "</span></a>";

      return $( "<li>" ).append(html).appendTo(ul);
    };

    this.onResize();

    return nameContainer;
  },

  updateI18n : function(source) {

    var that = this;
    $("#autocomplete-" + that.options.id).attr("placeholder", r360.config.i18n.get(source ? 'placeholderSrc' : 'placeholderTrg'));
    $('#' + that.options.id + '-reverse-button').attr('title', r360.config.i18n.get('reverse'));
    $('#' + that.options.id + '-reset-button').attr('title', r360.config.i18n.get('reset'));
    $('#' + that.options.id + '-options-btn').attr('title', r360.config.i18n.get('settings'));

  },

  onSelect: function(onSelect){

    this.options.onSelect = onSelect;
  },

  onReset: function(onReset){

    this.options.onReset = onReset;
  },

  onReverse: function(onReverse){

    this.options.onReverse = onReverse;
  },

  onTravelTypeChange: function(onTravelTypeChange){

    this.options.onTravelTypeChange = onTravelTypeChange;
  },

  reset : function(){

    this.options.value = {};
    this.setFieldValue("");
  },

  update : function(latLng, fieldValue) {

    this.setLatLng(latLng);
    this.setFieldValue(fieldValue);
  },

  setLatLng : function(latLng) {

    this.options.value.latlng = latLng
  },

  setFieldValue : function(value){

    var that = this;
    $("#autocomplete-" + that.options.id).val(value);
  },

  getFieldValue : function(){

    var that = this;
    return $("#autocomplete-" + that.options.id).val();
  },

  getTravelType : function(){

    return this.options.travelType;
  },

  setValue : function(value){
    this.options.value = value;
  },

  getValue : function(){
    return this.options.value;
  },

  getIndex : function(){
    return this.options.index;
  },

  onResize: function(){

    var that = this;
    if ( this.options.map.getSize().x < 550) $(that.options.input).css({'width':'45px'});
    else $(that.options.input).css({'width':''});
  }
});

/**
 * @ngdoc function
 * @name route360DemoApp.controller:ApartmentCtrl
 * @description
 * # ApartmentCtrl
 * Controller of the route360DemoApp
 */
angular.module('route360DemoApp')
  .controller('MapCtrl', function ($window, $http, $scope, $config, ngTableParams, $timeout, TableParamFactory, PolygonService, laupisDatabase) {

    function formatPhotonReverseGeocoding(place) {

      place = place.features[0].properties;

      var streetAdress = [];
      if ( r360.has(place, 'name') )         streetAdress.push(place.name);
      if ( r360.has(place, 'street') )       streetAdress.push(place.street);
      if ( r360.has(place, 'housenumber') )  streetAdress.push(place.housenumber);

      var city = [];
      if ( r360.has(place, 'postcode') )     city.push(place.postcode);
      if ( r360.has(place, 'city') )         city.push(place.city);

      var address = [];
      if ( streetAdress.length > 0 )  address.push(streetAdress.join(' '));
      if ( city.length > 0)           address.push(city.join(', '));

      if ( streetAdress.length == 0 && city.length == 0 ) address.push("Reverse geocoding not possible.");

      return address.join(', ');
    };

    function getAddressByCoordinatesService(latlng, language, callback) {  // + '&json_callback=?'
      $.getJSON("https://service.route360.net/geocode/reverse?&format=json&lat=" + latlng.lat + '&lon=' + latlng.lng , callback);
    };

    $scope.getNextFriday = function(){
      var date = new Date();
      var friday = new Date(+date+(7-(date.getDay()+2)%7)*86400000);
      var dd   = friday.getDate();
      if(dd < 10)
        dd = 0 + "" + dd;
      var mm   = friday.getMonth()+1; //January is 0!
      var yyyy = friday.getFullYear();
      return "" + yyyy + "" + mm + "" + dd;
    };

    $scope.travelDate = $scope.getNextFriday();

    // $scope.travelDate = '20150713';
    $scope.travelTime = (3600 * 17) + '';
    // $scope.travelTime = (3600 * 11) + '';

    // das ist der startmarker
    $scope.source           = undefined;
    // verschieden farben für verschiedene marker icons
    $scope.markerColorsHex  = [ '#338433', '#BC5A1D', '#B71632', '#226CBE', '#4F2474', '#656565' ];
    $scope.markerColors     = [ 'green', 'orange', 'red', 'blue', 'purple', 'grey' ];

    // das symbolisiert die laupi datenbank
    // $scope.laupisDatabase = [{"uriident":"kleingarten-nahe-bad-doberan-8-km-bis-zur-ostsee-p-81","css-filter-class-string":"estate flaechen-gesamtflaeche-400-500 laupi-hausart-steinhaus laupi-hausflaeche-20-30 laupi-eigentumsart-teileigentum preise-kaufpreisbrutto-10000-20000","freitexte-objekttitel":"Kleingarten nahe Bad Doberan, 8 km bis zur Ostsee","anhaenge-anhang-#1-@gruppe":"BILD","anhaenge-anhang-#1-daten-pfad":"assets\/images\/c\/P-81_10_%20Kleingarten_Wochenendgrundstueck_Bad_Doberan_Laupi_Berlin-1731127c.jpg","anhaenge-anhang-#1-format":".jpg","anhaenge-anhang-#1-anhangtitel":"10__Kleingarten_Wochenendgrundstueck_Bad_Doberan_Laupi_Berlin.jpg","geo-plz":"18209","geo-ort":"Bad Doberan","flaechen-gesamtflaeche":"400.00","laupi-hausart":"Steinhaus","laupi-hausflaeche":"24.00","laupi-eigentumsart":"Teileigentum","preise-kaufpreisbrutto":"10292.00","laupi-objektart":"Kleingarten","geo-lat":"54.0900000","geo-lon":"11.9300000","geo-lat_forged":"54.0900000","geo-lon_forged":"11.9300000"},{"uriident":"wochenendgrundstueck-in-beelitz-nahe-bei-potsdam-und-berlin-p-246","css-filter-class-string":"estate flaechen-gesamtflaeche-400-500 laupi-hausart-blockbohlenhaus laupi-hausflaeche-20-30 laupi-eigentumsart-pacht preise-kaufpreisbrutto-1-10000","freitexte-objekttitel":"Wochenendgrundst\u00fcck in Beelitz, nahe bei Potsdam und Berlin","anhaenge-anhang-#1-@gruppe":null,"anhaenge-anhang-#1-daten-pfad":null,"anhaenge-anhang-#1-format":null,"anhaenge-anhang-#1-anhangtitel":null,"geo-plz":"14547","geo-ort":"Beelitz","flaechen-gesamtflaeche":"467.00","laupi-hausart":"Blockbohlenhaus","laupi-hausflaeche":"24.00","laupi-eigentumsart":"Pacht","preise-kaufpreisbrutto":"8667.00","laupi-objektart":"Wochenendgrundst\u00fcck","geo-lat":"52.2200000","geo-lon":"12.9700000","geo-lat_forged":"52.2200000","geo-lon_forged":"12.9700000"},{"uriident":"kleingarten-in-templin-in-seenreicher-umgebung-75-km-von-berlin-p-205","css-filter-class-string":"estate flaechen-gesamtflaeche-400-500 laupi-hausart-steinhaus laupi-hausflaeche-20-30 laupi-eigentumsart-pacht preise-kaufpreisbrutto-20000-30000","freitexte-objekttitel":"Kleingarten in Templin, in seenreicher Umgebung, 75 km von Berlin","anhaenge-anhang-#1-@gruppe":"BILD","anhaenge-anhang-#1-daten-pfad":"assets\/images\/2\/P-205_10_Kleingarten_Wochenendhaus_Templin_Laupi_Berlin-aff86632.jpg","anhaenge-anhang-#1-format":".jpg","anhaenge-anhang-#1-anhangtitel":"10_Kleingarten_Wochenendhaus_Templin_Laupi_Berlin.jpg","geo-plz":"","geo-ort":"Templin","flaechen-gesamtflaeche":"400.00","laupi-hausart":"Steinhaus","laupi-hausflaeche":"28.00","laupi-eigentumsart":"Pacht","preise-kaufpreisbrutto":"21666.00","laupi-objektart":"Kleingarten","geo-lat":"53.1200000","geo-lon":"13.5000000","geo-lat_forged":"53.1200000","geo-lon_forged":"13.5000000"},{"uriident":"wochendendhaus-am-schervenzsee-im-schlaubetal-nicht-weit-bis-frankfurtioder-p-244","css-filter-class-string":"estate flaechen-gesamtflaeche-200-300 laupi-hausart-ddr-bungalow laupi-hausflaeche-30-40 laupi-eigentumsart-pacht preise-kaufpreisbrutto-1-10000","freitexte-objekttitel":"Wochendendhaus am Schervenzsee im Schlaubetal, nicht weit bis Frankfurt\/IOder","anhaenge-anhang-#1-@gruppe":"BILD","anhaenge-anhang-#1-daten-pfad":"","anhaenge-anhang-#1-format":".jpg","anhaenge-anhang-#1-anhangtitel":"10_Wochenendgrundst\u00c3\
    // u00bcck_Schervenzsee_Laupi_Berlin.jpg","geo-plz":"15890","geo-ort":"Schernsdorf","flaechen-gesamtflaeche":"250.00","laupi-hausart":"DDR-Bungalow","laupi-hausflaeche":"34.00","laupi-eigentumsart":"Pacht","preise-kaufpreisbrutto":"5595.00","laupi-objektart":"Wochenendgrundst\u00fcck","geo-lat":"52.1800000","geo-lon":"14.4400000","geo-lat_forged":"52.1900000","geo-lon_forged":"14.4600000"},{"uriident":"grosses-wochenendgrundstueck-in-golssen-am-rande-des-spreewalds-p-150","css-filter-class-string":"estate flaechen-gesamtflaeche-1400-1500 laupi-hausart-holzhaus laupi-hausflaeche-10-20 laupi-eigentumsart-eigentum preise-kaufpreisbrutto-10000-20000","freitexte-objekttitel":"Gro\u00dfes Wochenendgrundst\u00fcck in Gol\u00dfen am Rande des Spreewalds","anhaenge-anhang-#1-@gruppe":"BILD","anhaenge-anhang-#1-daten-pfad":"assets\/images\/5\/P-150_2_Wochenendgrundstueck_Gartengrundstueck_Golssen_Spreewald_Laupi_Berlin-10a102d5.jpg","anhaenge-anhang-#1-format":".jpg","anhaenge-anhang-#1-anhangtitel":"2_Wochenendgrundstueck_Gartengrundstueck_Golssen_Spreewald_Laupi_Berlin.jpg","geo-plz":"15938","geo-ort":"Gol\u00dfen","flaechen-gesamtflaeche":"1400.00","laupi-hausart":"Holzhaus","laupi-hausflaeche":"12.00","laupi-eigentumsart":"Eigentum","preise-kaufpreisbrutto":"16250.00","laupi-objektart":"Wochenendgrundst\u00fcck","geo-lat":"0.0000000","geo-lon":"0.0000000","geo-lat_forged":"51.9700000","geo-lon_forged":"13.6000000"},{"uriident":"romantische-scheune-mit-garten-in-seenaehe-180-km-von-berlin-20-km-bis-guestrow-p-126","css-filter-class-string":"estate flaechen-gesamtflaeche-700-800 laupi-hausart-steinhaus laupi-hausflaeche-60-70 laupi-eigentumsart-eigentum preise-kaufpreisbrutto-40000-50000","freitexte-objekttitel":"Romantische Scheune mit Garten in Seen\u00e4he, 180 km von Berlin, 20 km bis G\u00fcstrow","anhaenge-anhang-#1-@gruppe":null,"anhaenge-anhang-#1-daten-pfad":null,"anhaenge-anhang-#1-format":null,"anhaenge-anhang-#1-anhangtitel":null,"geo-plz":"18292","geo-ort":"Koppelow","flaechen-gesamtflaeche":"717.00","laupi-hausart":"Steinhaus","laupi-hausflaeche":"60.00","laupi-eigentumsart":"Eigentum","preise-kaufpreisbrutto":"43332.00","laupi-objektart":"Wochenendgrundst\u00fcck","geo-lat":"53.7000000","geo-lon":"12.3100000","geo-lat_forged":"53.6900000","geo-lon_forged":"12.3100000"},{"uriident":"bungalow-zaue-am-schwielochsee-seenaehe-45-km-von-cottbus-p-158","css-filter-class-string":"estate flaechen-gesamtflaeche-200-300 laupi-hausart-steinhaus laupi-hausflaeche-30-40 laupi-eigentumsart-teileigentum preise-kaufpreisbrutto-20000-30000","freitexte-objekttitel":"Bungalow Zaue am Schwielochsee, Seen\u00e4he, 45 km von Cottbus","anhaenge-anhang-#1-@gruppe":"BILD","anhaenge-anhang-#1-daten-pfad":"assets\/images\/3\/P-158_3_Wochenendgrundstueck_Wochenendhaus_Schlaubetal_See_Laupi_Berlin-153fae33.jpg","anhaenge-anhang-#1-format":".jpg","anhaenge-anhang-#1-anhangtitel":"3_Wochenendgrundstueck_Wochenendhaus_Schlaubetal_See_Laupi_Berlin.jpg","geo-plz":"15913","geo-ort":"Zaue am Schwielochsee","flaechen-gesamtflaeche":"250.00","laupi-hausart":"Steinhaus","laupi-hausflaeche":"38.00","laupi-eigentumsart":"Teileigentum","preise-kaufpreisbrutto":"21666.00","laupi-objektart":"Wochenendgrundst\u00fcck","geo-lat":"52.0500000","geo-lon":"14.1900000","geo-lat_forged":"52.0600000","geo-lon_forged":"14.1900000"},{"uriident":"wochenendhaus-in-berlin-nikolassee-nahe-wannsee-p-252","css-filter-class-string":"estate flaechen-gesamtflaeche-100-200 laupi-hausart-gartenhaus laupi-hausflaeche-20-30 laupi-eigentumsart-pacht preise-kaufpreisbrutto-20000-30000","freitexte-objekttitel":"Wochenendhaus in Berlin-Nikolassee, nahe Wannsee","anhaenge-anhang-#1-@gruppe":"BILD","anhaenge-anhang-#1-daten-pfad":"assets\/images\/e\/P-252_01_Wochenendhaus_Berlin_Laupi-86a6af4e.jpg","anhaenge-anhang-#1-format":".jpg","anhaenge-anhang-#1-anhangtitel":"01_Wochenendhaus_Berlin_Laupi.jpg","geo-plz":"14109","geo-ort":"Berlin","flaechen-gesamtflaeche":"144.00","laupi-hausart":"Gartenhaus","laupi-hausflaeche":"21.00","laupi-eigentumsart":"Pacht","preise-kaufpreisbrutto":"22500.00","laupi-objektart":"Wochenendgrundst\u00fcck","geo-lat":"52.4200000","geo-lon":"13.1900000","geo-lat_forged":"52.4200000","geo-lon_forged":"13.1900000"},{"uriident":"kleingarten-in-fuerstenwalde-an-der-spree-30-km-bis-berlin-erkner-p-211","css-filter-class-string":"estate flaechen-gesamtflaeche-300-400 laupi-hausart-ddr-bungalow laupi-hausflaeche-30-40 laupi-eigentumsart-pacht preise-kaufpreisbrutto-10000-20000","freitexte-objekttitel":"Kleingarten in F\u00fcrstenwalde an der Spree, 30 km bis Berlin \/ Erkner","anhaenge-anhang-#1-@gruppe":null,"anhaenge-anhang-#1-daten-pfad":null,"anhaenge-anhang-#1-format":null,"anhaenge-anhang-#1-anhangtitel":null,"geo-plz":"15517","geo-ort":"F\u00fcrstenwalde","flaechen-gesamtflaeche":"386.00","laupi-hausart":"DDR-Bungalow","laupi-hausflaeche":"30.00","laupi-eigentumsart":"Pacht","preise-kaufpreisbrutto":"17333.00","laupi-objektart":"Kleingarten","geo-lat":"52.3400000","geo-lon":"14.0600000","geo-lat_forged":"52.3400000","geo-lon_forged":"14.0600000"},{"uriident":"finnhuette-wochenendgrundstueck-niederlausitz-32-km-von-cottbus-p-206","css-filter-class-string":"estate flaechen-gesamtflaeche-400-500 laupi-hausart-finnhuette laupi-hausflaeche-40-50 laupi-eigentumsart-eigentum preise-kaufpreisbrutto-10000-20000","freitexte-objekttitel":"Finnh\u00fctte, Wochenendgrundst\u00fcck Niederlausitz, 32 km von Cottbus","anhaenge-anhang-#1-@gruppe":null,"anhaenge-anhang-#1-daten-pfad":null,"anhaenge-anhang-#1-format":null,"anhaenge-anhang-#1-anhangtitel":null,"geo-plz":"02959","geo-ort":"Gro\u00df D\u00fcben","flaechen-gesamtflaeche":"487.00","laupi-hausart":"Finnh\u00fctte","laupi-hausflaeche":"42.00","laupi-eigentumsart":"Eigentum","preise-kaufpreisbrutto":"10833.00","laupi-objektart":"Wochenendgrundst\u00fcck","geo-lat":"51.5800000","geo-lon":"14.5700000","geo-lat_forged":"51.5700000","geo-lon_forged":"14.5700000"},{"uriident":"gartenhaus-keingarten-in-prenzlau-ganz-nah-am-unteruckersee-p-157","css-filter-class-string":"estate flaechen-gesamtflaeche-300-400 laupi-hausart-steinhaus laupi-hausflaeche-30-40 laupi-eigentumsart-pacht preise-kaufpreisbrutto-10000-20000","freitexte-objekttitel":"Gartenhaus \/ Keingarten in Prenzlau,  ganz nah am Unteruckersee","anhaenge-anhang-#1-@gruppe":null,"anhaenge-anhang-#1-daten-pfad":null,"anhaenge-anhang-#1-format":null,"anhaenge-anhang-#1-anhangtitel":null,"geo-plz":"17291","geo-ort":"Prenzlau","flaechen-gesamtflaeche":"300.00","laupi-hausart":"Steinhaus","laupi-hausflaeche":"38.00","laupi-eigentumsart":"Pacht","preise-kaufpreisbrutto":"10292.00","laupi-objektart":"Kleingarten","geo-lat":"53.3100000","geo-lon":"13.8600000","geo-lat_forged":"53.3100000","geo-lon_forged":"13.8500000"},{"uriident":"kleingarten-in-eberswalde-seenaehe-schorfheide-p-249","css-filter-class-string":"estate flaechen-gesamtflaeche-300-400 laupi-hausart-steinhaus laupi-hausflaeche-20-30 laupi-eigentumsart-pacht preise-kaufpreisbrutto-1-10000","freitexte-objekttitel":"Kleingarten in Eberswalde, Seen\u00e4he, Schorfheide","anhaenge-anhang-#1-@gruppe":"BILD","anhaenge-anhang-#1-daten-pfad":"assets\/images\/6\/P-249_10_Kleingarten_Eberswalde_Laupi_Berlin-02791296.jpg","anhaenge-anhang-#1-format":".jpg","anhaenge-anhang-#1-anhangtitel":"10_Kleingarten_Eberswalde_Laupi_Berlin.jpg","geo-plz":"16227","geo-ort":"Eberswalde","flaechen-gesamtflaeche":"300.00","laupi-hausart":"Steinhaus","laupi-hausflaeche":"25.00","laupi-eigentumsart":"Pacht","preise-kaufpreisbrutto":"8000.00","laupi-objektart":"Kleingarten","geo-lat":"52.8500000","geo-lon":"13.7300000","geo-lat_forged":"52.8500000","geo-lon_forged":"13.7300000"},{"uriident":"wochenendhaus-rangsdorf-bauland-30-km-von-berlin-p-151","css-filter-class-string":"estate flaechen-gesamtflaeche-1200-1300 laupi-hausart-steinhaus laupi-hausflaeche-20-30 laupi-eigentumsart-pacht-ueber-bufim preise-kaufpreisbrutto-10000-20000","freitexte-objekttitel":"Wochenendhaus Rangsdorf, Bauland, 30 km von Berlin","anhaenge-anhang-#1-@gruppe":null,"anhaenge-anhang-#1-daten-pfad":null,"anhaenge-anhang-#1-format":null,"anhaenge-anhang-#1-anhangtitel":null,"geo-plz":"15834","geo-ort":"Rangsdorf","flaechen-gesamtflaeche":"1200.00","laupi-hausart":"Steinhaus","laupi-hausflaeche":"25.00","laupi-eigentumsart":"Pacht \u00fcber BufIM","preise-kaufpreisbrutto":"12500.00","laupi-objektart":"Wochenendgrundst\u00fcck","geo-lat":"52.2900000","geo-lon":"13.4500000","geo-lat_forged":"52.2900000","geo-lon_forged":"13.4600000"}];
    $scope.laupisDatabase = laupisDatabase.data;

    _.each($scope.laupisDatabase, function(laupi){
      if( laupi['geo-lat_forged'] == '' || laupi['geo-lat_forged'] == '0.0000000' ) {
        laupi.lat = '52.565395';
        laupi.lng = '11.920166';
      } else {
        laupi.lat = laupi['geo-lat_forged'];
        laupi.lng = laupi['geo-lon_forged'];
      }
      laupi.id = laupi.uriident;
    });
    // das sind die laupis die den suckriterien entsprechen
    $scope.laupis = angular.copy($scope.laupisDatabase);
    $scope.laupis = _.reject($scope.laupis, function(laupi){ return laupi.lat == 0 });

    // die verschiedenen suchkriterien, alles wo 'ticked: true' steht sind die standardvorgaben
    $scope.kaufpreis = [];
    var kaufpreis = laupisDatabase.filterConfig.values['preise-kaufpreisbrutto'];
    var size = kaufpreis.length;
    angular.forEach(kaufpreis, function(value, key) {
      var vals = value.css.split('-');
      var obj = {
        value: vals[1],
        name: 'bis ' + String(vals[1]).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1.").split("").reverse().join("") + ' €',
        ticked: false
      };
      if(size-1 == key) obj.ticked = true;
      this.push(obj);
    }, $scope.kaufpreis);

    $scope.eigentumsArt = [];
    angular.forEach(laupisDatabase.filterConfig.values['laupi-eigentumsart'], function(value, key) {
      var obj = {
        value: value.name,
        name: value.name,
        ticked: true
      };
      this.push(obj);
    }, $scope.eigentumsArt);

    $scope.grundstuecksFlaeche = [];
    var gesamtflaeche = laupisDatabase.filterConfig.values['flaechen-gesamtflaeche'];
    var size = gesamtflaeche.length;
    angular.forEach(gesamtflaeche, function(value, key) {
      var vals = value.css.split('-');
      var obj = {
        value: vals[1],
        name: 'bis ' + String(vals[1]).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1.").split("").reverse().join("") + ' ' + 'm²',
        ticked: false
      };
      // if(vals[1] == '500') obj.ticked = true;
      if(size-1 == key) obj.ticked = true;
      this.push(obj);
    }, $scope.grundstuecksFlaeche);

    $scope.hausFlaeche = [];
    var hausflaeche = laupisDatabase.filterConfig.values['laupi-hausflaeche'];
    var size = hausflaeche.length;
    angular.forEach(hausflaeche, function(value, key) {
      var vals = value.css.split('-');
      var obj = {
        value: vals[1],
        name: 'bis ' + String(vals[1]).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1.").split("").reverse().join("") + ' ' + 'm²',
        ticked: false
      };
      if(size-1 == key) obj.ticked = true;
      this.push(obj);
    }, $scope.hausFlaeche);

    $scope.uebertragungWebseite = [];
    angular.forEach(laupisDatabase.filterConfig.values['laupi-uebertragung_webseite'], function(value, key) {
      var obj = {
        value: value.name,
        name: value.name,// name: (value.name == 1) ? 'Ja' : value.name,
        ticked: true
      };
      this.push(obj);
    }, $scope.uebertragungWebseite);

    $scope.produktstatus = [];
    angular.forEach(laupisDatabase.filterConfig.values['laupi-produktstatus'], function(value, key) {
      var obj = {
        value: value.name,
        name: value.name,// name: value.name,
        ticked: true
      };
      this.push(obj);
    }, $scope.produktstatus);

    $scope.produkttyp = [];
    angular.forEach(laupisDatabase.filterConfig.values['laupi-produkttyp'], function(value, key) {
      var obj = {
        value: value.name,
        name: value.name,// name: (value.name == 1) ? 'Ja' : value.name,
        ticked: true
      };
      this.push(obj);
    }, $scope.produkttyp);

    $scope.aktiv = [];
    angular.forEach(laupisDatabase.filterConfig.values['laupi-aktiv'], function(value, key) {
      var obj = {
        value: value.name,
        name: value.name,// name: (value.name == 1) ? 'Ja' : value.name,
        ticked: true
      };
      this.push(obj);
    }, $scope.aktiv);

    $scope.reserviert = [];
    angular.forEach(laupisDatabase.filterConfig.values['laupi-reserviert'], function(value, key) {
      var obj = {
        value: value.name,
        name: value.name,// name: (value.name == 1) ? 'Ja' : value.name,
        ticked: true
      };
      this.push(obj);
    }, $scope.reserviert);

    // das öffnet das modal fenster für die bearbeitung der suche
    $("#laupi-search-edit").show();
    $("#laupi-search-edit").on('click', function(){ $("#laupi-search-edit-modal").modal('show'); });

    // öffnet die ergebnissliste
    $("#laupi-results").show();
    $("#laupi-results").on('click', function(){

      // baut das datenmodell für die tabelle
      $scope.laupisTableParams = TableParamFactory.create($scope.laupis);
      $scope.laupisTableParams.settings().$scope = $scope;
      $scope.$apply();
      $("#laupi-results-modal").modal('show');
    });

    // öffnet das modal fenster für die legende
    $("#laupi-legend").show();
    $("#laupi-legend").on('click', function(){ $("#laupi-legend-modal").modal('show'); });

    // leaflet complains if project is build/minimized if this is not present
    L.Icon.Default.imagePath = 'images/marker/';

    // add the map and set the initial center to berlin
    $scope.map = L.map('map-laupi', {zoomControl : false, scrollWheelZoom : true }).setView([52.516389, 13.377778], 13);
    // attribution to give credit to OSM map data and VBB for public transportation
    var attribution ="<a href='https://www.mapbox.com/about/maps/' target='_blank'>© Mapbox © OpenStreetMap</a> | ÖPNV Daten © <a href='http://www.vbb.de/de/index.html' target='_blank'>VBB</a> | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";
    // initialising the base map. To change the base map just change following lines as described by cloudmade, mapbox etc..
    L.tileLayer('https://a.tiles.mapbox.com/v3/' + $config.mapboxId + '/{z}/{x}/{y}.png', { maxZoom: 18, attribution: attribution }).addTo($scope.map);
    L.control.scale({ metric : true, imperial : false }).addTo($scope.map);

    // der reisezeit slider mit werten von 20 bis 120 minuten in 20 minuten abständen
    r360.config.defaultTravelTimeControlOptions.travelTimes = [
      { time : 60 * 20   , color : "#006837" , opacity : 1.0 },
      { time : 60 * 40   , color : "#39B54A" , opacity : 1.0 },
      { time : 60 * 60   , color : "#8CC63F" , opacity : 1.0 },
      { time : 60 * 80   , color : "#F7931E" , opacity : 1.0 },
      { time : 60 * 100  , color : "#F15A24" , opacity : 1.0 },
      { time : 60 * 120  , color : "#C1272D" , opacity : 1.0 }
    ];

    $scope.travelTimeControl = r360.travelTimeControl({
      travelTimes : r360.config.defaultTravelTimeControlOptions.travelTimes,
      position    : 'topright', // this is the position in the map
      label       : 'Reisezeit', // the label, customize for i18n
      unit        : 'min', // nur ein display wert
      initValue   : 60 // the inital value has to match a time from travelTimes, e.g.: 40m == 2400s
    });

    // map control zum verändern der polygon darstellung
    $scope.map.addControl($scope.travelTimeControl);
    $scope.polygonButtons = r360.radioButtonControl({
      buttons : [
        // each button has a label which is displayed, a key, a tooltip for mouseover events
        // and a boolean which indicates if the button is selected by default
        // labels may contain html
        { label: '<span class=""></span> Farbig',         key: 'color',   checked : false  },
        { label: '<span class=""></span> Schwarz/Weiß',   key: 'inverse', checked : true }
      ]
    });

    // umstellen der polygone
    $scope.polygonButtons.onChange(function(){
      $scope.polygonLayer.setInverse($scope.polygonButtons.getValue() == 'color' ? false : true);
      $scope.showLaupis();
    });

    // zur karte hinzufügen
    $scope.polygonButtons.addTo($scope.map);
    L.control.zoom({position : 'topright'}).addTo($scope.map);
    // der kleine text der anzeigt wird während der request ausgeführt
    $scope.waitControl = r360.waitControl({ position : 'bottomright' });
    $scope.map.addControl($scope.waitControl);
    $scope.travelTimeControl.onSlideStop(function() { $scope.showLaupis(); $scope.$apply(); });

    // create and add the layers to the map
    $scope.laupiLayer      = L.featureGroup().addTo($scope.map);
    $scope.sourceLayer     = L.featureGroup().addTo($scope.map);
    $scope.routesLayer     = L.featureGroup().addTo($scope.map);
    $scope.polygonLayer    = r360.leafletPolygonLayer({
      inverse : true,
      extendWidthX: 500,
      extendWidthY: 500
    });
    $scope.map.addLayer($scope.polygonLayer);

    /**
     * holt sich die lat/lng coordinate von dem autovervollständigungsmodul
     */
    $scope.getPlaces = function(){

      // alten start entfernen
      $scope.sourceLayer.clearLayers();

      // roten marker einfügen
      var icon = L.icon({
        iconSize     : [25, 41], iconAnchor   : [12, 41],
        iconUrl      : L.Icon.Default.imagePath + 'marker-icon-' + $scope.markerColors[2] + '.png',
        shadowUrl    : L.Icon.Default.imagePath + 'marker-shadow.png',
        label        : 'Startpunkt',
        placeholder  : 'Startpunkt'
      });
      $scope.source = L.marker($scope.autoComplete.getValue().latlng, {icon : icon, draggable : true }).addTo($scope.sourceLayer);
      $scope.source.travelType = $scope.autoComplete.getTravelType();

      // wenn man den marker verschiebt, muss das autocomplete geupdated werden
      // und ein neuer route360 request gemacht werden
      $scope.source.on("dragend", function(event){

        // ask the service for a proper name
        getAddressByCoordinatesService($scope.source.getLatLng(), 'de', function(json){

          // udpate the values in the auto complete
          $scope.autoComplete.update($scope.source.getLatLng(), formatPhotonReverseGeocoding(json));
          // rerender view
          $scope.showLaupis();
        });
      });
    };

    // wird nur gebraucht um die position des exposes neu zu berechnen wenn man auf
    // den travel mode einstellungs button klickt
    $scope.resize = function(){
      var height = $('.leaflet-top.leaflet-left').height();
      var pos = $('.leaflet-top.leaflet-left').offset();
      $('#laupi-details').animate({ top: ((height) + (pos.top) + 10) + 'px' }, 250, function() {
        $('#laupi-details').css('max-height',  ($('#map-laupi').height() -  (height) - 20) + 'px');    // Animation complete.
      });
    };

    // symbolisiert die abfrage an den webservice oder wie auch immer
    // nach den suchkriterien gefiltert wird
    $scope.filterLaupis = function () {
      $scope.laupis = [];
      _.each($scope.laupisDatabase, function(laupi){
        if ( parseFloat(laupi['flaechen-gesamtflaeche']) <= parseFloat($scope.getSelection($scope.selectedGrundstuecksFlaeche)[0]) &&
          parseFloat(laupi['laupi-hausflaeche'])      <= parseFloat($scope.getSelection($scope.selectedHausFlaeche)[0]) &&
          parseFloat(laupi['preise-kaufpreisbrutto']) <= parseFloat($scope.getSelection($scope.selectedKaufpreis)[0]) &&
          _.contains($scope.getSelection($scope.selectedEigentumsArt), laupi['laupi-eigentumsart']) &&
          _.contains($scope.getSelection($scope.selectedUebertragungWebseite), laupi['laupi-uebertragung_webseite']) &&
          _.contains($scope.getSelection($scope.selectedProduktstatus), laupi['laupi-produktstatus']) &&
          _.contains($scope.getSelection($scope.selectedProdukttyp), laupi['laupi-produkttyp']) &&
          _.contains($scope.getSelection($scope.selectedAktiv), laupi['laupi-aktiv']) &&
          _.contains($scope.getSelection($scope.selectedReserviert), laupi['laupi-reserviert']) )  {
          $scope.laupis.push(laupi);
        }

      });
    };

    // hilfsmethode um werte aus den suchmasken auszulesen
    $scope.getSelection = function(field) {

      var selection = [];
      angular.forEach(field, function(value) { if ( value.ticked === true ) selection.push(value.value); });
      return selection;
    }

    /**
     * [showLaupis description]
     * @return {[type]} [description]
     */
    $scope.showLaupis = function(){

      // add customer address as start point
      // example Lily-Braun-Straße 68, 12619, Berlin
      // call https://service.route360.net/geocode/api/?q=Lily-Braun-Stra%C3%9Fe+68%2C+12619+Berlin&limit=5
      var cAddr = decodeURI(location.search.split('cAddress=')[1]);
      if(typeof cAddr != 'undefined' && cAddr != 'undefined')
      {
        $.ajax({
          url: "https://service.route360.net/geocode/api/",
          async: false,
          data: {
            q: cAddr,
            limit: 1
          },
          success: function (data) {
            cAddr = cAddr.split('+').join(' ');
            var properties = data.features[0].properties;
            var latLng = data.features[0].geometry.coordinates;
            $scope.autoComplete.setFieldValue(cAddr);
            $scope.autoComplete.setValue({
              firstRow    : properties.city +' '+ properties.state,
              getLatLng   : function (){ return this.latlng; },
              label       : properties.city +' '+ properties.state,
              latlng      : L.latLng(latLng[1], latLng[0]),
              secondRow   : properties.city,
              term        : properties.city,
              value       : properties.city +' '+ properties.state
            });
          }
        });
      }

      // alle layer werden auf den ausgangszustand gesetzt
      $scope.waitControl.show();
      $scope.laupiLayer.clearLayers();
      $scope.routesLayer.clearLayers();
      $('#laupi-details').hide();
      $scope.getPlaces();
      $scope.noApartmentsInTravelTimeFound = true;

      $scope.maxTime = $scope.travelTimeControl.getMaxValue();

      var travelOptions = r360.travelOptions();
      travelOptions.addSource($scope.source); // die quelle ist der rote marker
      travelOptions.setTravelTimes($scope.travelTimeControl.getValues()); // reisezeiten vom slider holen
      travelOptions.setDate($scope.travelDate); // beliebigen festen freitag wählen
      travelOptions.setTime($scope.travelTime); //  feste urhzeit 17:00 wählen

      // call the service
      r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons){

        // die polygone zum layer hinzufügen und die karten so ausrichten
        // das die polygone komplett zu sehen sind
        $scope.polygonLayer.clearAndAddLayers(polygons, true);

        // do not query server if no laupis found
        if ( $scope.laupis.length == 0 ) {
          $scope.waitControl.hide();
          var error = noty({text: 'Keine Objekte gefunden.', layout : $config.notyLayout, type : 'error', timeout : 2000 });
          return;
        }

        // service configuration
        var travelOptions = r360.travelOptions();
        travelOptions.addSource($scope.source); // quelle ist der rote marker
        travelOptions.setTargets($scope.laupis); // ziel sind all laupis die den suchkriterien entsprechen
        travelOptions.setTravelTimes($scope.travelTimeControl.getValues()); // reisezeit festlegen
        // fix for grey markers by ma
        // travelOptions.setMaxRoutingTime($scope.travelTimeControl.getMaxValue()); // bis hirerhin wird geroutet
        travelOptions.setMaxRoutingTime(7200); // fixed to 7200 for 3 hours
        // zwingend für polygone und routen den selben tag/zeit auswählen
        travelOptions.setDate($scope.travelDate); // beliebigen festen freitag wählen
        travelOptions.setTime($scope.travelTime); //  feste urhzeit 17:00 wählen

        // // call the time service to get the travel times
        r360.TimeService.getRouteTime(travelOptions, function(sources){
          _.each(sources[0].targets, function(target){

            // wir müssen aus dem request die laupi wiederfinden
            var laupi = _.find($scope.laupis, function(laupi){ return laupi.uriident == target.id; });
            // reiszeit zu laupi hinzufügen
            laupi.travelTime = target.travelTime;
            // wir machen das hier nur damit wir normal sortieren können
            if ( laupi.travelTime == -1 ) laupi.travelTime = 10000000;

            // create a marker which represents good or bad reachability
            var laupiMarker = $scope.createlaupiMarker(laupi, travelOptions);

            // show the info window on mouseover and click
            laupiMarker.on('click', $scope.clickMarker(laupiMarker, laupi, travelOptions));
          });
          // noch nach den reisezeiten sortieren
          $scope.laupis.sort(function(a, b){ return a.travelTime - b.travelTime; });

          // ergebnisstabelle updaten
          $scope.tableParams = TableParamFactory.create($scope.laupis);

          // 'bitte warten' entfernen
          $scope.waitControl.hide();

          // falls keine laupis gefunden worden hinweis anzeigen
          if ( $scope.noApartmentsInTravelTimeFound )
            var error = noty({text: 'Es gibt in den erreichbaren Gebieten keine Objekte, die den Suchkriterien entsprechen.', timeout: 3000, layout : $config.notyLayout, type : 'error' });
        });
      });
    };

    // löst ein erhoehen der reisezeit aus falls limit noch nicht erreicht ist.
    $scope.showIncreaseTravelTimeQuestion = function(error){

      if ( $scope.travelTimeControl.getMaxValue() / 60 < 120 ) {

        noty({
          text: 'Reisezeit erhöhen?',
          layout : $config.notyLayout,
          buttons: [
            { addClass: 'btn btn-primary', text:  'Ja', onClick: function($noty) {

              $scope.travelTimeControl.setValue(Math.min($scope.travelTimeControl.getMaxValue() / 60 + 20, 60));
              $scope.showLaupis();
              $noty.close(); error.close();
            }},
            { addClass: 'btn btn-danger', text:  'Nein', onClick: function($noty) {
              $noty.close(); error.close();
            }}]
        });
      }
    };

    /**
     * erzeugt speziellen marker nach erreichbarkeit
     */
    $scope.createlaupiMarker = function(laupi, travelOptions){

      var laupiMarker, icon;
      var suffix = ''; // Fall a

      // besondere Ausgabe bei FilterSet 2
      if($scope.outputBrowsers[0].id == 2) {
        // alle Felder bekommen das x für verkauft
        suffix = '-x'; // Fall c
      } else if($scope.outputBrowsers[0].id == 3) {
        // alle Felder bekommen das r für reserviert
        suffix = '-r';
      } else {

        // kein FilterSet gewählt -> Standard
        if(laupi["laupi-produkttyp"] == '1-Projekt' && laupi["laupi-aktiv"] == 'Ja')
          if(laupi["laupi-uebertragung_webseite"] == 'Ja')
            suffix = '-p'; // Fall d
          else
            suffix = '-p-inaktiv'; // Fall e
        if(laupi["laupi-produkttyp"] == '1-Objekt' && laupi["laupi-aktiv"] == "Ja" && laupi["laupi-uebertragung_webseite"] == "Nein")
          suffix = '-i'; // Fall b
        if(laupi["laupi-produkttyp"] == '1-Objekt' && laupi["laupi-aktiv"] == "Nein" && laupi["laupi-produktstatus"] == '060-Verkauft durch Laupi')
          suffix = '-x'; // Fall c
        if(laupi["laupi-produkttyp"] == '1-Objekt' && laupi["laupi-aktiv"] == "Ja" && laupi["laupi-uebertragung_webseite"] == "Ja" && laupi["laupi-reserviert"] == 'Ja')
          suffix = '-r';
      }
      // marker die erreicht werden können sind grün
      if ( laupi.travelTime != -1 && laupi.travelTime != undefined && laupi.travelTime <= $scope.travelTimeControl.getMaxValue() &&
        PolygonService.pointInPolygon([laupi.lat, laupi.lng]) ) {

        icon = L.icon({
          iconSize     : [25, 41], iconAnchor   : [12, 41],
          iconUrl      : L.Icon.Default.imagePath + 'marker-icon-' + $scope.markerColors[0] + suffix + '.png',
          shadowUrl    : L.Icon.Default.imagePath + 'marker-shadow.png'
        });

        $scope.noApartmentsInTravelTimeFound = false;
      }
      // marker die NICHT erreicht werden können sind grau
      else {

        icon = L.icon({
          iconSize     : [25, 41], iconAnchor   : [12, 41],
          iconUrl      : L.Icon.Default.imagePath + 'marker-icon-' + $scope.markerColors[5] + suffix + '.png',
          shadowUrl    : L.Icon.Default.imagePath + 'marker-shadow.png'
        });
      }

      // add the laupi to the map
      laupiMarker = L.marker([laupi.lat, laupi.lng], {icon : icon, draggable : false }).addTo($scope.laupiLayer);

      return laupiMarker;
    }

    /**
     * [clickMarker description]
     * @param  {[type]} laupiMarker [description]
     * @param  {[type]} laupi       [description]
     * @param  {[type]} travelOptions   [description]
     * @return {[type]}                 [description]
     */
    $scope.clickMarker = function(laupiMarker, laupi, travelOptions){

      return function() {

        $scope.laupi = laupi;
        $scope.routesLayer.clearLayers();

        $scope.map.removeLayer($scope.routesLayer);
        $scope.routesLayer     = L.featureGroup().addTo($scope.map);

        $scope.resize();
        $('#laupi-details').show();

        // define source and target
        var travelOptions = r360.travelOptions();
        travelOptions.setDate($scope.travelDate); // beliebigen festen freitag wählen
        travelOptions.setTime($scope.travelTime); //  feste urhzeit 17:00 wählen
        travelOptions.setMaxRoutingTime(7200); // fix route by ma 27.08.2018
        travelOptions.addSource($scope.source);
        travelOptions.setTargets([laupiMarker]);

        // route vom serverholen
        r360.RouteService.getRoutes(travelOptions, function(routes){

          $scope.laupi.travelTime = routes[0].travelTime;
          $scope.laupi.route      = routes[0];

          r360.LeafletUtil.fadeIn($scope.routesLayer, $scope.laupi.route, 1000, 'travelDistance', {
            transferColor       : '#659742',
            transferHaloColor   : '#4B7C27',
            transferFillOpacity : 1,
            transferOpacity     : 1,
            transferStroke      : true,
            transferWeight      : 7,
            transferRadius      : 7
          });

          // angular spezifisch
          $scope.$apply(); // update view because of out of angular call
        });
      };
    }

    /**
     */
    $scope.addAutoComplete = function(){

      // create a autocomplete
      $scope.autoComplete = r360.photonPlaceAutoCompleteControl({
        country     : 'Deutschland',
        placeholder : 'Startpunkt',
        reset       : false,
        reverse     : false,
        image       : L.Icon.Default.imagePath + 'marker-icon-' + $scope.markerColors[2] + '.png',
        options     : { car : true, bike : true, walk : true, transit : true, biketransit : true, init : 'transit', labels : {
          bike : '<span class="fa fa-bicycle travel-type-icon"></span>',
          walk : '<span class="fa fa-male travel-type-icon"></span>',
          car : '<span class="fa fa-car travel-type-icon"></span>',
          transit : '<span class="fa fa-bus travel-type-icon"></span>',
          biketransit : '<span class="fa fa-bicycle travel-type-icon"></span> + <span class="fa fa-bus travel-type-icon"></span>',
        }},
        width : 400
      });

      // alle inhalte löschen
      var reset = function(){

        if ( $scope.autoComplete.getFieldValue() != '' ) {
          $scope.autoComplete.reset();
          $scope.polygonLayer.clearLayers();
          $scope.routesLayer.clearLayers();
          $scope.sourceLayer.clearLayers();
          $('#laupi-details').hide();
        }
      };

      // laupis anzeigen
      var select = function() { $scope.showLaupis(); };

      // laupis anzeigen
      var onTravelTypeChange = function(){

        // we have to wait since this is the time it takes for the slide-in to slide in
        $timeout(function(){ $scope.resize(); }, 320);
        $scope.showLaupis();
      };

      // define what is happing on select
      $scope.autoComplete.onSelect(select);
      $scope.autoComplete.onReset(reset);
      $scope.autoComplete.onTravelTypeChange(onTravelTypeChange);
      $scope.map.addControl($scope.autoComplete);
      $scope.resize();
    }();

    $('#laupi-details').css('top',  (62) + 'px');
    $('#laupi-details').on('mouseover', function(){ $scope.map.scrollWheelZoom.disable(); });
    $('#laupi-details').on('mouseout' , function(){ $scope.map.scrollWheelZoom.enable(); });

    // methoden die im html aufgerufen werden
    $scope.showResultView = function(){
      $scope.laupisTableParams = TableParamFactory.create($scope.laupis);
      $('#laupi-results-modal').modal('show');
    };
    $scope.showEditSearchView   = function(){ $('#laupi-search-edit-modal').modal('show'); };
    // end toggle modals

    // action listener für den schließen button im expose
    $('#close-expose').click(function(){ $('#laupi-details').hide(); });
    // recalculate the size of the laupi details after some one selects a travel type
    $('.travel-type-buttons').click(function(){ $timeout(function(){ $scope.resize(); }, 320); });
    // window is resized
    $scope.map.on('resize', function(){ $scope.resize(); });

    // set default values for debugging/developing
    $scope.autoComplete.setFieldValue("Berlin, Berlin");
    $scope.autoComplete.setValue({
      firstRow    : "Berlin, Berlin",
      getLatLng   : function (){ return this.latlng; },
      label       : "Berlin, Berlin",
      latlng      : L.latLng(52.517037, 13.38886),
      secondRow   : "Berlin",
      term        : "Berlin",
      value       : "Berlin, Berlin"
    });

    // defaultmäßiges aufrufen zu begin des website ladens
    $scope.showLaupis();
    noty({text: 'Man kann den Marker verschieben', layout : $config.notyLayout, type : 'success', timeout : 3000 });
    // $timeout(function(){ noty({text: 'Größere Marker symbolisieren kürzere Reisezeiten.', layout : $config.notyLayout, type : 'success', timeout : 3000 }); }, 4000);
    // $timeout(function(){ noty({text: 'Die farbigen Markierungen auf der Karte entsprechen den Gebieten die in der angegebenen Reisezeit erreichbar sind.', layout : $config.notyLayout, type : 'success', timeout : 3000 }); }, 8000);
    $scope.resize();
    // select language
    $("[lang='en']").hide();
    $("[lang='no']").hide();


    // load default filterSets
    $scope.filterSets = [
      { id: "1", icon: "[0]", name: "<span>Alle Produkttypen</span>",	        maker: "<small>Alle Felder: alle Werte</small>",	ticked: true	},
      // { name: "<strong>Objekte</strong>", msGroup: false },
      { id: "2", icon: "[1]", name: "<span>Verkaufte Objekte</span>",	    maker: "<small>Produktstatus = '060-Verkauft durch Laupi', restliche Felder: alle Werte</small>",	ticked: false	},
      { id: "3", icon: "[2]", name: "<span>Reservierte Objekte</span>",	    maker: "<small>Reserviert? = 'ja', aktiv = 'ja', Produktstatus <i>nicht</i> '060-Verkauft durch Laupi'</small>",	ticked: false	},
      { id: "4", icon: "[3]", name: "<span>Interne Objekte (aktiv)</span>",	maker: "<small>Übertragen an Webseite = 'nein', aktiv = 'ja', Produkttyp = '1-Objekt', restliche Felder: alle Werte</small>",	ticked: false	},
      { id: "5", icon: "[4]", name: "<span>Objekte auf Webseite</span>",	maker: "<small>Übertragen an Webseite = 'ja', aktiv = 'ja', Produkttyp = '1-Objekt', restliche Felder: alle Werte</small>",	ticked: false	},
      { id: "6", icon: "[5]", name: "<span>Interne Objekte (aktiv) und Objekte auf Webseite</span>",	    maker: "<small>Produkttyp = '1-Objekt', aktiv = 'ja', restliche Felder: alle Werte</small>",	ticked: false	},
      // { msGroup: false },
      // { name: "<strong>Projekte</strong>", msGroup: false },
      { id: "7", icon: "[6]", name: "<span>Projekte (aktiv)</span>",	    maker: "<small>Produkttyp = '3-Projekt', aktiv = 'ja', restliche Felder: alle Werte</small>",	ticked: false	},
      { id: "8", icon: "[7]", name: "<span>Projekte (inaktiv)</span>",	    maker: "<small>Produkttyp = '3-Projekt', aktiv = 'nein', restliche Felder: alle Werte</small>",	ticked: false	},
      { id: "9", icon: "[8]", name: "<span>Projekte (alle)</span>",	    maker: "<small>Produkttyp = '3-Projekt', restliche Felder: alle Werte</small>",	ticked: false	},
      // { msGroup: false },
    ];

    // $scope.eigentumsArt
    // $scope.uebertragungWebseite
    // $scope.produkttyp
    // $scope.produktstatus
    // $scope.aktiv

    var orgSelectedProdukttyp = $scope.selectedProdukttyp;

    $scope.filterSetClick = function( data ) {

      // reset all filters to show all
      $scope.selectedReserviert = [];
      for(var i=0;i<$scope.reserviert.length;i++) {
        $scope.reserviert[i].ticked = true;
        $scope.selectedReserviert.push({name: $scope.reserviert[i].name, ticked:true, value:$scope.reserviert[i].name});
      }

      $scope.selectedProduktstatus = [];
      for(var i=0;i<$scope.produktstatus.length;i++) {
        $scope.produktstatus[i].ticked = true;
        $scope.selectedProduktstatus.push({name: $scope.produktstatus[i].name, ticked:true, value:$scope.produktstatus[i].name});
      }

      $scope.selectedProdukttyp = [];
      for(var i=0;i<$scope.produkttyp.length;i++) {
        $scope.produkttyp[i].ticked = true;
        $scope.selectedProdukttyp.push({name: $scope.produkttyp[i].name, ticked:true, value:$scope.produkttyp[i].name});
      }

      $scope.selectedUebertragungWebseite = [];
      for(var i=0;i<$scope.uebertragungWebseite.length;i++) {
        $scope.uebertragungWebseite[i].ticked = true;
        $scope.selectedUebertragungWebseite.push({name: $scope.uebertragungWebseite[i].name, ticked:true, value:$scope.uebertragungWebseite[i].name});
      }

      $scope.selectedAktiv = [];
      for(var i=0;i<$scope.aktiv.length;i++) {
        $scope.aktiv[i].ticked = true;
        $scope.selectedAktiv.push({name: $scope.aktiv[i].name, ticked:true, value:$scope.aktiv[i].name});
      }

      // filter by select fields

      if( typeof data != 'undefined') {

        if( data.id == 2 ) { // Verkauft durch Laupi / 2 verkaufte Objekte,

          var items = 1;
          var tmpSelProArr = new Array(items);
          tmpSelProArr[0] = {name:"060-Verkauft durch Laupi", ticked:true, value:"060-Verkauft durch Laupi"};
          $scope.selectedProduktstatus = tmpSelProArr;

          for(var i=0;i<$scope.produktstatus.length;i++) {
            if ($scope.produktstatus[i].name === "060-Verkauft durch Laupi") {
              $scope.produktstatus[i].ticked = true;
            }
            else
              $scope.produktstatus[i].ticked = false;
          }
        }
        if( data.id == 2 || data.id == 3 || data.id == 4 || data.id == 5 || data.id == 6 ) { // Typ Objekt
          // 2 verkaufte Objekte,
          // 3 reservierte Objekte,
          // 4 interne Objekte (aktiv),
          // 5 Objekte auf Webseite,
          // 6 Interne Objekte (aktiv) und Objekte auf Webseite

          var items = 1;
          var tmpSelProArr = new Array(items);
          tmpSelProArr[0] = {name:"1-Objekt", ticked:true, value:"1-Objekt"};
          $scope.selectedProdukttyp = tmpSelProArr;

          for(var i=0;i<$scope.produkttyp.length;i++) {
            if ($scope.produkttyp[i].name === "1-Objekt") {
              $scope.produkttyp[i].ticked = true;
              //$scope.selectedProdukttyp.push($scope.produkttyp[i]);
            }
            else
              $scope.produkttyp[i].ticked = false;
          }
        }
        if( data.id == 3 ) { // reserviert ja
          // 3 reservierte Objekte
          // alt: 2) Reservierte Objekte: Reserviert? = "ja", restliche Felder: alle Werte
          //    => Ungewünscht: verkaufte Objekte, die noch "reserviert" gesetzt haben, werden ebenfalls angezeigt
          // neu: 2) Reservierte Objekte: Reserviert? = "ja", aktiv = "ja", Produktstatus nicht = "060-Verkauft durch Laupi"

          var items = 1;
          var tmpSelProArr = new Array(items);
          tmpSelProArr[0] = {name:"Ja", ticked:true, value:"Ja"};
          $scope.selectedReserviert = tmpSelProArr;

          // $scope.selectedReserviert = [];
          for(var i=0;i<$scope.reserviert.length;i++) {
            if ($scope.reserviert[i].name === "Ja") {
              $scope.reserviert[i].ticked = true;
            }
            else
              $scope.reserviert[i].ticked = false;
          }
        }
        if( data.id == 3 ) { // Nicht verkauft durch Laupi / 3 reservierte Objekte

          var items = 1;
          var tmpSelProArr = new Array(items);
          var tmpArr = $scope.produktstatus;

          tmpSelProArr[0] = {name:"000-Eintrag angelegt", ticked:true, value:"000-Eintrag angelegt"};
          tmpSelProArr[1] = {name:"001-Eintrag angelegt (über Webseite)", ticked:true, value:"001-Eintrag angelegt (über Webseite)"};
          tmpSelProArr[2] = {name:"005-Objektgespräch Laupi vereinbaren", ticked:true, value:"005-Objektgespräch Laupi vereinbaren"};
          tmpSelProArr[3] = {name:"010-Objektgespräch Laupi geführt", ticked:true, value:"010-Objektgespräch Laupi geführt"};
          tmpSelProArr[4] = {name:"020-Besichtigung Laupi vereinbaren", ticked:true, value:"020-Besichtigung Laupi vereinbaren"};
          tmpSelProArr[5] = {name:"040-Besichtigung Laupi ist erfolgt", ticked:true, value:"040-Besichtigung Laupi ist erfolgt"};
          tmpSelProArr[6] = {name:"049-Verplant durch andere", ticked:true, value:"049-Verplant durch andere"};
          tmpSelProArr[7] = {name:"050-Verkauft/Vermietet durch andere", ticked:true, value:"050-Verkauft/Vermietet durch andere"};
          $scope.selectedProduktstatus = tmpSelProArr;

          for(var i=0;i<$scope.produktstatus.length;i++) {
            if ($scope.produktstatus[i].name !== "060-Verkauft durch Laupi") {
              $scope.produktstatus[i].ticked = true;
            }
            else
              $scope.produktstatus[i].ticked = false;
          }

        }
        if( data.id == 4 ) { // Übertragen an Webseite nein
          // 4 interne Objekte (aktiv)

          var items = 1;
          var tmpSelProArr = new Array(items);
          tmpSelProArr[0] = {name: "Nein", ticked: true, value: "Nein"};
          $scope.selectedUebertragungWebseite = tmpSelProArr;

          for (var i = 0; i < $scope.uebertragungWebseite.length; i++) {
            if ($scope.uebertragungWebseite[i].name === "Nein") {
              $scope.uebertragungWebseite[i].ticked = true;
            }
            else
              $scope.uebertragungWebseite[i].ticked = false;
          }
        }

        if( data.id == 3 || data.id == 4 || data.id == 5 || data.id == 6 || data.id == 7) { // Laupi aktiv ja
          // 3 reservierte Objekte neu
          // 4 interne Objekte (aktiv),
          // 5 Objekte auf Webseite,
          // 6 Interne Objekte (aktiv) und Objekte auf Webseite,
          // 7 Projekte (aktiv)

          var items = 1;
          var tmpSelProArr = new Array(items);
          tmpSelProArr[0] = {name:"Ja", ticked:true, value:"Ja"};
          $scope.selectedAktiv = tmpSelProArr;

          for(var i=0;i<$scope.aktiv.length;i++) {
            if ($scope.aktiv[i].name === "Ja") {
              $scope.aktiv[i].ticked = true;
            }
            else
              $scope.aktiv[i].ticked = false;
          }
        }

        if( data.id == 8 ) { // Laupi aktiv nein
          // 8 Projekte (inaktiv)

          var items = 1;
          var tmpSelProArr = new Array(items);
          tmpSelProArr[0] = {name:"Nein", ticked:true, value:"Nein"};
          $scope.selectedAktiv = tmpSelProArr;

          for(var i=0;i<$scope.aktiv.length;i++) {
            if ($scope.aktiv[i].name === "Nein") {
              $scope.aktiv[i].ticked = true;
            }
            else
              $scope.aktiv[i].ticked = false;
          }
        }

        if( data.id == 5 ) { // Übertragen an Webseite Ja
          // 5 Objekte auf Webseite,

          var items = 1;
          var tmpSelProArr = new Array(items);
          tmpSelProArr[0] = {name: "Nein", ticked: true, value: "Ja"};
          $scope.selectedUebertragungWebseite = tmpSelProArr;

          for (var i = 0; i < $scope.uebertragungWebseite.length; i++) {
            if ($scope.uebertragungWebseite[i].name === "Ja") {
              $scope.uebertragungWebseite[i].ticked = true;
            }
            else
              $scope.uebertragungWebseite[i].ticked = false;
          }
        }

        if( data.id == 7 || data.id == 8 || data.id == 9 ) { // Typ Projekt
          // 7 Projekte (aktiv),
          // 8 Projekte (inaktiv),
          // 9 Projekte (alle)


          var items = 1;
          var tmpSelProArr = new Array(items);
          tmpSelProArr[0] = {name:"3-Objekt", ticked:true, value:"3-Projekt"};
          $scope.selectedProdukttyp = tmpSelProArr;

          for(var i=0;i<$scope.produkttyp.length;i++) {
            if ($scope.produkttyp[i].name === "3-Projekt") {
              $scope.produkttyp[i].ticked = true;
            }
            else
              $scope.produkttyp[i].ticked = false;
          }
        }
      }

      this.filterLaupis();
      this.showLaupis();
    };

    $scope.outputBrowsers = [
      {	icon: "[...]/opera.png...",	name: "Opera",	maker: "Opera Software",	ticked: true	},
      {	icon: "[...]/firefox-icon.png...",	name: "Firefox",	maker: "Mozilla Foundation",	ticked: true	},
      {	icon: "[...]/chrome.png...",	name: "Chrome",	maker: "Google",	ticked: true	},
    ];


  });
