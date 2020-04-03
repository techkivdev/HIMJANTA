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
var userDataPath = coll_base_path + 'USER/ALLUSER'
var userPoolPath = coll_base_path + 'USER/POOL'
var uuid = ''
var allDocCmpData = {}

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

// Startup Call
startupcalls()

getParams()

// Mobile mode handling
mobileModeStartupHandling()

modifyPageStyle()

// Complete Location Data 
function getLocationData() {
  return {
    BILASPUR: ['SADAR', 'JHANDUTTA','GHUMARWIN','NAINA DEVI'],
    CHAMBA: ['MEHLA','CHAMBA','TISSA','SALOONI','BHATIYAT','BHARMOUR','PANGI'],
    HAMIRPUR: ['SUJANPUR TIHRA','BIJHRI','NADAUN','BHORANJ','HAMIRPUR','BAMSAN'],
    KANGRA: ['N SURIAN','INDORA','NURPUR','FATEHPUR','PRAGRPUR','DEHRA','BHAWARNA','PANCHRUKHI','LAMBAGAON','BAIJNATH','KANGRA','N BAGWAN','RAIT','SULAH','DHARAMSHALA'],
    KINNAUR: ['POOH','KALPA','NICHAR'],
    KULLU: ['KULLU','ANI','BANJAR','NIRMAND','NAGGAR'],
    LAHAUL_SPITI: ['LAHAUL','SPITI'],
    MANDI: ['CHAUNTRA','BALH','KARSOG','DHARAMPUR','DRANG','GOPALPUR','SUNDERNAGAR','MANDI SADAR','GOHAR','SERAJ','BALI CHOWKI'],
    SHIMLA: ['MASHOBRA','BASANTPUR','CHOPAL','CHHOHARA','ROHRU','JUBALKOTKHAI','THEOG','RAMPUR','NANKHARI','NARKANDA','KUPVI'],
    SIRMOUR: ['PACHHAD','RAJGARH','NAHAN','SANGRAH','SHILLAI','PAONTA'],
    SOLAN: ['SOLAN','NALAGARH','KUNIHAR','DHARAMPUR','KANDAGHAT']
    }
    
}

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
    document.getElementById("main_nav_bar").style.display = 'none';
    document.getElementById("main_nav_bar_mb").style.display = 'none';    

    document.getElementById("main_footer_sec").style.display = 'none';
    signinpopup = 'default'

  } else {   
    document.getElementById("main_nav_bar").style.display = 'block';
    document.getElementById("main_nav_bar_mb").style.display = 'block';

    document.getElementById("main_footer_sec").style.display = 'block';
  }


}

