var BT_device;
var BT_service_id;
var BT_characteristic_id;
var BT_connect_status;
var BT_connect_data;
var BT_err_msg;
var BT_tpl;
var BT_cron;
var BT_print_done;
var BT_command_count;
var BT_connect_count;
var BT_scan_timeout;
var BT_device_connected = [];
var BT_print_timeout;
var BT_printer_width;
var BT_char_set;
var BT_bt_check_count;
var BT_has_perfom_scan = false;

const PRINTING_TYPE = 2;

var BT_test_data = '{"name":"BlueTooth Printer","id":"88:C2:55:A3:9F:E0","advertising":{},"rssi":-44,"services":["1800","1801","49535343-fe7d-4ae5-8fa9-9fafd205e455","18f0","e7810a71-73ae-499d-8c15-faa9aef0c3f2","180a"],"characteristics":[{"service":"1800","characteristic":"2a00","properties":["Read"]},{"service":"1800","characteristic":"2a01","properties":["Read"]},{"service":"1801","characteristic":"2a05","properties":["Read"]},{"service":"49535343-fe7d-4ae5-8fa9-9fafd205e455","characteristic":"49535343-1e4d-4bd9-ba61-23c647249616","properties":["Notify"],"descriptors":[{"uuid":"2902"}]},{"service":"49535343-fe7d-4ae5-8fa9-9fafd205e455","characteristic":"49535343-8841-43f4-a8d4-ecbe34729bb3","properties":["WriteWithoutResponse","Write"]},{"service":"18f0","characteristic":"2af0","properties":["Notify","Indicate"],"descriptors":[{"uuid":"2902"}]},{"service":"18f0","characteristic":"2af1","properties":["WriteWithoutResponse","Write"]},{"service":"e7810a71-73ae-499d-8c15-faa9aef0c3f2","characteristic":"bef8d6c9-9c21-4c9e-b632-bd58c1009f9f","properties":["WriteWithoutResponse","Write","Notify","Indicate"],"descriptors":[{"uuid":"2902"}]},{"service":"180a","characteristic":"2a25","properties":["Read"]},{"service":"180a","characteristic":"2a28","properties":["Read"]},{"service":"180a","characteristic":"2a27","properties":["Read"]},{"service":"180a","characteristic":"2a29","properties":["Read"]},{"service":"180a","characteristic":"2a24","properties":["Read"]}]}';

dump3 = function(data) {
	showToast(JSON.stringify(data));	
};

function str_replace($f, $r, $s){
    return $s.replace(new RegExp("(" + (typeof($f) == "string" ? $f.replace(/[.?*+^$[\]\\(){}|-]/g, "\\") : $f.map(function(i){return i.replace(/[.?*+^$[\]\\(){}|-]/g, "\\")}).join("|")) + ")", "g"), typeof($r) == "string" ? $r : typeof($f) == "string" ? $r[0] : function(i){ return $r[$f.indexOf(i)]});
}

function stringToBytes(string) {
   var array = new Uint8Array(string.length);
   for (var i = 0, l = string.length; i < l; i++) {
       array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

checkLocationPermission = function(){		
		
	 if( isdebug() ){		
		return ;
	 }	 
	 
	 ons.notification.confirm( t("Improve location accuracy when finding nearby bluetooth printer"),{
			title: t("Allow karenderia to access this device location?") ,		
			id : "dialog_order_options",
			modifier: " ",			
			buttonLabels : [ t("Yes") , t("Cancel") ]
		}).then(function(input) {				
			if (input==0){
				
				 cordova.plugins.diagnostic.isLocationAuthorized(function(authorized){	 		
			 		if(authorized){
			 		   // 
			 		} else { 			 			
			 			 cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
						    switch(status){
						        case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
						            showToast( t("Permission not requested") );			            
						            break;
						        case cordova.plugins.diagnostic.permissionStatus.DENIED:			            
						            showToast( t("Printer needs location enabled"), 'danger' );
						            /*setTimeout(function(){
						            	checkLocationPermission();
						            }, 2000); */
						            break;
						        case cordova.plugins.diagnostic.permissionStatus.GRANTED:
						            //
						            break;
						        case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
						            //
						            break;
						    }
						}, function(error){
						    showToast(error ,'danger');
						}, cordova.plugins.diagnostic.locationAuthorizationMode.ALWAYS); 				
			 		}	 		
			 	}, function(error){
				   showToast( t("The following error occurred:")  + " " + error ,'danger');
				});
				
				
			} /*end condition*/
	   }); 
	   /*end confirm*/	 
	 	 	 	
};

checkBluetooth = function( $actions ){
	
	dump("=>>checkBluetooth");
	
	if( isdebug() ){	
		BT_actions( $actions ) ;	
		return ;
	}
		
	
	/*IOS*/
	if(cordova.platformId == "ios"){
				
		cordova.plugins.diagnostic.getBluetoothState(function(state){			
			if(state === cordova.plugins.diagnostic.bluetoothState.POWERED_ON){			
				
				//showToast("BT_has_perfom_scan=>"+ BT_has_perfom_scan);
				if(BT_has_perfom_scan){					
					BT_actions( $actions ) ;
				} else {
					
					$current_page_id = getCurrentPage();
										
					if($current_page_id=="printer_add"){
					   BT_actions( $actions ) ;	
					} else {
						
						showLoader(true);
						
						ble.startScan([], function(device) {						
							showLoader(false);
							BT_has_perfom_scan = true;
							
							//showToast("startScan complete"); 
							
							setTimeout(function(){										
				    		    BT_actions( $actions ) ;
				    		 }, 1*500 );
								
						}, function(err){						
							showLoader(false);
							showToast( err , 'danger' );
						});	
						
						setTimeout(function(){
						    ble.stopScan(						    
						      function() {    
						      	 showLoader(false);						      	 
						      	 if(!BT_has_perfom_scan){
						      	 	checkBluetooth( $actions );
						      	 }
						      },
						      function() { 
						      	 showLoader(false);						      	 
						      }
						    );
						}, 18*1000 );
						
					}
				}									    	
			} else {			
				//showToast("state=>" + state);
				if(!BT_has_perform_btscan){
					BT_has_perform_btscan = true;					
					setTimeout(function(){										
				    	checkBluetooth( $actions );
				    }, 1*500 );
				} else {					
					showToast( t("Please enabled your bluetooth in your phone settings"), 'danger' );
				}
			}
		}, function(error){
			showToast( t("Please enabled your bluetooth in your phone settings") , 'danger' );
		});			
				
	} else {
	/*ANDROID*/
		cordova.plugins.diagnostic.hasBluetoothSupport(function(available){
		    if(available){
		    	cordova.plugins.diagnostic.isBluetoothEnabled(function(enabled){
				    if(enabled){
				    	// bluetooth is already enabled				    	
				    	BT_actions( $actions ) ;
				    } else {
				    	ble.enable(function(){
				    		 //dump3("Bluetooth enabled");
				    		 setTimeout(function(){			
				    		    BT_actions( $actions ) ;
				    		 }, 1*500 );
				    	}, function(){
				    		checkBluetooth('');
				    	});
				    }
				}, function(error){
				    showToast( t("The following error occurred:")  + " " + error , 'danger'  );
				});
		    } else {
		    	showToast( t("Bluetooth not available on this device") , 'danger' );
		    }
		}, function(error){	    
		    showToast( t("The following error occurred:")  + " " + error  , 'danger' );
		});
	
	}
};

BT_actions = function( $run_funtions ){
	if( !empty($run_funtions) ){	 
	 	switch ($run_funtions){
	 		case "BT_init_print":
	 		  setTimeout(function(){	
	 		     BT_init_print();
	 		  }, 1*500 );
	 		break;
	 		
	 		case "BT_startScan":
	 		   setTimeout(function(){		 		   	
	 		     BT_startScan();
	 		  }, 1*500 );
	 		break;
	 	}
	 }
};


