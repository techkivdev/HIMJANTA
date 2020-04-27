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

// Category Data Set
function getCategoryDataSet() {

  return {
     // ------- Information -----------
    INFO : "General",
    

    // ------- News ------------------
    GADGETS : "Gadgets",
    FOOD : "Food",
    POLTICS : "Poltics",

     // ------- Health ------------------
    FITNESS : "Fittness",
    YOGA : "Yoga",

     // ------- Education ------------------
     EXAM : "Exam",
     SCHOOL : "School",

    // ------- Travel ------------------
    TRAVELTIPS : "Travel Tips",
    TRAVELQUERY : "Travel Query"


  }
}

// Category Data Set
function getCategoryGroupSet(mode = "ALL") {

  // ------------ Group Name -----------------
  let catg_groups = 
   {
     // ---------- START --------------------
    GROUP1 : 
    { 
      NAME: 'Information',
      ICON: 'live_help',
      COLOR: 'green'
    },

    GROUP2 : 
    { 
      NAME: 'News',
      ICON: 'autorenew',
      COLOR: 'red'
    },

    GROUP3 : 
    { 
      NAME: 'Health',
      ICON: 'healing',
      COLOR: 'blue'
    },

    GROUP4 : 
    { 
      NAME: 'Education',
      ICON: 'school',
      COLOR: 'orange'
    },

    GROUP5 : 
    { 
      NAME: 'Travel',
      ICON: 'card_travel',
      COLOR: 'purple'
    }

    // ------------ END ---------------------
  }

  // ------------- Group List ------------------

  let group_data_set = 
  {
    GROUP1 : ['INFO'],
    GROUP2 : ['GADGETS','FOOD','POLTICS'],
    GROUP3 : ['FITNESS','YOGA'],
    GROUP4 : ['EXAM','SCHOOL'],
    GROUP5 : ['TRAVELTIPS','TRAVELQUERY']
  }


  // ------------ Handling -----------------
  if(mode == 'GROUP') {
    return catg_groups
  } else {
    return group_data_set
  }

}

// ------------------------------------------

// Category Handling
function getCatgDataMapping(query) {

  // ============================================
  // Add also in Create Page drop down section
  // ============================================
  let map_data = getCategoryDataSet()
  // ==============================================

  if(query == 'LIST') {   
    return map_data
  } else {
     return map_data[query]
  }

}

// Category Group Handling
function getCatgGroupDetails(key,value="NA") {

  switch(key) {

    case 'GROUPLIST' : 
    {
      return getCategoryGroupSet('GROUP')
    }

    case 'GROUP' : 
    {
      let allData = getCategoryGroupSet('GROUP')
      return allData[value]
    }

    case 'GROUPID' : 
    {
      let allData = getCategoryGroupSet('GROUP')
      
      let group_id = 'NA'
      for(eachkey in allData)
      {
        let group_details = allData[eachkey]
        if( group_details.NAME == value) {
          group_id = eachkey
        }

      }

      return group_id

    }

    case 'LIST' :
    {
      let allData = getCategoryGroupSet()  
      return allData[value]            
    }

    case 'FIND' :
    {
      let allData = getCategoryGroupSet()
      let allDataName = getCategoryGroupSet('GROUP')

      let find_group_name = 'NA'
      for(each_key in allData) 
      {
        if(allData[each_key].indexOf(value) >= 0) {
          find_group_name = allDataName[each_key]
        }
      }

      return find_group_name
    }

    default : 
    {
      return 'NA'
    }

  }



}

// ============= Get Language Content ==============

// Get Language Data
function getLangContent(lang,page) {

  switch(lang) {
    case 'ENG' : {
      if(page == 'SHOW') {
        return getENGlangShowContent()
      } else {
        return getENGlangCreateContent()
      }
      
    }

    case 'HIN' : {
      if(page == 'SHOW') {
        return getHINlangShowContent()
      } else {
        return getHINlangCreateContent()
      }
    }

    default : {
      if(page == 'SHOW') {
        return getENGlangShowContent()
      } else {
        return getENGlangCreateContent()
      }
    }

  }

}

// LANG : ENGLISH - Create Page
function getENGlangCreateContent() {

  return {
    HEADER: 'Add New Post',

    TITLE_HDR: 'Title',
    TITLE_PLCHLD: 'Give a title for your topic',

    TAG_HDR: 'Tags',
    TAG_PLCHLD: 'Enter a Tag',

    CATG_HDR: 'Category',
    CATG_PLCHLD: 'Please Select Category',

    DESC_HDR: 'Description',
    DESC_PLCHLD: 'Please write something !!',

    TAG_INFO: 'Please type tag name and then press enter. Do not add any space in tag name.',

    LOC_HEADER: 'Location Details',
    LOC_SCOPE_HEADER: 'What is the scope of your Post ?',

    CURR_LOC_HEADER: 'Current Location Details',
    CURR_LOC_CHK_HEADER: 'Update post in my current location also.',

    ACCEPT: 'I Accept',

    // Display Message 
    MESSAGE_POST: 'Post Title is empty!!',
    MESSAGE_DESC: 'Post Description is empty!!',
    MESSAGE_CATEGORY: 'Please select Category !!',
    MESSAGE_ACCEPT: 'Please accept terms and conditions.',

    HELP: 'Help Content',


    TERM_AND_COND: getTermAndCondDetailsEN()

  }

}

