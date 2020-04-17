// *******************************************************************************
// SCRIPT : index.js
//
//
// Author : Vivek Thakur
// Date : 13/2/2020
// *******************************************************************************

// ---------- Main Variables ---------
var coll_base_path = baseProductionPrivatePath

if (check_dev_publish_content) {
  coll_base_path = baseProductionPrivatePath
}

var main_path = 'NA'
var id = 'NA'
var fl = 'NA'

var userLoginData = ''
var currentTopicID = ''
var currentTopicCommentsStatus = true
var currentTopicLikeStatus = false
var currentTopicBookmarkStatus = false

// Main Filter
var filter_enable_flag = false
var filter_selection_status = {}
var filter_selection_data = {}
var searchSelectedOption = 'TAG'
var searchSelectedValue = 'NA'

// Scope Configuration
var location_scope = 'HIMACHAL PRADESH'
var scope_list = []
scope_list.push(location_scope)

var selected_tag = []
var selected_catg = 'NA'

// User Related variables
var isUserMode = false
var useruuid = 'NA'
var userData = {}
var userSectionCreated = false

// Collect all Details
var allForumTopics = {}

// Query Parameters
let querySize = 10
let commentquerySize = 10
let queryRef = ''

let queryMode = 'NORMAL'

// Scroll Position
let horizScrollPosition = 0
let vertiScrollPosition = 0

let comment_horizScrollPosition = 0
let comment_vertiScrollPosition = 0

// Page config
let main_page = 'showpost.html'
let create_page = 'createpost.html'

var color='purple'


// ***********************************************

// ***********************************************
// ----------- Read Parameters -------------------
function getParams() {
  // Read Parameters
  displayOutput('Read Parameters ...')
  var idx = document.URL.indexOf('?');
  var params = new Array();
  if (idx != -1) {
    var pairs = document.URL.substring(idx + 1, document.URL.length).split('&');
    for (var i = 0; i < pairs.length; i++) {
      nameVal = pairs[i].split('=');
      params[nameVal[0]] = nameVal[1];
    }
  }
  displayOutput(params); 

  main_path = params['pt']
  displayOutput(main_path)
  id = params['id']
  fl = params['fl'].replace('#!','')


}

// Check Session Data is Correct or Not
function checkLoginData(){

  // Check Session Data
  let status = getLoginUserStatus()
  displayOutput('Check Session Data ...')
  displayOutput(status)

  saveConfig('scope',location_scope)
  saveConfig('tag', selected_tag)
  saveConfig('catg',selected_catg)
  
  if(status == 'true') {
    userLoginData = getLoginUserData()
    //displayOutput(userLoginData)

    // Check for ROLE
    if(userLoginData['ROLE'] != 'USER') {
      document.getElementById("manage_post_menu").style.display = 'block';
    }

    // Display Other Options also
    document.getElementById("my_topics_menu").style.display = 'block';
    document.getElementById("my_list_menu").style.display = 'block';
    document.getElementById("my_bookmark_menu").style.display = 'block';

    document.getElementById("my_topics_menu_mb").style.display = 'block';
    document.getElementById("my_list_menu_mb").style.display = 'block';
    document.getElementById("my_bookmark_menu_mb").style.display = 'block';

    // Update Location Scope List
    scope_list.push(userLoginData['BLOCK'])
    scope_list.push(userLoginData['DISTRICT'])


  } 

  

}

// ******************************************************
// --------------- START UP CODE -----------------------
// Call Function when page loaded
// ******************************************************

startUpCalls();

// Get Parameters details
getParams();

// Mobile mode handling
mobileModeStartupHandling()

checkLoginData()

updateHTMLPage()


// *******************************************************
// --------------- Functions -----------------------------

// Update Complete HTML Page
function updateHTMLPage() {   
  modifyPageStyle()  

  location_scope = readConfig('scope')
  let selected_tag_loc = readConfig('tag')
  if(isStrEmpty(selected_tag_loc)) {
    selected_tag = []
  } else {
    selected_tag = selected_tag_loc.split(',')
  }
  selected_catg = readConfig('catg')

  document.getElementById("top_div_header").style.display = 'none'; 
  document.getElementById("userinfo_section").style.display = 'none'; 

  // Page Haandling according to Filter value : fl

  if((fl == 'edit') || (fl == 'only')) {
    document.getElementById("flb_open_filter").style.display = 'none';
    // Read only edit topic details and show details
    readOneForum()

  } if(fl == 'user') {
  
    displayOutput('User Details')
    document.getElementById("top_div_header").style.display = 'block'; 
    document.getElementById("userinfo_section").style.display = 'block';

    isUserMode = true
    useruuid = id

    showUserInfromation()

    readAllForums()
  
  }
  else {
    displayOutput('Default Action')
    readAllForums()
  
  }

  // Update Filter section details
  $('#main_filter_section').html('')

  

  if(location_scope != 'NA') {
    createLocationCard(location_scope)
  }
 
  let filt_html_line = ''

  if(selected_catg != 'NA') {
    filt_html_line += '<div class="chip green white-text z-depth-2" style="margin-bottom : 10px;">' + getCatgDataMapping(selected_catg) + '<i onclick="catgReset()" class="close material-icons">close</i></div>'

    //filt_html_line += createChipLikeCard(getCatgDataMapping(selected_catg) + '#' + 'catg','green')
  }

  if(selected_tag.length > 0) {    

    for(each_idx in selected_tag) {
      let tag_name = selected_tag[each_idx]

      filt_html_line += '<div class="chip orange white-text z-depth-2" style="margin-bottom : 10px;">' + tag_name + '<i onclick="tagReset(\'' + tag_name + '\')" class="close material-icons">close</i></div>'
    }    

    //filt_html_line += createChipLikeCard(selected_tag + '#' + 'tag','orange')
  }

  //filt_html_line  = '<div class="row">' + filt_html_line + '</div>'

  $('#main_filter_section').html(filt_html_line)
  

  // Update Filter Section 

  createFilterScopeDetails()

  createFilterTagsDetails()

  createFilterCategoryDetails()

 
}

// RESET Options
function catgReset() {
  saveConfig('catg','NA')

  updateHTMLPage()
}

function tagReset(tag_name) {
  
  selected_tag.splice( selected_tag.indexOf(tag_name), 1 );

  saveConfig('tag',selected_tag)

  updateHTMLPage()
}

// Modify Page style according to the browser
function modifyPageStyle() {
  // Check for mobile browser
  if (isMobileBrowser()) {
    displayOutput('Mobile Browser found!') 
    
    document.getElementById('show_all_topic_container').className = "container-fluid";
    document.getElementById('topic_display_container').className = "container-fluid";

    document.getElementById("filter_section").className = 'row container';

  } else {
    displayOutput('Mobile Browser Not found!')
    

  }
}

// ----------------------------------------
// --------- Mobile Mode Handling ---------
// ----------------------------------------
function mobileModeStartupHandling() {

  // Check for Mobile Mode
  if (mobile_mode) {
    // Disable Nav-bar and Footer
    //document.getElementById("main_nav_bar").style.display = 'block';
    
   

  } else {
   
  }


}

// *******************************************************
// --------- Presentation Layer --------------------------
// - This Layer change according to projects
// - Sequence of all HTML modification code
// *******************************************************


