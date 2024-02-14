var map;
//var marker;
var map_marker = [];
var map_bounds = [];
var infoWindow;


initMap = function(id , drag_map, drag_end){	
	
	
	dump("map id=>"+ id);
	dump("drag_map=>"+ drag_map);
	dump("drag_end=>"+ drag_end);
	
	if(app_settings = getAppSettings()){		
		dump("map provider=>"+ app_settings.map_provider.provider);
		switch(app_settings.map_provider.provider){
			case "google.maps":
			
				 options = {
					  div: id ,
					  lat: app_settings.default_map_location.lat,
					  lng: app_settings.default_map_location.lng,
					  disableDefaultUI: true,	
					  //styles: [ {stylers: [ { "saturation":-100 }, { "lightness": 0 }, { "gamma": 1 } ]}],				 
					};
					
				 if(drag_map){				 	
				 	options.draggable=true;
				 	
				 	options.drag = function(e){
				 		current_page_id = onsenNavigator.topPage.id;
	                    dump("current_page_id_1=>"+ current_page_id);
	                    
	                    switch (current_page_id){
	                    	case "map_select_location":	                    	  
	                    	  if (app_settings.map_auto_identity_location==1){
	                    	  	  identifyLocationLoader(true);
	                    	  } else {
	                    	  	  $(".identify_location_wrap").hide();
	                    	  }
	                    	break;
	                    }
	                    
				 	};
				 	options.dragend=function(e) {		
				 		if(drag_end){
				 			dump("DRAG END");
						   	map_setLangLngValue( e.center.lat() , e.center.lng() );
						    map_moveMarker( 1,  e.center.lat(),  e.center.lng() );
						    
						    current_page_id = onsenNavigator.topPage.id;
	                        dump("current_page_id=>"+ current_page_id);
						    switch (current_page_id){
						    	
						    	case "map":
						    	   $("#"+ current_page_id + " .map_lat").val( e.center.lat() );
						    	   $("#"+ current_page_id + " .map_lng").val( e.center.lng() );
						    	 break;
						    	
						    	case "map_select_location":
						    	case "address_form":
						    	case "address_book":						    	   
						    	   if (typeof infoWindow === "undefined" || infoWindow==null || infoWindow=="" || infoWindow=="null" || infoWindow=="undefined" ) {						    	   	  
						    	   } else {
						    	   	  infoWindow.close();
						    	   }						    	   
						    	   
						    	   dump("close window");
						    	   if ( app_settings.map_auto_identity_location==1){
						    	   	   GeocodeLat( e.center.lat(), e.center.lng()  );
						    	   } else {
						    	   	   $(".identify_location_wrap").show();
						    	   	   DragLocationLoader(true);
						    	   }						    	   
						    	break;
						    }
				 		}
					};
					
				 } else {
				 	options.draggable=false;
				 }
				 dump(options);
				 
				 var latlng = new google.maps.LatLng( app_settings.default_map_location.lat , app_settings.default_map_location.lng );
	             map_bounds.push(latlng);
				 
			     map = new GMaps(options);	
			     return true;
			break;
			
			case "mapbox":

			    mapbox_token = app_settings.map_provider.token; 
			    default_zoom = app_settings.mapbox_default_zoom;
			    if(empty(default_zoom)){
			    	default_zoom=18;
			    }			  
			    			    			   
			    id = id.replace("#", "");
			    			    
				map = L.map(id,{ 
				   scrollWheelZoom:true,
				   zoomControl:false,
			    }).setView([app_settings.default_map_location.lat ,app_settings.default_map_location.lng ], 5 );  
			    			    
			    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token='+mapbox_token, {		
			    	attribution: 'Mapbox',
				    maxZoom: default_zoom ,				    
				    id: 'mapbox/streets-v11',		
				}).addTo(map);
								
				return true;
				
			break;
		}		
	} else {
		showAlert("Invalid map provider");
	}
	
	return false;
};


initMapAdress = function(id, drag_map){
	dump("initMapAdress");
	map_marker[1]='';
	map_bounds = [];
	map_res = initMap(id, drag_map, true);
	
	$(".mapbox_drag_map").val(true);
	$(".mapbox_drag_end").val(true);
	
	if(map_res){
		locateLocation();
	}
};

fillMapAddress = function(id, drag_map, lat, lng){
	dump("fillMapAddress");
	map_marker[1]='';
	map_bounds = [];
	map_res = initMap(id, drag_map, true);
		
    $(".mapbox_drag_map").val(true);
	$(".mapbox_drag_end").val(true);
	
	if(map_res){
		icon = getDefaultIcon();		
		
		map_addMarker(1, lat, lng , icon);					
		setTimeout(function() {				     
		 		map_setCenter(lat,lng);
	    }, 1000); 
	}
};

