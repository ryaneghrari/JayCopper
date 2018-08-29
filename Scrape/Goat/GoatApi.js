const axios = require('axios');
const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require('fs');
const SIZE_DICT = require("./size_dict.js")


const query = "ovo 10s"

//getShoes(query);

/*
* Grabs each shoe it can find on stockX for a given query
*
* returns:
	name: <name of shoe>
	lowest_ask: <lowest asking price of all sizes>
	thumbnail_url: <picture url of shoe>
	url: <url to shoe>
	size_prices: <array of sizes and corresponding prices>
*
*/
async function getShoes(query){


	const api_url = "https://2fwotdvm2o-dsn.algolia.net/1/indexes/ProductTemplateSearch/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.25.1&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a";
	const payload = {"params":`query=${query}&facetFilters=(status%3Aactive%2C%20status%3Aactive_edit)%2C%20()%2C%20()%2C%20()&numericFilters=%5B%5D&page=0&hitsPerPage=20&facets=%5B%22available_sizes%22%5D`};

	try{
		var resp = await axios.post(api_url,payload);
	}
	catch(e){
		console.error(e);
		return null;
	}



	let shoeData = resp.data.hits;
	let shoes = [];

	for(const data of shoeData){
		let {name, id, available_sizes_new_v2, main_picture_url, grid_picture_url, slug} = data;

		let shoe = {
			name: name,
			id: id,
			main_picture_url: main_picture_url,
			thumbnail_url: grid_picture_url,
			url: "https://www.goat.com/sneakers/" + slug
		}

		let sizePrices = [];

		available_sizes_new_v2.map(function(arr){

			let size = arr[0];
			let price = parseInt(arr[1]);
			//let condition = arr[2]; dont think i care about this

			sizePrices.push({
				size: size,
				price: (price / 100)
			})

		})

		shoe.size_prices = sizePrices;

		shoes.push(shoe);
	}

	//console.log(shoes);


	return {
		companyName: "Goat",
		shoes: shoes
	}

}

module.exports = getShoes;
