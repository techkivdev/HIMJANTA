// *******************************************************************************
// SCRIPT : login.js
//
//
// Author : Vivek Thakur
// Date : 8/9/2019
// *******************************************************************************

// ---------- Main Variables ---------
var coll_base_path = baseProductionPrivatePath

if (check_dev_publish_content) {
  coll_base_path = baseProductionPrivatePath
}

// Global Variables
let userData = {}
var uuid = ''
var allDocCmpData = {}

var selectedCurrentLocation = ''
var selectedCurrLocArea = ''
var selectedCurrLocSubArea = ''

var selectedDistrict = ''
var selectedBlock = ''

var defaultLocationConfig = getLocationConfig() 
var languageContent = {}

// Parameters
var fl = 'NA'
var fl2 = 'NA'

var bookingData = ''
var bookingID = ''
var cancelDetails = ''
var signinpopup = 'popup'
var wishlistFilter = 'ALL'
var bookmarkFilter = 'ALL'
var myListFilter = 'ALL'

var color = 'purple'

// Startup Call
startupcalls()

getParams()

// Mobile mode handling
mobileModeStartupHandling()

modifyPageStyle()

// ----------- Read Parameters -------------------
function getParams() {
  // Read Parameters
  displayOutput('Read Parameters ...')
  var idx = document.URL.indexOf('?');
  var params = new Array();
  var parmFound = false
  if (idx != -1) {
    var pairs = document.URL.substring(idx + 1, document.URL.length).split('&');
    for (var i = 0; i < pairs.length; i++) {
      nameVal = pairs[i].split('=');
      params[nameVal[0]] = nameVal[1];
      parmFound = true
    }
  }
  displayOutput(params); 
  if(parmFound) {
    fl = params['fl']
    fl2 = params['fl2'].replace('#!','')
  }

}

// ----------------------------------------
// --------- Mobile Mode Handling ---------
// ----------------------------------------
function mobileModeStartupHandling() {

  // Check for Mobile Mode
  if (mobile_mode) {
    // Disable Nav-bar and Footer
    handleBlockView("main_nav_bar");
    handleBlockView("main_nav_bar_mb");    

    handleBlockView("main_footer_sec");
    signinpopup = 'default'

  } else {   
    handleBlockView("main_nav_bar",'show');
    handleBlockView("main_nav_bar_mb",'show');

    handleBlockView("main_footer_sec",'show');
  }


}

// Modify Page style according to the browser
function modifyPageStyle() {
  // Check for mobile browser
  if (isMobileBrowser()) {
    displayOutput('Mobile Browser found!')     
    getHTML("profile_content_section").style.margin = "0px 0px 0px 0px";

    handleBlockView("profile_header_section_mb",'show');
    handleBlockView("profile_header_section");
    

  } else {
    displayOutput('Mobile Browser Not found!') 

    handleBlockView("profile_header_section_mb");
    handleBlockView("profile_header_section",'show');

  }

}


// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(auth);

// Firebase Auth Configuration
var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.     

      authDetails()
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect. signInFlow: 'popup'
  signInFlow: signinpopup,
  signInSuccessUrl: 'login.html',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //firebase.auth.GithubAuthProvider.PROVIDER_ID,
    //firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: 'terms_and_conditions.html',
  // Privacy policy url.
  privacyPolicyUrl: 'privacy_police.html'
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);



// ===========================================================
// Collect user details after sign in complete 
// ===========================================================
function authDetails() {
  firebase.auth().onAuthStateChanged(function (user) {

    // Is user login or not
    if (user) {

      displayOutput('User login !!')

      //handleBlockView("main_profile_section",'show');
      handleBlockView("login_header_section");
      handleBlockView("spinner",'show');

      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      uuid = user.uid;
      var phoneNumber = user.phoneNumber;
      var providerData = user.providerData;

      user.getIdToken().then(function (accessToken) {            

        // Admin Data
        userData['VERSION'] = 'V1'
        userData['BLOCKED'] = false
        userData['DELETESTATUS'] = false

        //userData['TEST'] = false

        // User Data        
        userData['NAME'] = displayName
        userData['EMAIL'] = email
        userData['EMAILVERIFIED'] = emailVerified
        userData['PROVIDERDATA'] = providerData
        userData['UUID'] = uuid
        userData['BIO'] = ''
        userData['DISPNAME'] = displayName 
        userData['AGEGROUP'] = 'CHILDREN'
        userData['PROFESSION'] = 'FREE@I AM FREE'

        // Image 
        userData['PHOTOURL'] = photoURL       

        // Roles and Permissions 
        userData['ROLE'] = 'USER'
        userData['ACCESS'] = 'NA'
        userData['PERMISSION'] = 'NA'
        userData['MEMBERSHIP'] = 'NA'

        // Mobile Number
        userData['MOBILE'] = ''

        // Location Information
        userData['COUNTRY'] = defaultLocationConfig['COUNTRY']
        userData['STATE'] = defaultLocationConfig['STATE']
        userData['DISTRICT'] = defaultLocationConfig['DISTRICT']
        userData['BLOCK'] = defaultLocationConfig['BLOCK']
        userData['ADDRESS'] = ''
        userData['MAPLOCATION'] = ''
        userData['CURRADDRSTATUS'] = 'INSIDE'
        userData['CURRADDRVALUE'] = defaultLocationConfig['DEFAULT_CURRENT_LOC']


        // Other Settings 
        userData['LANG'] = 'ENG'

        userData['SHOWSETTINGS'] = {
          PROFILE: true,
          MOBILE: true,
          ADDRESS: true,
          AGEGROUP: true,
          LOCATION: true
        } 
        
        // Social Links
        userData['SOCIALINK'] = {
          FACEBOOK: '',
          INSTAGRAM: '',
          YOUTUBE: '',
          TIKTOK: '',
          TWITTER: ''
        }

        // Update User Details into Database
        updateUserDetails(uuid, userData)

      });
    } else {
      // User is signed out.

      displayOutput('User logout !!')
      localStorageData('ISUSER',false)
      handleBlockView("main_profile_section");
      handleBlockView("footer_sec");
      handleBlockView("login_header_section",'show');
      handleBlockView("spinner");

    }

  }, function (error) {
    displayOutput(error);
  });
};