BT_startScan = function(){
	
	 
	/*DEBUG*/
	if( isdebug() ){				
		BT_scanLoader(true);	
		setTimeout(function(){
			
			BT_scan_timeout = setTimeout(function(){
				BT_stop_scan(); 
			}, 6*1000 );
			
			ons.modifier.remove(document.getElementById('printer_bt_list'), 'dialog_bt');
			ons.modifier.add(document.getElementById('printer_bt_list'), 'dialog_medium');
			
			$test_data = {"id":"94-ef-21-2b-40-3f","name":"Bluetooth test"};			
			BT_add_device_list($test_data);						
			
			$test_data = {"id":"94-ef-21-2b-40-ef","name":"MPT"};			
			BT_add_device_list($test_data);						
			
		}, 2000); 		
		return ;
	}
	/*END DEBUG*/
		
			
	try {


		BT_scanLoader(true);
			
		if(BT_device_connected.length>0){
			$.each( BT_device_connected  , function( $key, $val ) {				
				BT_add_device_list( $val ); 
			});
		}	
		
		BT_has_perfom_scan = true;	
					
		ble.startScan([], function(device) {
			
			ons.modifier.remove(document.getElementById('printer_bt_list'), 'dialog_bt');
			ons.modifier.add(document.getElementById('printer_bt_list'), 'dialog_medium');
			
		    BT_add_device_list(device);   		    
		}, function(err){						
			BT_stop_scan2();		
			showToast( err , 'danger' );
		});
				
		BT_scan_timeout = setTimeout(function(){
		   BT_stop_scan(); 
		}, 10*1000 );
				
	} catch(err) {      
	  BT_scanLoader(false);	
      showToast( t("The following error occurred:")  + " " + err.message ,'danger' );
   } 
};

BT_scanLoader = function(enabled){
	try {
		if(enabled) {
			ons.modifier.remove(document.getElementById('printer_bt_list'), 'dialog_medium');
			ons.modifier.add(document.getElementById('printer_bt_list'), 'dialog_bt');
			$("#printer_bt_list ons-progress-circular" ).show();	
			
			current_page_id = getCurrentPage();
			$("#printer_bt_list" + " ons-list" ).html('');		
		} else {
			$("#printer_bt_list ons-progress-circular" ).hide();
			ons.modifier.remove(document.getElementById('printer_bt_list'), 'dialog_bt');
			ons.modifier.add(document.getElementById('printer_bt_list'), 'dialog_medium');
		}
	} catch(err) {
		//err.message
	}
};

BT_add_device_list = function(data){
	dump(data);
	current_page_id = getCurrentPage(); html ='';	var row='';	
	var object = $("#printer_bt_list ons-list" );
	var list = object[0];	
		
	if ((typeof  data.name !== "undefined") && ( data.name !== null)) {
		
		$class_name = str_replace(" ","_",data.name);
		
		$found_device_on_list = object.find("." + $class_name ).length;
		dump("$found_device_on_list=>" + $found_device_on_list);
		
		if($found_device_on_list<=0){
		html+='<ons-list-item tappable onclick="BT_set_device('+ q(data.name) + "," +  q(data.id) +  ');" class="'+ $class_name +'"  >';
	       html+='<div class="center">';
		    html+='<span class="list-item__title">'+ data.name +'</span>';
		    html+='<span class="list-item__subtitle">'+ data.id +'</span>';
		  html+='</div>';
	    html+='</ons-list-item>';	 
	    
	    row = ons.createElement(html);
		list.appendChild(row);
		html=''; 
	    
		}   
	}
		
};

BT_set_device = function(bt_name, mac_address){	
			
	BT_set_connected_device(bt_name,mac_address);	
	
	BT_connect_data = false;	
	showLoader(true); 
	
	BT_connect( mac_address );
	
	BT_connect_count = 0;
		
	BT_connect_status = setInterval(function(){ 	
		dump("BT_CONNECT_DATA=>");
		dump(BT_connect_data);
		
		BT_connect_count++;
		
		//dump3("BT_connect_count=>" + BT_connect_count);
				
		if(BT_connect_data){							   			   
				
		   showLoader(false); 		   
		   clearInterval(BT_connect_status);
			
		   $result = BT_connect_data;
	   	   BT_connect_data = false;
	   	  
	   	   CloseDialog('printer_bt_list');
		   $current_pageid  = getCurrentPage();
		   $("#"+ $current_pageid  + " .mac_address" ).val( mac_address );
		   $("#"+ $current_pageid  + " .bluetooth_printer_name" ).val( bt_name );
		   $("#"+ $current_pageid  + " .data1" ).val( $result.service );
		   $("#"+ $current_pageid  + " .data2" ).val( $result.characteristic ); 	
		  
		   $printer_name =  $("#"+ $current_pageid  + " .printer_name" ).val(); 
		   if(empty($printer_name)){
		   	  $("#"+ $current_pageid  + " .printer_name" ).val( bt_name ); 
		   }
		   		
		}
	}, 1*1000 );
		
};

BT_set_connected_device = function(bt_name, mac_address){
	
	$found_device = false;
	if(BT_device_connected.length>0){		
		$.each( BT_device_connected  , function( $key, $val ) {			
			if( $val.id == mac_address ){
				$found_device = true;
			}
		});
	} 

	if(!$found_device){
	   BT_device_connected.push({"name": bt_name ,"id": mac_address });	
	}
};

BT_connect = function(mac_address){	

	if( isdebug() ){				
		$test_data = JSON.parse(BT_test_data);		
        BT_connect_data = BT_parse_device($test_data);	
		return BT_connect_data;
	}
	
	ble.isConnected(mac_address , function(){		
		ble.disconnect( mac_address , function(){			
			setTimeout(function(){	
			   BT_connects( mac_address );
			}, 1*1000 );
		},  function(){			
			setTimeout(function(){	
			   BT_connects( mac_address );
			}, 1*1000 );
		});
	}, function(){		
		setTimeout(function(){	
		   BT_connects( mac_address );
		}, 1*1000 );
	});	
		
};

BT_connects = function( mac_address ){
	
	ble.connect( mac_address , function(data){		
		BT_connect_data = BT_parse_device(data);	
		return BT_connect_data;	
		
	},  function(err){		
		
		try {
			showLoader(false); 
			showDialog(false,'printer_loader');		
		} catch(err) {
		   //
	    }
		
		if ((typeof  err.errorMessage !== "undefined") && ( err.errorMessage !== null)) {			
			clearInterval(BT_connect_status);
			showToast( t(err.errorMessage), 'danger' );								 			
		} else {			
			clearInterval(BT_connect_status);
			showToast( t("The following error occurred:")  + " " + JSON.stringify(err) ,'danger' );
		}
	});	
	
};

BT_parse_device = function(data){
	//dump(data);
	$service = ''; $characteristic = '';
	if ((typeof  data.characteristics !== "undefined") && ( data.characteristics !== null)) {
		$found_key = 0;
		$.each( data.characteristics  , function( key, val ) {			
			$found = $.inArray("Write",val.properties);
			if($found>=0){				
				if ((typeof  data.characteristics[key].service !== "undefined") && ( data.characteristics[key].service !== null)) {	
					//if(data.characteristics[key].service.length<=20){					   
					   dump("FOUND=>"+key);			
					   $service = data.characteristics[key].service;
					   $characteristic = data.characteristics[key].characteristic;
					//}
				}
			}			
		});
		
	   return {
	   	 "service" : $service,
	   	 "characteristic" : $characteristic
	   };
	} else {
		clearInterval(BT_connect_status);
		showToast( t("The following error occurred:")  + " " + JSON.stringify(data) ,'danger' );				
	}
}

BT_close_dialog_device_list = function(){
	dump("BT_close_dialog_device_list");
	CloseDialog('printer_bt_list');	
	//clearTimeout(BT_connect_status);
	
	if ((typeof  BT_connect_status !== "undefined") && ( BT_connect_status !== null)) {
	   clearInterval(BT_connect_status);
	}
		
	if( !isdebug() ){
	    BT_stop_scan();
	}
};


BT_stop_scan = function(){
	
	try {
		
	
		BT_stop_scan2();
		
		ble.stopScan(
	      function() {    
	      	 //dump3("stopScan complete");  
	      },
	      function() { 
	      	 //dump3("stopScan failed");  
	      }
	    );
    
    } catch(err) {
		dump(err.message);
	}
};

