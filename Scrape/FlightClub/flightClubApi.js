const axios = require('axios');
const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require('fs');
const SIZE_DICT = require("./size_dict.js")


// const query = "w's air"
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

	const api_url = "https://se11pyus00-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.21.1%3Binstantsearch.js%201.11.2%3BMagento%20integration%20(1.10.0)%3BJS%20Helper%202.18.1&x-algolia-application-id=SE11PYUS00&x-algolia-api-key=YWZkMGQ2MGY3NTI2NTRjNzU5M2I5NDE1NDZlNDI4MGEwN2E2MDA0ZmY5NmJmNzdmYjU4ODQ3OTQxNTQxNmE2YWZpbHRlcnM9Jm51bWVyaWNGaWx0ZXJzPXZpc2liaWxpdHlfc2VhcmNoJTNEMQ%3D%3D";
	const payload = {
		"requests": [{
									"indexName":"fc_prod_us_products",
									"params": `query=${query}&hitsPerPage=30&maxValuesPerFacet=20&page=0&facets=%5B%22tag_division%22%2C%22available_conditions%22%2C%22sizegroup_men%22%2C%22sizegroup_women%22%2C%22sizegroup_youth%22%2C%22sizegroup_hats%22%2C%22sizegroup_apparel%22%2C%22product_year%22%2C%22shoe_color%22%5D&tagFilters=`
								}]
	}

	try{
		var resp = await axios.post(api_url,payload);
	}
	catch(e){
		console.error(e);
		return null;
	}




	let shoeData = resp.data.results[0].hits;
	let shoes = [];

	//console.log(Object.keys(shoeData[0]))

	for(const data of shoeData){
		let {name, thumbnail_url, url, sku} = data;

		if(data.sizegroup_men){
			var sizegroup = data.sizegroup_men;
		}
		else if(data.sizegroup_women){
			var sizegroup = data.sizegroup_women;
		}

		let shoe = {
			sizegroup: sizegroup,
			sku: sku,
			name: name,
			thumbnail_url: thumbnail_url,
			url: url,
			size_prices: []
		}

		shoes.push(shoe);
	}

	//shoes = [shoes[0]];


	// for(const shoe of shoes){
	//
	// 	let sizePrices = [];
	//
	// 	for(const size of shoe.sizegroup){
	//
	// 		var options = {
	// 			url: shoe.url +"?" + size,
	// 			transform: body => cheerio.load(body)
	// 		}
	//
	// 		try{
	// 			var $ = await rp(options);
	// 		}
	// 		catch(e){
	// 			console.error(e);
	// 			return null;
	// 		}
	//
	// 		console.log("finding " + size)
	// 		console.log( $('div.price-box').find('span.price').text() )
	// 		// $('div','.price-box').each(function(i, elm){
	// 		// 	//let size = $(elm).find(".title").text()
	// 		// 	let price = $(elm).find(".price").text()
	// 		// 	// console.log(size);
	// 		// 	 console.log(price);
	// 		//
	// 		// 	// if(SIZE_DICT[size]){
	// 		// 	// 	sizePrices.push({
	// 		// 	// 		size: size,
	// 		// 	// 		price: price
	// 		// 	// 	})
	// 		// 	// }
	// 		//
	// 		// })
	//
	//
	//
	//	}

	// 	 shoe.size_prices = [];
	// }
	// console.log(shoes)
	return {
		companyName: "FlightClub",
		shoes: shoes
	}

}

module.exports = getShoes;