merchantLocation = function(id, lat, lng, merchant_address){	
	map_marker = [];
	map_res = initMap(id, true , false);
	if(map_res){
		icon = getDefaultIcon();				
		map_addMarker(0, lat, lng , icon, merchant_address);					
		
		setTimeout(function() {				     
		 		map_setCenter(lat,lng);
	    }, 1000); 
	    
	}
};

merchantMapList = function(id, lat, lng ){
	map_res = initMap(id, true, false);
	if(map_res){
		map_setCenter(lat,lng);
	}
};

merchantMapSetList = function(data){	
	map_bounds = [];
	map_marker = [];
	//default_icon = getDefaultIcon();			
	$.each(data, function(key, val){		
		
		default_icon = getRandomMarker();	
		
		info_html='<div class="map_info_wrap">'
				  
		  button='<br/><ons-button modifier="skip_button quiet" onclick="loadMerchant('+ val.merchant_id +')" >';
		  button+=t("VIEW");
		  button+='</ons-button>';
		  
		  info_html+='<div class="table auto">'
		     info_html+='<div class="col"><div><img src="' + val.logo + '"  /></div></div>';
		     info_html+='<div class="col top"><p>'+ val.restaurant_name + button + '</p></div>';
		  info_html+='</div>';
		  
		info_html+='</div>';		
		map_addMarker(key, val.latitude, val.lontitude, default_icon , info_html );
	});	
	
	setTimeout(function() {		
   	  map_center();
    }, 500); 
    
};

getRandomMarker = function(){
	rnd_icon ='';
	if(app_settings = getAppSettings()){	
		total_marker = app_settings.marker_icon.length;		
		rnd = Math.floor(Math.random() * parseInt(total_marker) );		
		rnd_icon = app_settings.marker_icon[rnd];
	} else {
		rnd_icon = getDefaultIcon();
	}
	return rnd_icon;
};

merchantLocationRoute = function(){
	var speed_dial = document.querySelector('ons-speed-dial');
	speed_dial.hideItems();	
	mapClearRoute();
	locateLocation();
};

getDefaultIcon = function(){
	icon='';      
    if(app_settings = getAppSettings()){
		switch(app_settings.map_provider.provider){
			case "google.maps":
			    icon = app_settings.icons.marker1;
			 break;
			 
			 case "mapbox":
			     icon = app_settings.icons.marker1;
			 break;
		}
	}	
	return icon;		
};

mapClearRoute = function(){	
	if(app_settings = getAppSettings()){
		switch(app_settings.map_provider.provider){
			case "google.maps":
			   map.cleanRoute();
			 break;
			 
			 case "mapbox":
			 break;
		}
	}		
};

initMapSelectLocation = function(id,lat, lng){
	
	map_marker = [];
	map_bounds = [];
	map_res = initMap(id, true, true);
	
	$(".mapbox_drag_map").val(true);
	$(".mapbox_drag_end").val(true);
		
	if(map_res){		
		if(empty(lat)){		   
		   locateLocation();
		} else {		
		   dump("re initMapSelectLocation");
		   dump("lat=>"+ lat + "lng=>"+ lng);
		   
		   setMapLocationFields(lat,lng);
		   
		   icon='';
		   if(app_settings = getAppSettings()){
		      //icon = app_settings.icons.marker2
		   }
		   
		   info = t("Move the map to set the exact location");		   
		   map_setLangLngValue( lat , lng );		   
		   map_addMarker( 1, lat , lng , icon, info );
		     		   
		   setTimeout(function() {		
		   	  map_setCenter( lat , lng ); 		      
           }, 100); 
           
           setTimeout(function() {				   	  
 		      GeocodeLat( lat, lng );
           }, 100); 
           
		}
	} else {
		showToast( t("failed loading map") );
	}
};