// =============================================================
// Sign Out User 
// =============================================================
function signout() {
  auth.signOut().then(function () {
    // Sign-out successful.
    displayOutput('Signout Sucess..')
    toastMsg('Logout Done !!')
    
    localStorageData('ISUSER',false)

  }).catch(function (error) {
    // An error happened.
  });

}

// ==============================================================
// Update User Details into Database
// ==============================================================
function updateUserDetails(uuid, userdata) {

  // Check User Doc Exist or Not
  let ref = db.collection(getCompPath('USER')).doc(uuid);
  let getDoc = ref.get()
    .then(doc => {

      if (!doc.exists) {
        displayOutput('No such document!');
        displayOutput('Create New User Doc.');       

        // Create new user data doc
        db.collection(getCompPath('USER')).doc(uuid).set(userdata).then(function () {
          displayOutput("User Data Updated !!");

          toastMsg('Your profile created !!')

          // Update HTML Page
          updateHTMLPage(userdata)

        });


      } else {
        // ===========================================================
        // ===========================================================

        displayOutput('User Data already present.');        
        let current_userData = JSON.parse(JSON.stringify(doc.data()));
       
        // Check For Version
        if(current_userData['VERSION'] != userdata['VERSION']) {

           // Compare Both Objects
          let user_obj_cmp_status = compareKeys(current_userData,userdata)
          displayOutput('Compare Status : ' + user_obj_cmp_status)

          if(!user_obj_cmp_status) {
            displayOutput('Version Changed to : ' + current_userData['VERSION'] + ' -> ' + userdata['VERSION'])
            displayOutput('User DatSet Changed !!')
            displayOutput('---- Need to Update Only New Chnaged DataSet ------- ')
            
            // Get New Data Sets Keys Details
            let new_keys_details = []
            for(each_new_key in userdata) {
              // Check key in current DataSet
              if(each_new_key in current_userData) {
                /* Nothing */
              } else {               
                new_keys_details.push(each_new_key)
              }
            }

            displayOutput('New Keys Details : ' + new_keys_details)

            // Update current Data with New Data Set
            for(each_idx in new_keys_details) {
              let new_key_value = new_keys_details[each_idx]              
              current_userData[new_key_value] = userdata[new_key_value]
            }
            current_userData['VERSION'] = userdata['VERSION']

            let final_user_obj_cmp_status = compareKeys(current_userData,userdata)
            displayOutput('Final Compare Status : ' + final_user_obj_cmp_status)

            // ---------------------------------------------
            if(final_user_obj_cmp_status) {
              // Update Latest User Data Set
              displayOutput('Update Latest Data Set ...')

              displayOutput(current_userData)

              // Create new user data doc
              db.collection(getCompPath('USER')).doc(uuid).set(current_userData).then(function () {
                displayOutput("User Data Updated !!");

                toastMsg('Your profile created !!')

                // Update HTML Page
                updateHTMLPage(current_userData)

              });


            }
            // ---------------------------------------

           

          }

        } else {

          // Normal User Operation
          displayOutput('Normal User Read Operation ...')         
          updateHTMLPage(JSON.parse(JSON.stringify(current_userData)))

          
        }       

      // ------------------------------------------------------
       
      }
    })
    .catch(err => {
      displayOutput('Error getting document', err);
    });




}

// Compare two Objects Keys
function compareKeys(a, b) {
  var aKeys = Object.keys(a).sort();
  //displayOutput(aKeys)
  var bKeys = Object.keys(b).sort();
  //displayOutput(bKeys)
  return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}

// Sync Provider Details
function syncProvideDetails() {

  firebase.auth().onAuthStateChanged(function (user) {


      // User is signed in.
      var displayName = user.displayName;
      var photoURL = user.photoURL;
      uuid = user.uid;

      showPleaseWaitModel()
      
      db.collection(getCompPath('USER')).doc(uuid).update({
        NAME: displayName,
        DISPNAME: displayName,
        PHOTOURL: photoURL
      }).then(function () {
        displayOutput("Provider Date Updated ..");  
        // Update Pool
        updateUserPoolContent(uuid,[displayName,photoURL])

      });

}, function (error) {
  displayOutput(error);
});

}

// ==============================================================
// ----------------- Image Handling -----------------------------
// ==============================================================

// Update Data Set
var imageHandlingDataSet = {
    IMAGE_READY_TO_UPLOAD : false,
    IMAGE_NAME: '', // Update it when user data loaded
    IMAGE_DB_PATH: getCompPath('BASE') + '/USER/'
}