// LANG : ENGLISH - Show Page
function getENGlangShowContent() {

  return {
    PROFILE: 'Profile',
    PROFILE_DESC: 'Update Profile Content',

    BOOKMARK: 'Bookmark',
    BOOKMARK_DESC: 'My Bookmark Details',

    LIST : 'My List',
    LIST_DESC: 'My List Details.',

    // Profile Content
    PROFILE_HEADER: 'Profile Information',
    PROFILE_HEADER_IMG: 'perm_contact_calendar', // Not Changed

    LOCATION_HEADER: 'Location & Address',
    LOCATION_HEADER_IMG: 'person_pin', // Not Changed

    PRIVACY_HEADER: 'Privacy Settings',
    PRIVACY_HEADER_IMG: 'verified_user', // Not Changed

    PRIVACY_CHK_BTN_1: 'Profile Visible to All.',
    PRIVACY_CHK_BTN_2: 'Mobile Number Visible to All.',
    PRIVACY_CHK_BTN_3: 'Address Visible to All.',

    SOCIAL_HEADER: 'Social Links',
    SOCIAL_HEADER_IMG: 'insert_link', // Not Changed

    SETTINGS_HEADER: 'Settings',
    SETTINGS_HEADER_IMG: 'settings', // Not Changed

    ACCEPT: 'I Accept',

    // Display Message 
    MESSAGE_MOBILE: 'Your mobile number is not correct !!',
    MESSAGE_ACCEPT: 'Please accept terms and conditions !!',
    MESSAGE_CURRLOC: 'Please select current location details !!',
    MESSAGE_PROFILE: 'Profile Updated !!',

    HELP: 'Help Content'

  }

}

// ---------------------------------------------------

// LANG : HINDI - Create Page
function getHINlangCreateContent() {

  return {
    HEADER: 'नई पोस्ट जोड़ें',

    TITLE_HDR: 'शीर्षक',
    TITLE_PLCHLD: 'अपने विषय के लिए एक शीर्षक दें',

    TAG_HDR: 'टैग',
    TAG_PLCHLD: 'एक टैग दर्ज करें',

    CATG_HDR: 'श्रेणी',
    CATG_PLCHLD: 'कृपया श्रेणी का चयन करें',

    DESC_HDR: 'विवरण',
    DESC_PLCHLD: 'कृपया कुछ लिखें !!',

    TAG_INFO: 'कृपया टैग नाम दर्ज करें और फिर एंटर दबाएं। टैग नाम में कोई स्थान न जोड़ें।',

    LOC_HEADER: 'Location Details',
    LOC_SCOPE_HEADER: 'What is the scope of your Post ?',

    CURR_LOC_HEADER: 'Current Location Details',
    CURR_LOC_CHK_HEADER: 'Update post in my current location also.',

    ACCEPT: 'मैं स्वीकार करता हूं',

    // Display Message 
    MESSAGE_POST: 'पोस्ट का शीर्षक खाली है !!',
    MESSAGE_DESC: 'पोस्ट विवरण खाली है !!',
    MESSAGE_CATEGORY: 'कृपया श्रेणी का चयन करें !!',
    MESSAGE_ACCEPT: 'कृपया नियम और शर्तें स्वीकार करें।',

    HELP: 'सहायता सामग्री',

    TERM_AND_COND: getTermAndCondDetailsHI()

  }

}

// LANG : HINDI - Show Page
function getHINlangShowContent() {

  return {
    PROFILE: 'प्रोफ़ाइल',
    PROFILE_DESC: ' प्रोफ़ाइल सामग्री अपडेट करें',

    BOOKMARK: 'बुकमार्क',
    BOOKMARK_DESC: 'मेरा बुकमार्क विवरण',

    LIST : 'मेरी सूची',
    LIST_DESC: 'मेरी सूची विवरण',

    // Profile Content
    PROFILE_HEADER: 'प्रोफ़ाइल जानकारी',
    PROFILE_HEADER_IMG: 'perm_contact_calendar', // Not Changed

    LOCATION_HEADER: 'स्थान का पता',
    LOCATION_HEADER_IMG: 'person_pin', // Not Changed

    PRIVACY_HEADER: 'गोपनीय सेटिंग',
    PRIVACY_HEADER_IMG: 'verified_user', // Not Changed

    PRIVACY_CHK_BTN_1: 'प्रोफ़ाइल सभी के लिए दृश्यमान है।',
    PRIVACY_CHK_BTN_2: 'सभी के लिए मोबाइल नंबर।',
    PRIVACY_CHK_BTN_3: 'सभी के लिए दर्शनीय।',

    SOCIAL_HEADER: 'सामाजिक लिंक',
    SOCIAL_HEADER_IMG: 'insert_link', // Not Changed

    SETTINGS_HEADER: 'समायोजन',
    SETTINGS_HEADER_IMG: 'settings', // Not Changed

    ACCEPT: 'मुझे स्वीकार है',

    // Display Message 
    MESSAGE_MOBILE: 'आपका मोबाइल नंबर सही नहीं है !!',
    MESSAGE_ACCEPT: 'कृपया नियम और शर्तें स्वीकार करें !!',
    MESSAGE_CURRLOC: ' कृपया वर्तमान स्थान विवरण का चयन करें !!',
    MESSAGE_PROFILE: ' प्रोफ़ाइल अपडेट !!',

    HELP: 'सहायता सामग्री'

  }

}


// ************* Generated Data *********************
// Tags List Data
// ======================================================

function tagsListData() { 
  return {"tourist":"7","fun":"11","india":"5","leovaradkar":"6","bsesensex":"9","yesbank":"4","instapassport":"7","instagood":"3","statebankofindia":"8","coronavirus":"3","photooftheday":"5","vacation":"7","donaldtrump":"10","travel":"3","justintrudeau":"4","nifty50":"7","traveling":"5","tourism":"5","amitshah":"5","holiday":"3","instatravel":"6","instago":"2","travelgram":"3","visiting":"4","travelling":"4","mytravelgram":"3"}
 }

 // ====================================================