// Read Forum Details
function readAllForums() {

  allForumTopics = {}
  $("#forum_card_section").html('');
  document.getElementById("main_progress").style.display = "block";
  document.getElementById("more_btn").style.display = "none"; 
  
  // ---------------------------------------
  // ----- NORMAL ------

  
  // Query Handling
  // orderBy('DATEID', 'desc') 

  // Main Filter Query
  if(filter_enable_flag) {

    // Get Filter Query Reference 
    queryRef = getFilterQuery()

  } else {

    // Get Noraml Query Reference 
    queryRef = getQuery()

  }

  // Update Total Count message
  queryRef.get().then(function(querySnapshot) {   
    $("#total_card_sec").html('Display ' + querySize + ' / ' + querySnapshot.size);
    if(querySize >= querySnapshot.size) {
      document.getElementById("more_btn").style.display = "none";
    } else {
      document.getElementById("more_btn").style.display = "block";
    }
  });

 
  queryRef.limit(querySize).get()
   .then(snapshot => {
 
     if (snapshot.size == 0) {
       // ------ No Details Present -------------  
       displayOutput('No Record Found !!') 

       let htmlContent = ''
       htmlContent += '<h1 class="black-text">No Post Found !!</h1>'
       
       $("#forum_card_section").html(htmlContent);

       document.getElementById("main_progress").style.display = "none";
       document.getElementById("more_btn").style.display = "none";

     } else {    
 
     snapshot.forEach(doc => { 
       allForumTopics[doc.id] = doc.data() 

       createEachDocumentCard(doc.data(),doc.id)

     });

     // Update Forum HTML Content

    // updateForumContent()

    document.getElementById("main_progress").style.display = "none";   

    window.scrollTo(horizScrollPosition, vertiScrollPosition);
 
   }
   })
   .catch(err => {
     console.log('Error getting documents', err);
   }); 
  
}

// Normal Query Handling
function getQuery() {

   // Read details
   let path = coll_base_path + 'FORUM/' + main_path 
   let collectionRef = db.collection(path)

  let normalqueryref = ''

   // Filter query for url
  // For each query you have to create Index in firebase console

  // Show User Related Details
  if(isUserMode) {

    displayOutput(useruuid)

    if(location_scope == 'ANY') {

      // ------------- MAIN SELECTION QUERY HANDLING ------------

      if((selected_catg == 'NA') && (selected_tag.length == 0)) {
        // Default Operation
        displayOutput('Default User Query')
        normalqueryref = collectionRef.where('DELETESTATUS', '==', false)       // Default Options
        .where('UUID', '==', useruuid)
        .orderBy('CREATEDON', 'desc');
  
      } else if((selected_catg != 'NA') && (selected_tag.length > 0)) {
        displayOutput('All User Query')
        // All Filter Applied 
        normalqueryref = collectionRef.where('DELETESTATUS', '==', false)     // Category Options
        .where('UUID', '==', useruuid)
        .where('CATEGORY', '==', selected_catg)
        .where('TAGS', 'array-contains-any',selected_tag)
        .orderBy('CREATEDON', 'desc');
  
  
      } else {
  
        // Any One Applied 
        if(selected_catg != 'NA') {
          displayOutput('Only User Catg Query')
  
          normalqueryref = collectionRef.where('DELETESTATUS', '==', false)     // Category Options
          .where('UUID', '==', useruuid)
          .where('CATEGORY', '==', selected_catg)
          .orderBy('CREATEDON', 'desc');
        }
      
        if(selected_tag.length > 0) {    
          displayOutput('Only User Tags Query')
  
          normalqueryref = collectionRef.where('DELETESTATUS', '==', false)    // TAG Options
          .where('UUID', '==', useruuid)
          .where('TAGS', 'array-contains-any',selected_tag)
          .orderBy('CREATEDON', 'desc');
      
        }
  
  
      }
  
      // -----------------------------------------------------------

    // ==========================================================================

    } else {

     // ------------- MAIN SELECTION QUERY HANDLING ------------

     if((selected_catg == 'NA') && (selected_tag.length == 0)) {
      // Default Operation
      displayOutput('Default User Query')
      normalqueryref = collectionRef.where('DELETESTATUS', '==', false)       // Default Options
      .where('UUID', '==', useruuid)
      .where('LOCSCOPE', '==', location_scope)
      .orderBy('CREATEDON', 'desc');

    } else if((selected_catg != 'NA') && (selected_tag.length > 0)) {
      displayOutput('All User Query')
      // All Filter Applied 
      normalqueryref = collectionRef.where('DELETESTATUS', '==', false)     // Category Options
      .where('UUID', '==', useruuid)
      .where('LOCSCOPE', '==', location_scope)
      .where('CATEGORY', '==', selected_catg)
      .where('TAGS', 'array-contains-any',selected_tag)
      .orderBy('CREATEDON', 'desc');


    } else {

      // Any One Applied 
      if(selected_catg != 'NA') {
        displayOutput('Only User Catg Query')

        normalqueryref = collectionRef.where('DELETESTATUS', '==', false)     // Category Options
        .where('UUID', '==', useruuid)
        .where('LOCSCOPE', '==', location_scope)
        .where('CATEGORY', '==', selected_catg)
        .orderBy('CREATEDON', 'desc');
      }
    
      if(selected_tag.length > 0) {    
        displayOutput('Only User Tags Query')

        normalqueryref = collectionRef.where('DELETESTATUS', '==', false)    // TAG Options
        .where('UUID', '==', useruuid)
        .where('LOCSCOPE', '==', location_scope)
        .where('TAGS', 'array-contains-any',selected_tag)
        .orderBy('CREATEDON', 'desc');
    
      }


    }

    // -----------------------------------------------------------

  }


  } else {
     
      // ------------- MAIN SELECTION QUERY HANDLING ------------

      if((selected_catg == 'NA') && (selected_tag.length == 0)) {
        // Default Operation
        displayOutput('Default Query')
        normalqueryref = collectionRef.where('DELETESTATUS', '==', false)       // Default Options
        .where('LOCSCOPE', '==', location_scope)
        .orderBy('CREATEDON', 'desc');

      } else if((selected_catg != 'NA') && (selected_tag.length > 0)) {
        displayOutput('All Query')
        // All Filter Applied 
        normalqueryref = collectionRef.where('DELETESTATUS', '==', false)     // Category Options
        .where('LOCSCOPE', '==', location_scope)
        .where('CATEGORY', '==', selected_catg)
        .where('TAGS', 'array-contains-any',selected_tag)
        .orderBy('CREATEDON', 'desc');


      } else {

        // Any One Applied 
        if(selected_catg != 'NA') {
          displayOutput('Only Catg Query')

          normalqueryref = collectionRef.where('DELETESTATUS', '==', false)     // Category Options
          .where('LOCSCOPE', '==', location_scope)
          .where('CATEGORY', '==', selected_catg)
          .orderBy('CREATEDON', 'desc');
        }
      
        if(selected_tag.length > 0) {    
          displayOutput('Only Tags Query')

          normalqueryref = collectionRef.where('DELETESTATUS', '==', false)    // TAG Options
          .where('LOCSCOPE', '==', location_scope)
          .where('TAGS', 'array-contains-any',selected_tag)
          .orderBy('CREATEDON', 'desc');
      
        }


      }

           
    // -------------------------------------------------------------
 }


  return normalqueryref

}

// Filter Query Handling
function getFilterQuery() {

  // Read details
  let path = coll_base_path + 'FORUM/' + main_path 
  let collectionRef = db.collection(path)

  let normalqueryref = collectionRef.where('DELETESTATUS', '==', false).where('LOCSCOPE', '==', location_scope)

  // Selected Month Filter
  if(filter_selection_status['MONTH'] || filter_selection_status['YEAR']) {    
    normalqueryref = normalqueryref.where('DATELIST', 'array-contains', filter_selection_data['DATE'])
  } else {
 
      // Apply query
      if(filter_selection_status['DATE']) {
        normalqueryref = normalqueryref.where('DATE', '==', filter_selection_data['DATE'])
      }

      if(filter_selection_status['CATG']) {
        normalqueryref = normalqueryref.where('CATEGORY', '==', filter_selection_data['CATG'])
      }

      if(filter_selection_status['TAG']) {
        normalqueryref = normalqueryref.where('TAGS', 'array-contains', filter_selection_data['TAG'])
      }

  }

  normalqueryref = normalqueryref.orderBy('CREATEDON', 'desc') 

  return normalqueryref

}

// Show More Page Content
function morePage() {

  // Current Scroll Posstion
  // horizontal scrolling amount
  horizScrollPosition = window.pageXOffset
  // vertical scrolling amount
  vertiScrollPosition = window.pageYOffset

  querySize = querySize + 10
  readAllForums()
} 