initGeocomplete = function(element){
	if(app_settings = getAppSettings()){
		switch(app_settings.map_provider.provider){
			case "google.maps":			    			
			    $(".mapbox_s_goecoder").remove();		    
				$(element).geocomplete({
				'country': getDefaultCountry()
				}).bind("geocode:result", function(event, result){		
					var _test=[];
					_test[0]=result;					
					$resp = parseAdress(_test);
					dump("parseAdress=> initGeocomplete");
					dump($resp);																								
			   	  	popPage();
			   	  	
			   	  	setTimeout(function() {
			   	  		
			   	  		current_page_id = onsenNavigator.topPage.id;	
			   	  		dump("current_page_id=>"+current_page_id);
			   	  		if(current_page_id!="address_book"){
				   	  		$(".print_location_address").html( $resp.formatted_address );
				   	  	    $(".recent_search_address").val( $resp.formatted_address );
			   	  		}
			   	  		
			   	  		map_setLangLngValue( $resp.lat , $resp.lng );
			            map_setCenter( $resp.lat , $resp.lng );
			            map_moveMarker( 1, $resp.lat , $resp.lng );	
			            			            					    					    
					    $("#"+current_page_id +" .street").val( $resp.street );
			   	  	  	$("#"+current_page_id +" .city").val( $resp.city );
			   	  	    $("#"+current_page_id +" .state").val( $resp.state );
			   	  	    $("#"+current_page_id +" .zipcode").val( $resp.zipcode );
			   	  	  	$("#"+current_page_id +" .country").val( $resp.country );					    
			   	  	}, 50);			   	  	
				});								
				$(".pac-container").css( {"z-index":99999} );
				
			 break;
			 
			 case "mapbox":
			    $(".search_address").remove();
			    dump("start geocoder for mapbox");
			    			    
			    mapbox_token = app_settings.map_provider.token; 
			    options = {
				    accessToken: mapbox_token ,	    
				    flyTo : false
				};
				
				if(!empty(app_settings.map_country)){
					geocomplete_default_country = app_settings.geocomplete_default_country;
					if(geocomplete_default_country=="yes"){
		               options.country = app_settings.map_country;
					}
	            }
	            				
				var geo_suggestion = new MapboxGeocoder(options);   
				
				document.getElementById('mapbox_s_goecoder').appendChild(geo_suggestion.onAdd(map));
				
				$(".mapbox_s_goecoder input").attr("name","search_address");
				$(".mapbox_s_goecoder input").attr("id","search_address");
				$(".mapbox_s_goecoder input").attr("placeholder", t("Search for your location") );	
				$(".mapbox_s_goecoder input").attr("autocomplete","off");
				
				geo_suggestion.on('result', function(results) {
									    
				    formatted_address = results.result.place_name;				    				   
				    popPage();					    				    
				    setTimeout(function() {
				    	
				    	current_page_id = onsenNavigator.topPage.id;	
				    	
					    $(".print_location_address").html( formatted_address );
				   	  	$(".recent_search_address").val( formatted_address );
				   	  	
					    geo_lat =   results.result.center[1];
						geo_lng =   results.result.center[0];		
						
						params = "lat="+ geo_lat + "&lng="+ geo_lng;
			            processDynamicAjax("mapboxgeocode",params , 'print_location_address', 'GET', 1); 
											
						map_setLangLngValue( geo_lat , geo_lng );
			            map_setCenter( geo_lat , geo_lng );
					    map_moveMarker( 1, geo_lat ,  geo_lng );					    
				    }, 50);
				    
				});
								
				//$(".suggestions").css( {"z-index":99999} );
								
			 break;
		}
	}		
};

locateLocation = function(){
	dump("=>locateLocation");
	if( isdebug() ){
		geoLocateWeb();
	} else {
		// device
		deviceAskLocation();
	}
};

geoLocateWeb = function(){
	
	showLoader(true);
	
	setTimeout(function() {		
 		showLoader(false); 		
    }, 10000); 
	
    gmaps_AskLocation();
	
};

gmaps_AskLocation = function(){

	dump("gmaps_AskLocation");
	
	GMaps.geolocate({
	  success: function(position) {	  	

	  	your_lat = position.coords.latitude;
	  	your_lng = position.coords.longitude;
	  	
	  	map_setLangLngValue( your_lat , your_lng );	  	  	    
	    
	    icon='';
	    if(app_settings = getAppSettings()){	    	
	    	if ((typeof  app_settings.icons !== "undefined") && ( app_settings.icons !== null)) {
	            icon = app_settings.icons.marker2
	    	}
	    }	    	    
	    
	    current_page_id = onsenNavigator.topPage.id;
	    dump("current_page_id=>"+ current_page_id);
	    
	    info = '';
	    if(current_page_id=="map_select_location"){
	    	info = t("Move the map to set the exact location");
	    }
	    
	    map_addMarker( 1, your_lat , your_lng , icon, info );	    
	    
	    setTimeout(function() {		
	    	dump('need to center');
	    	dump(map_bounds);
	    	dump(map_bounds.length);
	    	if(map_bounds.length>2){
	    		dump("map_center");
	    		map_center();
	    	} else {
	    		dump("map_setCenter");
	    		map_setCenter(  your_lat , your_lng );
	    	}		    
	    		    	
	    	switch(current_page_id){
	    		case "location":
	    			    		  	    		 
	    		  merchant_lat = $(".merchant_lat").val();
	    		  merchant_lng = $(".merchant_lng").val();
	    		  
	    		  map_addRoute(1,your_lat,your_lng,merchant_lat,merchant_lng);
	    		  	    			 	    		  					 
	    		break;
	    		
	    		case "map_select_location":
	    		case "address_form":
	    		case "address_book":
	    		  GeocodeLat( your_lat, your_lng );
	    		break;
	    		
	    	} /*end switch*/
	    	
	    }, 100); 	   
	    
	  },
	  error: function(error) {
	    showToast('Geolocation failed: '+error.message);
	    
	    icon='';
	    if(app_settings = getAppSettings()){
	       //icon = app_settings.icons.marker2
	    }	    	    	    
	    info = '';	    
	    map_addMarker( 1, 0 , 0 , icon, info );
	    map_center();
	  },
	  not_supported: function() {
	    showToast("Your browser does not support geolocation");
	  },
	  always: function() {	    
	    showLoader(false);
	  }
	});
	
};

