const electron = require('electron')
const path = require('path')
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const shell = electron.shell;

//var SHOES = require('./testDataFactory.js').arr;

var format = require('./testDataFactory.js').format;

var loading = d3.select("body").append("div").attr("id","loading").text("loading");

var SIZE;
var SHOES;

//Shoe that was searched for
var QUERY = d3.select("body")
  .append('div')
  .attr('id','query')


//container for min price and avg price
var summary = d3.select("body").append("div")

summary.attr("class","summary")

//min price and company associated
var lowestShoe = summary.append('div')
lowestShoe.attr('class','minCompCont')
lowestShoe.append("div").attr('class','summaryTitle').text("Min")

var lowestShoe_CompanyName  = lowestShoe.append("div")
var lowestShoe_ShoeName = lowestShoe.append("div")
var lowestShoe_ShoeSize  = lowestShoe.append("div")
var lowestShoe_ShoePrice = lowestShoe.append("div")

//container for the average price
var avgPriceCont = summary
              .append('div')
              .attr('class','avgPriceCont')

avgPriceCont.append("div").attr("class","headerTitle").text("Avg")
var avgPriceValueCont = avgPriceCont.append("div").attr("class","avgPrice")

createSlider();

d3.select("body").append("div").attr('id','resultsSeparator').text("Results:")

var cont = d3.select("body")
  .append('div')
  .attr('class','shoesCont')




//listen for search text from main process
ipc.on("searchTxt",function(event,searchTxt){


  d3.select("title").text(searchTxt);
  QUERY.text("Prices of " + searchTxt);

  // let promise = update(searchTxt,true);
  //
  // promise.then(function(shoes){
  //
  //
  //   setInterval(function(){
  //
  //     update(searchTxt,false);
  //
  //   },10000)
  //
  // })

  hardUpdate(searchTxt,true);


  setInterval(function(){

    hardUpdate(searchTxt,false);

  },5000)


})



function filterResults(){


  //get shoes +- half size the selected size
  var filteredShoes = SHOES.filter(s => (+s.shoe_size+.5) === SIZE || (+s.shoe_size-.5) === SIZE || +s.shoe_size === SIZE);

  filteredShoes = filteredShoes.sort(function(a, b){return a.shoePriceVal - b.shoePriceVal})

  //console.log("filtered: ",filteredShoes);
  updateView(filteredShoes)

}

async function hardUpdate(searchTxt, init){

  if(init){
    var phrases = [
      "This will probably take a million years",
      "I am going to all the websites and getting the data",
      "On average it takes me 13 seconds",
      "You have waited 6",
      "So stfu and wait",
      ".",
      "..",
      "...",
      ".",
      "..",
      "...",
      ".",
      "..",
      "...",
      "still there? cool same",
      "..",
      "okay call ryan"
    ]

    var i = 0;
    setInterval(function(){
      loading.text(phrases[i++]);
    },2000)

    SHOES = await require('../../Scrape/Scrape.js')(searchTxt);

    loading.remove();
  }
  else{

    SHOES = await require('../../Scrape/Scrape.js')(searchTxt);

  }




  filterResults()

}