// Call Back Function
// Update New ref. into Document Info field
function updateNewImageRefintoDoc(newImageRef,imgName) {

  displayOutput(newImageRef)  
  displayOutput(imgName)

  db.collection(getCompPath('USER')).doc(uuid).update({
    PHOTOURL: newImageRef
  }).then(function () {   
    // Update Pool
    updateUserPoolContent(uuid,[userData['DISPNAME'],newImageRef])

  });

}



// ==============================================================
// Update Complete HTML Page
// ==============================================================
function updateHTMLPage(updatedUserData) {
  displayOutput('Update HTML Page ..')

  //displayOutput(updatedUserData)

  // Update Data Sets
  updateSessionData(updatedUserData)
  imageHandlingDataSet['IMAGE_NAME'] = uuid

  updatePageWithLang(updatedUserData['LANG'])

  displayOutput('fl : ' + fl)

  if(fl == 'NA') {

  // Update User Profile Content  

  $("#profile_name").html(updatedUserData['NAME'])
  $("#profile_email").html(updatedUserData['EMAIL'])
  if(updatedUserData['MOBILE'] != '') {
  $("#profile_mobile").html('+91- '+updatedUserData['MOBILE'])
  }
  $("#profile_location").html(updatedUserData['BLOCK'] + ' , ' + updatedUserData['DISTRICT'])
  $("#profile_bio").html(updatedUserData['BIO'])


  // For Mobile 
  $("#profile_name_mb").html(updatedUserData['NAME'])
  $("#profile_email_mb").html(updatedUserData['EMAIL'])
  if(updatedUserData['MOBILE'] != '') {
  $("#profile_mobile_mb").html('+91- '+updatedUserData['MOBILE'])
  }

  $("#profile_location_mb").html(updatedUserData['BLOCK'] + ' , ' + updatedUserData['DISTRICT'])
  $("#profile_bio_mb").html(updatedUserData['BIO'])

  

  getHTML("user_profile_image").src = updatedUserData['PHOTOURL']
  getHTML("user_profile_image_mb").src = updatedUserData['PHOTOURL']

  // --------------------------------------------------------
  // -------------- Profile Details -------------------------
  // --------------------------------------------------------
   
  getHTML("u_img").src = updatedUserData['PHOTOURL']

  // Update Provider Information
  $("#provider_details").html('Provided By : ' + updatedUserData['PROVIDERDATA'][0]['providerId']);

  $("#u_name").html(updatedUserData['NAME']);
  $("#u_email").html(updatedUserData['EMAIL']);

  setHTMLValue("user_name",updatedUserData['NAME'])
  setHTMLValue("user_email",updatedUserData['EMAIL'])
  setHTMLValue("user_mobile",updatedUserData['MOBILE'])

  setHTMLValue("display_user_name",updatedUserData['DISPNAME'])
  setHTMLValue("user_bio",br2nl(updatedUserData['BIO']))
  M.textareaAutoResize($('#user_bio'));

  selectedHTML(updatedUserData['AGEGROUP'])
  selectedHTML(updatedUserData['PROFESSION'].split('@')[0])

  
  selectedDistrict = updatedUserData['DISTRICT']
  selectedBlock = updatedUserData['BLOCK']

  if(updatedUserData['BLOCK'] == defaultLocationConfig['BLOCK']){
    setHTMLValue("user_district_blocks",updatedUserData['BLOCK'] + ',' + updatedUserData['DISTRICT'])
    $('#u_district_details').html(updatedUserData['BLOCK'] + ' - Please update it.')    
  } else {
    setHTMLValue("user_district_blocks",updatedUserData['BLOCK'] + ',' + updatedUserData['DISTRICT'])
  }
  

  setHTMLValue("user_address",br2nl(updatedUserData['ADDRESS']))
  M.textareaAutoResize($('#user_address'));

  // Update Settings
  checkedHTML("user_profile_chk",updatedUserData['SHOWSETTINGS']['PROFILE'])
  checkedHTML("user_mobile_chk",updatedUserData['SHOWSETTINGS']['MOBILE'])
  checkedHTML("user_address_chk",updatedUserData['SHOWSETTINGS']['ADDRESS'])

  selectedHTML(updatedUserData['LANG'])

  $(document).ready(function(){
    $('select').formSelect();
  });

  // Update Social Link
  setHTMLValue("social_link_facebook",updatedUserData['SOCIALINK']['FACEBOOK'])
  setHTMLValue("social_link_instagram",updatedUserData['SOCIALINK']['INSTAGRAM'])
  setHTMLValue("social_link_youtube",updatedUserData['SOCIALINK']['YOUTUBE'])
  setHTMLValue("social_link_twitter",updatedUserData['SOCIALINK']['TWITTER'])
  setHTMLValue("social_link_tiktok",updatedUserData['SOCIALINK']['TIKTOK'])

  // Update Current Location Status
  selectedCurrLocArea = updatedUserData['CURRADDRVALUE'].split(',')[1]
  selectedCurrLocSubArea = updatedUserData['CURRADDRVALUE'].split(',')[0]

  selectedCurrentLocation = selectedCurrLocSubArea + ',' + selectedCurrLocArea

  if(updatedUserData['CURRADDRSTATUS'] == 'INSIDE') {    
    checkedHTML("inside_radbtn",true)
  } else {   
    setHTML('user_current_location_value',updatedUserData['CURRADDRVALUE'] + '<a href="#!" onclick="openCurrLocAreaSelectorDialog()" class="secondary-content"><i class="material-icons purple-text">chevron_right</i></a>')
    checkedHTML("outside_radbtn",true)
    handleBlockView("current_outside_location_section",'show'); 
  }


  // -----------------------------------------------------------


  handleBlockView("spinner");
  handleBlockView("main_profile_section",'show');
  handleBlockView("footer_sec",'show');


  // Update Admin Options
  // List Details
  let dev_role = '<br>\
  <h5>Admin Options</h5>\
    <div class="collection">\
        <a href="#!" class="collection-item">User Managment</a>\
        <a href="managedetails.html" class="collection-item blue-text">Booking Managment</a>\
        <a href="project_settings.html" class="collection-item red-text">Content Managment</a>\
        <a href="../dev/index.html" class="collection-item red-text">Development Url</a> </div>\
   </div>'

  let admin_role = '<br>\
  <h5>Admin Options</h5>\
    <div class="collection">\
        <a href="managedetails.html" class="collection-item blue-text">Booking Managment</a>\
  </div>'

  if (updatedUserData['ROLE'] != 'USER') {
    
    handleBlockView("extra_options_card",'show');

    let adminOptions = ''

    if(updatedUserData['ROLE'] == 'DEV') {
      adminOptions = dev_role
    } else if(updatedUserData['ROLE'] == 'ADMIN') {
      adminOptions = admin_role
    }   

    $("#admin_options").html(adminOptions)
  }

} else {
  // ---- Open Spcific Block --------------
  handleBlockView("spinner");
  handleBlockView("main_profile_section",'show');
  handleBlockView("footer_sec",'show');

  divBlockHandling(fl)

  handleBlockView("close_fl_btn");
  handleBlockView("close_fl_btn_to_forum",'show');
}

userData = updatedUserData


}