// Top Page
function topPage() {
  window.scrollTo(0, 0);
}

// Read Only One Forum Details
function readOneForum() {

  allForumTopics = {}
  document.getElementById("main_progress").style.display = "block";

  // Read details
  
  db.collection(coll_base_path+'FORUM/' + main_path).doc(id).get()
  .then(doc => {
    if (!doc.exists) {
      displayOutput('No such document!');  
      
      let htmlContent = ''
       htmlContent += '<h1 class="black-text">No Post Found !!</h1>'
       
       $("#forum_card_section").html(htmlContent);

       document.getElementById("main_progress").style.display = "none";

       document.getElementById("close_fl_btn_to_back").style.display = "block";

    } else {
       let data = doc.data()

       if(data['DELETESTATUS'] == false) {
          allForumTopics[doc.id] = data
          // Update Forum HTML Content
          updateForumContent()
    
          viewEachTopic(doc.id)
       } else {

        // Document Deleted
        let htmlContent = ''
        htmlContent += '<h4 class="black-text">Item Deleted by owner!!</h4><br> \
        <p class="grey-text">You can also detele it from your bookmark list.</p>'        
        $("#forum_card_section").html(htmlContent);
        document.getElementById("main_progress").style.display = "none";

        document.getElementById("close_fl_btn_to_back").style.display = "block";

       }
       
      
      
    }
  })
  .catch(err => {   
    displayOutput('Error getting document', err);
  });
  

}

// Update forum Section with ALL Data once
function updateForumContent() { 

  $("#forum_card_section").html('');

  let htmlContent = '<div class="row">'

 for(eachKey in allForumTopics) {

      let data = allForumTopics[eachKey]
      //displayOutput(data)     
           
    // <span class="new badge blue" data-badge-caption="reply">'+data['REPLYCNT']+'</span>

      htmlContent += ' <div class="col s12 m12">\
      <div class="card" style="border-radius: 5px;">\
        <div>\
          <!-- Header -->\
            <ul class="collection" style="border-radius: 5px 5px 0px 0px;">\
              <li class="collection-item avatar">\
                <img src="'+data['UPHOTO']+'" alt="" class="circle">\
                <span class="title"><b>'+data['UNAME']+'</b></span>\
                <p class="grey-text" style="font-size: 13px;">'+data['DATE']+'</p>\
                </li>\
            </ul>\
\
            <!-- Content -->\
            <div class="card-content" style="margin-top: -30px;">\
            <div class="right-align"> <a href="#!" onclick="chipClickHandling(\'' + data['CATEGORY'] +'#catg' + '\')" ><div class="chip '+color+' white-text">'+data['CATEGORY']+'</div></a> </div>\
              <span class="card-title">'+data['TITLE']+'</span>\
              <div>\
                '+getChipWithBorderFromListLoc(data['TAGS'])+'\
              </div>\
\
              <div style="margin-top: 15px;">\
                <p class="long-text" >'+data['DESC']+'</p>\
              </div> \
              <div id="reach_content_btn" class="right-align" style="margin-top: 0px;">\
              <a onclick="viewEachTopic(\'' + eachKey + '\')" class="waves-effect waves-teal btn-flat blue-text">Read More</a>\
            </div>\
              </div> </div>  </div></div>'

}

    htmlContent += '</div>'


    $("#forum_card_section").html(htmlContent);

    document.getElementById("main_progress").style.display = "none";

}

// Create single card with Data
function createEachDocumentCard(data,docid) {

 
    //displayOutput(data)   
           
    // <span class="new badge blue" data-badge-caption="reply">'+data['REPLYCNT']+'</span>

      htmlContent  = ' <div class="col s12 m12">\
      <div class="card" style="border-radius: 15px;">\
        <div>\
          <!-- Header -->\
            <ul class="collection" style="border-radius: 15px 15px 0px 0px; border: 0.1px solid grey; height: 60px;">\
              <li class="collection-item avatar">\
                <img src="'+data['UPHOTO']+'" alt="" class="circle">\
                <span class="title"><b>'+data['UNAME']+'</b></span>\
                <p class="grey-text" style="font-size: 13px;">'+data['DATE']+'</p>\
                <a href="#!" onclick="openMoreOptions(\'' + docid + '#'+ data['UUID'] + '\')" class="secondary-content"><b><i class="material-icons grey-text">more_vert</i></b></a>\
                </li>\
            </ul>\
\
            <!-- Content -->\
            <div class="card-content" style="margin-top: -35px;">\
            <span class="card-title long-text-nor">'+data['TITLE']+'</span>\
            <div style="margin-top: 5px;">\
            <p class="long-text grey-text" >'+data['DESC']+'</p>\
          </div> \
          <div class="left-align" style="margin-top: 15px;"> <a href="#!" onclick="chipClickHandling(\'' + data['CATEGORY'] +'#catg' + '\')" ><div class="chip  '+color+' white-text z-depth-2">'+data['CATEGORYDIS']+'</div></a> </div>\
              <div  style="margin-top: 2px; z-index: -1">\
                '+getChipWithBorderFromListLoc(data['TAGS'])+'\
              </div>\
               <div id="reach_content_btn" class="right-align" style="margin-top: 5px;">\
              <a onclick="viewEachTopic(\'' + docid + '\')" class="waves-effect waves-teal btn-flat blue-text">Read More</a>\
            </div>\
              </div> </div>  </div></div>'


let block_to_insert = document.createElement( 'div' );
block_to_insert.innerHTML = htmlContent ;
 
let container_block = document.getElementById( 'forum_card_section' );
container_block.appendChild( block_to_insert );

}

// View Each Post
function viewEachTopic(details) {

  // Current Scroll Posstion
  // horizontal scrolling amount
  horizScrollPosition = window.pageXOffset
  // vertical scrolling amount
  vertiScrollPosition = window.pageYOffset

  //displayOutput(details)
  currentTopicID = details

  window.scrollTo(0, 0);

  let data = allForumTopics[details]

  document.getElementById("show_all_topic_container").style.display = "none";
  document.getElementById("topic_display_container").style.display = "block";

  if(fl == 'only') {
    // No need to show close btn, user has to back to source page
    document.getElementById("close_fl_btn").style.display = "none";
    document.getElementById("close_fl_btn_to_back").style.display = "block";
  } else {
    document.getElementById("close_fl_btn").style.display = "block";
  }
  

  // Update Post details 
  document.getElementById("u_img").src = data['UPHOTO']

  $("#u_name").html(data['UNAME']);
  $("#u_date").html(data['DATE']);
  $("#category").html('<a href="#!" onclick="chipClickHandling(\'' + data['CATEGORY'] +'#catg' + '\')" ><div class="chip '+color+' white-text z-depth-2">'+data['CATEGORYDIS']+'</div></a>');
  $("#title").html(data['TITLE']);
  $("#publish_date").html('Published on ' + data['DATE']);
 
  // Update Scope Value  
  let scope_line = '<p class="grey-text">Published In : <br>' + data['LOCSCOPE']

  if(data['CURRADDRSTATUS'] != 'NA') {
    scope_line += ' and ' + data['CURRADDRSUBLOC'] + ',' + data['CURRADDRLOC']
  }

  scope_line += '</p>'

  $("#scope_details").html(scope_line);

  $("#tags").html(getChipWithBorderFromListLoc(data['TAGS']));

  $("#desc").html(data['DESC']);

  // Total Liks Count
  let likePath = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/LIKE'  
  db.collection(likePath).get().then(function(querySnapshot) {
    $("#total_fav_cnt").html(querySnapshot.size);     
  });
  

  // Btn Handling
  likeBtnHandling()
  bookmarkBtnHandling()

  // Handle user_control_section Section
  document.getElementById("user_control_section").style.display = "none";
  if(userLoginData['UUID'] == data['UUID']) {
    document.getElementById("user_control_section").style.display = "block";    
  }

  // Display all comments
  updateCommentMessage('FIRST')

}

