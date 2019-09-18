import credentials from '../commons/credentials.js';
import base_urls from '../commons/base_urls.js';
var base64 = require('base-64');

export default class googlemaps {

	constructor(){
		this.apiKey = credentials.googleMaps;
		this.base64 = base64;
		this.gMapsUrl = base_urls.google_maps_url;
	}

	getQueryURL = () => {
		let baseUrl =  `${this.gMapsUrl}maps/api/geocode/json`;
		let url = baseUrl;
		return url; 
	};

	urlFetch = ( url, options ) => {
		return fetch( url, options ).then( res => res.json() ).then( res => {
			//return Promise.resolve(	res );
			return Promise.resolve( { "data":res, "status": "ok", "error":"" }	);
		}).catch( function(error) {
			return { "data":"", "status": "fail", "error": error.message };
			//throw error;
		});
	};

	getCityByGeoLocation = ( lat, lon) => {
		let url = this.getQueryURL();
		let options = {};

		url += `?latlng=${lat},${lon}&sensor=true&key=${this.apiKey}`;
		
		return this.urlFetch(url, options);
	};

}