// Display Profile Details
function showProfileDetails() {

  let content = '<div id="top_div_header" class="purple-card-content z-depth-2" style="height: 100px;">\
  </div><div style="margin-left : 30px; margin-right : 10px;">' + getUserProfileFormat(userData) + '</div>'

  viewModelCustom(content)  
}

// Update Page according to Language
function updatePageWithLang(lang) {
  // Get Language Details

  languageContent = getLangContent(lang)

  setHTML('card_profile_name',languageContent['PROFILE'])
  setHTML('card_profile_desc',languageContent['PROFILE_DESC'])

  setHTML('card_bookmark_name',languageContent['BOOKMARK'])
  setHTML('card_bookmark_desc',languageContent['BOOKMARK_DESC'])

  setHTML('card_list_name',languageContent['LIST'])
  setHTML('card_list_desc',languageContent['LIST_DESC'])

  setHTML('collps_profile_header','<i class="material-icons '+color+'-text"><b>'+languageContent['PROFILE_HEADER_IMG']+'</i>' + languageContent['PROFILE_HEADER']+'</b>')
  setHTML('collps_locaddr_header','<i class="material-icons '+color+'-text"><b>'+languageContent['LOCATION_HEADER_IMG']+'</i>' + languageContent['LOCATION_HEADER']+'</b>')
  setHTML('collps_privacy_header','<i class="material-icons '+color+'-text"><b>'+languageContent['PRIVACY_HEADER_IMG']+'</i>' + languageContent['PRIVACY_HEADER']+'</b>')
  setHTML('collps_sociallink_header','<i class="material-icons '+color+'-text"><b>'+languageContent['SOCIAL_HEADER_IMG']+'</i>' + languageContent['SOCIAL_HEADER']+'</b>')
  setHTML('collps_settings_header','<i class="material-icons '+color+'-text"><b>'+languageContent['SETTINGS_HEADER_IMG']+'</i>' + languageContent['SETTINGS_HEADER']+'</b>')

  setHTML('user_profile_chk_hdr',languageContent['PRIVACY_CHK_BTN_1'])
  setHTML('user_mobile_chk_hdr',languageContent['PRIVACY_CHK_BTN_2'])
  setHTML('user_address_chk_hdr',languageContent['PRIVACY_CHK_BTN_3'])

  setHTML('accept_content',languageContent['ACCEPT'] + '  <a class="purple-text" href="#!" onclick="termandcondMessage()">terms and conditions</a>')


  setHTML('user_loc_header',languageContent['LOC_HEADER'])
  setHTML('user_curr_loc_header',languageContent['CURR_LOC_HEADER'])
  


}

// Open Profile Help Content
function openProfileHelp() {
  viewModel('',languageContent['HELP'])
}

// ========= Location Selection ===============

// Create and Open Model
function openDistrictSelectorDialog(){

  let seclectedLocation = getHTMLValue("user_district_blocks");
  selectedDistrict = seclectedLocation.split(',')[1]
  selectedBlock = seclectedLocation.split(',')[0]

  let allLocationData = getLocationData()

  let location_html = ''
  for(each_dist in allLocationData) {
    let each_dist_blocks = allLocationData[each_dist]
    each_dist = each_dist.replace('_',' ') 
    let dist_htm = ''

    if(selectedDistrict == each_dist) {
      dist_htm += '<li class="collection-item purple center-align active"><a href="#!" onclick="districtSelected(\''+each_dist+'\')"  class="white-text">'+each_dist+'</a></li>'
    } else {
      dist_htm += '<li class="collection-item center-align"><a href="#!" onclick="districtSelected(\''+each_dist+'\')"  class="black-text">'+each_dist+'</a></li>'
    }
    
    location_html += dist_htm
  }

  location_html = '<h5 style="margin-left : 15px;">Select District</h5><ul class="collection" style="margin-left : 0px; margin-right : 0px;">' + location_html + '</ul>'

  // Open Model

  var model = '<!-- Modal Structure -->\
  <div id="dist_location_model" class="modal">\
    <div>\
      <div>'+ location_html + '</div>\
    </div>\
    </div>'

  var elem = getHTML('dist_location_model');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });

  $('#dist_location_model').modal('open');

}