// More Option Handing
function openMoreOptions(details) {
  displayOutput(details)  

  let mdlContent = ''   
  
  mdlContent += '<ul class="">\
  <li><a href="#!" onclick="openUserDetails(\'' + details.split('#')[1] + '\')"><div class="collapsible-header black-text"><i class="medium material-icons green-text">person</i>View User Profile</div></a></li>\
  <li><a href="#!" onclick="shareTopicFromMain(\'' + details.split('#')[0] + '\')"><div class="collapsible-header black-text"><i class="medium material-icons blue-text">share</i>Share</div></a></li>\
  <li><a href="#!" onclick="reportToUs(\'' + details.split('#')[0] + '\')"><div class="collapsible-header black-text"><i class="medium material-icons red-text">report</i>Report to us</div></a></li>\
   </ul>'

  var model = '<!-- Modal Structure -->\
  <div id="more_option_modal" class="modal modal-fixed-footer white">\
    <div style="margin-top: -1%;">\
      <div>'+ mdlContent + '</div>\
    </div>\
    <div class="modal-footer">\
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>\
    </div>\
  </div>'



  var elem = document.getElementById('more_option_modal');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });


  $('#more_option_modal').modal('open');


}

// Report to us
function reportToUs(details) {

  $('#more_option_modal').modal('close');

  let path = coll_base_path + 'FORUM/' + 'REPORT'
  let report_data = {}

  report_data['DOCID'] = details
  report_data['DOCSPACE'] = main_path

  addNewDocument(path,report_data,'Done')
}

// ==================================
// ----- User Profile Handling ------
// ==================================

// Show User Information
function showUserInfromation() {

  if(userSectionCreated) {
    displayOutput('User Section Already Created !!')
  } else {

    scope_list.push('ANY')

  // Read User Information and Display Details
  displayOutput('User Section Created !!')
  db.collection(coll_base_path+'USER/ALLUSER').doc(useruuid).get()
  .then(doc => {
    if (!doc.exists) {
      displayOutput('No User document!');
      document.getElementById("userinfo_section").style.display = 'none';
    } else {
      userData = doc.data()

      $("#userinfo_section").html('');

      // Update User Information Section 
      let htmlContent = ''
      htmlContent += '<div class="card" style="margin: 0px 0px 0px 0px; border-radius: 10px;"><ul class="collection" style="border-radius: 10px;">\
      <li class="collection-item avatar" >\
        <img src="'+userData['PHOTOURL']+'" alt="" class="circle">\
        <span class="title"><b>'+userData['NAME']+'</b></span>\
        <p class="grey-text" style="font-size: 15px;">'+userData['EMAIL']+'</p>\
        <a onclick="viewUserProfile(\'' + 'profile' + '\')" class="waves-effect waves-teal btn-flat blue-text" style="margin-top: -5px; margin-left: -16px;"><b>Profile</b></a>\
        <a href="#!" onclick="viewUserProfile(\'' + 'info' + '\')" class="secondary-content"><b><i class="material-icons blue-text">info</i></b></a>\
      </li></ul></div>'

      $("#userinfo_section").html(htmlContent);
      document.getElementById("userinfo_section").style.display = 'block';

      userSectionCreated = true

    }
  })
  .catch(err => {   
    displayOutput('Error getting document', err);
  });

}

}

// View User Complete Profile
function viewUserProfile(control) {
  // Data : userData

  let mdlContent = ''  

  if(control == 'profile') {
  
  /*
  let profile_sec_hdr = '<!-- Header Section -->\
  <div class="row" style="margin-top: -100px; margin-left: 15%; margin-right: 15%;">\
    <div class="row">\
    <div class="col s12 m4">\
        <div class="img_div">\
          <img id="user_profile_image" class="materialboxed fb-image-profile z-depth-2" src="'+userData['PHOTOURL']+'"\
            alt="Profile image example" />\
        </div>\
     </div>\
     <div class="col s12 m8">\
        <div class="right-align" style="margin-top: 10px;">\
        <b style="font-size: 30px;">'+userData['NAME']+'</b>\
          <p style="font-size: 15px; margin-top: -5px;" class="white-text">'+userData['EMAIL']+'</p>\
          </div>\
          <br><br><i style="font-size: 15px; margin-top: 0px;" class="black-text long-text-nor">'+userData['BIO']+'</i>\
          </div></div></div>'

          */

  // For Mobile Browser
  let profile_mb_sec_hdr =  '<div id="profile_header_section_mb" class="row" style="margin-top: -100px;>\
  <div class="row">\
  <div class="col s12 m12">\
        <div class="center-align">\
          <img id="user_profile_image_mb" class="fb-image-profile-mb z-depth-2" src="'+userData['PHOTOURL']+'"/>\
        </div>\
      </div>\
      <div class="col s12 m12">\
        <div id="user_content_mb" class="center-align" style="margin-top: 0px;">\
        <b id="profile_name_mb" style="font-size: 30px;">'+userData['NAME']+'</b>\
            <p id="profile_email_mb" style="font-size: 15px; margin-top: -8px;" class="grey-text">'+userData['EMAIL']+'</p>\
            <i style="font-size: 15px; margin-top: -25px;" class="black-text long-text-nor">'+userData['BIO']+'</i>\
           </div></div></div></div>'



  
  mdlContent += '<div id="top_div_header" class="purple-card-content z-depth-2" style="height: 130px;">\
  </div>' + profile_mb_sec_hdr

  viewModelCustom(mdlContent)

  } else {

    // Show Information Only

    mdlContent += '<div id="top_div_header" class="purple-card-content z-depth-2" style="height: 100px;">\
  </div><div style="margin-left : 30px; margin-right : 10px;">' + getUserProfileFormat(userData,'user') + '</div>'

  viewModelCustom(mdlContent)


  }


}

// ==================================

// ---------------------------------------
// Add new Item
function addNewItem(details) {
var url = create_page + '?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('ADD')+ '&type=' + encodeURIComponent(details);
window.location.href = url 
}

// Show My Topic Only
function openMyTopics() {
  var url = main_page + '?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent(userLoginData['UUID']) + '&fl=' + encodeURIComponent('user');
  window.location.href = url

}

// Show All Topic Only
function openAllTopics() {
  var url = main_page + '?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
  window.location.href = url
}

// ------------ DELETE Complete topic --------------

// Ask model to confirm delete
function askToDeleteCompleteTopic() {

  let mdlContent = ''

  let header = 'Delete Complete Post'
  let content = 'Are you sure to delete complete topic ?'

  mdlContent += '<div class="left-align z-depth-2" style="border-radius: 5px 5px 0px 0px;">\
  <div class="card-content" style="padding: 5px;">\
  <p style="font-size: 30px; margin-left: 30px;">'+ header + '</p>\
  </div>\
  </div>'

  mdlContent += '<div class="card-content"><p class="grey-text" style="font-size: 15px; margin-left: 30px;">' + content + '</p>\</div>'

  mdlContent += '<div class="card-content center-align"><a onclick="deleteCompleteTopic()" class="waves-effect waves-teal btn blue white-text rcorners">Yes</a>\
  <a onclick="askNO()" class="waves-effect waves-teal btn black white-text rcorners" style="margin-left: 2%;">No</a>\
  </div>'



  var model = '<!-- Modal Structure -->\
  <div id="askmodel" class="modal" style="border-radius: 25px;">\
    <div style="margin-top: -4%;">\
      <p>'+ mdlContent + '</p>\
    </div>\
  </div>'



  var elem = document.getElementById('askmodel');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });


  $('#askmodel').modal('open');

}

