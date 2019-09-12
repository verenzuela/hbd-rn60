import credentials from '../commons/credentials.js';
var base64 = require('base-64');

export default class hotelsbyday {

	constructor(){
		this.hbd_usr = credentials.hbd_usr;
		this.hbd_pss = credentials.hbd_pss;
		this.base64 = base64;
	}

	static getQueryWebURL = (lan='en') => {
		let baseUrl = 'https://www.hotelsbyday.com/';
		let url = baseUrl;
		url += lan;
		return url; 
	};

	static getQueryApiURL = (ver) => {
		let baseUrl = 'https://www.hotelsbyday.com/api/';
		let url = baseUrl;
		url += ver;
		return url; 
	};


	urlFetch = ( url, options ) => {
		return fetch( url, options ).then( res => res.json() ).then( res => {
			return Promise.resolve(	res );
		}).catch( function(error) {
			console.warn('Error: ' + error.message);
			throw error;
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
		let url = hotelsbyday.getQueryWebURL('en');
		let options = {};

		if($cityName != ''){
			url += '/search/city_autocomplete?city='+$cityName;
		}else{
			url += '/search/city_autocomplete';
		}
		
		return this.urlFetch(url, options);
	};


	getHotelsByCity = (cityName, date) => {
		
		let url = hotelsbyday.getQueryApiURL('v3');
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

		let url = hotelsbyday.getQueryApiURL('v3');
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