deviceAskLocation = function(){
	
	try { 
		
		var request_priority;
		request_priority='REQUEST_PRIORITY_BALANCED_POWER_ACCURACY';		
		if(app_settings = getAppSettings()){		
			if ((typeof  app_settings.location_accuracy !== "undefined") && ( app_settings.location_accuracy !== null)) {
				if(!empty(app_settings.location_accuracy)){
				   request_priority  = app_settings.location_accuracy;
				}
			}
		}
		
		//alert(request_priority);
		//onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY);
		//cordova.plugins.locationAccuracy.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY		
		
		request_location_accuracy='';
		
		switch(request_priority)
		{
			case "REQUEST_PRIORITY_NO_POWER":	
			  request_location_accuracy = cordova.plugins.locationAccuracy.REQUEST_PRIORITY_NO_POWER;
			break;
			
			case "REQUEST_PRIORITY_LOW_POWER":			
			  request_location_accuracy = cordova.plugins.locationAccuracy.REQUEST_PRIORITY_LOW_POWER;
			break;
			
			case "REQUEST_PRIORITY_BALANCED_POWER_ACCURACY":			
			  request_location_accuracy = cordova.plugins.locationAccuracy.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY;
			break;
			
			case "REQUEST_PRIORITY_HIGH_ACCURACY":			
			  request_location_accuracy = cordova.plugins.locationAccuracy.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY;
			break;
			
			default:
			  request_location_accuracy = cordova.plugins.locationAccuracy.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY;
			break;
		}		
				
	
		switch(device.platform){
			 case "iOS":
			 /*IOS*/
			 
			 cordova.plugins.diagnostic.isLocationAuthorized(function(authorized){								
					if(authorized){			
						cordova.plugins.locationAccuracy.request(
			            onRequestSuccess, onRequestFailure, request_location_accuracy );
					} else {
					 	cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
						    switch(status){
						        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
						            showToast( t("Permission not requested") );						           
						            break;
						        case cordova.plugins.diagnostic.permissionStatus.DENIED:		            
						            showToast( t("Permission denied") );						            
						            break;
						        case cordova.plugins.diagnostic.permissionStatus.GRANTED:						            	 		           						            
						            cordova.plugins.locationAccuracy.request(
					                onRequestSuccess, onRequestFailure, request_location_accuracy );
						                       
						            break;
						        case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:						            						            
						            cordova.plugins.locationAccuracy.request(
					                onRequestSuccess, onRequestFailure, request_location_accuracy );
					                
						            break;
						    }
						}, function(error){
						    showToast(error);						    
						}, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS);				
					}
				}, function(error){
				    showToast( t("The following error occurred") + ": "+  error );
				});  
			 
			 break;
			 
			 default:
			 /*ANDROID*/
			 
				 cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
				    switch(status){
				        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
				            showToast( t("Permission not requested") );			            
				            break;
				        case cordova.plugins.diagnostic.permissionStatus.GRANTED:			            
				            cordova.plugins.locationAccuracy.request(
			                onRequestSuccess, onRequestFailure, request_location_accuracy );
				            
				            break;
				        case cordova.plugins.diagnostic.permissionStatus.DENIED:
				            showToast( t("Permission denied") );			            
				            break;
				        case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
				            showToast( t("Permission permanently denied") );			            
				            break;
				    }
				}, function(error){
				    showToast(error);			    
				});	
			 
			break;
		}
	
	} catch(err) {
       showToast(err.message);
    } 
};

onRequestFailure = function(error){
	showToast( error.message );	
	setDefaultMarker();
};

setDefaultMarker = function(){	
	if ( lat_res = getCurrentLocation()){
		icon='';		
		current_page_id = onsenNavigator.topPage.id;
		//alert(current_page_id);
		switch(current_page_id){
			case "address_form":
			case "address_book":
						
			    if(app_settings = getAppSettings()){
                   icon = app_settings.icons.marker2
                }	  	
                
                map_setLangLngValue( lat_res.lat , lat_res.lng );
	            map_addMarker( 1, lat_res.lat , lat_res.lng , icon, '' );		
	            
	            setTimeout(function() {		            
	               map_setCenter(  lat_res.lat , lat_res.lng );	    
	            }, 100); 	
	            
			break;		
		}
	}
};