BT_stop_scan2 = function(){
	BT_scanLoader(false);  	    	
  	if ((typeof  BT_scan_timeout !== "undefined") && ( BT_scan_timeout !== null)) {
	      clearTimeout(BT_scan_timeout);
	}		
};


BT_line = function(lenght){
	$line = '';
	lenght = parseInt(lenght);	
	if( isNaN(lenght)){
		lenght = 40;
	}
	if(lenght<=0){
		lenght = 40;
	}	
	for (i = 0; i < lenght; i++) {
	  $line+="-";
	} 
	return $line;
};

BT_test_template = function() {
	var data = [];	
	
	var $_line = BT_line(42);	
	
	data = [	   
	   //{"type":"command","value":HW_INIT},
	  {"type":"command","value":TXT_BOLD_ON}, 
	  {"type":"command","value":TXT_ALIGN_RT},
	  {"type":"text","value":"Test receipt"},
	  {"type":"command","value":TXT_BOLD_OFF},	  
	  {"type":"command","value":CTL_LF},
	  {"type":"command","value":CTL_LF},	 
	  {"type":"command","value":TXT_ALIGN_LT},
	  {"type":"command","value":TXT_FONT_B},
	  {"type":"text","value": $_line },
	  {"type":"command","value":CTL_LF},
	  //{"type":"command","value":TXT_NORMAL},
	  {"type":"text","value": "Cheese burger" },
	  {"type":"command","value":CTL_LF},
	  {"type":"text","value": "1 x 2.00" },
	  {"type":"command","value":CTL_LF},
	  //{"type":"command","value":TXT_FONT_B},
	  {"type":"text","value": $_line },
	  {"type":"command","value":CTL_LF},	  
	  {"type":"command","value":TXT_NORMAL},
	  {"type":"command","value":TXT_BOLD_ON}, 
	  {"type":"text","value": "TOTAL" },	  
	  {"type":"command","value":TXT_BOLD_OFF},
	  {"type":"command","value":CTL_LF},
	  {"type":"command","value":TXT_NORMAL},
	  {"type":"text","value": "Cash" },
	  {"type":"command","value":CTL_LF},
	  {"type":"command","value":CTL_LF}	  
	];
	return data;
};

BT_print_test = function(){
	
	try {
	
		current_page_id = getCurrentPage();
		BT_device = $("#" + current_page_id +  " .mac_address").val();
		BT_service_id = $("#" + current_page_id +  " .data1").val();
		BT_characteristic_id = $("#" + current_page_id +  " .data2").val();
		
		BT_tpl = '';
		
		if( !empty(BT_device) && !empty(BT_service_id) && !empty(BT_characteristic_id) ){
			
			if(PRINTING_TYPE==2){
				BT_tpl = BT_test_template2();
			} else {
				BT_tpl = BT_test_template();		
			}		
								
			setTimeout(function(){										
			   checkBluetooth('BT_init_print');
			}, 1*500 );
		
		} else {
			showToast( t("No selected printer. please restart your printer"), 'danger' );
		}
	
	} catch(err) {
		dump2( err.message );
	}
};

/*
This is the call to print the template
*/
BT_init_print = function(){
	showDialog(true,'printer_loader');

	BT_print_done = false;
	BT_command_count = 0;
	BT_connect_data = false;
	
	/*DEBUG*/
	if( isdebug() ){
				
		setTimeout(function(){	
		   BT_set_status( t("Connecting")+ "..." );
		}, 1*500 );
				
		BT_connect( BT_device );	    
		
		BT_connect_status = setInterval(function(){
			if(BT_connect_data){
				BT_set_status( t("Printing") + "..." );
				$result = BT_connect_data;
		   	    dump($result);
		   	    BT_connect_data = false;
		   	    
		   	    BT_service_id = $result.service;
			    BT_characteristic_id = $result.characteristic;
			    BT_print( BT_tpl );
			  			    
			    //BT_cron = setInterval(BT_cron_print, 1*1000);		   	    
			}
		}, 1*1000 );
		
		return ;
	}
	/*END DEBUG*/
	
	
	ble.isConnected( BT_device , function(){
		//success		
				
		setTimeout(function(){	
		   BT_set_status( t("Printing")+ "..." );
		}, 1*500 );
		
		BT_print( BT_tpl );	
		//BT_cron = setInterval( BT_cron_print , 1*1000);
		
	}, function(){
		
		//failed		
		setTimeout(function(){	
		   BT_set_status( t("Connecting")+ "..." );
		}, 1*500 );
		
		BT_connect_data = false;
		BT_connect( BT_device );	    
		
		BT_connect_status = setInterval(function(){
			if(BT_connect_data){
				BT_set_status( t("Printing") + "..." );
				$result = BT_connect_data;
		   	    dump($result);
		   	    BT_connect_data = false;
		   	    
		   	    BT_service_id = $result.service;
			    BT_characteristic_id = $result.characteristic;
			    BT_print( BT_tpl );
			  
			    //BT_cron = setInterval( BT_cron_print , 1*1000);		   	    
			}
		}, 2*1000 );
    		
	});	
	
};

BT_set_status = function(message){
	$("#printer_loader h3").html( message );
};

BT_print = function(data){
	dump("BT_print");
	dump(data);
	
	BT_err_msg  = '';
	
	if(data.length>0){
		$.each( data  , function( data, val ) {			
			setTimeout(function(){	
				//dump(val);
				switch (val.type){
					case "command":
					  BT_command(val.value);
					break
					
					case "text":
					  BT_text(val.value);
					break
					
					case "image":
					  BT_image(val.value);
					 break;
				}
			}, 1*1000); 
		});					
		
		/*setTimeout(function(){
			BT_print_done = true;        	
        }, 5*1000); */
		
		BT_cron = setInterval( BT_cron_print , 1*1000);
		
	} else {
		BT_print_done = true;
		BT_err_msg = t("No data to print");
		//showToast( t("No data to print"), 'danger' );		
	}
};

BT_cron_print = function(){
	
	try {		
		
		 if( isdebug() ){
		 	 $time_out = 15*1000;
		 } else {
			 $time_out = 15*1000;
			 if(cordova.platformId === "ios"){
		     	$time_out = 4*1000;	     	
		     } 	
		 }
		
		BT_print_timeout = setTimeout(function(){	   
			//dump3("BT_print_timeout");
			BT_command_count = 0;
			/*$dialog = document.getElementById("printer_loader");   
			if($dialog){
				$dialog.hide();
			}*/
			showDialog(false,'printer_loader');
	        clearInterval(BT_cron);	
		}, $time_out );
		
		/*dump3("BT_command_count=>" + BT_command_count);
		dump3("BT_tpl=>" + BT_tpl.length);*/
		
		$tpl_count = BT_tpl.length;	
		if( isNaN($tpl_count)){
			BT_print_done = true;
		}
		
		if( BT_command_count >=  BT_tpl.length ){
			BT_print_done = true;
		}
		
		//dump3("BT_cron_print =>"+ BT_print_done);
		
		if(BT_print_done){		
			BT_command_count = 0;
			if(!empty(BT_err_msg)){
	        	showToast( BT_err_msg , 'danger' );	        	    
	        } 		
	        /*$dialog = document.getElementById("printer_loader");   
			if($dialog){
				$dialog.hide();
			}*/
	        showDialog(false,'printer_loader');
	        clearInterval(BT_cron);
	        clearTimeout(BT_print_timeout);
		}		
		
	
	} catch(err) {
		dump2( err.message );
	}
};


BT_text = function($text){		
	try {		
		var data = stringToBytes($text);
		ble.write( BT_device , BT_service_id , BT_characteristic_id , data, function(result){
	    	//dump3(result);
	    	BT_command_count++;
	    }, function(err){		  
	    	BT_command_count++;  
		    if ((typeof  err.errorMessage !== "undefined") && ( err.errorMessage !== null)) {
		       BT_err_msg+= err.errorMessage;
		       BT_err_msg+="\n";
		    } else {
		       BT_err_msg+= JSON.stringify(err);
		       BT_err_msg+="\n";
		    }
	    });	   	    
    } catch(err) {    
      BT_command_count++;	  
      BT_err_msg+= err.message; 
      BT_err_msg+="\n";
    } 
};

