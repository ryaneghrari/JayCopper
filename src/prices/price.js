const electron = require('electron')
const path = require('path')
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const shell = electron.shell;

var companies = require('./testDataFactory.js').arr;
var format = require('./testDataFactory.js').format;

//Shoe that was searched for
var shoeName = d3.select("body")
  .append('div')
  .attr('class','shoeName')


//container for min price and avg price
var header = d3.select("body").append("div")

header.attr("class","header")

//min price and company associated
var lowestComp = header.append('div')
lowestComp.attr('class','minCompCont')
lowestComp.append("div").attr('class','headerTitle').text("Min")

var lowestCompName  = lowestComp.append("div")
var lowestCompPrice = lowestComp.append("div")

//container for the average price
var avgPriceCont = header
              .append('div')
              .attr('class','avgPriceCont')

avgPriceCont.append("div").attr("class","headerTitle").text("Avg")
var avgPriceValueCont = avgPriceCont.append("div").attr("class","avgPrice")



//container for all the companies
var cont = d3.select("body")
  .append('div')
  .attr('class','companiesCont')

//Each company container
var comp = cont.selectAll('compCont')
    .data(companies)
    .enter()
    .append("div")
    .attr("class","compCont")


//open the link for each company
comp.on('click',function(c){
  if(c.link){
    shell.openExternal(c.link)
  }
})

var comp_name = comp.append('div')
    .attr('class','compName')
    .text(function(c){return c.comp_name})

var comp_shoeName = comp.append('div')
    .attr('class','compShoeName')
    .text(function(c){return "shoename: " + c.shoe_name})

var comp_size = comp.append('div')
    .attr('class','compShoeSize')
    .text(function(c){return "size"+c.shoe_size});

var comp_price = comp.append('div')
    .attr('class','compShoePrice');





update();
setInterval(function(){

  update();

  //update price text
  comp_price.text(function(c){ return c.shoePrice});
},1000)



//listen for search text from main process
ipc.on("searchTxt",function(event,searchTxt){
  // console.log("price.js: ", searchTxt)

  d3.select("title").text(searchTxt);
  shoeName.text("Prices of " + searchTxt);
})



async function update(){

  let pricesPromises = companies.map(comp => comp.getShoePrice());

  let prices = await Promise.all(pricesPromises);

  var min = Number.MAX_SAFE_INTEGER;
  var minComp = null;
  var priceAvg = 0;

  companies = companies.map(function(comp,i){

    //Add the new price to the company object
    comp.shoePriceVal = prices[i];
    comp.shoePrice = format( prices[i] );

    //Accumulate prices to the priceAvg variable
    priceAvg += comp.shoePriceVal;

    //update minComp
    if(comp.shoePriceVal < min){

      min = comp.shoePriceVal;
      minComp = comp;
    }

    return comp

  })

  //Divide accumulated value by the number of companies
  priceAvg = priceAvg / companies.length;

  //Format and set the new value for the price average
  avgPriceValueCont.text(function(){  return format( priceAvg ) })


  //Update the company with the minimum shoe price
  lowestCompName.attr('class','minCompName').text(function(){ return minComp.comp_name })

  //Update the value of the price
  lowestCompPrice.attr('class','minCompPrice').text(function(){ return minComp.shoePrice })

  //Update the link for the Min box
  lowestComp.on("click",function(){
    if(minComp.link){
      shell.openExternal(minComp.link)
    }
  })

}