onRequestSuccess = function(){	
	try {
		navigator.geolocation.getCurrentPosition(geolocationSuccess,geolocationError, { 
			timeout: 10000 , 
			enableHighAccuracy: true , 
			maximumAge:Infinity 
		});	
	} catch(err) {		
		dump(err);	    
	}  
};

geolocationError = function(error){
	showToast( error.message );
};

geolocationSuccess = function(position){
	
	try {
			
	your_lat = position.coords.latitude;
	your_lng = position.coords.longitude;
	
	map_setLangLngValue( your_lat , your_lng );	
	
	icon='';
    if(app_settings = getAppSettings()){
       if ((typeof  app_settings.icons !== "undefined") && ( app_settings.icons !== null)) {	
           icon = app_settings.icons.marker2
       }
    }	  
    
    current_page_id = onsenNavigator.topPage.id;
	dump("current_page_id=>"+ current_page_id);
	
	info = '';
    if(current_page_id=="map_select_location"){
    	info = t("Move the map to set the exact location");
    }
	
    map_addMarker( 1, your_lat , your_lng , icon, info );	    
    
    setTimeout(function() {		
    	dump('need to center');
    	dump(map_bounds);
    	dump(map_bounds.length);
    	if(map_bounds.length>2){
    		dump("map_center");
    		map_center();
    	} else {
    		dump("map_setCenter");
    		map_setCenter(  your_lat , your_lng );
    	}		    
    		    	
    	switch(current_page_id){
    		case "location":
    			    		  	    		 
    		  merchant_lat = $(".merchant_lat").val();
    		  merchant_lng = $(".merchant_lng").val();
    		  
    		  map_addRoute(1,your_lat,your_lng,merchant_lat,merchant_lng);
    		  	    			 	    		  					 
    		break;
    		
    		case "map_select_location":
    		case "address_form":
    		case "address_book":
    		  GeocodeLat( your_lat, your_lng );
    		break;
    		
    	} /*end switch*/
    	
    }, 100); 	   
    
    } catch(err) {		
		dump(err);	    
	}  
};

map_addRoute = function(index,your_lat,your_lng,merchant_lat,merchant_lng, set_icon ){
	if(app_settings = getAppSettings()){
		switch(app_settings.map_provider.provider){
			case "google.maps":
			  map.setZoom(10);
	          map.panTo( map_marker[index].position );	  
	          
	          map.travelRoute({
			  origin: [your_lat,your_lng],
			  destination: [merchant_lat,merchant_lng],
			  travelMode: 'driving',		  
			  step: function(e){
				  	$('#map_instructions').append('<li>'+e.instructions+'</li>');
		            $('#map_instructions li:eq('+e.step_number+')').delay(350*e.step_number).fadeIn(200, function(){
		              map.setCenter(e.end_location.lat(), e.end_location.lng());
		              map.drawPolyline({
		                path: e.path,
		                strokeColor: '#131540',
		                strokeOpacity: 0.6,
		                strokeWeight: 6
		              });
		            });
				  }				  
			  });	    	
	            		  
			break
			
			case "mapbox":
			  dump('map_addRoute mapbox');
			  
			  mapbox_token = app_settings.map_provider.token; 
		 		 
			  icon1 = mapboxCreateIcon( getDefaultIcon() );			  
			  icon2 = mapboxCreateIcon( app_settings.icons.marker2 );			  
			   
			  var control = L.Routing.control({	
				waypoints: [
					    L.latLng(your_lat, your_lng),
					    L.latLng(merchant_lat, merchant_lng)
					],
				    router: L.Routing.mapbox(mapbox_token),
				    createMarker: function(i, wp, nWps) {					    
					    if(i==0){
					    	 if(empty(set_icon)){
					    	    return L.marker(wp.latLng, {icon: icon1 });
					    	 }
					    } else {
					    	 if(empty(set_icon)){
					    	    return L.marker(wp.latLng, {icon: icon2 });
					    	 }
					    }
					} 
			   });
			   
			  var routeBlock = control.onAdd(map);  
			  
			  latlng = [your_lat,your_lng];
			  map_bounds.push( latlng );			 
			  map_center();
			  
			break
		}
	} 
};

map_setCenter = function(lat, lng){
	
	dump("map_setCenter");
			
	if(app_settings = getAppSettings()){
		switch(app_settings.map_provider.provider){
			case "google.maps":
			   default_zoom = 15;
			   current_map_zoom = map.getZoom();			   
			   
			   if(current_map_zoom!=default_zoom){
			   	  default_zoom = current_map_zoom;
			   }
			   
			   dump("zoom=>"+ default_zoom);
			   
			   map.setCenter(lat, lng);	
			   map.setZoom(default_zoom);
			 break;
			 
			 case "mapbox":
			   default_zoom = 13;
			   current_map_zoom = map.getZoom();			   
			   if(current_map_zoom==5){
			   	  current_map_zoom = default_zoom;
			   }
			   if(current_map_zoom!=default_zoom){
			   	  default_zoom = current_map_zoom;
			   }			
			   dump("zoom=>"+ default_zoom);			   
			   map.setView([lat, lng], default_zoom);
			 break;
		}
	}		
};