BT_command = function( $command ){		
	try {							
		
		data = new Uint8Array( $command.length );				
		$.each( $command  , function( key, val ) {		
			data[key]=val;
		});
						
	    ble.write( BT_device , BT_service_id , BT_characteristic_id , data.buffer, function(result){
	    	//dump3(result);
	    	BT_command_count++;
	    }, function(err){
	    	BT_command_count++;
		    if ((typeof  err.errorMessage !== "undefined") && ( err.errorMessage !== null)) {
		       BT_err_msg+= err.errorMessage; 
		       BT_err_msg+="\n";
		    } else {
		       BT_err_msg+= JSON.stringify(err); 
		       BT_err_msg+="\n";
		    }
	    });	 

    } catch(err) {
       BT_command_count++;
       BT_err_msg+= err.message; 
       BT_err_msg+="\n";
    }        
};

BT_image = function(data){		
	try {			
		ble.write( BT_device , BT_service_id , BT_characteristic_id , data.buffer , function(result){
	    	//dump3(result);
	    	BT_command_count++;
	    }, function(err){		  
	    	BT_command_count++;  
		    if ((typeof  err.errorMessage !== "undefined") && ( err.errorMessage !== null)) {
		       BT_err_msg+= err.errorMessage;
		       BT_err_msg+="\n";
		    } else {
		       BT_err_msg+= JSON.stringify(err);
		       BT_err_msg+="\n";
		    }
	    });	   	    
    } catch(err) {    
      BT_command_count++;	  
      BT_err_msg+= err.message; 
      BT_err_msg+="\n";
    } 
};


BT_stop_all_cron = function(){
	
	try {
		
		if ((typeof  BT_connect_status !== "undefined") && ( BT_connect_status !== null)) {
		   clearInterval(BT_connect_status);
		}
		
		if ((typeof  BT_cron !== "undefined") && ( BT_cron !== null)) {
	       clearInterval(BT_cron);
		}
		
	} catch(err) {
		//
	}
};


BT_printOrder = function(data){	
	BT_device = data.printer_data.mac_address;
	BT_service_id = data.printer_data.data1;
	BT_characteristic_id = data.printer_data.data2;
	BT_printer_width = data.printer_data.paper_width;
	BT_char_set = data.printer_data.char_set;
			
	BT_tpl = '';	
	if( !empty(BT_device) && !empty(BT_service_id) && !empty(BT_characteristic_id) ){
		
		if(PRINTING_TYPE==2){
		  BT_tpl = BT_templateOrder2( data.order_details , BT_printer_width , data.printer_custom_data );
		} else {
		  BT_tpl = BT_templateOrder( data.order_details , BT_printer_width , data.printer_custom_data );		  
		}
				
		setTimeout(function(){										
		   checkBluetooth('BT_init_print');
		}, 1*500 );
		
	} else {
		showToast( t("No selected printer. please restart your printer"), 'danger' );
	}
};


var $tpl = [];		

