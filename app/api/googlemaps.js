import credentials from '../commons/credentials.js';
var base64 = require('base-64');

export default class googlemaps {

	constructor(){
		this.apiKey = credentials.googleMaps;
		this.base64 = base64;
	}

	static getQueryURL = () => {
		let baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
		let url = baseUrl;
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

	getCityByGeoLocation = ( lat, lon) => {
		let url = googlemaps.getQueryURL('en');
		let options = {};

		url += `?latlng=${lat},${lon}&sensor=true&key=${this.apiKey}`;
		
		return this.urlFetch(url, options);
	};

}