map_center = function(){
	if(app_settings = getAppSettings()){
		switch(app_settings.map_provider.provider){
			case "google.maps":  
			  map.fitLatLngBounds(map_bounds);
			break;
			
			case "mapbox":
			  map.fitBounds(map_bounds, {padding: [30, 30]}); 
			break;
		}
	}
};

map_addMarker = function(index, lat, lng, icon,  info_html){
			
	if(app_settings = getAppSettings()){
				
		switch(app_settings.map_provider.provider){
			case "google.maps":
			  
			    var options = {
			       lat: lat,
				   lng: lng,
			    };
			    
			    if(!empty(icon)){
			    	options.icon = {
			    		'url':icon
			    	};
			    }
			    
			    //map.removeMarkers(); 
			    
			    if(!empty(map_marker[index])){			
			    	dump('move');
			    	map_moveMarker( index, lat, lng );
			    } else {			    	
			    	dump('add');
			        map_marker[index] = map.addMarker( options );
			    }
			    
			    var latlng = new google.maps.LatLng( lat , lng );
	            map_bounds.push(latlng);
			    
			    if(!empty(info_html)){
			    	/*infoWindow = new google.maps.InfoWindow({
						    content: info_html
					});	
			    	infoWindow.open(map, map_marker[index] );*/
			    	
			    	 current_page_id = onsenNavigator.topPage.id;
		             if(current_page_id=="restaurant_list_map"){
		             	infoWindow = new SnazzyInfoWindow({
					        marker: map_marker[index] ,
					        placement: 'top',
					        offset: {
					            top: '-50px'
					        },
					        content: info_html ,
					        showCloseButton: false,
					        closeOnMapClick: false,
					        padding: '6px 5px',					        
					        border: true,
					        borderRadius: '5px',
					        shadow: false,					        
					        fontSize: '12px'
					    });
		             } else {			    	
				    	 infoWindow = new SnazzyInfoWindow({
					        marker: map_marker[index] ,
					        placement: 'top',
					        offset: {
					            top: '-50px'
					        },
					        content: info_html ,
					        showCloseButton: false,
					        closeOnMapClick: false,
					        padding: '12px 8px',
					        backgroundColor: 'rgba(0, 0, 0, 0.7)',
					        border: false,
					        borderRadius: '6px',
					        shadow: false,
					        fontColor: '#fff',
					        fontSize: '12px'
					    });
		            }
				    infoWindow.open();
			    	
			    }				
			    			
			break;
			
			case "mapbox":
			  dump("add marker mapbox");
			  options = {};
			  if(!empty(icon)){
			  	 options.icon = mapboxCreateIcon(icon);
			  }
			  
			  mapbox_drag_map = $(".mapbox_drag_map").val();
			  if(mapbox_drag_map=="true"){
			  	  options.draggable = true;
			  }
			  
			  dump("mapbox options");
			  dump(options);		
			  
			  if(!empty(map_marker[index])){	
			  	 dump('move');
			  	 map_moveMarker( index, lat, lng );
			  } else {
			  	 dump('add');
			  	 map_marker[index] = L.marker([ lat , lng ], options ).addTo(map);  
			  }	  			  
			  			  
			  if(!empty(info_html)){
			  	  map_marker[index].bindPopup( info_html , {autoClose:false}).openPopup();
			  }
			  
			  mapbox_drag_end = $(".mapbox_drag_end").val();
			  			  
			  if(mapbox_drag_end =="true" ){
			  	
			  	 map_marker[index].on('drag', function (e) {
			  	 	
			  	 	 current_page_id = onsenNavigator.topPage.id;
			  	     dump("current_page_id=>"+ current_page_id);
			  	      switch (current_page_id){
			  	      	 case "map_select_location":
			  	      	 case "address_form":
			  	      	 case "address_book":
			  	      	    if (app_settings.map_auto_identity_location==1){
			  	      	    	identifyLocationLoader(true);
			  	      	    } else {
			  	      	    	$(".identify_location_wrap").hide();
			  	      	    }
			  	      	 break;
			  	      }
			  	 	 
			  	 });			  	 
			  	
			  	 map_marker[index].on('dragend', function (e) {
			  	 	 new_lat = map_marker[index].getLatLng().lat;
			  	 	 new_lng = map_marker[index].getLatLng().lng;
			  	 	 dump("new_lat : "+ new_lat);
	                 dump("new_lng : "+ new_lng);
	                 map_setLangLngValue( new_lat , new_lng );	                 
	                 
	                 current_page_id = onsenNavigator.topPage.id;
	                 dump("xcurrent_page_id=>"+ current_page_id);
	                 switch (current_page_id){
	                 	case "map":
	                 	    $("#"+ current_page_id + " .map_lat").val( new_lat );
						    $("#"+ current_page_id + " .map_lng").val( new_lng );
	                 	 break;
	                 	 
	                 	case "map_select_location":
	                 	case "address_form":
	                 	case "address_book":	                 	   
	                 	   if ( app_settings.map_auto_identity_location==1){
	                 	       GeocodeLat( new_lat , new_lng  );
	                 	   } else {
	                 	   	   $(".identify_location_wrap").show();
	                 	   	   DragLocationLoader(true);
	                 	   }
	                 	break;
	                 }
	                 
			  	 });
			  	 
			  } /*end if drag*/
			  
			  latlng = [lat,lng];
			  map_bounds.push( latlng );			  			 
			  
			break;
		}				
	}
};