BT_templateOrder = function( $data, $paper_width , $custom_data ){
	dump($data);
	var $_line = BT_line(42);	
		
	if($paper_width==80){
		$_line = BT_line(64);	
	}
		
	/*
	NOTES how to use functions
	 64 - 32		 
	$tpl.push( {"type":"text","value":$_line} );	
	$tpl.push( {"type":"command","value":CTL_LF} );
	
	BT_template_item(58,"cheese burger (small)","10.00",1,"5.00","1","4.00");	
	$tpl.push( {"type":"text","value": "medium rare" } );
	BT_template_addon(58,"Coke",1,2.50,2.50);			
	BT_template_item(58,"Chichen joy","20.00",1,"1.00","");
	*/
		
	$order_data = $data.order_data;
		
	$tpl = [
	  //{"type":"command","value":HW_INIT},
	  {"type":"command","value":TXT_NORMAL},
	  {"type":"command","value":TXT_BOLD_ON}, 
	  {"type":"command","value":TXT_ALIGN_CT}	  
	];
		
	if ((typeof  BT_char_set!== "undefined") && ( BT_char_set !== null)) {					
		$char_set = BT_setChar( BT_char_set );
	}
	
	if ((typeof  $order_data.merchant_name !== "undefined") && ( $order_data.merchant_name !== null)) {
	if(!empty($order_data.merchant_name)){
		$tpl.push( {"type":"text","value": $order_data.merchant_name } );	
		$tpl.push( {"type":"command","value":CTL_LF} );
	}
	}
	
	$tpl.push( {"type":"command","value":TXT_BOLD_OFF} );
	$tpl.push( {"type":"command","value":TXT_FONT_B} );
	
	if ((typeof  $order_data.merchant_address !== "undefined") && ( $order_data.merchant_address !== null)) {
	if(!empty($order_data.merchant_address)){	
		$tpl.push( {"type":"text","value": $order_data.merchant_address } );	
		$tpl.push( {"type":"command","value":CTL_LF} );	
	}
	}
	
	if ((typeof  $order_data.merchant_contact_phone !== "undefined") && ( $order_data.merchant_contact_phone !== null)) {
	if(!empty($order_data.merchant_contact_phone)){	
		$tpl.push( {"type":"text","value": $order_data.merchant_contact_phone } );	
		$tpl.push( {"type":"command","value":CTL_LF} );	
		$tpl.push( {"type":"command","value":CTL_LF} );	
	}
	}
		
	if ((typeof  $custom_data.printed_date !== "undefined") && ( $custom_data.printed_date !== null)) {
	if(!empty($custom_data.printed_date)){		   
	   $tpl.push( {"type":"command","value":TXT_ALIGN_RT} );
	   $tpl.push( {"type":"text","value": $custom_data.printed_date } );	
	   $tpl.push( {"type":"command","value":CTL_LF} );	
	   $tpl.push( {"type":"command","value":CTL_LF} );	
	}
	}
				
	$tpl.push( {"type":"command","value":TXT_ALIGN_LT} );			
	
	/*HEADER*/
	if ((typeof  $order_data.customer_name !== "undefined") && ( $order_data.customer_name !== null)) {
	    BT_template_inline( $paper_width , t("Name") , $order_data.customer_name   );
	}
	if ((typeof  $order_data.trans_type !== "undefined") && ( $order_data.trans_type !== null)) {
	    BT_template_inline( $paper_width , t("TRN Type") , $order_data.trans_type  );
	}
	if ((typeof  $order_data.payment_type !== "undefined") && ( $order_data.payment_type !== null)) {
	    BT_template_inline( $paper_width , t("Payment Type") , $order_data.payment_type );
	}
	if ((typeof  $order_data.order_id !== "undefined") && ( $order_data.order_id !== null)) {
	    BT_template_inline( $paper_width , t("Reference #") , $order_data.order_id  );
	}
	if ((typeof  $order_data.date_created !== "undefined") && ( $order_data.date_created !== null)) {
	    BT_template_inline( $paper_width , t("TRN Date") , $order_data.date_created );
	}
	
	$trans_type_raw = $order_data.trans_type_raw;
	switch($trans_type_raw){
		case "pickup":
		  $delivery_date_label = t("Pickup Date");
		  $delivery_time_label = t("Pickup Time");
		break
		
		case "dinein":
		  $delivery_date_label = t("Dinein Date");
		  $delivery_time_label = t("Dinein Time");
		break
		
		default:
		  $delivery_date_label = t("Delivery Date");
		  $delivery_time_label = t("Delivery Time");
		break
	}
	
	if ((typeof  $order_data.delivery_date !== "undefined") && ( $order_data.delivery_date !== null)) {				
	    BT_template_inline( $paper_width , $delivery_date_label , $order_data.delivery_date  );
	}
	if ((typeof  $order_data.delivery_time !== "undefined") && ( $order_data.delivery_time !== null)) {
		if($order_data.delivery_asap==1){
			BT_template_inline( $paper_width , $delivery_time_label , t("Asap") );
		} else {
	       BT_template_inline( $paper_width , $delivery_time_label , $order_data.delivery_time );
		}
	}
	
	if ((typeof  $order_data.delivery_address !== "undefined") && ( $order_data.delivery_address !== null)) {
		if($trans_type_raw=="delivery"){
	       BT_template_inline( $paper_width , t("Deliver to") , $order_data.delivery_address   );
		}
	}
	if ((typeof  $order_data.delivery_instruction !== "undefined") && ( $order_data.delivery_instruction !== null)) {
	    BT_template_inline( $paper_width , t("Delivery Instruction") , $order_data.delivery_instruction  );
	}
	if ((typeof  $order_data.location_name !== "undefined") && ( $order_data.location_name !== null)) {
	    BT_template_inline( $paper_width , t("Location Name") ,  $order_data.location_name  );
	}
	if ((typeof  $order_data.contact_phone !== "undefined") && ( $order_data.contact_phone !== null)) {
	    BT_template_inline( $paper_width , t("Contact Number") , $order_data.contact_phone  );
	}
	if ((typeof  $order_data.order_change !== "undefined") && ( $order_data.order_change !== null)) {		
		$change = parseFloat($order_data.order_change);
		if($change>0){
	       BT_template_inline( $paper_width , t("Change") , $order_data.order_change  );
		}
	}
	
	if ((typeof  $order_data.opt_contact_delivery !== "undefined") && ( $order_data.opt_contact_delivery !== null)) {
		if($order_data.opt_contact_delivery==1){
	       BT_template_inline( $paper_width , t("Delivery options") , t("Leave order at the door or gate")  );
		}
	}
	
	/*END HEADER*/
			
	$tpl.push( {"type":"text","value":$_line} );	
	$tpl.push( {"type":"command","value":CTL_LF} );	
	
	$.each( $data.order_details  , function( $key, $val ) {
		$.each( $val.item  , function( $key_item, $item ) {
			
			BT_template_item( $paper_width , $item.name , $item.item_total_price, $item.qty , $item.price, $item.discount, $item.price_after_discount  );	
			
			
			if ((typeof  $item.cooking_ref !== "undefined") && ( $item.cooking_ref !== null)) {
			if(!empty($item.cooking_ref)){
			   $tpl.push( {"type":"text","value": $item.cooking_ref } );
			   $tpl.push( {"type":"command","value":CTL_LF} );	
			}
			}
			
			if ((typeof  $item.order_notes !== "undefined") && ( $item.order_notes !== null)) {
			if(!empty($item.order_notes)){
			   $tpl.push( {"type":"text","value": $item.order_notes } );
			   $tpl.push( {"type":"command","value":CTL_LF} );	
			}
			}
						
			if ((typeof  $item.ingredients !== "undefined") && ( $item.ingredients !== null)) {
				if(!empty($item.ingredients)){
				   $.each( $item.ingredients  , function( $ingredientskey, $ingredients_val ) {				   					   
					   $tpl.push( {"type":"text","value": $ingredients_val } );
					   $tpl.push( {"type":"command","value":CTL_LF} );	
				   });
				}
			}
			
			$.each( $item.sub_item  , function( $key_subitem, $sub_item ) {				
				$tpl.push( {"type":"text","value": $sub_item.addon_category } );
				$tpl.push( {"type":"command","value":CTL_LF} );				
				if($sub_item.item.length>0){
					$.each( $sub_item.item  , function( $subkey, $subitem ) {
						BT_template_addon($paper_width, $subitem.name ,  $subitem.qty , $subitem.price ,  $subitem.sub_item_total );
					});
				} 
			});/* SUB ITEM*/
			
		});/* ITEM*/
	}); /*ORDER DETAILS*/
		
	$tpl.push( {"type":"text","value":$_line} );	
	$tpl.push( {"type":"command","value":CTL_LF} );		
	$tpl.push( {"type":"command","value":TXT_BOLD_ON} );		
	
	/*FOOTER*/
	$total_details = $data.total_details;
	
	if ((typeof  $total_details.less_voucher !== "undefined") && ( $total_details.less_voucher !== null)) {
	    BT_template_row( $paper_width , t("Voucher") , "("+ $total_details.less_voucher +")"  );
	}
	
	if ((typeof  $total_details.pts_redeem_amt !== "undefined") && ( $total_details.pts_redeem_amt !== null)) {
	    BT_template_row( $paper_width , t("Redeem points") , "("+ $total_details.pts_redeem_amt +")"  );
	}
	
	if ((typeof  $total_details.subtotal !== "undefined") && ( $total_details.subtotal !== null)) {
	    BT_template_row( $paper_width , t("Sub Total") , $total_details.subtotal );
	}
	
	if ((typeof  $total_details.service_fee !== "undefined") && ( $total_details.service_fee !== null)) {
	    BT_template_row( $paper_width , t("Service Fee") , $total_details.service_fee );
	}
	
	if ((typeof  $total_details.delivery_charges !== "undefined") && ( $total_details.delivery_charges !== null)) {
	    BT_template_row( $paper_width , t("Delivery Fee") , $total_details.delivery_charges );
	}
	
	if ((typeof  $total_details.packaging_charge !== "undefined") && ( $total_details.packaging_charge !== null)) {
	    BT_template_row( $paper_width , t("Packaging") , $total_details.packaging_charge );
	}
	
	if ((typeof  $total_details.tax !== "undefined") && ( $total_details.tax !== null)) {
	    BT_template_row( $paper_width , $total_details.tax.tax_label  , $total_details.tax.taxable_total );
	}
	
	if ((typeof  $total_details.tips !== "undefined") && ( $total_details.tips !== null)) {
	    BT_template_row( $paper_width , $total_details.tips.label  , $total_details.tips.value );
	}
	
	if ((typeof  $total_details.card_fee !== "undefined") && ( $total_details.card_fee !== null)) {
	    BT_template_row( $paper_width , t("Card Fee") , $total_details.card_fee );
	}
	
	if ((typeof  $total_details.total !== "undefined") && ( $total_details.total !== null)) {
	    BT_template_row( $paper_width , t("Total") , $total_details.total );
	}
	
	$tpl.push( {"type":"command","value":TXT_BOLD_OFF} );
	$tpl.push( {"type":"command","value":TXT_ALIGN_CT} );
	
	if ((typeof  $custom_data.site_url !== "undefined") && ( $custom_data.site_url !== null)) {		
	if(!empty($custom_data.site_url)){
	   $tpl.push( {"type":"command","value":CTL_LF} );		   
	   $tpl.push( {"type":"text","value": $custom_data.site_url } );	   
	} 
	}
	
	if ((typeof  $custom_data.footer !== "undefined") && ( $custom_data.footer !== null)) {		
	if(!empty($custom_data.footer)){	
	   $tpl.push( {"type":"command","value":CTL_LF} );	
	   $.each( $custom_data.footer , function( $fkey, $fval ) {
	   	   $tpl.push( {"type":"command","value":CTL_LF} );	
	   	   $tpl.push( {"type":"text","value": $fval } );	   
	   });	   
	}
	}
	
	$tpl.push( {"type":"command","value":CTL_LF} );	
	$tpl.push( {"type":"command","value":CTL_LF} );	
	
	return $tpl;
};

BT_template_inline = function($paper_width, $label, $value){
	$max_len = $paper_width==58?42:64;	
	$len = parseInt($label.length) + parseInt($value.length);  

	if(empty($value)){
		return;
	}
	
	if($len>$max_len){
		$tpl.push( {"type":"text","value": $label+":" });
		$tpl.push( {"type":"command","value":CTL_LF} );	
		$tpl.push( {"type":"text","value": $value });
		$tpl.push( {"type":"command","value":CTL_LF} );	
	} else {
		$tpl.push( {"type":"text","value": $label+": "+$value });
		$tpl.push( {"type":"command","value":CTL_LF} );	
	}
};

BT_template_row = function($paper_width, $label, $value){
	$max_len = $paper_width==58?21:32;	
	$len = $label.length;  
	
	$label = str_pad($label,$max_len," ");
	$value = str_pad( $value , $max_len ," ",'STR_PAD_LEFT');
	$tpl.push( {"type":"text","value": $label+$value });
	$tpl.push( {"type":"command","value":CTL_LF} );	
};