// Modify Page style according to the browser
function modifyPageStyle() {
  // Check for mobile browser
  if (isMobileBrowser()) {
    displayOutput('Mobile Browser found!')     
    document.getElementById("profile_content_section").style.margin = "0px 0px 0px 0px";

    document.getElementById("profile_header_section_mb").style.display = 'block';
    document.getElementById("profile_header_section").style.display = 'none';
    

  } else {
    displayOutput('Mobile Browser Not found!') 

    document.getElementById("profile_header_section_mb").style.display = 'none';
    document.getElementById("profile_header_section").style.display = 'block';

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

      //document.getElementById("main_profile_section").style.display = 'block';
      document.getElementById("login_header_section").style.display = 'none';
      document.getElementById("spinner").style.display = 'block';

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

        // User Data        
        userData['NAME'] = displayName
        userData['EMAIL'] = email
        userData['EMAILVERIFIED'] = emailVerified
        userData['PROVIDERDATA'] = providerData
        userData['UUID'] = uuid
        userData['BIO'] = ''
        userData['DISPNAME'] = displayName 
        userData['AGEGROUP'] = 'CHILDREN'

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
        userData['COUNTRY'] = 'INDIA'
        userData['STATE'] = 'HIMACHAL PRADESH'
        userData['DISTRICT'] = 'HIMACHAL'
        userData['BLOCK'] = 'HIMACHAL'
        userData['ADDRESS'] = ''
        userData['MAPLOCATION'] = ''


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
      document.getElementById("main_profile_section").style.display = 'none';
      document.getElementById("footer_sec").style.display = 'none';
      document.getElementById("login_header_section").style.display = 'block';
      document.getElementById("spinner").style.display = 'none';

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
  let ref = db.collection(userDataPath).doc(uuid);
  let getDoc = ref.get()
    .then(doc => {

      if (!doc.exists) {
        displayOutput('No such document!');
        displayOutput('Create New User Doc.');

        // ----- Remove later --------
        // Add a new document in collection
        if(first_time_operation) {
          db.collection(coll_base_path).doc('USER').set({
            NAME: 'USER'
          });
        }

        // Create new user data doc
        db.collection(userDataPath).doc(uuid).set(userdata).then(function () {
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
              db.collection(userDataPath).doc(uuid).set(current_userData).then(function () {
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

// Update Session Data
function updateSessionData(updatedUserData) {
  // Update Session Data
  localStorageData('ISUSER',true)
  localStorageData('UUID',updatedUserData['UUID'])
  localStorageData('NAME',updatedUserData['NAME'])
  localStorageData('DISPNAME',updatedUserData['DISPNAME'])
  localStorageData('EMAIL',updatedUserData['EMAIL'])
  localStorageData('MOBILE',updatedUserData['MOBILE'])
  localStorageData('ROLE',updatedUserData['ROLE'])
  localStorageData('PHOTO',updatedUserData['PHOTOURL'])
  localStorageData('COUNTRY',updatedUserData['COUNTRY'])
  localStorageData('STATE',updatedUserData['STATE'])
  localStorageData('DISTRICT',updatedUserData['DISTRICT'])
  localStorageData('BLOCK',updatedUserData['BLOCK'])
  localStorageData('ADDRESS',updatedUserData['ADDRESS'])
  localStorageData('MAPLOCATION',updatedUserData['MAPLOCATION'])
  localStorageData('AGEGROUP',updatedUserData['AGEGROUP'])
  
  displayOutput('Session Data Updated ...')
}

// Sync Provider Details
function syncProvideDetails() {

  firebase.auth().onAuthStateChanged(function (user) {


      // User is signed in.
      var displayName = user.displayName;
      var photoURL = user.photoURL;
      uuid = user.uid;

      showPleaseWaitModel()
      
      db.collection(userDataPath).doc(uuid).update({
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
    IMAGE_DB_PATH: coll_base_path + '/USER/'
}

// Call Back Function
// Update New ref. into Document Info field
function updateNewImageRefintoDoc(newImageRef,imgName) {

  displayOutput(newImageRef)  
  displayOutput(imgName)

  db.collection(userDataPath).doc(uuid).update({
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

  

  document.getElementById("user_profile_image").src = updatedUserData['PHOTOURL']
  document.getElementById("user_profile_image_mb").src = updatedUserData['PHOTOURL']

  // --------------------------------------------------------
  // -------------- Profile Details -------------------------
  // --------------------------------------------------------
   
  document.getElementById("u_img").src = updatedUserData['PHOTOURL']

  // Update Provider Information
  $("#provider_details").html('Provided By : ' + updatedUserData['PROVIDERDATA'][0]['providerId']);

  $("#u_name").html(updatedUserData['NAME']);
  $("#u_email").html(updatedUserData['EMAIL']);

  document.getElementById("user_name").value = updatedUserData['NAME']
  document.getElementById("user_email").value = updatedUserData['EMAIL']
  document.getElementById("user_mobile").value = updatedUserData['MOBILE']

  document.getElementById("display_user_name").value = updatedUserData['DISPNAME']
  document.getElementById("user_bio").value = br2nl(updatedUserData['BIO'])
  M.textareaAutoResize($('#user_bio'));

  document.getElementById(updatedUserData['AGEGROUP']).selected = true

  document.getElementById("user_district_blocks").value = updatedUserData['BLOCK'] + ',' + updatedUserData['DISTRICT']

  if(updatedUserData['BLOCK'] == 'HIMACHAL'){
    $('#u_district_details').html(updatedUserData['BLOCK'] + ' - Please update it.')
  }
  

  document.getElementById("user_address").value = br2nl(updatedUserData['ADDRESS'])
  M.textareaAutoResize($('#user_address'));

  // Update Settings
  document.getElementById("user_profile_chk").checked = updatedUserData['SHOWSETTINGS']['PROFILE']
  document.getElementById("user_mobile_chk").checked = updatedUserData['SHOWSETTINGS']['MOBILE']
  document.getElementById("user_address_chk").checked = updatedUserData['SHOWSETTINGS']['ADDRESS']

  document.getElementById(updatedUserData['LANG']).selected = true

  $(document).ready(function(){
    $('select').formSelect();
  });

  // Update Social Link
  document.getElementById("social_link_facebook").value = updatedUserData['SOCIALINK']['FACEBOOK']
  document.getElementById("social_link_instagram").value = updatedUserData['SOCIALINK']['INSTAGRAM']
  document.getElementById("social_link_youtube").value = updatedUserData['SOCIALINK']['YOUTUBE']
  document.getElementById("social_link_twitter").value = updatedUserData['SOCIALINK']['TWITTER']
  document.getElementById("social_link_tiktok").value = updatedUserData['SOCIALINK']['TIKTOK']


  // -----------------------------------------------------------


  document.getElementById("spinner").style.display = 'none';
  document.getElementById("main_profile_section").style.display = 'block';
  document.getElementById("footer_sec").style.display = 'block';


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
    
    document.getElementById("extra_options_card").style.display = 'block';

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
  document.getElementById("spinner").style.display = 'none';
  document.getElementById("main_profile_section").style.display = 'block';
  document.getElementById("footer_sec").style.display = 'block';

  divBlockHandling(fl)

  document.getElementById("close_fl_btn").style.display = 'none';
  document.getElementById("close_fl_btn_to_forum").style.display = 'block';
}


}

// ========= Location Selection ===============
var selectedLocation = 'NA'

// Create and Open Model
function openLocationSelector(){

  let allLocationData = getLocationData()

  let location_html = ''
  for(each_dist in allLocationData) {
    let each_dist_blocks = allLocationData[each_dist]

    let block_html = ''
    for(each_idx in each_dist_blocks){
      let each_block = each_dist_blocks[each_idx]
      block_html += '<li class="collection-item"><a href="#!" onclick="locationSelected(\''+each_block+'@'+each_dist+'\')"  class="black-text">'+each_block+'</a></li>'
    }

    let dist_htm = '<b style="margin-left: 20px; margin-top: 20px;">'+each_dist+'</b><ul class="collection">' +  block_html + '</ul>'

    location_html += dist_htm
  }

  let content = '<ul class="collection">\
  <li class="collection-item"><a href="#!" onclick="locationSelected(\'Alvin\')"  class="black-text">Alvin</a></li>\
  <li class="collection-item"><a href="#!" onclick="locationSelected(\'Alvin\')"  class="black-text">Alvin</a></li>\
  <li class="collection-item"><a href="#!" onclick="locationSelected(\'Alvin\')"  class="black-text">Alvin</a></li>\
  <li class="collection-item"><a href="#!" onclick="locationSelected(\'Alvin\')"  class="black-text">Alvin</a></li>\
  <li class="collection-item"><a href="#!" onclick="locationSelected(\'Alvin\')"  class="black-text">Alvin</a></li>\
</ul>'

  var model = '<!-- Modal Structure -->\
  <div id="location_model" class="modal">\
    <div class="">\
      <div style="margin-top: 20px;">'+ location_html + '</div>\
    </div>\
    </div>'

  var elem = document.getElementById('location_model');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });

  $('#location_model').modal('open');

}

// Location Selected
function locationSelected(name) {     
  $('#location_model').modal('close');
  selectedLocation = name
  //toastMsg(name)

  document.getElementById("user_district_blocks").value = selectedLocation.replace('@',',')
  $('#u_district_details').html('You have changed details, Please SAVE it.')

}



// Div Block Handling
function divBlockHandling(value) {
  displayOutput(value)

  window.scrollTo(0, 0);

  document.getElementById("main_footer_sec").style.display = 'none';
  document.getElementById("top_div_header").style.display = 'none';

  switch(value) {
    
    case "profile":

      if (isMobileBrowser()) {
        document.getElementById("profile_header_section_mb").style.display = 'none';
      } else {
        document.getElementById("profile_header_section").style.display = 'none';
      }
      document.getElementById("options_card_section").style.display = 'none';

      document.getElementById("profile_section").style.display = 'block';
      document.getElementById("close_fl_btn").style.display = 'block';

    break;

    case "bookmark":

      if (isMobileBrowser()) {
        document.getElementById("profile_header_section_mb").style.display = 'none';
      } else {
        document.getElementById("profile_header_section").style.display = 'none';
      }
      document.getElementById("options_card_section").style.display = 'none';

      document.getElementById("bookmark_section").style.display = 'block';
      document.getElementById("close_fl_btn").style.display = 'block';

      openBookmarkContent()

    break;

    case "mylist":

      if (isMobileBrowser()) {
        document.getElementById("profile_header_section_mb").style.display = 'none';
      } else {
        document.getElementById("profile_header_section").style.display = 'none';
      }
      document.getElementById("options_card_section").style.display = 'none';

      document.getElementById("mylist_section").style.display = 'block';
      document.getElementById("close_fl_btn").style.display = 'block';

      openMyListContent()

    break;

    case "options":

      if (isMobileBrowser()) {
        document.getElementById("profile_header_section_mb").style.display = 'none';
      } else {
        document.getElementById("profile_header_section").style.display = 'none';
      }
      document.getElementById("options_card_section").style.display = 'none';

      document.getElementById("options_section").style.display = 'block';
      document.getElementById("close_fl_btn").style.display = 'block';

    break;


  }
}

// Hide Close Floating btn
function hideFullMessageDialog(){

  window.scrollTo(0, 0);

  document.getElementById("profile_section").style.display = 'none'; 
  document.getElementById("bookmark_section").style.display = 'none';
  document.getElementById("mylist_section").style.display = 'none';
  document.getElementById("options_section").style.display = 'none';
  document.getElementById("close_fl_btn").style.display = 'none';

  if (isMobileBrowser()) {
    document.getElementById("profile_header_section_mb").style.display = 'block';
  } else {
    document.getElementById("profile_header_section").style.display = 'block';
  }
  
  document.getElementById("options_card_section").style.display = 'block';
  document.getElementById("main_footer_sec").style.display = 'block';
  document.getElementById("top_div_header").style.display = 'block';

}

// Hide User Booking
function hideUserBookingView(){

  document.getElementById("user_bookings_view_section").style.display = 'none';
  document.getElementById("user_bookings").style.display = 'block';
}

// Return to Forum Page
function returnToForumPage() {
  window.history.back();
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

  var mobileno = document.getElementById("user_mobile").value.trim();
  displayOutput('Mobile Number : ' + mobileno)

  if(isStrEmpty(mobileno)) {
    validation = true
  } else {
  // Check mobile number validation
  var mbcnt = mobileno.length;
  if (mbcnt != 10) {
    validation = false
    hidePleaseWaitModel()
    toastMsg('Your mobile number is not correct !!')
  } else {
    validation = true
  }
}

var user_accept_terms_checkbox = document.getElementById("user_accept_terms_checkbox").checked
if(!user_accept_terms_checkbox){
  validation = false
  hidePleaseWaitModel()
  toastMsg('Please accept terms and conditions !!')
}


// Read Other Details
var user_name = document.getElementById("user_name").value.trim();
var display_user_name = document.getElementById("display_user_name").value.trim();
if(isStrEmpty(display_user_name)) {
  display_user_name = user_name
}

var user_bio = document.getElementById("user_bio").value.trim();
user_bio = nl2br(user_bio)
var user_age_group = document.getElementById("user_age_group").value.trim();
var user_district_blocks = document.getElementById("user_district_blocks").value.trim();
var user_address = document.getElementById("user_address").value.trim();
user_address = nl2br(user_address)

// Read Other Settings Details
var user_profile_chk = document.getElementById("user_profile_chk").checked
var user_mobile_chk = document.getElementById("user_mobile_chk").checked
var user_address_chk = document.getElementById("user_address_chk").checked

var user_language = document.getElementById("user_language").value.trim();

var settings_privacy = {
  PROFILE: user_profile_chk,
  MOBILE: user_mobile_chk,
  ADDRESS: user_address_chk,
  AGEGROUP: true,
  LOCATION: true
}

// User Social Link Details
var social_link_facebook = document.getElementById("social_link_facebook").value.trim();
var social_link_instagram = document.getElementById("social_link_instagram").value.trim();
var social_link_youtube = document.getElementById("social_link_youtube").value.trim();
var social_link_twitter = document.getElementById("social_link_twitter").value.trim();
var social_link_tiktok = document.getElementById("social_link_tiktok").value.trim();

 // Social Links
 var social_links = {
  FACEBOOK: social_link_facebook,
  INSTAGRAM: social_link_instagram,
  YOUTUBE: social_link_youtube,
  TIKTOK: social_link_tiktok,
  TWITTER: social_link_twitter
}

  if (validation) {
    userData['MOBILE'] = mobileno
    userData['DISPNAME'] = display_user_name
    userData['BIO'] = user_bio
    userData['AGEGROUP'] = user_age_group
    userData['DISTRICT'] = user_district_blocks.split(',')[1]
    userData['BLOCK'] = user_district_blocks.split(',')[0]
    userData['ADDRESS'] = user_address

    db.collection(userDataPath).doc(uuid).update({
      MOBILE: mobileno,
      DISPNAME: display_user_name,
      BIO: user_bio,
      AGEGROUP: user_age_group,
      DISTRICT: user_district_blocks.split(',')[1],
      BLOCK: user_district_blocks.split(',')[0],
      ADDRESS: user_address,
      LANG: user_language,
      SHOWSETTINGS: settings_privacy,
      SOCIALINK: social_links
    }).then(function () {
      displayOutput("Mobile details Updated ..");

      // Update Session Data Also
      localStorageData('MOBILE',mobileno)
      localStorageData('DISPNAME',display_user_name)
      localStorageData('BIO',user_bio)
      localStorageData('AGEGROUP',user_age_group)
      localStorageData('DISTRICT',user_district_blocks.split(',')[1])
      localStorageData('BLOCK',user_district_blocks.split(',')[0])
      localStorageData('ADDRESS',user_address)

      // Update Pool
      updateUserPoolContent(uuid,[userData['DISPNAME'],userData['PHOTOURL']])

    });

  }

}

// Update User Pool Details
function updateUserPoolContent(uuid, dataArray) {

  hidePleaseWaitModel()

  toastMsg('Profile Updated !!')

  location.reload();

  // Check for Possiblilties of cloud function

  /*
  let data = {
      DISPNAME: dataArray[0],
      PHOTOURL: dataArray[1]
  }

   // Create new user data doc
   db.collection(userPoolPath).doc(uuid).set(data).then(function () {
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

    db.collection(userDataPath+'/'+uuid+'/BOOKMARK').get().then((querySnapshot) => {
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

           document.getElementById("filter_drop_sec_bookmark").style.display = 'block';

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

    db.collection(userDataPath+'/'+uuid+'/BOOKMARK').doc(details).delete().then(function () {
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

    db.collection(userDataPath+'/'+uuid+'/MYLIST').orderBy('CREATEDON', 'desc').get().then((querySnapshot) => {
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

           document.getElementById("filter_drop_sec_mylist").style.display = 'block';

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

    db.collection(userDataPath+'/'+uuid+'/MYLIST').doc(details).delete().then(function () {
      displayOutput("MyList Deleted !!");  

      closeModel()
      openMyListContent()
    });


}