function updateView(FILTERED_SHOES){


  var min = Number.MAX_SAFE_INTEGER;
  var minShoe = null;
  var priceAvg = 0;

  FILTERED_SHOES = FILTERED_SHOES.map(function(shoe,i){

    //console.log(typeof shoe.shoe_price,shoe);

    //Add the new price to the company object
    if(typeof shoe.shoe_price === "string"){
      shoe.shoePriceFormatted = shoe.shoe_price;

      var price = Number(shoe.shoe_price.replace(/[^0-9.-]+/g,""));

      if(typeof price === "number"){
        shoe.shoePriceVal = price;
      }
      else{
        shoe.shoePriceVal = null;
      }



    }
    else{


      shoe.shoePriceVal = shoe.shoe_price;
      shoe.shoePriceFormatted = format( shoe.shoe_price );
    }


    //Accumulate prices to the priceAvg variable
    priceAvg += shoe.shoePriceVal;

    //update minComp
    if( shoe.shoePriceVal && shoe.shoePriceVal < min ){

      min = shoe.shoePriceVal;
      minShoe = shoe;

    }

    return shoe

  })



  // console.log("updateView:",FILTERED_SHOES)

  var shoe = cont.selectAll('.shoeCont').data(FILTERED_SHOES);

  // console.log(shoe);

  var shoeCont = shoe
      .enter()
      .append("div")
      .attr("class","shoeCont")

  // console.log("shoeCont",shoeCont)


  //New Containers for shoes
  shoeCont.append('div').attr('class','shoe_compName').text(function(s){ return s.company_name})
  shoeCont.append('div').attr('class','shoe_shoeName').text(function(s){ return s.shoe_name})
  shoeCont.append('div').attr('class','shoe_shoeSize').text(function(s){ return s.shoe_size})
  shoeCont.append('div').attr('class','shoe_shoePrice').text(function(s){ return s.shoePriceFormatted})



  //Update existing containers
  shoe.select(".shoe_compName").text(function(s){ return s.company_name})
  shoe.select(".shoe_shoeName").text(function(s){ return s.shoe_name})
  shoe.select(".shoe_shoeSize").text(function(s){ return s.shoe_size})
  shoe.select(".shoe_shoePrice").text(function(s){ return s.shoePriceFormatted})
  //open the link for each shoe
  shoe.on('click',function(s){
    if(s.shoe_url){
      shell.openExternal(s.shoe_url)
    }
  })

  shoe.exit().remove();


  //Divide accumulated value by the number of companies
  priceAvg = (priceAvg > 0 ? priceAvg / FILTERED_SHOES.length : 0);

  //Format and set the new value for the price average
  avgPriceValueCont.text(function(){  return format( priceAvg ) })

  //Update the company with the minimum shoe price
  if(minShoe){
    lowestShoe_CompanyName.attr('class','minCompName').text(function(){ return minShoe.company_name })
    lowestShoe_ShoeName.attr('class','minCompName').text(function(){ return minShoe.shoe_name })
    lowestShoe_ShoeSize.attr('class','minCompName').text(function(){ return `size ${minShoe.shoe_size}` })

    //Update the value of the price
    lowestShoe_ShoePrice.attr('class','minCompPrice').text(function(){ return minShoe.shoePriceFormatted })

    //Update the link for the Min box
    lowestShoe.on("click",function(){
      if(minShoe.shoe_url){
        shell.openExternal(minShoe.shoe_url)
      }
    })
  }
  else{
    lowestShoe_CompanyName.text("No Minimum Shoe")
    lowestShoe_ShoeName.text("")
    lowestShoe_ShoeSize.text("")
    lowestShoe_ShoePrice.text("")

    lowestShoe.on("click",function(){})

  }



}


function createSlider(){
  d3.select("body").append("div").attr("id",'sizeTitle').text("Choose Size: " + (SIZE || ""));
  d3.select("body").append("svg").attr("id","slider")

  var svg = d3.select("svg");


  svg.attr("width",500)
  svg.attr("height",50)

  var margin = {right: 25, left: 25},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height");


  var x = d3.scaleLinear()
      .domain([1, 16])
      .range([0, width])
      .clamp(true);

  var slider = svg.append("g")
      .attr("class", "slider")
      .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

  slider.append("line")
      .attr("class", "track")
      .attr("x1", x.range()[0])
      .attr("x2", x.range()[1])
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-inset")
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-overlay")
      .call(d3.drag()
          .on("start.interrupt", function() { slider.interrupt(); })
          .on("start drag", function() { hue(x.invert(d3.event.x)); }));

  slider.insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 20 + ")")
    .selectAll("text")
    .data(x.ticks(20))
    .enter().append("text")
      .attr("x", x)
      .attr("text-anchor", "middle")
      .text(function(d) { return d  });

  var handle = slider.insert("circle", ".track-overlay")
      .attr("class", "handle")
      .attr("r", 9)

  function hue(h) {
    handle.attr("cx", x(h));

    SIZE = Math.floor(h)
    d3.select('#sizeTitle').text(function(){return `Size: ${SIZE}`});
    filterResults()
    // svg.style("background-color", d3.hsl(h, 0.8, 0.8));
  }
}