// Delete complete topic
function deleteCompleteTopic() {

   displayOutput('Delete Post : ' + currentTopicID)  

   // Delete all comments
   //deleteCollectionDocuments(coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/COMMENT')

   // Delete all like
   //deleteCollectionDocuments(coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/LIKE')
   

   // Delete Main topic Document

   showPleaseWaitModel()

  let path = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID

  // Just Update DELETESTATUS to true

  
  db.doc(path).update({
    DELETESTATUS: true
  }).then(ref => {

    db.doc(coll_base_path + 'USER/ALLUSER/' +  userLoginData['UUID'] + '/MYLIST/' + currentTopicID).delete().then(function () {
      hidePleaseWaitModel()
      toastMsg('Post Deleted !!')
      resetFilter()
    });

  });
  

 //deleteDocumentUsingCloudFcn(path)

 /*
  db.doc(path).delete().then(function () {

    db.doc(coll_base_path + 'USER/ALLUSER/' +  userLoginData['UUID'] + '/MYLIST/' + currentTopicID).delete().then(function () {
      hidePleaseWaitModel()
      toastMsg('Post Deleted !!')
      location.reload();
    });
   
  });
  */

}

// Delete Collection Documents
function deleteCollectionDocuments(path) {

  db.collection(path).get()
    .then(snapshot => {
  
      if (snapshot.size == 0) {
        // ------ No Details Present ------------- 
      } else {
  
        snapshot.forEach(doc => { 

          // Delete Document
          db.doc(path + '/' + doc.id).delete()
        
        });  

    }
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });

}

// Delete Operation using Cloud Function
function deleteDocumentUsingCloudFcn(path) {
  /**
 * Call the 'recursiveDelete' callable function with a path to initiate
 * a server-side delete.
 */

 displayOutput('Delete Document using cloud function ....')

  var deleteFn = firebase.functions().httpsCallable('recursiveDelete');
  deleteFn({ path: path })
      .then(function(result) {
          displayOutput('Delete success: ' + JSON.stringify(result));
      })
      .catch(function(err) {
        displayOutput('Delete failed, see console,');
          console.warn(err);
      });

}

// -------------------------------------------------

// ------------- Comment Handling ------------------

// Open Comment Modal
function openCommentModal(control) {

  displayOutput(control)

  let validateInput = true
  if(getLoginUserStatus() == 'false') {
    validateInput = false;
    toastMsg('Please login to write comment !!')
  }

  let header = ''
  let content = '  <!-- user comment -->\
  <form class="col s12">\
    <div class="row">\
        <div class="input-field col s12">\
            <!-- <i class="material-icons prefix">message</i> -->\
            <textarea id="comment" class="materialize-textarea"></textarea>\
            <label for="comment">Your Comment</label>\
          </div></div>\
  </form>'

  // Click Behaviour Change according to control
  let onclick_html = ''
  if(control == 'MAIN') {
    onclick_html = 'addNewComment()'
  } else {
    onclick_html = 'addNewSubComment(\'' + control + '\')'
  }

  var model = '<!-- Modal Structure -->\
  <div id="commentModal" class="modal">\
    <div class="modal-content">\
      <h4> '+ header + '</h4>\
      <p class="long-text-nor">'+ content + '</p>\
    </div>\
    <div class="modal-footer">\
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cancel</a>\
      <a href="#!" onclick="'+onclick_html+'" class="waves-effect waves-green btn-flat">Add Comment</a>\
    </div>\
  </div>'

  var elem = document.getElementById('commentModal');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });

  if(validateInput) {
     $('#commentModal').modal('open');
  }

}

// Add new Comment
function addNewComment() { 

  $('#commentModal').modal('close');

  // Read details
  let path = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/COMMENT'
 
  var validateInput =  true

  // Read Comment Details
  var comment = document.getElementById("comment").value.trim();
  displayOutput('comment : ' + comment)
  if(comment == '') {
    validateInput = false
    toastMsg('Comment is empty!!')
  } 

  if(validateInput) {
       // Update Comment into Comment Section

       let forumData = {}

       forumData['COMMENT'] = nl2br(comment)

        forumData['DATE'] =  getTodayDate()
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        forumData['CREATEDON'] =  timestamp        

        forumData['UNAME'] =  userLoginData['NAME']
        forumData['UPHOTO'] =  userLoginData['PHOTO']
        forumData['UUID'] =  userLoginData['UUID']        

       showPleaseWaitModel()

  // Update Into Database
   db.collection(path).add(forumData).then(function() {    
    hidePleaseWaitModel()
    
    document.getElementById("comment").value = ''

    toastMsg('Comment Added !!')


    /*
    // ---------------------------------------------------
    // Update Reply counter 
    let topicPath = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID

    // parseInt()
    allForumTopics[currentTopicID]['REPLYCNT'] = allForumTopics[currentTopicID]['REPLYCNT']++
    db.doc(topicPath).update({
      REPLYCNT: allForumTopics[currentTopicID]['REPLYCNT']
    }).then(ref => {
       displayOutput('Reply counter increment !!')
    });

    // -----------------------------------------------------
    */

    viewAllComments()
     
  }); 
  }

}

// View all comments
function viewAllComments() {

  document.getElementById("all_user_comments").style.display = "block";
  document.getElementById("viewallcomments").style.display = "none";

  $("#all_user_comments").html('<p>Loading .... </p>');

  currentTopicCommentsStatus = true

  // Update Comment Message
  updateCommentMessage('SECOND')

   // Read details
   let path = coll_base_path + 'FORUM/' + main_path + '/' +  currentTopicID + '/COMMENT'

   let htmlContent = '<div class="row">'

   let queryRef = db.collection(path).orderBy('CREATEDON', 'desc');
 
   queryRef.limit(commentquerySize).get()
    .then(snapshot => {
  
      if (snapshot.size == 0) {
        // ------ No Details Present -------------  
        displayOutput('No Record Found !!') 
        //document.getElementById("ratings_sec").style.display = 'none'; 
        $("#all_user_comments").html('<p>No Comment !!</p>');

        document.getElementById("viewmorecomments").style.display = "none";

        currentTopicCommentsStatus = false

      } else {
  
      snapshot.forEach(doc => { 
        let data = doc.data() 

        // Update Comment Section

        htmlContent += ' <div id="'+ doc.id +'" class="col s12 m12" style="margin-top : 10px;" >\
        <div class="" style="border-radius: 5px; border: 0.1px solid grey; border-top-style: none;">\
          <div>\
            <!-- Header -->\
              <ul class="collection" style="border-radius: 5px 5px 0px 0px; border: 0.1px solid grey; margin-top : -0.5px; z-index: -1 ">\
                <li class="collection-item avatar">\
                  <img src="'+data['UPHOTO']+'" alt="" class="circle">\
                  <span class="title"><b>'+data['UNAME']+'</b></span>\
                  <p class="grey-text" style="font-size: 13px;">'+data['DATE']+'</p>\
                  </li>\
              </ul>\
  \
              <!-- Content -->\
              <div>\
  \
                <div style="margin-top: -30px; margin-left: 20px; margin-right: 10px; ">\
                  <p class="long-text-nor">'+data['COMMENT']+'</p>\
                </div>'

                if(userLoginData['UUID'] == data['UUID']) {
                htmlContent += ' <div class="right-align" style="margin-top: 0px;">\
                <a onclick="askToDeleteComment(\'' + doc.id + '\')" class="waves-effect waves-teal btn-flat blue-text">Delete</a>\
              </div>'
                }

               htmlContent += ' <li class="divider" tabindex="-1"></li> </div> </div>  </div></div>'

      });   
      
      
      htmlContent += '</div>'


      $("#all_user_comments").html(htmlContent);    
      
      window.scrollTo(comment_horizScrollPosition, comment_vertiScrollPosition);
     
  
    }
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
  

}

// View more comments
function viewMoreComments() {

  comment_horizScrollPosition = window.pageXOffset  
  comment_vertiScrollPosition = window.pageYOffset

  commentquerySize = commentquerySize + 10

  viewAllComments()

}

// Display Comment Message
function updateCommentMessage(mode) {

  let path = coll_base_path + 'FORUM/' + main_path + '/' +  currentTopicID + '/COMMENT'

   // Update Total Count message
   db.collection(path).get().then(function(querySnapshot) {   

    if(querySnapshot.size == 0) {
      $("#comment_message").html('Comment (' + querySnapshot.size + ')')
      document.getElementById("viewallcomments").style.display = "none";

      document.getElementById("all_user_comments").style.display = "block";
      $("#all_user_comments").html('<p>No Comment !!</p>');

    } else {

      if(commentquerySize >= querySnapshot.size) {
        document.getElementById("viewmorecomments").style.display = "none";
        commentquerySize = querySnapshot.size
      } else {
        document.getElementById("viewmorecomments").style.display = "block";
      }

      if(mode == 'FIRST') {
        $("#comment_message").html('Comment (' + querySnapshot.size + ')')
        document.getElementById("viewmorecomments").style.display = "none";
        document.getElementById("viewallcomments").style.display = "block";
        document.getElementById("all_user_comments").style.display = "none";

      } else {
        $("#comment_message").html('Comment (' + commentquerySize + ' / '+ querySnapshot.size + ')')
      }

    }
    
  });

}

// Ask model dialog to delete any document
function askToDeleteComment(details) {

  let mdlContent = ''

  let header = 'Delete Comment'
  let content = 'Are you sure to delete comment ?'

  mdlContent += '<div class="left-align z-depth-2" style="border-radius: 5px 5px 0px 0px;">\
  <div class="card-content" style="padding: 5px;">\
  <p style="font-size: 30px; margin-left: 30px;">'+ header + '</p>\
  </div>\
  </div>'

  mdlContent += '<div class="card-content"><p class="grey-text" style="font-size: 15px; margin-left: 30px;">' + content + '</p>\</div>'

  mdlContent += '<div class="card-content center-align"><a onclick="deleteComment(\'' + details + '\')" class="waves-effect waves-teal btn blue white-text rcorners">Yes</a>\
  <a onclick="askNO()" class="waves-effect waves-teal btn black white-text rcorners" style="margin-left: 2%;">No</a>\
  </div>'



  var model = '<!-- Modal Structure -->\
  <div id="askmodel" class="modal" style="border-radius: 25px;">\
    <div style="margin-top: -4%;">\
      <p>'+ mdlContent + '</p>\
    </div>\
  </div>'



  var elem = document.getElementById('askmodel');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });


  $('#askmodel').modal('open');

}

