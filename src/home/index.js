const electron = require('electron')
const path = require('path')
const BrowserWindow = require('electron').remote.BrowserWindow;
const axios = require('axios');
const ipc = electron.ipcRenderer;

const searchBtn = d3.select("#searchButton");
const searchInput = d3.select('#searchVal');

// const notification = {
//   title: "BTC Alert",
//   body: 'BTC just beat your target price!',
//   icon: path.join(__dirname,'../assets/images/btc.png')
// }

searchBtn.on('click',askMainToCreateNewWindow);
searchInput.on('keypress',function(){
  if(d3.event.keyCode === 13){
    askMainToCreateNewWindow()
  }
});

function askMainToCreateNewWindow(){
  let searchTxt = searchInput.property("value");

  if(searchTxt.length > 0){
    ipc.send('createNewWindow', searchTxt);

    //set the search text back to empty
    searchInput.property("value","");
  }
  else{
     searchInput.classed("animated",true);
     searchInput.classed("shake",true);
     searchInput.classed("faster",true);


     //faster denotes 500ms animation
     setTimeout(function(){
       searchInput.classed("animated",false);
       searchInput.classed("shake",false);
       searchInput.classed("faster",true);
     },501)

  }

}
