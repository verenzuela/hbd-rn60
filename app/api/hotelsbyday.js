import credentials from '../commons/credentials.js';
import url from '../commons/base_urls.js';
var base64 = require('base-64');

export default class hotelsbyday {

	constructor(){
		this.hbd_usr = credentials.hbd_usr;
		this.hbd_pss = credentials.hbd_pss;
		this.base64 = base64;
		this.hbdUrl = url.hbd_url;
	}

	getQueryWebURL = (lan='en') => {
		let baseUrl = this.hbdUrl;
		let url = baseUrl;
		url += lan;
		return url; 
	};

	getQueryApiURL = (ver) => {
		let baseUrl = this.hbdUrl + 'api/';
		let url = baseUrl;
		url += ver;
		return url; 
	};


	urlFetch = ( url, options ) => {
		return fetch( url, options ).then( res => res.json() ).then( res => {
			return Promise.resolve( { "data":res, "status": "ok", "error":"" }	);
		}).catch( function(error) {
			return { "data":"", "status": "fail", "error": error.message };
		});
	};


	setFormBody = ( params ) => {
		var formBody = [];
	    for (var property in params) {
	      var encodedKey = encodeURIComponent(property);
	      var encodedValue = encodeURIComponent(params[property]);
	      formBody.push(encodedKey + "=" + encodedValue);
	    }
	    formBody = formBody.join("&");
	    return formBody;
	};


	getCities = ($cityName='') => {
		let url = this.getQueryWebURL('en');
		let options = {};

		if($cityName != ''){
			url += '/search/city_autocomplete?city='+$cityName;
		}else{
			url += '/search/city_autocomplete';
		}
		
		return this.urlFetch(url, options);
	};


	getHotelsByCity = (cityName, date) => {
		
		let url = this.getQueryApiURL('v3');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Basic ${this.base64.encode(this.hbd_usr + ":" + this.hbd_pss)}` 
			}
        };

		url += '/hotels?location='+cityName+'&language=en-US&specific_date='+date;

		return this.urlFetch(url, options);

	}

	getHotelsByGeo = (lat, lon, date) => {

		let url = this.getQueryApiURL('v3');
		let options = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Basic ${this.base64.encode(this.hbd_usr + ":" + this.hbd_pss)}` 
			}
        };

		url += `/hotels?lat=${lat}&lon=${lon}&language=en-US&specific_date=${date}`;

		return this.urlFetch(url, options);

	}

}