// Delete Comment
function deleteComment(details) {

  askNO()
  displayOutput(details) 
  document.getElementById(details).style.display = "none"; 

  //showPleaseWaitModel()

  let path = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/COMMENT/' + details

  db.doc(path).delete().then(function () {
    //hidePleaseWaitModel()
    toastMsg('Comment Deleted !!') 

    /*
    // ---------------------------------------------------
  // Update Reply counter 
  let topicPath = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID

  let cntInc = allForumTopics[currentTopicID]['REPLYCNT']
  if(cntInc < 0) {
    cntInc = 1
  }

  allForumTopics[currentTopicID]['REPLYCNT'] = cntInc--
  displayOutput(allForumTopics[currentTopicID]['REPLYCNT'])
  db.doc(topicPath).update({
    REPLYCNT: allForumTopics[currentTopicID]['REPLYCNT']
  }).then(ref => {
     displayOutput('Reply counter increment !!')
  });

  // --------------------------------------------------
  */ 

  }); 

  

}


// --------------- Edit Topic --------------
function editTopic() {
  var url = create_page + '?pt='+encodeURIComponent(main_path)+'&id=' + encodeURIComponent(currentTopicID)+'&fl=' + encodeURIComponent('edit') + '&type=' + encodeURIComponent(allForumTopics[currentTopicID]['DOCTYPE']);
  window.location.href = url
}

// Share topic
function shareTopic() {
  let link = 'https://kivtravels.com/prod/post/' + main_page +'?pt='+main_path+'&id='+currentTopicID+'&fl=only' 

  var textArea = document.createElement("textarea");
  textArea.value = link;
  textArea.display = "none";
  textArea.style.position="fixed";  //avoid scrolling to bottom
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';    
    //displayOutput('Fallback: Copying text command was ' + msg);
    toastMsg('Link Copied !!')
  } catch (err) {
    //console.error('Fallback: Oops, unable to copy', err);
    displayOutput('Oops, unable to copy')
  }

  document.body.removeChild(textArea);

}

function shareTopicFromMain(docid) {

  $('#more_option_modal').modal('close');

  let link = 'https://kivtravels.com/prod/post/' + main_page +'?pt='+main_path+'&id='+docid+'&fl=only' 

  var textArea = document.createElement("textarea");
  textArea.value = link;
  textArea.display = "none";
  textArea.style.position="fixed";  //avoid scrolling to bottom
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';    
    //displayOutput('Fallback: Copying text command was ' + msg);
    toastMsg('Link Copied !!')
  } catch (err) {
    //console.error('Fallback: Oops, unable to copy', err);
    displayOutput('Oops, unable to copy')
  }

  document.body.removeChild(textArea);

}

// Like topic
function likeTopic() {

  let path = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/LIKE'

  if(getLoginUserStatus() == 'true') {

  if(currentTopicLikeStatus) {

    db.collection(path).doc(userLoginData['UUID']).delete().then(function() { 
      $("#like_btn").html('favorite_border');
      currentTopicLikeStatus = false
    }); 

  } else {

    db.collection(path).doc(userLoginData['UUID']).set({LIKE : 'YES'}).then(function() { 
      $("#like_btn").html('favorite');
      currentTopicLikeStatus = true
    }); 

  }

} else {
  toastMsg('Please login !!')
}

}

// Like btn handling
function likeBtnHandling() {
  $("#like_btn").html('favorite_border');
  currentTopicLikeStatus = false

  let path = coll_base_path + 'FORUM/' + main_path +'/' +  currentTopicID + '/LIKE'

  if(getLoginUserStatus() == 'true') {

  db.collection(path).doc(userLoginData['UUID']).get()
  .then(doc => {
    if (!doc.exists) {
      $("#like_btn").html('favorite_border');
      currentTopicLikeStatus = false
    } else {
      $("#like_btn").html('favorite');
      currentTopicLikeStatus = true
    }
  })
  .catch(err => {
    console.log('Error getting document', err);
  });

}

}

// Bookmark topic
function bookmarkTopic() {
  $("#bookmark_btn").html('bookmark');

  let path = coll_base_path + 'USER/ALLUSER/' +  userLoginData['UUID'] + '/BOOKMARK'

  if(getLoginUserStatus() == 'true') {
  
  if(currentTopicBookmarkStatus) {

    db.collection(path).doc(currentTopicID).delete().then(function() { 
      $("#bookmark_btn").html('bookmark_border');
      currentTopicBookmarkStatus = false
      toastMsg('Bookmark Removed !!')
    }); 

  } else {

    let data = allForumTopics[currentTopicID]

    let bookmarkData = {}
    
    bookmarkData['UPHOTO'] = data['UPHOTO']
    bookmarkData['UNAME'] = data['UNAME']
    bookmarkData['DATE'] = data['DATE']
    bookmarkData['TITLE'] = data['TITLE']
    bookmarkData['TYPE'] = 'FORUM'
    bookmarkData['SPACE'] = main_path
    bookmarkData['SPACENAME'] = 'POST'

    var url = 'post/' + main_page +'?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent(currentTopicID) + '&fl=' + encodeURIComponent('only'); 
    bookmarkData['LINK'] = url


    db.collection(path).doc(currentTopicID).set(bookmarkData).then(function() { 
      $("#bookmark_btn").html('bookmark');
      currentTopicBookmarkStatus = true
      toastMsg('Bookmark Added !!')
    }); 

  }

} else {
  toastMsg('Please login !!')
}


}