map_moveMarker = function(index, lat , lng){
	
	try {
	
		if(app_settings = getAppSettings()){
			
			switch(app_settings.map_provider.provider){
				case "google.maps":			   
				   map_marker[index].setPosition( new google.maps.LatLng( lat , lng ) );			   
				break;
				
				case "mapbox":
				   map_marker[index].setLatLng([lat, lng]).update(); 
				break;
			}				
		}
	
	} catch(err) {		
		dump(err);	    
	}  
};

map_setLangLngValue = function(lat, lng){
	$(".lat").val( lat );
	$(".lng").val( lng );	  		    
};


viewExternalDirection = function(){
	merchant_lat = $(".merchant_lat").val();
    merchant_lng = $(".merchant_lng").val();         
    try {
		    	
        launchnavigator.isAppAvailable(launchnavigator.APP.GOOGLE_MAPS, function(isAvailable){
		    var app;
		    if(isAvailable){
		        //app = launchnavigator.APP.GOOGLE_MAPS;
		        app = launchnavigator.APP.USER_SELECT;
		    }else{		        
		        app = launchnavigator.APP.USER_SELECT;
		    }
		    launchnavigator.navigate( [merchant_lat, merchant_lng] , {
		        app: app
		    });
		});
	
	} catch(err) {		
		showToast(err.message);	    
	}  
};

GeocodeLat = function(lat, lng){
	if(empty(lat) || empty(lng)){
		return;
	}	
	dump("GeocodeLat");
	if(app_settings = getAppSettings()){
		switch(app_settings.map_provider.provider){
			case "google.maps":
			   var geocoder = new google.maps.Geocoder;
			   var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
			   geocoder.geocode({'location': latlng}, function(results, status) {
			   	  dump("GeocodeLat response");
			   	  dump(status);
			   	  
			   	  identifyLocationLoader(false);
			   	  
			   	  if (!app_settings.map_auto_identity_location){			   	  	  
			   	  	  $(".identify_location_wrap").hide();
			   	  }
			   	  
			   	  if (status === 'OK') {		
			   	  	  if (results[0]) {		
			   	  	  		   	  	  	 			   	  	  	 
			   	  	  	 			   	  	  	 
			   	  	  	 $resp = parseAdress(results);
			   	  	  	 dump("parseAdress=> GeocodeLat");
			   	  	  	 dump($resp);					   	  	  	

			   	  	  	 current_page_id = onsenNavigator.topPage.id;	
			   	  	  	 dump("current_page_id=>"+current_page_id);
			   	  	  	 			   	  	  	 		   	  	  	
			   	  	  	 if (current_page_id=="map_select_location"){
				   	  	  	 $(".print_location_address").html( results[0].formatted_address );
				   	  	  	 $(".recent_search_address").val( results[0].formatted_address );
			   	  	  	 } 
			   	  	  	 
			   	  	  	 $("#"+current_page_id +" .street").val( $resp.street );
			   	  	  	 $("#"+current_page_id +" .city").val( $resp.city );
			   	  	  	 $("#"+current_page_id +" .state").val( $resp.state );
			   	  	  	 $("#"+current_page_id +" .zipcode").val( $resp.zipcode );
			   	  	  	 $("#"+current_page_id +" .country").val( $resp.country );
			   	  	  	 
			   	  	  } else {
			   	  	  	 showToast( t("No results found") );
			   	  	  }
			   	  } else {
			   	  	  showToast( t("Geocoder failed due to:") + status  );
			   	  }
			   });
			    	
			 break;
			 
			 case "mapbox":			   
			   params = "lat="+ lat + "&lng="+ lng;
			   //processDynamicAjax("mapboxgeocode",params , 'print_location_address', 'GET', 1);
			 break;
		}
	}		
};


