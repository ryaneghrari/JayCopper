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

	const api_url = "https://xw7sbct9v6-dsn.algolia.net/1/indexes/products/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.30.0&x-algolia-application-id=XW7SBCT9V6&x-algolia-api-key=6bfb5abee4dcd8cea8f0ca1ca085c2b3";
	const payload = {"params":`query=${query}&facets=*&page=0`};

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
		let {name, lowest_ask, thumbnail_url, url} = data;

		let shoe = {
			name: name,
			lowest_ask: lowest_ask,
			thumbnail_url: thumbnail_url,
			url: "https://stockx.com/" + url
		}

		shoes.push(shoe);
	}


	for(const shoe of shoes){

		var options = {
			url: shoe.url,
			transform: body => cheerio.load(body)
		}

		try{
			var $ = await rp(options);
		}
		catch(e){
			console.error(e);
			return null;
		}

		let sizePrices = [];

		$('div','.shoe-size').each(function(i, elm){
			let size = $(elm).find(".title").text()
			let price = $(elm).find(".subtitle").text()
			// console.log(size);

			if(SIZE_DICT[size]){
				sizePrices.push({
					size: size,
					price: price
				})
			}

		})

		shoe.size_prices = sizePrices;
	}

	return {
		companyName: "StockX",
		shoes: shoes
	};

}

module.exports = getShoes;