// Bookmark Handling
function bookmarkBtnHandling() {
  $("#bookmark_btn").html('bookmark_border');
  currentTopicBookmarkStatus = false
  
  let path = coll_base_path + 'USER/ALLUSER/' +  userLoginData['UUID'] + '/BOOKMARK'

  if(getLoginUserStatus() == 'true') {
    db.collection(path).doc(currentTopicID).get()
    .then(doc => {
      if (!doc.exists) {
        $("#bookmark_btn").html('bookmark_border');
        currentTopicBookmarkStatus = false
      } else {
        $("#bookmark_btn").html('bookmark');
        currentTopicBookmarkStatus = true
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });

  }

}


// Get Chip with border accroding to the Name
function getChipWithBorderFromListLoc(details){

  if((details[0] == 'NA') && (details.length == 1)) {
    details = ''
  } else {
    //details.splice( details.indexOf('NA'), 1 );
  }

  var html_line = ''

  for (each_idx in details) {
    var name = details[each_idx]
    let start = '<a href="#!" onclick="chipClickHandling(\'' + name +'#tag' + '\')" ><div class="chip-outline grey-text" style="margin-right: 5px; margin-top: 5px;">'
    let end = '</div></a>'

    html_line += start + name + end
  }

  return html_line

}

// On Chip Click Handling
function chipClickHandling(details) {
  displayOutput(details)

  if(details.split('#')[1] == 'tag') {

    selected_tag.push(details.split('#')[0])

    selected_tag = Array.from(new Set(selected_tag));

    saveConfig(details.split('#')[1],selected_tag)

    hideFullMessageDialog()
    closeFilterSection()
    updateHTMLPage()

  } else {

    saveConfig(details.split('#')[1],details.split('#')[0])

    hideFullMessageDialog()
    closeFilterSection()
    updateHTMLPage()

  }
  

  /*
  if(details.split('#')[1] == 'scope') {
    saveConfig('LOCSCOPE',details.split('#')[0])

    closeFilterSection()

    updateHTMLPage()

  } else {
    // Open URL with tag filter option
    var url = main_page + '?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent(details.split('#')[0]) + '&fl=' + encodeURIComponent(details.split('#')[1]);
    window.location.href = url
  } 
  */

}

// Open User Related Details
function openUserDetails(details) {
 // Open URL with tag filter option
  var url = main_page + '?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent(details) + '&fl=' + encodeURIComponent('user');
  window.location.href = url
}

// Save Configuration
function saveConfig(key,value) {
  localStorageData(key,value)
}

// Read Configuration
function readConfig(key) {

  if (typeof (Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    return sessionStorage.getItem(key);
  } else {
    // Sorry! No Web Storage support..
    displayOutput('Sorry! No Web Storage support..')
    return 'NA'
  }

}


// ---------- UI Handling ------------------

// close topic view
function hideFullMessageDialog() {

  commentquerySize = 10
  comment_horizScrollPosition = 0
  comment_vertiScrollPosition = 0

  if(fl == 'edit') {
    var url = main_page + '?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
    window.location.href = url   

  } else {

    document.getElementById("show_all_topic_container").style.display = "block";
    document.getElementById("topic_display_container").style.display = "none";

    document.getElementById("close_fl_btn").style.display = "none";

    

  }

  window.scrollTo(horizScrollPosition, vertiScrollPosition);

  

}

// Back to previous page
function backTopreviousPage() {
  window.history.back();
}


// ----------- START UP CALLS ----------------
function startUpCalls() {

  displayOutput('Startup Calls')

  $(document).ready(function () {
    $('.modal').modal();
  });

  $(document).ready(function(){
    $('input.autocomplete').autocomplete({
      data: {
        "Apple": null,
        "Microsoft": null,
        "Google": 'https://placehold.it/250x250'
      },
    });
  });


  $(document).ready(function(){
    $('.datepicker').datepicker();
    $('.datepicker').datepicker({'format' : 'mmm d, yyyy'});
  }); 

  $(document).ready(function(){
    $('select').formSelect();
  });


  $(document).ready(function(){
    $('input.autocomplete').autocomplete({
      data: convTagsList(),
    });
  });

  $(document).ready(function(){
    $('.tabs').tabs();
  });


  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
      direction: 'top',
      hoverEnabled: false
    });
  });

}

// ------------ Search Dialog ----------------

function openSearchDialog() {

  let content =  ''

  if(searchSelectedOption == 'USER') {
    content += '<a href="#!" onclick="searchSelectionOption(\'' + 'USER' + '\')" class="chip purple white-text z-depth-2">User</a>'
    content += '<a href="#!" onclick="searchSelectionOption(\'' + 'TAG' + '\')" class="chip" style="margin-left : 10px;">Tag</a>'
  } else {
    content += '<a href="#!" onclick="searchSelectionOption(\'' + 'USER' + '\')" class="chip">User</a>'
    content += '<a href="#!" onclick="searchSelectionOption(\'' + 'TAG' + '\')" class="chip purple white-text z-depth-2" style="margin-left : 10px;">Tag</a>'
  }
  

  content += ' <div class="row" style="margin-top: 30px;">\
  <div class="input-field">\
    <i class="material-icons red-text prefix">search</i>\
    <input type="text" id="search_value" class="autocomplete">\
    <label for="search_value">Keyword</label>\
  </div>\
  </div>'

  content += '<div class="center-align" style="margin-top: 2px;">\
  <a onclick="applySelectedSearch()" class="waves-effect waves-light btn red rcorners">Search</a>\
</div>'

  
  var model = '<!-- Modal Structure -->\
  <div id="searchSectionDialog" class="modal modal-fixed-footer">\
    <div class="modal-content">\
    <h4>Search Option</h4>\
    <p class="long-text-nor">'+ content + '</p>\
    </div>\
    <div class="modal-footer">\
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>\
    </div>\
  </div>'

  var elem = document.getElementById('searchSectionDialog');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });


  $('#searchSectionDialog').modal('open');

  // Update Data set

  $(document).ready(function(){
    $('input.autocomplete').autocomplete({
      data: convTagsList(),
    });
  });

}

// Search Selection
function searchSelectionOption(details) {
  //toastMsg(details)
  searchSelectedOption = details

  $('#searchSectionDialog').modal('close');

  openSearchDialog()

}

// Apply Selected Search 
function applySelectedSearch() {

  $('#searchSectionDialog').modal('close');

  var search_value = document.getElementById("search_value").value.trim();  
  if(search_value == '') {
    searchSelectedValue = 'NA'
  } else {
    searchSelectedValue = search_value
  }

  if(searchSelectedOption == 'TAG') {
    chipClickHandling(searchSelectedValue+'#tag')
  } else {
    toastMsg('User : ' + searchSelectedValue)
  }




}

// ------------ Filter Handling --------------

// Open Filter Section
function openFilterSection() {

  // Current Scroll Posstion
  // horizontal scrolling amount
  horizScrollPosition = window.pageXOffset
  // vertical scrolling amount
  vertiScrollPosition = window.pageYOffset

  window.scrollTo(0, 0); 

  document.getElementById("col_section_1").style.display = 'none';
  document.getElementById("flb_open_filter").style.display = 'none';
  document.getElementById("main_footer_sec").style.display = 'none';  

  document.getElementById("flb_close_filter").style.display = 'block';
  document.getElementById("filter_section").style.display = 'block';

}

// Close Filter Section
function closeFilterSection() {  

  document.getElementById("col_section_1").style.display = 'block';
  document.getElementById("flb_open_filter").style.display = 'block';
  //document.getElementById("main_footer_sec").style.display = 'block';  

  document.getElementById("flb_close_filter").style.display = 'none';
  document.getElementById("filter_section").style.display = 'none';

  window.scrollTo(horizScrollPosition, vertiScrollPosition);  

}

// RESET Filter 
function resetFilter() {
  var url = main_page + '?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
  window.location.href = url
}