BT_template_item = function($paper_width, $item_name, $total_price , $qty , $price , $discount, $price_after_discount ){
		
	$max_len = $paper_width==58?21:32;	
	$len = $item_name.length;  
	$discount = parseFloat($discount);
	
	dump("$max_len=>"+$max_len + " $len=>"+ $len);
	
	$row_qty = $qty + " x " +  $price;
	
	if($len>$max_len){
	   $tpl.push( {"type":"text","value": $item_name} );
	   $tpl.push( {"type":"command","value":CTL_LF} );
	   $sub_qty = str_pad($row_qty,$max_len," ");
	   $total_amount = str_pad( $total_price , $max_len ," ",'STR_PAD_LEFT');	   
	   $tpl.push( {"type":"text","value": $sub_qty+$total_amount } );	   
	   $tpl.push( {"type":"command","value":CTL_LF} );	
	} else {
		$item_name = str_pad($item_name,$max_len," ");
		$total_amount = str_pad( $total_price , $max_len ," ",'STR_PAD_LEFT');
		$tpl.push( {"type":"text","value": $item_name+$total_amount } );
		$tpl.push( {"type":"command","value":CTL_LF} );	
		if($discount>0){		   	
			$row_qty = $qty + " x " +  $price_after_discount + " " + "("+ $price  +")" ;
			$tpl.push( {"type":"text","value": $row_qty });			
			$tpl.push( {"type":"command","value":CTL_LF} );
		} else {
		   $tpl.push( {"type":"text","value": $row_qty });
		   $tpl.push( {"type":"command","value":CTL_LF} );	
		}
		
	}		
};

BT_template_addon = function($paper_width, $name , $qty, $price, $sub_item_total){
	$max_len = $paper_width==58?21:32;	
	
	$row_qty = "  " + $qty + " " + $name  + " " +  "("+$price+")";
	$row_qty2 = "  " +  $qty + " x " +  $price;
	
	$len = $row_qty.length; 
	//dump("$len=>"+ $len);
	if($len>$max_len){
	   $tpl.push( {"type":"text","value": "  "+ $name } );
	   $tpl.push( {"type":"command","value":CTL_LF} );	
	   $row_name = str_pad( $row_qty2 ,$max_len," ");
	   $row_total_price = str_pad( $sub_item_total , $max_len ," ",'STR_PAD_LEFT'); 
	   $tpl.push( {"type":"text","value": $row_name+$row_total_price } );
	   $tpl.push( {"type":"command","value":CTL_LF} );	
	} else {
		$row_name = str_pad($row_qty,$max_len," ");		
		$row_total_price = str_pad( $sub_item_total , $max_len ," ",'STR_PAD_LEFT');
		$tpl.push( {"type":"text","value": $row_name+$row_total_price });	
		$tpl.push( {"type":"command","value":CTL_LF} );	
	}
};

BT_setChar = function(char_set){
	switch(char_set){
		case "CHARCODE_PC437":		   
		   $tpl.push( {"type":"command","value":CHARCODE_PC437} );
		break;
		
		case "CHARCODE_JIS":		    
		   $tpl.push( {"type":"command","value":CHARCODE_JIS} );
		break;
		
		case "CHARCODE_PC850":
		   $tpl.push( {"type":"command","value":CHARCODE_PC850} );
		break;
		
		case "CHARCODE_PC860":
		   $tpl.push( {"type":"command","value":CHARCODE_PC860} );
		break;
		
		case "CHARCODE_PC863":
		   $tpl.push( {"type":"command","value":CHARCODE_PC863} );
		break;
		
		case "CHARCODE_PC865":
		   $tpl.push( {"type":"command","value":CHARCODE_PC865} );
		break;
		
		case "CHARCODE_WEU":
		   $tpl.push( {"type":"command","value":CHARCODE_WEU} );
		break;
		
		case "CHARCODE_GREEK":
		   $tpl.push( {"type":"command","value":CHARCODE_GREEK} );
		break;
		
		case "CHARCODE_HEBREW":
		   $tpl.push( {"type":"command","value":CHARCODE_HEBREW} );
		break;
		
		case "CHARCODE_PC1252":
		   $tpl.push( {"type":"command","value":CHARCODE_PC1252} );
		break;
		
		case "CHARCODE_PC866":
		   $tpl.push( {"type":"command","value":CHARCODE_PC866} );
		break;
		
		case "CHARCODE_PC852":
		   $tpl.push( {"type":"command","value":CHARCODE_PC852} );
		break;
		
		case "CHARCODE_PC858":
		   $tpl.push( {"type":"command","value":CHARCODE_PC858} );
		break;
		
		case "CHARCODE_THAI42":
		   $tpl.push( {"type":"command","value":CHARCODE_THAI42} );
		break;
		
		case "CHARCODE_THAI11":
		   $tpl.push( {"type":"command","value":CHARCODE_THAI11} );
		break;
		
		case "CHARCODE_THAI13":
		   $tpl.push( {"type":"command","value":CHARCODE_THAI13} );
		break;
		
		case "CHARCODE_THAI14":
		   $tpl.push( {"type":"command","value":CHARCODE_THAI14} );
		break;
		
		case "CHARCODE_THAI16":
		   $tpl.push( {"type":"command","value":CHARCODE_THAI16} );
		break;
		
		case "CHARCODE_THAI17":
		   $tpl.push( {"type":"command","value":CHARCODE_THAI17} );
		break;
		
		case "CHARCODE_THAI18":
		   $tpl.push( {"type":"command","value":CHARCODE_THAI18} );
		break;
		
		case "CHARCODE_CHINESE":		  
		  $tpl.push( {"type":"command","value":CHARCODE_CHINESE} );
		break;
				
	}
};

BT_auto_init_print = function($order_id){
	$_timenow = getTimeNow();
	processAjax("AutoPrint",'order_id=' + $order_id,'POST','','silent'); 
};


BT_auto_print = function($order_id, $_printer_id ){	
	$params = "order_id="+ $order_id + "&printer_id=" + $_printer_id + "&auto_print=1";
	processAjax("PrintOrder", $params , 'POST', '', 'silent' );
};

/*===================================================
    NEW PRINT FUNCTIONS STARTS HERE
===================================================*/