function openBlockSelectorDialog(){

  let allLocationData = getLocationData()

  let location_html = ''
  for(each_dist in allLocationData) {
    let each_dist_blocks = allLocationData[each_dist]
    each_dist = each_dist.replace('_',' ') 

    let block_html = ''
    if(selectedDistrict == each_dist) {       
        // Update Block Section
       
        for(each_idx in each_dist_blocks){
          let each_block = each_dist_blocks[each_idx]
          if(selectedBlock == each_block) {
            block_html += '<li class="collection-item purple center-align active"><a href="#!" onclick="blockSelected(\''+each_block +'\')"  class="white-text">'+each_block+'</a></li>'
          } else {
            block_html += '<li class="collection-item center-align"><a href="#!" onclick="blockSelected(\''+each_block +'\')"  class="black-text">'+each_block+'</a></li>'
          }
        }
    }
   
    
    location_html += block_html
  }

  location_html = '<h5 style="margin-left : 15px;">Select Block</h5><ul class="collection" style="margin-left : 0px; margin-right : 0px;">' + location_html + '</ul>'


  // Open Model

  var model = '<!-- Modal Structure -->\
  <div id="block_location_model" class="modal">\
    <div>\
      <div>'+ location_html + '</div>\
    </div>\
    </div>'

  var elem = getHTML('block_location_model');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });

  $('#block_location_model').modal('open');

}

// District Selected
function districtSelected(name) {
  $('#dist_location_model').modal('close');
  selectedDistrict = name
  //toastMsg(name)

  // Open Block Selecter Dialog
  openBlockSelectorDialog()

}

// Block Selected
function blockSelected(name) {
  $('#block_location_model').modal('close');
  selectedBlock = name
  //toastMsg(name)

  setHTMLValue("user_district_blocks",selectedBlock + ',' + selectedDistrict)
  $('#u_district_details').html('You have changed details, Please SAVE it.')

}

// ------------------------------------------------

// Current Location Status
function updateCurrentLocationStatus(details) {

  if(details == 'OUTSIDE') {
    handleBlockView("current_outside_location_section",'show');  
    selectedCurrLocArea = ''
    selectedCurrLocSubArea = ''
    
    setHTML('user_current_location_value','Please Select Location.'+ '<a href="#!" onclick="openCurrLocAreaSelectorDialog()" class="secondary-content"><i class="material-icons purple-text">chevron_right</i></a>')
  } else {
    handleBlockView("current_outside_location_section");  
    selectedCurrLocArea = defaultLocationConfig['DEFAULT_CURRENT_LOC'].split(',')[1]
    selectedCurrLocSubArea = defaultLocationConfig['DEFAULT_CURRENT_LOC'].split(',')[0]
  }

}

// ---- Outside Location Selector ---

// Create and Open Model
function openCurrLocAreaSelectorDialog(){

  selectedCurrLocArea = selectedCurrentLocation.split(',')[1]
  selectedCurrLocSubArea = selectedCurrentLocation.split(',')[0]


  let allLocationData = getOutSideLocationData()

  let location_html = ''
  for(each_dist in allLocationData) {
    let each_dist_blocks = allLocationData[each_dist]
    each_dist = each_dist.replace('_',' ') 
    let dist_htm = ''

    if(selectedCurrLocArea == each_dist) {
      dist_htm += '<li class="collection-item purple center-align active"><a href="#!" onclick="currLocAreaSelected(\''+each_dist+'\')"  class="white-text">'+each_dist+'</a></li>'
    } else {
      dist_htm += '<li class="collection-item center-align"><a href="#!" onclick="currLocAreaSelected(\''+each_dist+'\')"  class="black-text">'+each_dist+'</a></li>'
    }
    
    location_html += dist_htm
  }

  location_html = '<h5 style="margin-left : 15px;">Select Your Choice</h5><ul class="collection" style="margin-left : 0px; margin-right : 0px;">' + location_html + '</ul>'

  // Open Model

  var model = '<!-- Modal Structure -->\
  <div id="currLocArea_location_model" class="modal">\
    <div>\
      <div>'+ location_html + '</div>\
    </div>\
    </div>'

  var elem = getHTML('currLocArea_location_model');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });

  $('#currLocArea_location_model').modal('open');

}

