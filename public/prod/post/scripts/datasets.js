// *******************************************************************************
// SCRIPT : datasets.js
//
//
// Author : Vivek Thakur
// Date : 29/3/2020
// *******************************************************************************

// -------------------------------------------------
// --------- Mapping Data Set ----------------------
// -------------------------------------------------

// ----------- Category Data Set -----------------
function getCatgDataMapping(query) {

  // ============================================
  // Add also in Create Page drop down section
  // ============================================
  let map_data = {
              INFO : "General Infromation",
              TIPS : "Important Travel Tips",
              QRY : "Any Query",
              NEW : "New Query"
            }

  // ==============================================

  if(query == 'LIST') {

    let allList = [""]
    for(each in map_data) {
      allList.push(each)
    }
    return allList

  } else {
     return map_data[query]
  }

}


// ************* Generated Data *********************
// Tags List Data
// ======================================================

function tagsListData() { 
  return {"tourist":"7","fun":"11","india":"5","leovaradkar":"6","bsesensex":"9","yesbank":"4","instapassport":"7","instagood":"3","statebankofindia":"8","coronavirus":"3","photooftheday":"5","vacation":"7","donaldtrump":"10","travel":"3","justintrudeau":"4","nifty50":"7","traveling":"5","tourism":"5","amitshah":"5","holiday":"3","instatravel":"6","instago":"2","travelgram":"3","visiting":"4","travelling":"4","mytravelgram":"3"}
 }

 // ====================================================