
const companies = {
  format: function(m){
    return ('$' + m.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
  },
  arr: [
    {name: 'Nike',type: 'retailer', getShoePrice: getShoePrice},
    {name: 'Adidas',type: 'retailer', getShoePrice: getShoePrice},
    {name: 'Flightclub',type: 'reseller', getShoePrice: getShoePrice, link: "https://www.flightclub.com/air-jordan-10-retro-ovo-summit-white-metallic-gold-wht-012292"},
    {name: 'Stockx',type: 'reseller', getShoePrice: getShoePrice, link:"https://stockx.com/jordan-10-retro-drake-ovo-white"},
    {name: 'Kixify',type: 'reseller', getShoePrice: getShoePrice, link:"https://www.kixify.com/product/jordan-10-ovo-white-size-10-5"}
  ]
}

async function getShoePrice(nameOfShoe = "noOneCaresRightNow"){

  let price = new Promise(function(resolve,reject){

    let wait = Math.random() * 300;

    let p = (Math.random() * 100) + 100;

    //p = '$' + p.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

    setTimeout(resolve, wait, p);

  })

  return price;

}


module.exports = companies;