BT_templateOrder2 = function( $data, $paper_width , $custom_data ){
	
	var $_line = BT_line(42);	
		
	if($paper_width==80){
		$_line = BT_line(64);	
	}
	
	$order_data = $data.order_data;
	$tpl = [];
	
	var $template = '';
	
	/*HEADER*/
				
	if ((typeof  BT_char_set!== "undefined") && ( BT_char_set !== null)) {				
		$char_set = BT_setChar( BT_char_set );		
	}
	
	$template += ESC_COMMANDS.TEXT_FORMAT.TXT_BOLD_ON ;	
	$template += ESC_COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT ;	
					
	if ((typeof  $order_data.merchant_name !== "undefined") && ( $order_data.merchant_name !== null)) {
	if(!empty($order_data.merchant_name)){				
		$template += $order_data.merchant_name;		
		$template += '\n';
	}
	}
		
	$template += ESC_COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF ;
	$template += ESC_COMMANDS.TEXT_FORMAT.TXT_FONT_B;	
	
	if ((typeof  $order_data.merchant_address !== "undefined") && ( $order_data.merchant_address !== null)) {
	if(!empty($order_data.merchant_address)){					
		$template += $order_data.merchant_address;
		$template += '\n';
	}
	}
	
	if ((typeof  $order_data.merchant_contact_phone !== "undefined") && ( $order_data.merchant_contact_phone !== null)) {
	if(!empty($order_data.merchant_contact_phone)){			
		$template += $order_data.merchant_contact_phone;
		$template += '\n';
	}
	}
	
	if ((typeof  $custom_data.printed_date !== "undefined") && ( $custom_data.printed_date !== null)) {
	if(!empty($custom_data.printed_date)){		   	   
	   $template += ESC_COMMANDS.TEXT_FORMAT.TXT_ALIGN_RT;	   
	   $template += '\n';
	   $template += $custom_data.printed_date;
	   $template += '\n';
	}
	}
		
	$template += ESC_COMMANDS.TEXT_FORMAT.TXT_ALIGN_LT ;	
	$template += '\n';
		
	if ((typeof  $order_data.customer_name !== "undefined") && ( $order_data.customer_name !== null)) {
	    $template += BT_template_inline2( $paper_width , t("Name") , $order_data.customer_name   );
	}
	if ((typeof  $order_data.trans_type !== "undefined") && ( $order_data.trans_type !== null)) {
	    $template += BT_template_inline2( $paper_width , t("TRN Type") , $order_data.trans_type  );
	}
	if ((typeof  $order_data.payment_type !== "undefined") && ( $order_data.payment_type !== null)) {
	    $template += BT_template_inline2( $paper_width , t("Payment Type") , $order_data.payment_type );
	}
	if ((typeof  $order_data.order_id !== "undefined") && ( $order_data.order_id !== null)) {
	    $template += BT_template_inline2( $paper_width , t("Reference #") , $order_data.order_id  );
	}
	if ((typeof  $order_data.date_created !== "undefined") && ( $order_data.date_created !== null)) {
	    $template += BT_template_inline2( $paper_width , t("TRN Date") , $order_data.date_created );
	}
	
	
	$trans_type_raw = $order_data.trans_type_raw;
	switch($trans_type_raw){
		case "pickup":
		  $delivery_date_label = t("Pickup Date");
		  $delivery_time_label = t("Pickup Time");
		break
		
		case "dinein":
		  $delivery_date_label = t("Dinein Date");
		  $delivery_time_label = t("Dinein Time");
		break
		
		default:
		  $delivery_date_label = t("Delivery Date");
		  $delivery_time_label = t("Delivery Time");
		break
	}
	
	if ((typeof  $order_data.delivery_date !== "undefined") && ( $order_data.delivery_date !== null)) {				
	    $template += BT_template_inline2( $paper_width , $delivery_date_label , $order_data.delivery_date  );
	}
	if ((typeof  $order_data.delivery_time !== "undefined") && ( $order_data.delivery_time !== null)) {
		if($order_data.delivery_asap==1){
			$template += BT_template_inline2( $paper_width , $delivery_time_label , t("Asap") );
		} else {
	       $template += BT_template_inline2( $paper_width , $delivery_time_label , $order_data.delivery_time );
		}
	}
	
	if ((typeof  $order_data.delivery_address !== "undefined") && ( $order_data.delivery_address !== null)) {
		if($trans_type_raw=="delivery"){
	       $template += BT_template_inline2( $paper_width , t("Deliver to") , $order_data.delivery_address   );
		}
	}
		
	if ((typeof  $order_data.delivery_instruction !== "undefined") && ( $order_data.delivery_instruction !== null)) {	
	    $template += BT_template_inline2( $paper_width , t("Delivery Instruction") , $order_data.delivery_instruction  );
	}
	if ((typeof  $order_data.location_name !== "undefined") && ( $order_data.location_name !== null)) {		
	    $template += BT_template_inline2( $paper_width , t("Location Name") ,  $order_data.location_name  );
	}
	if ((typeof  $order_data.contact_phone !== "undefined") && ( $order_data.contact_phone !== null)) {
	    $template += BT_template_inline2( $paper_width , t("Contact Number") , $order_data.contact_phone  );
	}
	if ((typeof  $order_data.order_change !== "undefined") && ( $order_data.order_change !== null)) {		
		$change = parseFloat($order_data.order_change);
		if($change>0){
	       $template += BT_template_inline2( $paper_width , t("Change") , $order_data.order_change  );
		}
	}
	
	if ((typeof  $order_data.opt_contact_delivery !== "undefined") && ( $order_data.opt_contact_delivery !== null)) {
		if($order_data.opt_contact_delivery==1){
	       $template += BT_template_inline2( $paper_width , t("Delivery options") , t("Leave order at the door or gate")  );
		}
	}
	
	$tpl.push( {"type":"text","value": $template } );	
	dump($template);
	$template = '';
	
	/*ORDER DETAILS*/
		
	$template += $_line+" "+ '\n';
	$counter = 0; $total_item = 0;
	
	$.each( $data.order_details  , function( $key, $val ) {
		
		$template += ESC_COMMANDS.TEXT_FORMAT.TXT_BOLD_ON ;	
		$template += $val.category_name + '\n';
		$template += ESC_COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF ;
		
		$total_item = $data.order_details.length;		
		
		$.each( $val.item  , function( $key_item, $item ) {
			
			$template += BT_template_item2( $paper_width , $item.name , $item.item_total_price, $item.qty , $item.price, $item.discount, $item.price_after_discount  );	
			
			
			if ((typeof  $item.cooking_ref !== "undefined") && ( $item.cooking_ref !== null)) {
			if(!empty($item.cooking_ref)){			   
			   $template += $item.cooking_ref + '\n';
			}
			}
			
			if ((typeof  $item.order_notes !== "undefined") && ( $item.order_notes !== null)) {
			if(!empty($item.order_notes)){			   
			   $template += $item.order_notes + '\n';
			}
			}
						
			if ((typeof  $item.ingredients !== "undefined") && ( $item.ingredients !== null)) {
				if(!empty($item.ingredients)){
				   $.each( $item.ingredients  , function( $ingredientskey, $ingredients_val ) {						   
					   $template += $ingredients_val  + '\n';
				   });
				}
			}
			
			$.each( $item.sub_item  , function( $key_subitem, $sub_item ) {				
								
				$template += $sub_item.addon_category + '\n';
					
				if($sub_item.item.length>0){
					$.each( $sub_item.item  , function( $subkey, $subitem ) {
						$template += BT_template_addon2($paper_width, $subitem.name ,  $subitem.qty , $subitem.price ,  $subitem.sub_item_total );
					});
				} 
			});/* SUB ITEM*/
												
			$counter++;			
			if($template.length>500){
				$tpl.push( {"type":"text","value": $template } );
				dump($template);
				$template = '';
			} else {
				if ($counter>=$total_item){
					$tpl.push( {"type":"text","value": $template } );
					dump($template);
					$template = '';
				}
			}
									
		});/* ITEM*/
	}); /*ORDER DETAILS*/
	
		
	$template = '';
	$template += $_line + " \n" + ESC_COMMANDS.TEXT_FORMAT.TXT_BOLD_ON ;	

	/*$tpl.push( {"type":"text","value": $template } );	
	dump($template);
	$template = '';*/
	
	/*FOOTER*/
	$total_details = $data.total_details;
	
	if ((typeof  $total_details.less_voucher !== "undefined") && ( $total_details.less_voucher !== null)) {
	    $template += BT_template_row2( $paper_width , t("Voucher") , "("+ $total_details.less_voucher +")"  );
	}
	
	if ((typeof  $total_details.pts_redeem_amt !== "undefined") && ( $total_details.pts_redeem_amt !== null)) {
	    $template += BT_template_row2( $paper_width , t("Redeem points") , "("+ $total_details.pts_redeem_amt +")"  );
	}
	
	if ((typeof  $total_details.subtotal !== "undefined") && ( $total_details.subtotal !== null)) {
	    $template += BT_template_row2( $paper_width , t("Sub Total") , $total_details.subtotal );
	}
	
	if ((typeof  $total_details.service_fee !== "undefined") && ( $total_details.service_fee !== null)) {
	    $template += BT_template_row2( $paper_width , t("Service Fee") , $total_details.service_fee );
	}
	
	if ((typeof  $total_details.delivery_charges !== "undefined") && ( $total_details.delivery_charges !== null)) {
	    $template += BT_template_row2( $paper_width , t("Delivery Fee") , $total_details.delivery_charges );
	}
	
	if ((typeof  $total_details.packaging_charge !== "undefined") && ( $total_details.packaging_charge !== null)) {
	    $template += BT_template_row2( $paper_width , t("Packaging") , $total_details.packaging_charge );
	}
		
	if ((typeof  $total_details.tax !== "undefined") && ( $total_details.tax !== null)) {
	    $template += BT_template_row2( $paper_width , $total_details.tax.tax_label  , $total_details.tax.taxable_total );
	}
	
	if ((typeof  $total_details.tips !== "undefined") && ( $total_details.tips !== null)) {
	    $template += BT_template_row2( $paper_width , $total_details.tips.label  , $total_details.tips.value );
	}
	
	if ((typeof  $total_details.card_fee !== "undefined") && ( $total_details.card_fee !== null)) {
	    $template += BT_template_row2( $paper_width , t("Card Fee") , $total_details.card_fee );
	}
	
	if ((typeof  $total_details.total !== "undefined") && ( $total_details.total !== null)) {
	    $template += BT_template_row2( $paper_width , t("Total") , $total_details.total );
	}
			
	$template += ESC_COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF + " " + ESC_COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT  ;		
	
	
	/*CUSTOM FOOTER*/
	
	if ((typeof  $custom_data.site_url !== "undefined") && ( $custom_data.site_url !== null)) {		
	if(!empty($custom_data.site_url)){	   
	   $template += '\n' + $custom_data.site_url;
	} 
	}
	
	if ((typeof  $custom_data.footer !== "undefined") && ( $custom_data.footer !== null)) {		
	if(!empty($custom_data.footer)){		   
	   $template += '\n';
	   $.each( $custom_data.footer , function( $fkey, $fval ) {	   	   	   	     
	   	   $template += '\n' + $fval;
	   });	   
	}
	}
	
	$template += ESC_COMMANDS.LF;
	$template += ESC_COMMANDS.LF;	
		
	dump("FOOTER=>"+ $template.length);
	dump($template);
	
	
	$tpl.push( {"type":"text","value": $template } );		
	return $tpl;
};

