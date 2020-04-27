// *******************************************************************************
// SCRIPT : index.js
//
//
// Author : Vivek Thakur
// Date : 13/2/2020
// *******************************************************************************

// ---------- Main Variables ---------
var main_path = 'NA'
var id = 'NA'
var fl = 'NA'

// Login User Details
var userLoginData = ''
var currentTopicID = ''
var currentTopicCommentsStatus = true
var currentTopicLikeStatus = false
var currentTopicBookmarkStatus = false

// Current SPACE
var current_space = 'POST'

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

// User Follower Details
var user_follower_count = 0
var user_follower_status = false

// Each Doc FAV Count
var each_doc_fav_count = 0

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

// Global Color
var color='purple'

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
      handleBlockView("manage_post_menu",'show');
    }

    // Display Other Options also
    handleBlockView("my_topics_menu",'show');
    handleBlockView("my_list_menu",'show');
    handleBlockView("my_bookmark_menu",'show');

    handleBlockView("my_topics_menu_mb",'show');
    handleBlockView("my_list_menu_mb",'show');
    handleBlockView("my_bookmark_menu_mb",'show');

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

  handleBlockView("top_div_header"); 
  handleBlockView("userinfo_section"); 
  handleBlockView("main_filter_section");
  handleBlockView("create_sec",'show');

  // Page Haandling according to Filter value : fl

  if((fl == 'edit') || (fl == 'only')) {
    handleBlockView("flb_open_filter");
    // Read only edit topic details and show details
    readOneForum()

  } if(fl == 'user') {
  
    displayOutput('User Details')
    handleBlockView("top_div_header",'show'); 
    handleBlockView("userinfo_section",'show');
    handleBlockView("create_sec");
    

    isUserMode = true
    useruuid = id

    readAllForums()

    showUserInfromation()
  
  }
  else {
    displayOutput('Default Action')
    readAllForums()
  
  }

  // Update Filter section details
  setHTML('main_filter_section_value','')

  

  if(location_scope != 'NA') {
    if(isUserMode) {
      setHTML('location_details_sec',createChipLikeCard(location_scope,'green','location_on'))
    } else {
      createLocationCard(location_scope)
    }    
  }
 
  let filt_html_line = ''

  if(selected_catg != 'NA') {    
    filt_html_line +=  '<a class="waves-effect waves-light '+getCatgGroupDetails('FIND',selected_catg).COLOR +' btn z-depth-2" style="border-radius: 10px; margin-bottom : 10px;"><i onclick="catgReset()" class="material-icons right">close</i>' + getCatgDataMapping(selected_catg) + '</a><br>'
 }

  if(selected_tag.length > 0) {    

    for(each_idx in selected_tag) {
      let tag_name = selected_tag[each_idx]
      filt_html_line += '<div class="chip orange white-text z-depth-2" style="margin-bottom : 10px;">' + tag_name + '<i onclick="tagReset(\'' + tag_name + '\')" class="close material-icons">close</i></div>'
    }    
  }

  if(!isStrEmpty(filt_html_line)) {
    handleBlockView("main_filter_section",'show');
    setHTML('main_filter_section_value',filt_html_line)
  }

  

  // Update Filter Section 

  createFilterScopeDetails()

  createFilterTagsDetails()

  createFilterCategoryDetails()

 
}

// RESET CATG Options
function catgReset() {
  saveConfig('catg','NA')

  updateHTMLPage()
}

// RESET TAG Options
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
    
    getHTML('show_all_topic_container').className = "container-fluid";
    getHTML('topic_display_container_sub').className = "container-fluid";
    getHTML('topic_display_container_sub').style.marginLeft = "5px";
    getHTML('topic_display_container_sub').style.marginRight = "5px";
    getHTML('topic_display_container_sub').style.marginTop = "-80px";

    //getHTML("filter_section").className = 'row container';
    getHTML('filter_section').style.marginLeft = "5px";
    getHTML('filter_section').style.marginRight = "5px";

  } else {
    displayOutput('Mobile Browser Not found!')
    getHTML('topic_display_container_sub').style.marginTop = "-80px";
    

  }
}

// --------- Mobile Mode Handling ---------
function mobileModeStartupHandling() {

  // Check for Mobile Mode
  if (mobile_mode) {
    // Disable Nav-bar and Footer
    //handleBlockView("main_nav_bar",'show');
    
   

  } else {
   
  }


}