iniTrackMap = function(id, data){	
	map_bounds = [];
	map_marker = [];
	
	map_res = initMap(id, true, false);
	if(map_res){
		if(!empty(data.driver_lat)){
		   map_addMarker(1, data.driver_lat, data.driver_lng , data.map_icons.driver  );
		}
		
		if(!empty(data.task_lat)){		   
		   map_addMarker(2, data.task_lat, data.task_lng , data.map_icons.delivery );
		}
		
		if(!empty(data.dropoff_lat)){
		   map_addMarker(3, data.dropoff_lat, data.dropoff_lng , data.map_icons.dropoff );		  		   		   
		}		
											
		setTimeout(function() {		
		  if(!empty(data.driver_lat)){
		     //map_setCenter(data.driver_lat, data.driver_lng);		    
		  } else {
	   	     //map_center();
		  }
		  		  		  
	  	  if(app_settings = getAppSettings()){
	  	  	 switch(app_settings.map_provider.provider){
	  	  	 	case "google.maps":
	  	  	 	   if(!empty(data.dropoff_lat)){
	  	  	 	   	  map_addRoute(1, data.driver_lat, data.driver_lng, data.dropoff_lat, data.dropoff_lng );
	  	  	 	   }
	  	  	 	   setTimeout(function() {	
	  	  	 	      map_addRoute(2, data.dropoff_lat, data.dropoff_lng, data.task_lat, data.task_lng );
	  	  	 	   }, 1000); 
	  	  	 	break;
	  	  	 	
	  	  	 	case "mapbox":
	  	  	 	   if(!empty(data.dropoff_lat)){
	  	  	 	   	  map_addRoute(1, data.driver_lat, data.driver_lng, data.dropoff_lat, data.dropoff_lng , "false" );
	  	  	 	   }
	  	  	 	   setTimeout(function() {	
	  	  	 	      map_addRoute(2, data.dropoff_lat, data.dropoff_lng, data.task_lat, data.task_lng , "false");
	  	  	 	   }, 1000); 
	  	  	 	break;
	  	  	 }
	  	  }		  
		  
	    }, 100); 
	}
};


/*MAPBOX FUNCTIONS*/

mapboxCreateIcon = function(icon_url){
	icon = L.icon({
		iconUrl: icon_url
	});
	return icon;
};


parseAdress = function(results){
	
	geocoded_address=[];	
	
	if(results.length<=0){
		return false;
	}
	
	var street='',city='',state='',zipcode='', kountry='',formatted_address='';
	
	formatted_address = results[0].formatted_address;
	
	$.each(results[0].address_components, function(reskey, resval){			   	  	  	 	
		$.each(resval.types, function(types_key, types_val){			   	  	  	 		
			if (types_val=="street_number" || types_val=="route" || types_val=="street_address"  ){
				if(!empty(street)){
					street+= " " + resval.long_name;  
				} else {
					street+=resval.long_name;
				}			   	  	  	 			
			}
			
			if (types_val=="locality" || types_val=="administrative_area_level_3" ){
				if(!empty(city)){
					city+= " " + resval.long_name;  
				} else {
					city+=resval.long_name;
				}			   	  	  	 			
			}
			
			if (types_val=="administrative_area_level_1" ){
				if(!empty(state)){
					state+= " " + resval.long_name;  
				} else {
					state+=resval.long_name;
				}			   	  	  	 			
			}
			
			if (types_val=="postal_code" ){
				if(!empty(zipcode)){
					zipcode+= " " + resval.long_name;  
				} else {
					zipcode+=resval.long_name;
				}			   	  	  	 			
			}
			
			if (types_val=="country" ){
				if(!empty(kountry)){
					kountry+= " " + resval.long_name;  
				} else {
					kountry+=resval.long_name;
				}			   	  	  	 			
			}
			
		});			   	  	  	 	
	 });		
	 
	 geocoded_address = {
	 	'formatted_address': formatted_address,
		'street' : street,
		'city' : city,
		'state' : state,
		'zipcode' : zipcode,
		'country' : kountry,
		'lat' : results[0].geometry.location.lat(),
		'lng' : results[0].geometry.location.lng(),
	 };	  	 
	 return geocoded_address;
};

getGeocodeAddress = function(){		
	try {
	    $geocoded = getStorage("geocoded_address");
	    //dump2($geocoded);
	    if(!empty($geocoded)){
	    	$geocoded = JSON.parse($geocoded);
	    	return $geocoded;
	    }
        return false;
    } catch(err) {
       dump(err.message);
       return false;
   } 
};

identifyLocationLoader = function(){
	
};

setMapLocationFields = function(lat, lng){
	$(".map_lat").val( lat );
	$(".map_lng").val( lng );
};