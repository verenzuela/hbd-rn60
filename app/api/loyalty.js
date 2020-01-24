import credentials from '../commons/credentials.js';
import url from '../commons/base_urls.js';
var base64 = require('base-64');

export default class loyalty {

	constructor(){
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
		let baseUrl = this.hbdUrl + 'api_loyalty/';
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


	login = (email, password) => {
		let url = this.getQueryApiURL('v1');
		let options = {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: JSON.stringify({
				user: email,
				pwss: password,
			}),
        };
		url += '/login';

		return this.urlFetch(url, options);
	};


	loginSocial = (type, id) => {
		let url = this.getQueryApiURL('v1');
		let options = {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: JSON.stringify({
				type: type,
				id: id,
			}),
        };
		url += '/loginBySocialId';

		return this.urlFetch(url, options);
	};

	isLogin = () => {
		let url = this.getQueryApiURL('v1');
		let options = {
			method: "POST",
			headers: {
				'Accept': 'application/json',
	            'Content-Type': 'application/json'
			}
        };
		url += '/isLogin';
		return this.urlFetch(url, options);
	};


	bookings = () => {
		let url = this.getQueryApiURL('v1');
		let options = {
			method: "POST",
			headers: {
				'Accept': 'application/json',
	            'Content-Type': 'application/json'
			}
        };
		url += '/bookings';
		return this.urlFetch(url, options);
	};


	favorites = () => {
		let url = this.getQueryApiURL('v1');
		let options = {
			method: "POST",
			headers: {
				'Accept': 'application/json',
	            'Content-Type': 'application/json'
			}
        };
		url += '/favorites';
		return this.urlFetch(url, options);
	};


	profile = () => {
		let url = this.getQueryApiURL('v1');
		let options = {
			method: "POST",
			headers: {
				'Accept': 'application/json',
	            'Content-Type': 'application/json'
			}
        };
		url += '/profile';
		return this.urlFetch(url, options);
	};


	profileUpdate = (firstname, lastname, gender, date, phone, postal_code, fflayer, profession, travel_iata, travel_iataid, travel_email, travel_phone, travel_name, travel_agency ) => {

		let url = this.getQueryApiURL('v1');
		let options = {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: JSON.stringify({
				firstname: firstname,
				lastname: lastname,
				gender: gender,
				date: date,
				phone: phone,
				postal_code: postal_code,
				fflayer: fflayer,
				profession: profession,
				travel_iata: travel_iata,
				travel_iataid: travel_iataid,
				travel_email: travel_email,
				travel_phone: travel_phone,
				travel_name: travel_name,
				travel_agency: travel_agency,

			}),
        };
		url += '/profileUpdate';

		return this.urlFetch(url, options);
	};



	passwordUpdate = ( current_password, new_password, confirm_password ) => {
		let url = this.getQueryApiURL('v1');
		let options = {
			method: "POST",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: JSON.stringify({
				current_password: current_password,
				new_password: new_password,
				confirm_password: confirm_password,
			}),
        };
		url += '/passwordUpdate';

		return this.urlFetch(url, options);
	};


	logout = () => {
		let url = this.getQueryApiURL('v1');
		let options = {
			method: "POST",
			headers: {
				'Accept': 'application/json',
	            'Content-Type': 'application/json'
			}
        };
		url += '/logout';
		return this.urlFetch(url, options);
	};

}