function openCurrLocSubAreaSelectorDialog(){

  let allLocationData = getOutSideLocationData()

  let location_html = ''
  for(each_dist in allLocationData) {
    let each_dist_blocks = allLocationData[each_dist]
    each_dist = each_dist.replace('_',' ')

    let block_html = ''
    if(selectedCurrLocArea == each_dist) {       
        // Update Block Section
       
        for(each_idx in each_dist_blocks){
          let each_block = each_dist_blocks[each_idx]
          if(selectedCurrLocSubArea == each_block) {
            block_html += '<li class="collection-item purple center-align active"><a href="#!" onclick="currLocSubAreaSelected(\''+each_block +'\')"  class="white-text">'+each_block+'</a></li>'
          } else {
            block_html += '<li class="collection-item center-align"><a href="#!" onclick="currLocSubAreaSelected(\''+each_block +'\')"  class="black-text">'+each_block+'</a></li>'
          }
        }
    }
   
    
    location_html += block_html
  }

  location_html = '<h5 style="margin-left : 15px;">Select Your Choice</h5><ul class="collection" style="margin-left : 0px; margin-right : 0px;">' + location_html + '</ul>'


  // Open Model

  var model = '<!-- Modal Structure -->\
  <div id="currLocSubArea_location_model" class="modal">\
    <div>\
      <div>'+ location_html + '</div>\
    </div>\
    </div>'

  var elem = getHTML('currLocSubArea_location_model');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });

  $('#currLocSubArea_location_model').modal('open');

}

// Area Selected
function currLocAreaSelected(name) {
  $('#currLocArea_location_model').modal('close');
  selectedCurrLocArea = name
  //toastMsg(name)

  // Open Block Selecter Dialog
  openCurrLocSubAreaSelectorDialog()

}

// Sub Area Selected
function currLocSubAreaSelected(name) {
  $('#currLocSubArea_location_model').modal('close');
  selectedCurrLocSubArea = name
  //toastMsg(name)

  selectedCurrentLocation = selectedCurrLocSubArea + ',' + selectedCurrLocArea
  setHTML('user_current_location_value',selectedCurrentLocation + '<a href="#!" onclick="openCurrLocAreaSelectorDialog()" class="secondary-content"><i class="material-icons purple-text">chevron_right</i></a>')


}




// Div Block Handling
function divBlockHandling(value) {
  displayOutput(value)

  window.scrollTo(0, 0);

  handleBlockView("main_footer_sec");
  handleBlockView("top_div_header");

  switch(value) {
    
    case "profile":

      if (isMobileBrowser()) {
        handleBlockView("profile_header_section_mb");
      } else {
        handleBlockView("profile_header_section");
      }
      handleBlockView("options_card_section");

      handleBlockView("profile_section",'show');
      handleBlockView("close_fl_btn",'show');

    break;

    case "bookmark":

      if (isMobileBrowser()) {
        handleBlockView("profile_header_section_mb");
      } else {
        handleBlockView("profile_header_section");
      }
      handleBlockView("options_card_section");

      handleBlockView("bookmark_section",'show');
      handleBlockView("close_fl_btn",'show');

      openBookmarkContent()

    break;

    case "mylist":

      if (isMobileBrowser()) {
        handleBlockView("profile_header_section_mb");
      } else {
        handleBlockView("profile_header_section");
      }
      handleBlockView("options_card_section");

      handleBlockView("mylist_section",'show');
      handleBlockView("close_fl_btn",'show');

      openMyListContent()

    break;

    case "options":

      if (isMobileBrowser()) {
        handleBlockView("profile_header_section_mb");
      } else {
        handleBlockView("profile_header_section");
      }
      handleBlockView("options_card_section");

      handleBlockView("options_section",'show');
      handleBlockView("close_fl_btn",'show');

    break;


  }
}

// Hide Close Floating btn
function hideFullMessageDialog(){

  window.scrollTo(0, 0);

  handleBlockView("profile_section"); 
  handleBlockView("bookmark_section");
  handleBlockView("mylist_section");
  handleBlockView("options_section");
  handleBlockView("close_fl_btn");

  if (isMobileBrowser()) {
    handleBlockView("profile_header_section_mb",'show');
  } else {
    handleBlockView("profile_header_section",'show');
  }
  
  handleBlockView("options_card_section",'show');
  handleBlockView("main_footer_sec",'show');
  handleBlockView("top_div_header",'show');

}

// Hide User Booking
function hideUserBookingView(){

  handleBlockView("user_bookings_view_section");
  handleBlockView("user_bookings",'show');
}

// Return to Forum Page
function returnToForumPage() {
  window.history.back();
}

// View Term and Conditions
function termandcondMessage() {
  viewModel('',languageContent['TERM_AND_COND'])
}


// ==================================================================
// Start up Calls 
// ==================================================================
function startupcalls() {

  $(document).ready(function () {
    $('.tabs').tabs();
  });

  $(document).ready(function () {
    M.updateTextFields();
  });

  $('.dropdown-trigger').dropdown();

  $(document).ready(function(){
    $('select').formSelect();
  });

}