// Read Forum Details
function readAllForums() {

  allForumTopics = {}
  setHTML('forum_card_section','');
  handleBlockView("main_progress",'show');
  handleBlockView("more_btn"); 
  
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
    setHTML('total_card_sec','Display ' + querySize + ' / ' + querySnapshot.size);

    if(isUserMode) {setHTML('post_count',querySnapshot.size)}
    
    if(querySize >= querySnapshot.size) {
      handleBlockView("more_btn");
    } else {
      handleBlockView("more_btn",'show');
    }
  });

 
  queryRef.limit(querySize).get()
   .then(snapshot => {
 
     if (snapshot.size == 0) {
       // ------ No Details Present -------------  
       displayOutput('No Record Found !!') 

       let htmlContent = ''
       htmlContent += '<h1 class="black-text">No Post Found !!</h1>'
       
       setHTML('forum_card_section',htmlContent);

       handleBlockView("main_progress");
       handleBlockView("more_btn");

     } else {    
 
     snapshot.forEach(doc => { 
       allForumTopics[doc.id] = doc.data() 

       createEachDocumentCard(doc.data(),doc.id)

     });

     // Update Forum HTML Content

    // updateForumContent()

    handleBlockView("main_progress");   

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
   let collectionRef = db.collection(getCompPath('FORUM'))

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
  let collectionRef = db.collection(getCompPath('FORUM'))

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
  handleBlockView("main_progress",'show');

  // Read details
  
  db.collection(getCompPath('FORUM')).doc(id).get()
  .then(doc => {
    if (!doc.exists) {
      displayOutput('No such document!');  
      
      let htmlContent = ''
       htmlContent += '<h1 class="black-text">No Post Found !!</h1>'
       
       setHTML('forum_card_section',htmlContent);

       handleBlockView("main_progress");

       handleBlockView("close_fl_btn_to_back",'show');

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
        setHTML('forum_card_section',htmlContent);
        handleBlockView("main_progress");

        handleBlockView("close_fl_btn_to_back",'show');

       }
       
      
      
    }
  })
  .catch(err => {   
    displayOutput('Error getting document', err);
  });
  

}

// Update forum Section with ALL Data once
function updateForumContent() { 

  setHTML('forum_card_section','');

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


    setHTML('forum_card_section',htmlContent);

    handleBlockView("main_progress");

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
            <p class="long-text grey-text" >'+getDescription(data,'SHORT')+'</p>\
          </div> \
          <div class="left-align" style="margin-top: 15px;">'
          + getCatgHTMLCode(data['CATEGORY'],data['CATEGORYDIS'],data['CATEGORYGROUP']) +
              '<div  style="margin-top: 8px; z-index: -1">\
                '+getChipWithBorderFromListLoc(data['TAGS'])+'\
              </div>\
               <div id="reach_content_btn" class="right-align" style="margin-top: 5px;">\
              <a onclick="viewEachTopic(\'' + docid + '\')" class="waves-effect waves-teal btn-flat blue-text">Read More</a>\
            </div>\
              </div> </div>  </div></div>'


let block_to_insert = document.createElement( 'div' );
block_to_insert.innerHTML = htmlContent ;
 
let container_block = getHTML( 'forum_card_section' );
container_block.appendChild( block_to_insert );

// Old Set
// <a href="#!" onclick="chipClickHandling(\'' + data['CATEGORY'] +'#catg' + '\')" ><div class="chip  '+color+' white-text z-depth-2">'+data['CATEGORYDIS']+'</div></a> </div>\

}

// Get CATEGORY HTML Code
function getCatgHTMLCode(catg_id,catg_name,catg_group_id) {
  let catg_group_details = getCatgGroupDetails('GROUP',catg_group_id)
  return  '<a class="waves-effect waves-light '+catg_group_details.COLOR+' btn z-depth-2" onclick="chipClickHandling(\'' + catg_id +'#catg' + '\')" style="border-radius: 10px;"><i class="material-icons left">'+catg_group_details.ICON+'</i>' + catg_name + '</a>'
}

// Create Description
function getDescription(post_data,mode='FULL') {

  let content = post_data.DESC

  if(mode == 'FULL') {
    // Format complet Content
    content = content.replace(/\r?B#/g, "<b>")
    content = content.replace(/\r?#B/g, "</b>")

    content = content.replace(/\r?I#/g, "<i>")
    content = content.replace(/\r?#I/g, "</i>")

    content = content.replace(/\r?U#/g, "<u>")
    content = content.replace(/\r?#U/g, "</u>")

    content = content.replace(/\r?LS#/g, "<li>")
    content = content.replace(/\r?#LS/g, "</li>") 
    
    // Update BLOCKLIST Content
    let blocklist_content = post_data.BLOCKLIST
    for(each_key in blocklist_content) {
      content = content.replace('@' + each_key + '@', blocklist_content[each_key])
    }

    // Update Link Content  
    let all_links_content = post_data.LINKLIST
    for(each_key in all_links_content) {
      content = content.replace('@' + each_key + '@', all_links_content[each_key])
    }

    // Update Image Content  
    let images_content = post_data.IMAGELIST
    for(each_key in images_content) {
      content = content.replace('@' + each_key + '@', '<img class="materialboxed" data-caption=" " width="250" src="'+images_content[each_key]+'">')
    }

  } else if(mode == 'SHORT') {

    // Format complet Content
    content = content.replace(/\r?B#/g, "")
    content = content.replace(/\r?#B/g, "")

    content = content.replace(/\r?I#/g, "")
    content = content.replace(/\r?#I/g, "")

    content = content.replace(/\r?U#/g, "")
    content = content.replace(/\r?#U/g, "")

    content = content.replace(/\r?LS#/g, "")
    content = content.replace(/\r?#LS/g, "") 
    
    // Update BLOCKLIST Content
    let blocklist_content = post_data.BLOCKLIST
    for(each_key in blocklist_content) {
      content = content.replace('@' + each_key + '@', '')
    }

    // Update Link Content  
    let all_links_content = post_data.LINKLIST
    for(each_key in all_links_content) {
      content = content.replace('@' + each_key + '@', '')
    }

    // Update Image Content  
    let images_content = post_data.IMAGELIST
    for(each_key in images_content) {
      content = content.replace('@' + each_key + '@', '')
    }


  }

  return content

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

  handleBlockView("show_all_topic_container");
  handleBlockView("topic_display_container",'show');

  if(fl == 'only') {
    // No need to show close btn, user has to back to source page
    handleBlockView("close_fl_btn");
    handleBlockView("close_fl_btn_to_back",'show');
  } else {
    handleBlockView("close_fl_btn",'show');
  }
  
  if(isUserMode) {
    handleBlockView("top_div_header");
  }  

  setHTML('category',getCatgHTMLCode(data['CATEGORY'],data['CATEGORYDIS'],data['CATEGORYGROUP']));
  setHTML('title',data['TITLE']);
  setHTML('publish_date',data['DATE']);
 
  // Update User and Location Value  
  let user_location_sec_html = '<a href="#!" onclick="openUserDetails(\'' + data['UUID'] + '\')"><div class="chip blue white-text z-depth-2" style="margin-bottom : 10px;"><img src="'+data['UPHOTO']+'" alt="User">' + data['UNAME']+'</div></a>'
  user_location_sec_html += ' <div class="chip" style="margin-bottom : 10px;">'+data['LOCSCOPE']+'</div>'
 
  if(data['CURRADDRSTATUS'] != 'INSIDE') { 
    if(data['CURRADDRSUBLOC'] != 'NA') {
      user_location_sec_html += ' <div class="chip" style="margin-bottom : 10px;">'+data['CURRADDRSUBLOC'] + ',' + data['CURRADDRLOC']+'</div>'
    }
    }

  setHTML('published_location_user_sec',user_location_sec_html);

  setHTML('tags',getChipWithBorderFromListLoc(data['TAGS']));

  setHTML('desc',getDescription(data));


  $(document).ready(function(){
    $('.materialboxed').materialbox();
  });

  // Total Liks Count
  let likePath = getCompPath('FORUM_LIKE') 
  db.collection(likePath).get().then(function(querySnapshot) {
    each_doc_fav_count = querySnapshot.size
    setHTML('fav_btn_count',each_doc_fav_count);     
  });
  

  // Btn Handling
  likeBtnHandling()
  bookmarkBtnHandling()

  // Handle user_control_section Section
  handleBlockView("user_control_section");
  if(userLoginData['UUID'] == data['UUID']) {
    handleBlockView("user_control_section",'show');    
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



  var elem = getHTML('more_option_modal');
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
 
  let report_data = {}

  report_data['DOCID'] = details
  report_data['DOCSPACE'] = main_path

  addNewDocument(getCompPath('FORUM_REPORT'),report_data,'Done')
}

// Add new Item
function addNewItem() {

  let validateInput = true
  if(getLoginUserStatus() == 'false') {
    validateInput = false;
    toastMsg('Please login !!')
  }
  
  if(validateInput) {
    var url = create_page + '?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('ADD')+ '&type=' + encodeURIComponent(current_space);
    window.location.href = url
  }
 
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

  horizScrollPosition = 0
  vertiScrollPosition = 0

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

    handleBlockView("show_all_topic_container",'show');
    handleBlockView("topic_display_container");

    handleBlockView("close_fl_btn");
    
    if(isUserMode) {
      handleBlockView("top_div_header",'show');
    }

  }

  window.scrollTo(horizScrollPosition, vertiScrollPosition);

  

}

// Back to previous page
function backTopreviousPage() {
  window.history.back();
}

// ------------ Search Dialog ----------------

function openSearchDialog() {

  let content_hdr =  ''
  content_hdr += '<div class="purple-card-content z-depth-2" style="padding : 30px;">\
  <h4 class="white-text">Search Option</h4>' 

  let input_name = ''
  if(searchSelectedOption == 'USER') {
    input_name = 'User Name'
    content_hdr += '<a href="#!" onclick="searchSelectionOption(\'' + 'USER' + '\')" class="chip green white-text z-depth-2">USER</a>'
    content_hdr += '<a href="#!" onclick="searchSelectionOption(\'' + 'TAG' + '\')" class="chip" style="margin-left : 10px;">TAG</a>'
  } else {
    input_name = 'Tag'
    content_hdr += '<a href="#!" onclick="searchSelectionOption(\'' + 'USER' + '\')" class="chip">USER</a>'
    content_hdr += '<a href="#!" onclick="searchSelectionOption(\'' + 'TAG' + '\')" class="chip green white-text z-depth-2" style="margin-left : 10px;">TAG</a>'
  }

  content_hdr +=  '</div>'
  

  let content = ' <div class="row" style="padding: 10px;">\
  <div class="input-field">\
    <i class="material-icons red-text prefix">search</i>\
    <input type="text" id="search_value" class="autocomplete" data-length="30">\
    <label for="search_value">'+input_name+'</label>\
    <span class="helper-text" data-error="Wrong" data-success="right">Use only (a-z,A-Z,0-9)</span>\
  </div>\
  </div>'  
  
  var model = '<!-- Modal Structure -->\
  <div id="searchSectionDialog" class="modal modal-fixed-footer">\
    <div class="">\
    <div>'+ content_hdr + content + '</div>\
    </div>\
    <div class="modal-footer">\
    <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>\
    <a href="#!" onclick="applySelectedSearch()" class="waves-effect waves-green red btn" style="border-radius: 5px; margin-left: 10px; margin-right: 5px;">SEARCH</a>\
    </div>\
  </div>'

  var elem = getHTML('searchSectionDialog');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });

  $(document).ready(function() {
    $('input#search_value').characterCounter();
  });


  $('#searchSectionDialog').modal('open');

  // Update Data set

  $(document).ready(function(){
    $('input.autocomplete').autocomplete({
      data: convTagsList(),
      minLength: 2,
      limit: 4,
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

  searchSelectedValue = 'NA'

  var search_value = getHTMLValue("search_value")
  displayOutput('search_value : ' + search_value)
  
  if(isInputStringValid(search_value,30,'IGSP')) {

    $('#searchSectionDialog').modal('close');

    searchSelectedValue = search_value

    if(searchSelectedOption == 'TAG') {
      chipClickHandling(searchSelectedValue+'#tag')
    } else {
      toastMsg('User : ' + searchSelectedValue)
    }


  }  

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


  (element).querySelector('mousedown', (e) => {
    e.preventDefault()
   })

}