// Apply Filter
function applyFilter() {

  let filter_validation = true

  filter_selection_status = {
    CATG : false,
    TAG : false,
    DATE : false,
    MONTH : false,
    YEAR : false
  }

  filter_selection_data = {
    CATG : '',
    TAG : '',
    DATE : ''
  }

  // Read Filter details

   let catgOption = getCatgDataMapping('LIST') 
   let catDropValue = document.getElementById("catg_options").value
   let cateData = ''  

   if(catDropValue == '') {
    filter_selection_status['CATG'] = false
   } else {
    filter_selection_status['CATG'] = true
     cateData = catgOption[catDropValue]     
     filter_selection_data['CATG'] = cateData
   } 
  


  var tagDetails = document.getElementById("autocomplete-input").value.trim();  
  if(tagDetails == '') {
    filter_selection_status['TAG'] = false
  } else {
    filter_selection_status['TAG'] = true
    filter_selection_data['TAG'] = tagDetails
  }

  var topic_date = document.getElementById("topic_date").value.trim();
  displayOutput('Post Date : ' + topic_date)
  if(topic_date == '') {
    filter_selection_status['DATE'] = false
  } else {
    filter_selection_status['DATE'] = true
    filter_selection_data['DATE'] = topic_date
  }

  //displayOutput(filter_selection_status)
  //displayOutput(filter_selection_data)

  // Check Month and year status
  let selected_date = document.getElementById("selected_date_chkbx").checked
  if(selected_date) {
    filter_selection_status['MONTH'] = false
    filter_selection_status['YEAR'] = false
  } else {
    filter_selection_status['MONTH'] = document.getElementById("selected_month_chkbx").checked
    filter_selection_status['YEAR'] = document.getElementById("selected_year_chkbx").checked
  }
  

  filter_validation = filter_selection_status['CATG'] || filter_selection_status['TAG'] || filter_selection_status['DATE']
  displayOutput('Filter Validation : ' + filter_validation)
  //filter_validation = false

  if(filter_validation) {

  filter_enable_flag = true 

   // Update Filter message
   let chip_html = ''
   if(filter_selection_status['DATE']) {
    chip_html += '<div class="chip">' + 'Date : ' +  filter_selection_data['DATE'] + '</div>'
   }

   if(filter_selection_status['CATG']) {
    chip_html += '<div class="chip">' + 'Category : ' +  getCatgDataMapping(filter_selection_data['CATG']) + '</div>'
   }

   if(filter_selection_status['TAG']) {
    chip_html += '<div class="chip">' + 'Tag : ' +  filter_selection_data['TAG'] + '</div>'
   }

   let sel_value = ''
   if(filter_selection_status['MONTH']) {
     sel_value = filter_selection_data['DATE'].split(' ')[0]
    chip_html = '<div class="chip">' + 'Month : ' +  sel_value  + '</div>'
    filter_selection_data['DATE'] = sel_value
   }

   if(filter_selection_status['YEAR']) {
    sel_value = filter_selection_data['DATE'].split(' ')[2]
    chip_html = '<div class="chip">' + 'Year : ' +  sel_value  + '</div>'
    filter_selection_data['DATE'] = sel_value
   }

   $('#main_filter_section').html(chip_html)

   
    $('#message_content').html('Filter Applied !!')
   

  closeFilterSection()
  readAllForums()

  } else {     
    toastMsg('No Filter Applied !!')
    closeFilterSection()
  }


}

// Create Filter tags details

// Create Location Scope Section
function createFilterScopeDetails() {

  $("#all_Scope_details").html('');

  let html_line = ''
  for(each_idx in scope_list) {   
    let scope_name = scope_list[each_idx]

    if(scope_name == location_scope) {
      html_line += '<a href="#!" onclick="chipClickHandling(\'' + scope_name +'#scope' + '\')" ><div class="chip blue white-text z-depth-2" style="margin-bottom : 10px;">'+ scope_name  +'</div></a>'
    } else {
      html_line += '<a href="#!" onclick="chipClickHandling(\'' + scope_name +'#scope' + '\')" ><div class="chip" style="margin-bottom : 10px;">'+ scope_name  +'</div></a>'
    }

    
  }

  $("#all_Scope_details").html(html_line);

}

// Create Location Card
function createLocationCard(locName) {

  let location_info = getEachLocationInfo(locName)

  let loc_html = '<div class="card hoverable" style="border-radius: 10px;" >\
  <div class="card-image waves-effect waves-block waves-light">\
    <img class="activator" src="'+location_info['IMAGE']+'" style="border-radius: 10px 10px 0px 0px; height: 150px;">\
  </div>\
  <div style="padding: 10px;">\
    <span class="card-title truncate activator grey-text text-darken-4">'+location_info['NAME']+'<i class="material-icons right" style="margin-top: 5px;">more_vert</i></span>\
  </div>\
  <div class="card-reveal">\
    <span class="card-title grey-text text-darken-4">'+location_info['NAME']+'<i class="material-icons right">close</i></span>\
    <p class="long-hdr-text">'+location_info['INFO']+'</p>\
    <div class="right-align" style="margin-top: 30px;">\
    <a onclick="viewEachLocationInfo(\'' + location_info['DOCID'] + '\')" class="waves-effect waves-teal btn-flat blue-text">view More</a>\
    </div>\
  </div>\
</div>'

$('#location_details_sec').html(loc_html)

}

// View each Location Information
function viewEachLocationInfo(docid) {

  displayOutput(docid)

}

// Create Tags Section
function createFilterTagsDetails() {
  $("#all_tags_details").html('');

  let tags_list = tagsListData()

  let html_line = ''
  for(tags_name in tags_list) {
    let tags_count = tags_list[tags_name]

    if(selected_tag.indexOf(tags_name) >= 0) {
      html_line += '<a href="#!" onclick="chipClickHandling(\'' + tags_name +'#tag' + '\')" ><div class="chip orange white-text z-depth-2" style="margin-bottom : 10px;">'+tags_name + ' (' + tags_count +')' +'</div></a>'
    } else {
      html_line += '<a href="#!" onclick="chipClickHandling(\'' + tags_name +'#tag' + '\')" ><div class="chip" style="margin-bottom : 10px;">'+tags_name + ' (' + tags_count +')' +'</div></a>'
    }

  }

  $("#all_tags_details").html(html_line);

}

// Create Category Section
function createFilterCategoryDetails() {
  $("#all_Category_details").html('');

  let catg_list = getCatgDataMapping('LIST')

  let html_line = ''
  for(each_idx in catg_list) {
    if(each_idx == 0) {continue}

    let catg_name = catg_list[each_idx]

    if(getCatgDataMapping(catg_name) == getCatgDataMapping(selected_catg)) {
      html_line += '<a href="#!" onclick="chipClickHandling(\'' + catg_name +'#catg' + '\')" ><div class="chip green white-text z-depth-2" style="margin-bottom : 10px;">'+ getCatgDataMapping(catg_name)  +'</div></a>'
    } else {
      html_line += '<a href="#!" onclick="chipClickHandling(\'' + catg_name +'#catg' + '\')" ><div class="chip" style="margin-bottom : 10px;">'+ getCatgDataMapping(catg_name)  +'</div></a>'    }
    }

  $("#all_Category_details").html(html_line);

}

// Create chip like card with title and close btn
function createChipLikeCard(details,color) {

  let card_html = '<div class="col s6 m6">\
  <a href="#!" onclick="cardChipSelectedHandle(\'' + details + '\')">\
  <div class="card hoverable '+color+'" style="border-radius: 10px;">\
    <div style="padding: 10px;" class="white-text">\
      <span class="card-title truncate">'+details.split('#')[0]+'<i class="material-icons right" style="margin-top: 5px;">close</i></span>\
      </div>\
      </div>\
      </div></a>'

  return card_html

}

// Callback from Card Chip
function cardChipSelectedHandle(details) {
  displayOutput(details)
}

// ------------- Menu Handling -------------------

// Show Menu Options
function showMenuOptions() {

  if(getLoginUserStatus() == 'true') {

  document.getElementById("show_all_topic_container").style.display = "none";
  document.getElementById("menu_section").style.display = "block";

  document.getElementById("close_fl_btn_menu").style.display = "block";
  } else {
    toastMsg('Please login to post anything !!')
  }

   // Current Scroll Posstion
  // horizontal scrolling amount
  horizScrollPosition = window.pageXOffset
  // vertical scrolling amount
  vertiScrollPosition = window.pageYOffset

}

// Hide Menu Options
function hideMenuDialogSection() {
  document.getElementById("show_all_topic_container").style.display = "block";
  document.getElementById("menu_section").style.display = "none";

  document.getElementById("close_fl_btn_menu").style.display = "none";

  window.scrollTo(horizScrollPosition, vertiScrollPosition);

}