// ==================================================================
// Update and Save Profile Data
// ==================================================================
function saveprofiledata() {
  displayOutput('Save Profile Data ...')

  showPleaseWaitModel()

  displayOutput(userData)

  var mobileno = getHTMLValue("user_mobile");
  displayOutput('Mobile Number : ' + mobileno)

  if(isStrEmpty(mobileno)) {
    validation = true
  } else {
  // Check mobile number validation
  var mbcnt = mobileno.length;
  if (mbcnt != 10) {
    validation = false
    hidePleaseWaitModel()
    toastMsg(languageContent['MESSAGE_MOBILE'])
  } else {
    validation = true
  }
}

var user_accept_terms_checkbox = getHTMLChecked("user_accept_terms_checkbox");
if(!user_accept_terms_checkbox){
  validation = false
  hidePleaseWaitModel()
  toastMsg(languageContent['MESSAGE_ACCEPT'])
}


// Read Other Details
var user_name = getHTMLValue("user_name");
var display_user_name = getHTMLValue("display_user_name");
if(isStrEmpty(display_user_name)) {
  display_user_name = user_name
}

var user_bio = getHTMLValue("user_bio");
user_bio = nl2br(user_bio)
var user_age_group = getHTMLValue("user_age_group");
var user_profession = getHTMLValue("user_profession");
var user_district_blocks = getHTMLValue("user_district_blocks");
var user_address = getHTMLValue("user_address");
user_address = nl2br(user_address)

// Read Other Settings Details
var user_profile_chk = getHTMLChecked("user_profile_chk");
var user_mobile_chk = getHTMLChecked("user_mobile_chk");
var user_address_chk = getHTMLChecked("user_address_chk");

var user_language = getHTMLValue("user_language");

var settings_privacy = {
  PROFILE: user_profile_chk,
  MOBILE: user_mobile_chk,
  ADDRESS: user_address_chk,
  AGEGROUP: true,
  LOCATION: true
}

// User Social Link Details
var social_link_facebook = getHTMLValue("social_link_facebook");
var social_link_instagram = getHTMLValue("social_link_instagram");
var social_link_youtube = getHTMLValue("social_link_youtube");
var social_link_twitter = getHTMLValue("social_link_twitter");
var social_link_tiktok = getHTMLValue("social_link_tiktok");

 // Social Links
 var social_links = {
  FACEBOOK: social_link_facebook,
  INSTAGRAM: social_link_instagram,
  YOUTUBE: social_link_youtube,
  TIKTOK: social_link_tiktok,
  TWITTER: social_link_twitter
}


// Read Current Location Data
if(isStrEmpty(selectedCurrentLocation)) {
  validation = false
  hidePleaseWaitModel()
  toastMsg(languageContent['MESSAGE_CURRLOC'])
}

let outside_radbtn = getHTMLChecked("outside_radbtn");
let current_location_status = 'INSIDE'
if(outside_radbtn) {
  current_location_status = 'OUTSIDE'
}

// ============================================================

  if (validation) {
    userData['MOBILE'] = mobileno
    userData['DISPNAME'] = display_user_name
    userData['BIO'] = user_bio
    userData['AGEGROUP'] = user_age_group
    userData['DISTRICT'] = user_district_blocks.split(',')[1]
    userData['BLOCK'] = user_district_blocks.split(',')[0]
    userData['ADDRESS'] = user_address
    userData['LANG'] = user_language

    db.collection(getCompPath('USER')).doc(uuid).update({
      MOBILE: mobileno,
      DISPNAME: display_user_name,
      BIO: user_bio,
      AGEGROUP: user_age_group,
      PROFESSION: user_profession,
      DISTRICT: user_district_blocks.split(',')[1],
      BLOCK: user_district_blocks.split(',')[0],
      ADDRESS: user_address,
      LANG: user_language,
      CURRADDRSTATUS: current_location_status,
      CURRADDRVALUE: selectedCurrentLocation,
      SHOWSETTINGS: settings_privacy,
      SOCIALINK: social_links
    }).then(function () {
      displayOutput("Mobile details Updated ..");

      updateSessionData(userData)

      // Update Pool
      updateUserPoolContent(uuid,[userData['DISPNAME'],userData['PHOTOURL']])

    });

  }

}

// Update User Pool Details
function updateUserPoolContent(uuid, dataArray) {

  hidePleaseWaitModel()

  toastMsg(languageContent['MESSAGE_PROFILE'])

  location.reload();

  // Check for Possiblilties of cloud function

  /*
  let data = {
      DISPNAME: dataArray[0],
      PHOTOURL: dataArray[1]
  }

   // Create new user data doc
   db.collection(getCompPath('USER_POOL')).doc(uuid).set(data).then(function () {
    displayOutput("User Pool Updated !!");

    hidePleaseWaitModel()

    toastMsg('Profile Updated !!')

    location.reload();

  });

  */
}

// --------------- Bookmark Handling -----------------
// Open Bookmark details
function openBookmarkContent() {

  let content = ''

  // Get Bookmark Details    
  showPleaseWaitModel()

    db.collection(getCompPath('USER_BOOKMARK',uuid)).get().then((querySnapshot) => {
      displayOutput("SIZE : " + querySnapshot.size);
  
      if (querySnapshot.size == 0) {
        // ------ No Details Present -------------  
        displayOutput('No Record Found !!')
        hidePleaseWaitModel()    
        //viewModel('My Wishlist','<h1>Empty List</h1>'); 
        $('#user_bookmark').html('<h1>Empty List</h1>')
  
      } else {
  
        totaldocCount = querySnapshot.size
        var docCount = 0;
  
        // Read Each Documents
        querySnapshot.forEach((doc) => {
          let data = doc.data()
          //displayOutput(mark_data);

         
         if((data['SPACENAME'] == bookmarkFilter) || (bookmarkFilter == 'ALL')) {         
                  
          content += '<ul class="collection"><a href="'+data['LINK']+'"><li class="collection-item avatar black-text hoverable">\
          <img src="'+data['UPHOTO']+'" alt="" class="circle">\
          <span class="title black-text"><b>'+data['UNAME']+'</b></span>\
          <p class="grey-text">'+data['DATE'] +' , '+ data['SPACENAME'] +'</p><br>\
          <b>'+data['TITLE']+'</b>\
          <a href="#!" onclick="removeBookmark(\'' + doc.id  + '\')" class="secondary-content"><i class="material-icons">delete</i></a>\
        </li></a></ul>'  

         }

          // Check Document count
          docCount++;
          if (totaldocCount == docCount) {
           
           hidePleaseWaitModel()
           content += ''
           //viewModel('My Wishlist',content);           
           $('#user_bookmark').html(content)  

           handleBlockView("filter_drop_sec_bookmark",'show');

          }
  
        }); 
        
  
      }
  
    });

}

