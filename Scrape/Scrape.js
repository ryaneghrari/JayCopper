
const Goat = require('./Goat/GoatApi.js');
const FlightClub = require('./FlightClub/FlightClubApi.js');
const StockX = require('./StockX/StockXApi.js');



const Sites = {
  Goat: Goat,
  FlightClub: FlightClub,
  StockX: StockX
}

// queryAll("yeezy butters")

async function queryAll(query){

  //console.log("here")

  const promises = Object.values(Sites).map(f => f(query));

  let results = await Promise.all(promises);

  //console.log(results)
  return processResults(results)

}



function processResults(results){

  const allShoes = results.reduce(function(accumulator, result){

    const { shoes, companyName } = result;

    shoes.forEach(function(shoe){
      shoe.size_prices.forEach(function(sizePrice){

          let {size, price} = sizePrice;

          accumulator.push({
            company_name: companyName,
            shoe_size: size,
            shoe_price: price,
            shoe_name: shoe.name,
            shoe_url: shoe.url,
            thumbnail_url: shoe.thumbnail_url,
            shoe_url: shoe.url
          });

      })
    })

    return accumulator;

  },[])

  return allShoes;
}


module.exports = queryAll;