BT_template_inline2 = function($paper_width, $label, $value){
	
	$max_len = $paper_width==58?42:64;	
	$len = parseInt($label.length) + parseInt($value.length);  

	if(empty($value)){
		return '';
	}
	
	var $_template = '';
	
	if($len>$max_len){
		
		$_template+= $label+":";
		$_template += '\n';
		$_template += $value;
		$_template += '\n';
		
	} else {		
		$_template+= $label+": "+$value ;
		$_template += '\n';
	}
	return $_template;
};

BT_template_item2 = function($paper_width, $item_name, $total_price , $qty , $price , $discount, $price_after_discount ){
		
	$max_len = $paper_width==58?21:32;	
	$len = $item_name.length;  
	$discount = parseFloat($discount);
	
	//dump("$max_len=>"+$max_len + " $len=>"+ $len);
	
	var $_template = '';
	
	$row_qty = $qty + " x " +  $price;
	
	if($len>$max_len){	   
	   $_template +=  $item_name  + '\n';
	    
	   $sub_qty = str_pad($row_qty,$max_len," ");
	   $total_amount = str_pad( $total_price , $max_len ," ",'STR_PAD_LEFT');	   
	   	   
	   $_template +=  $sub_qty+$total_amount  + '\n';
	   
	} else {
		$item_name = str_pad($item_name,$max_len," ");
		$total_amount = str_pad( $total_price , $max_len ," ",'STR_PAD_LEFT');
		
		$_template +=  $item_name+$total_amount  + '\n';
		
		if($discount>0){		   	
			$row_qty = $qty + " x " +  $price_after_discount + " " + "("+ $price  +")" ;			
			$_template +=  $row_qty + '\n';
		} else {		   
		   $_template +=  $row_qty + '\n';
		}
		
	}		
	
	return $_template;
};

BT_template_addon2 = function($paper_width, $name , $qty, $price, $sub_item_total){
	$max_len = $paper_width==58?21:32;	
	
	var $_template = '';
	
	$row_qty = "  " + $qty + " x " + $name  + " " +  "("+$price+")";
	$row_qty2 = "  " +  $qty + " x " +  $price;
	
	$len = $row_qty.length; 
	//dump("$len=>"+ $len);
	if($len>$max_len){
	   
	   $_template +=  "  "+ $name + '\n';
	   
	   $row_name = str_pad( $row_qty2 ,$max_len," ");
	   $row_total_price = str_pad( $sub_item_total , $max_len ," ",'STR_PAD_LEFT'); 	   	   
	   $_template +=  $row_name+$row_total_price  + '\n';
	   
	} else {
		$row_name = str_pad($row_qty,$max_len," ");		
		$row_total_price = str_pad( $sub_item_total , $max_len ," ",'STR_PAD_LEFT');		
		$_template +=  $row_name+$row_total_price  + '\n';
	}
	
	return $_template;
};

BT_template_row2 = function($paper_width, $label, $value){
	$max_len = $paper_width==58?21:32;	
	$len = $label.length;  
	
	var $_template = '';
	
	$label = str_pad($label,$max_len," ");
	$value = str_pad( $value , $max_len ," ",'STR_PAD_LEFT');
	
	$_template += $label+$value + '\n';
	return $_template;
};

BT_setChar2 = function(char_set){
	
	var $_template = '';
	
	switch(char_set){
		case "CHARCODE_PC437":		   		   
		   $_template += '\x1b\x74\x00';
		break;
		
		case "CHARCODE_JIS":		    		   
		   $_template += '\x1b\x74\x01';
		break;
		
		case "CHARCODE_PC850":		   
		   $_template += '\x1b\x74\x02';
		break;
		
		case "CHARCODE_PC860":		   
		   $_template += '\x1b\x74\x03';
		break;
		
		case "CHARCODE_PC863":		   
		   $_template += '\x1b\x74\x04';
		break;
		
		case "CHARCODE_PC865":		   
		   $_template += '\x1b\x74\x05';
		break;
		
		case "CHARCODE_WEU":		   
		   $_template += '\x1b\x74\x06';
		break;
		
		case "CHARCODE_GREEK":		   
		   $_template += '0x1b,0x74,0x07';
		break;
		
		case "CHARCODE_HEBREW":		   
		   $_template += '\x1b\x74\x08';
		break;
		
		case "CHARCODE_PC1252":		   
		   $_template += '\x1b\x74\x10';
		break;
		
		case "CHARCODE_PC866":		   
		   $_template += '\x1b\x74\x12';
		break;
		
		case "CHARCODE_PC852":		   
		   $_template += '\x1b\x74\x13';
		break;
		
		case "CHARCODE_PC858":		   
		   $_template += '\x1b\x74\x14';
		break;
		
		case "CHARCODE_THAI42":		   
		   $_template += '\x1b\x74\x15';
		break;
		
		case "CHARCODE_THAI11":		   
		   $_template += '\x1b\x74\x16';
		break;
		
		case "CHARCODE_THAI13":		   
		   $_template += '\x1b\x74\x17';
		break;
		
		case "CHARCODE_THAI14":		   
		   $_template += '\x1b\x74\x18';
		break;
		
		case "CHARCODE_THAI16":		   
		   $_template += '\x1b\x74\x19';
		break;
		
		case "CHARCODE_THAI17":		   
		   $_template += '\x1b\x74\x1a';
		break;
		
		case "CHARCODE_THAI18":		   
		   $_template += '\x1b\x74\x1b';
		break;
				
	}
	
	return $_template;
};

BT_test_template2 = function() {
	
	var $_line = BT_line(42);	
	var $data_tpl = [];
	
	var $_template = '';
	
	$_template += '\n';
	$_template += " ";
	$_template += ESC_COMMANDS.TEXT_FORMAT.TXT_BOLD_ON + " " + ESC_COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT ;	
	$_template += " ";
	$_template += '\n';
	$_template += 'Test receipt';
	$_template += '\n';
	$_template += $_line;
	$_template += '\n';
	$_template += " ";
	$_template += ESC_COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF + " " + ESC_COMMANDS.TEXT_FORMAT.TXT_FONT_B ;
	$_template += " ";
    $_template += ESC_COMMANDS.TEXT_FORMAT.TXT_ALIGN_LT ;
    $_template += " ";
    $_template += '\n';
    $_template += "Cheese burger";
    $_template += '\n';
    $_template += "1 x 2.00";
    $_template += '\n';
    $_template += '\n';
    
    dump("====================================");
	dump($_template);
	
	$data_tpl.push( {"type":"text","value": $_template } );	
	return $data_tpl;
};