// Filter Bookmark Content 
function filterBookmark(details) {

  bookmarkFilter = details
  $('#bookmark_filter_drop_down').html('<i class="material-icons left">filter_list</i>' + details)

  openBookmarkContent()

}

// Remove Bookmark
function removeBookmark(details) {
    displayOutput(details)

    db.collection(getCompPath('USER_BOOKMARK',uuid)).doc(details).delete().then(function () {
      displayOutput("Bookmark Deleted !!");  

      closeModel()
      openBookmarkContent()
    });


}


// --------------- Mylist Handling -----------------
// Open Mylist details
function openMyListContent() {

  let content = ''

  // Get Bookmark Details    
  showPleaseWaitModel()

    db.collection(getCompPath('USER_MYLIST',uuid)).orderBy('CREATEDON', 'desc').get().then((querySnapshot) => {
      displayOutput("SIZE : " + querySnapshot.size);
  
      if (querySnapshot.size == 0) {
        // ------ No Details Present -------------  
        displayOutput('No Record Found !!')
        hidePleaseWaitModel()    
        //viewModel('My Wishlist','<h1>Empty List</h1>'); 
        $('#user_mylist').html('<h1>Empty List</h1>')
  
      } else {
  
        totaldocCount = querySnapshot.size
        var docCount = 0;
  
        // Read Each Documents
        querySnapshot.forEach((doc) => {
          let data = doc.data()
          //displayOutput(mark_data);

          // <a href="#!" onclick="removeBookmark(\'' + doc.id  + '\')" class="secondary-content"><i class="material-icons">delete</i></a>\
         
         if((data['SPACENAME'] == myListFilter) || (myListFilter == 'ALL')) {         
                  
          content += '<ul class="collection"><a href="'+data['LINK']+'"><li class="collection-item avatar black-text hoverable">\
          <img src="'+data['UPHOTO']+'" alt="" class="circle">\
          <span class="title black-text"><b>'+data['UNAME']+'</b></span>\
          <p class="grey-text">'+data['DATE'] +' , '+ data['SPACENAME'] +'</p><br>\
          <b>'+data['TITLE']+'</b>\
          <a href="#!" class="secondary-content"><i class="material-icons"></i></a>\
        </li></a></ul>'  

         }

          // Check Document count
          docCount++;
          if (totaldocCount == docCount) {
           
           hidePleaseWaitModel()
           content += ''
           //viewModel('My Wishlist',content);           
           $('#user_mylist').html(content)  

           handleBlockView("filter_drop_sec_mylist",'show');

          }
  
        }); 
        
  
      }
  
    });

}

// Filter MyList Content 
function filterMyList(details) {

  myListFilter = details
  $('#mylist_filter_drop_down').html('<i class="material-icons left">filter_list</i>' + details)

  openMyListContent()

}

// Remove MyList
function removeMyList(details) {
    displayOutput(details)

    db.collection(getCompPath('USER')+'/'+uuid+'/MYLIST').doc(details).delete().then(function () {
      displayOutput("MyList Deleted !!");  

      closeModel()
      openMyListContent()
    });


}

// ============= Get Language Content ==============

// Get Language Data
function getLangContent(lang) {

  switch(lang) {
    case 'ENG' : {
      return getENGlangContent()
    }

    case 'HIN' : {
      return getHINlangContent()
    }

    default : {
      return getENGlangContent()
    }

  }

}

// LANG : ENGLISH
function getENGlangContent() {

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

    // Location Section
    LOC_HEADER: 'What is your permanent address ?',
    CURR_LOC_HEADER: 'Where are you now ?',

    // Display Message 
    MESSAGE_MOBILE: 'Your mobile number is not correct !!',
    MESSAGE_ACCEPT: 'Please accept terms and conditions !!',
    MESSAGE_CURRLOC: 'Please select current location details !!',
    MESSAGE_PROFILE: 'Profile Updated !!',

    HELP: 'Help Content',

    TERM_AND_COND: getTermAndCondDetailsEN()

  }

}

// LANG : HINDI
function getHINlangContent() {

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

    // Location Section
    LOC_HEADER: 'What is your permanent address ?',
    CURR_LOC_HEADER: 'Where are you now ?',

    // Display Message 
    MESSAGE_MOBILE: 'आपका मोबाइल नंबर सही नहीं है !!',
    MESSAGE_ACCEPT: 'कृपया नियम और शर्तें स्वीकार करें !!',
    MESSAGE_CURRLOC: ' कृपया वर्तमान स्थान विवरण का चयन करें !!',
    MESSAGE_PROFILE: ' प्रोफ़ाइल अपडेट !!',

    HELP: 'सहायता सामग्री',

    TERM_AND_COND: getTermAndCondDetailsHI()

  }

}