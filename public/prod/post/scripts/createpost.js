// *******************************************************************************
// SCRIPT : createnew.js
//
//
// Author : Vivek Thakur
// Date : 13/2/2020
// *******************************************************************************

// ---------- Main Variables ---------
var userLoginData = ''

var main_path = 'NA'
var id = 'NA'
var fl = 'NA'
var type = 'NA'

var languageContent = {}

var updateExistingContentDetails = false
var currentData = {}

var selectedCategoryValue = ''
var selectedCategoryGroupValue = ''
var selectedScope = 'BLOCK'
var selectedScopeValue = ''

// Edit Description Handling
var blocklist_content = {}
var blocklist_content_cnt = 0

var all_links_content = {}
var all_links_content_cnt = 0

var images_content = {}
var images_content_cnt = 0

// Tag Array List
var allTagsValue = []
var chip_color = 'purple'

// Page config
let main_page = 'showpost.html'
let create_page = 'createpost.html'


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
  id = params['id']
  fl = params['fl'].replace('#!','')
  type = params['type'].replace('#!','')

  if(fl == 'ADD') {
    updateExistingContentDetails = false
  } else {
    if(fl != 'NA') {
      updateExistingContentDetails = true
    }
  }

  


}

// Check Session Data is Correct or Not
function checkLoginData(){

  // Check Session Data
  let status = getLoginUserStatus()
  displayOutput('Check Session Data ...')
  displayOutput(status)
  
  if(status == 'true') {
    userLoginData = getLoginUserData() 
    displayOutput(userLoginData) 

    // Update User Information Section 
    let htmlContent = ''
    htmlContent += '<div class="card" style="margin: 0px 0px 0px 0px; border-radius: 10px;"><ul class="collection" style="border-radius: 10px;">\
    <li class="collection-item avatar" >\
      <img src="'+userLoginData['PHOTO']+'" alt="" class="circle">\
      <span class="title"><b>'+userLoginData['NAME']+'</b></span>\
      <p class="grey-text" style="font-size: 15px;">'+userLoginData['EMAIL']+'</p>\
      <a href="#!" onclick="openHelp()" class="secondary-content"><b><i class="material-icons '+chip_color+'-text">help</i></b></a>\
    </li></ul></div>'

    $("#user_info_sec").html(htmlContent);

    if(updateExistingContentDetails) {
      handleBlockView("main_list_container");     
    } else {
      handleBlockView("main_list_container",'show');      
    }

    // Get Language Content
    displayOutput(userLoginData['LANG'])
    languageContent = getLangContent(userLoginData['LANG'],'CREATE')
    
  }  else {
    handleBlockView("hdr_section_validation_failed",'show');
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

// Show All Post Only
function openAllTopics() {
  var url = main_page + '?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
  window.location.href = url

}

// Update Complete HTML Page
function updateHTMLPage() {  
  modifyPageStyle()

  window.scrollTo(0, 0); 
  displayOutput('Update HTML Page ..')

  updateLanguageContent()

  
  if(fl == 'ADD') {
    // Check for type
    if(type == 'POST') {
      handleBlockView("create_new_topic",'show'); 
    } 


  } else if(fl == 'edit') {

    // Check for type
    if(type == 'POST') {
      
      handleBlockView("create_new_topic",'show');
      showCurrentTopicContent()

    }

    
  }

  // Update other section
  setHTML('dist_block_details',userLoginData['BLOCK']+','+userLoginData['DISTRICT'])
  setHTML('state_country_details',userLoginData['STATE']+','+userLoginData['COUNTRY'])

  handleBlockView('current_loc_section')
  if(userLoginData['CURRADDRSTATUS'] != 'INSIDE') {
    handleBlockView('current_loc_section','show')
    setHTML('curr_loc_chk_header','Update post in ' + userLoginData['CURRADDRVALUE'] + ' location also.')
  }
  
  // Update Scope
  updateScope()
  btnClickHandling(selectedScope)

}

// Update Scope Section
function updateScope(){
  let scope_html = ''

  if(selectedScope == 'BLOCK') {
    scope_html += getBtnHTMLCode('BLOCK',userLoginData['BLOCK'],true)
    selectedScopeValue = userLoginData['BLOCK']
  } else {
    scope_html += getBtnHTMLCode('BLOCK',userLoginData['BLOCK'])
  }

  if(selectedScope == 'DISTRICT') {    
    scope_html += getBtnHTMLCode('DISTRICT',userLoginData['DISTRICT'],true)
    selectedScopeValue = userLoginData['DISTRICT']
  } else {
    scope_html += getBtnHTMLCode('DISTRICT',userLoginData['DISTRICT'])
  }

  if(selectedScope == 'STATE') {    
    scope_html += getBtnHTMLCode('STATE',userLoginData['STATE'],true)
    selectedScopeValue = userLoginData['STATE']
  } else {
    scope_html += getBtnHTMLCode('STATE',userLoginData['STATE'])
  }

  setHTML('scope_sec',scope_html)

}

// Updated Scope Handling
function btnClickHandling(details){
  selectedScope = details

  if(selectedScope == 'BLOCK') {
    setHTML('loc_scope_message','Your Post Visible to ' + userLoginData['BLOCK'] + ' People only.')
    selectedScopeValue = userLoginData['BLOCK']
  }

  if(selectedScope == 'DISTRICT') {
    setHTML('loc_scope_message','Your Post Visible to ' + userLoginData['DISTRICT'] + ' People only.')
    selectedScopeValue = userLoginData['DISTRICT']
  }

  if(selectedScope == 'STATE') {
    setHTML('loc_scope_message','Your Post Visible to ' + userLoginData['STATE'] + ' People.')
    selectedScopeValue = userLoginData['STATE']
  }

  updateScope()
  
}

// Update Language Content
function updateLanguageContent() {

  // Update Language Content
  setHTML('main_hdr_msg',languageContent['HEADER'])
  setHTML('tag_info',languageContent['TAG_INFO'])
  setHTML('i_accept',languageContent['ACCEPT'] + '  <a class="purple-text" href="#!" onclick="termandcondMessage()">terms and conditions</a>')

  setHTML('title_hdr',languageContent['TITLE_HDR'])  
  getHTML("title").placeholder = languageContent['TITLE_PLCHLD'];

  setHTML('tags_hdr',languageContent['TAG_HDR'])
  setHTML('category_hdr',languageContent['CATG_HDR'])
  setHTML('category_value',languageContent['CATG_PLCHLD'])
  setHTML('description_hdr',languageContent['DESC_HDR'])
  getHTML("description").placeholder = languageContent['DESC_PLCHLD'];

  setHTML('loc_header',languageContent['LOC_HEADER'])
  setHTML('loc_scope_header',languageContent['LOC_SCOPE_HEADER'])
  setHTML('curr_loc_header',languageContent['CURR_LOC_HEADER'])
 

}

// Modify Page style according to the browser
function modifyPageStyle() {
  // Check for mobile browser
  if (isMobileBrowser()) {
    displayOutput('Mobile Browser found!') 
    
    getHTML('main_list_container').className = "container-fluid";

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
    //handleBlockView("main_nav_bar",'show');
   

  } else {
   
  }


}

// *******************************************************
// --------- Presentation Layer --------------------------
// - This Layer change according to projects
// - Sequence of all HTML modification code
// *******************************************************

// Read Current topic content and update HTML page
function showCurrentTopicContent() {
  displayOutput('Read current topic content.') 

  //showPleaseWaitModel()

  handleBlockView("main_progress",'show');

  db.collection(getCompPath('FORUM')).doc(id).get()
  .then(doc => {
    if (!doc.exists) {
      displayOutput('No such document!');
      //hidePleaseWaitModel()
      handleBlockView("hdr_section_validation_failed",'show');

      handleBlockView("main_progress");
      setHTML('validation_msg','Post not found !!')


    } else {
      let data = doc.data()
      updateExistingContentDetails = true

      currentData = data

      //displayOutput(data)

      // Update HTML Page
     setHTMLValue("title",data['TITLE'])

      // Update Description content      
      setHTMLValue("description",br2nl(data['DESC']))
      M.textareaAutoResize($('#description'));

      // Update Other Parameter
      blocklist_content = data['BLOCKLIST']
      blocklist_content_cnt = data['BLOCKLIST']['TOTAL@CNT']

      all_links_content = data['LINKLIST']
      all_links_content_cnt = data['LINKLIST']['TOTAL@CNT']

      images_content = data['IMAGELIST']
      images_content_cnt = data['IMAGELIST']['TOTAL@CNT']

      // Update Tag Details
      allTagsValue = data['TAGS']
      updateTagSection()


      // Update CATEGORY      
      setHTML('category_value',data['CATEGORYDIS'])
      selectedCategoryValue = data['CATEGORY']+'#'+data['CATEGORYDIS']
      selectedCategoryGroupValue = data['CATEGORYGROUP']

      // Update Scope
      selectedScope = data['LOCSCOPEAREA']
      selectedScopeValue = data['LOCSCOPE']
      updateScope()
      btnClickHandling(selectedScope)

      // Update Current Location Status  
      handleBlockView('current_loc_section')
      if(data['CURRADDRSTATUS'] != 'INSIDE') {
        handleBlockView('current_loc_section','show')
        if(data['CURRADDRSUBLOC'] == 'NA') {
          checkedHTML('update_post_curr_loc_check',false)
        } else {
          checkedHTML('update_post_curr_loc_check',true)
        }

        setHTML('curr_loc_chk_header','Update post in ' + userLoginData['CURRADDRVALUE'] + ' location also.')
      }

      handleBlockView("main_progress");

      handleBlockView("main_list_container",'show');  

      //hidePleaseWaitModel()      
    }
  })
  .catch(err => {
    //hidePleaseWaitModel()
    displayOutput('Error getting document' + err);
  });

}

// Open Help Section
function openHelp() {

  let content = languageContent['HELP']

  var model = '<!-- Modal Structure -->\
  <div id="help_model" class="modal modal-fixed-footer">\
    <div class="modal-content">\
      <div style="margin-left: 10px; margin-right: 10px;">'+ content + '</div>\
    </div>\
    <div class="modal-footer">\
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">CLOSE</a>\
      </div>\
  </div>'

  var elem = getHTML('help_model');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });

  $('#help_model').modal('open');
}

// Cancel Details
function cancelDetails() {

  if(updateExistingContentDetails) {
    var url = '../login.html' + '?fl=' + encodeURIComponent('MYLIST') + '&fl2=' + encodeURIComponent('POST');
    window.location.href = url
  }  else {
    var url = main_page + '?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
    window.location.href = url
  }


  
}

// Submit New Post
function submitDetails() { 

  let testing_purpose = false

  if(testing_purpose) {

       generateNDocuments()

  } else {
   
  
    if(updateExistingContentDetails) {
      // --------- Update Existing --------------
      if(type == 'POST') {
        addNewTopic()
      }
  
    } else {
  
      // ------- Add New ---------------
      if(fl == 'ADD') {
        if(type == 'POST') {
          addNewTopic()
        }
      }
  
    } 
    
  }
  



}

// -------------------------

// Add New Post
function addNewTopic() {

  displayOutput('Submit New Post !!')

   // Validate input
   let validateInput = true

   var title = getHTMLValue("title");
   displayOutput('title : ' + title)
   if(!isInputStringValid(title,100,'NA','Title : ')) {
     validateInput = false
     //toastMsg(languageContent['MESSAGE_POST'])
   }
   
   // Tag Section
   displayOutput(allTagsValue)
  
 
   var description = getCompletDescContent();   
   displayOutput('description : ' + description)   
   if(description == '') {
     validateInput = false
     toastMsg(languageContent['MESSAGE_DESC'])
   }
 
   // Category Handling
   let cateData = ''
   let cateData_display = ''
   if(isStrEmpty(selectedCategoryValue)){
    toastMsg(languageContent['MESSAGE_CATEGORY'])
    validateInput = false
   } else {
    cateData = selectedCategoryValue.split('#')[0]
    cateData_display = selectedCategoryValue.split('#')[1]
   }
   displayOutput('cateData : ' + cateData)
   displayOutput('cateData_display : ' + cateData_display)
   displayOutput('Catg Group : ' + selectedCategoryGroupValue)
  

   let update_post_curr_loc_check = getHTMLChecked("update_post_curr_loc_check")

   // Check for Term and conditions
   let terms_check_status = getHTMLChecked("accept_terms_checkbox")
   if(!terms_check_status){
    toastMsg(languageContent['MESSAGE_ACCEPT'])
    validateInput = false
   }
 
 
   //validateInput = false
   // If all Validation is true
   if(validateInput) {
     displayOutput('Input Validation TRUE !!')
 
     let forumData = {}
 
     // --------- Form Data Set -------------
     forumData['TITLE'] =  title
     forumData['TAGS'] =  allTagsValue
 
     // ---- Category --------------
     forumData['CATEGORY'] =  cateData
     forumData['CATEGORYDIS'] =  cateData_display

     forumData['CATEGORYGROUP'] =  selectedCategoryGroupValue    
 
     // Content Section 
     forumData['DESC'] =  description
     forumData['BLOCKLIST'] =  blocklist_content
     forumData['LINKLIST'] =  all_links_content
     forumData['IMAGELIST'] =  images_content

     forumData['DATE'] =  getTodayDate()
     forumData['DATELIST'] =  getTodayDateList()
     

     if(updateExistingContentDetails) {
      forumData['CREATEDON'] =  currentData['CREATEDON']
     } else {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      forumData['CREATEDON'] =  timestamp
     }           
 
     forumData['UNAME'] =  userLoginData['NAME']
     forumData['UPHOTO'] =  userLoginData['PHOTO']
     forumData['UUID'] =  userLoginData['UUID']
 
     forumData['DELETESTATUS'] = false
 
     //forumData['MULTICONFIG'] = ['NA']
     
     // Location Details
     forumData['LOCSCOPEAREA'] = selectedScope
     forumData['LOCSCOPE'] = selectedScopeValue

     // Current Location Details
     forumData['CURRADDRSTATUS'] = userLoginData['CURRADDRSTATUS']
     forumData['CURRADDRSUBLOC'] = 'NA'
     forumData['CURRADDRLOC'] = 'NA'

     if(userLoginData['CURRADDRSTATUS'] != 'INSIDE') {

      if(update_post_curr_loc_check) {
        forumData['CURRADDRSTATUS'] = userLoginData['CURRADDRSTATUS']
        forumData['CURRADDRSUBLOC'] = userLoginData['CURRADDRVALUE'].split(',')[0]
        forumData['CURRADDRLOC'] = userLoginData['CURRADDRVALUE'].split(',')[1]  
       }

     } 
 
     // Admin Section
     forumData['DOCTYPE'] = 'POST'  // Chnage It according to the Item
     forumData['DOCVER'] = 'V1'
     forumData['DOCVERIFIED'] = 'NA'
     
     forumData['ISMAIN'] = false
     forumData['PAGEID'] = 1

     // Image Details
     forumData['IMAGESTATUS'] = false
     forumData['IMAGEDETAILS'] = {} 
 
     
     if(updateExistingContentDetails) {
       updateExistPostIntoDatabase(forumData)
     } else {
       updateNewPostIntoDatabase(forumData)
     } 
 
   } else {
     displayOutput('Input Validation FALSE !!')
   }

}

// Open Dialog : Add New Tag
function openAddNewTagDialog() {

  let content_hdr =  ''
  content_hdr += '<div class="purple-card-content z-depth-2" style="padding : 30px;">\
  <h4 class="white-text">Tags</h4></div>' 
  

  let content = ' <div class="row" style="padding: 10px;">\
  <div class="input-field">\
    <i class="material-icons red-text prefix">search</i>\
    <input type="text" id="tag_value" class="autocomplete" data-length="30">\
    <label for="tag_value">Tag Name</label>\
    <span class="helper-text" data-error="Wrong" data-success="right">Use only (a-z,A-Z,0-9)</span>\
  </div>\
  </div>'  
  
  var model = '<!-- Modal Structure -->\
  <div id="addnewtagdialog" class="modal modal-fixed-footer">\
    <div class="">\
    <div>' + content_hdr + content + '</div>\
    </div>\
    <div class="modal-footer">\
    <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>\
    <a href="#!" onclick="applyTagValue()" class="waves-effect waves-green red btn" style="border-radius: 5px; margin-left: 10px; margin-right: 5px;">ADD</a>\
    </div>\
  </div>'

  var elem = getHTML('addnewtagdialog');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });

  $(document).ready(function() {
    $('input#tag_value').characterCounter();
  });

  
  // Check for Limit
  if(allTagsValue.length > 5) {
     toastMsg('Max Tag limit reach !!')
  } else {
    $('#addnewtagdialog').modal('open');
  }
  

  // Update Data set

  $(document).ready(function(){
    $('input.autocomplete').autocomplete({
      data: convTagsList(),
      minLength: 1,
      limit: 5,
    });
  });

}

// Apply Enter Tag Details
function applyTagValue() {

  var tag_value = getHTMLValue("tag_value")
  displayOutput('tag_value : ' + tag_value)
  
  if(isInputStringValid(tag_value,30,'IGSP')) {
    $('#addnewtagdialog').modal('close');

    displayOutput(tag_value)
    allTagsValue.push(tag_value)
    
    updateTagSection()
    
  } 


}

// Update Tag Section
function updateTagSection() {

  allTagsValue = Array.from(new Set(allTagsValue));

  // Update Tag Value
  let tag_html_line = ''
  for(each_idx in allTagsValue) {
    let tag_name = allTagsValue[each_idx]
    tag_html_line += '<div class="chip" style="margin-bottom : 10px;">' + tag_name + '<i onclick="updateTagList(\'' + tag_name + '\')" class="close material-icons">close</i></div>'

  }

  if(allTagsValue.length == 0) {
    setHTML('all_tag_section_value','<p class="grey-text">Please add tags (max only 6)</p>')
  } else {
    setHTML('all_tag_section_value',tag_html_line)
  }
  


}

// Update Tag List
function updateTagList(details) {

  allTagsValue.splice( allTagsValue.indexOf(details), 1 );

  updateTagSection()

}

// ---------------------------------------
// TESTING : Generated n- Documents
function generateNDocuments() {

  var i;
  for (i = 0; i < 30; i++) {   

    let forumData = {}
 
     // --------- Form Data Set -------------
     let titleList = []
     titleList[0] = 'Trading Halted For 45 Minutes, Sensex Down 3,091 Points; Nifty Below 9,000'
     titleList[1] = 'Karnataka man, 76, is Indias first coronavirus fatality'
     titleList[2] = 'Govt: Dont panic, no community transmission of coronavirus yet'
     titleList[3] = 'Day after His BJP Entry, MP Economic Offences Wing Reopens Forgery Case Against Jyotiraditya Scindia'
     titleList[4] = 'Google India employee tests positive for coronavirus'
     titleList[5] = 'Canadian PM Justin Trudeau wife positive for coronavirus'
     titleList[6] = 'Sophie Gregoire Trudeau had returned from a speaking engagement in Britain and was showing mild flu-like symptoms.'
     titleList[7] = 'A flight attendant tells why should never keep anything on the seat-back pocket of a plane'
     titleList[8] = 'How does coronavirus spread? How do you get it?'
     titleList[9] = 'Growing concerns about the coronavirus pandemic in the last 24 hours — with California calling for a ban on many public events, the NBA suspending its'



     forumData['TITLE'] =  titleList[Math.floor(Math.random() * 9)] + ' ' + i

     let normalTag = ['Justin Trudeau','Amit Shah','BSE SENSEX','Yes Bank','India','Donald Trump','NIFTY 50','StateBankofIndia','Coronavirus','Leo Varadkar','travel','traveling','vacation','visiting','instatravel','instago','instagood','trip','holiday','photooftheday','fun','travelling','tourism','tourist','instapassport','instatraveling','mytravelgram','travelgram','travelingram','igtravel']
          
     let tagList = []
     let maxTags = Math.floor(Math.random() * 10)
     for (let j = 0; j < maxTags; j++) {
       let newTag = normalTag[Math.floor(Math.random() * 28)].replace(' ','').toLowerCase()
      tagList.push(newTag)
     }

     forumData['TAGS'] =  tagList
 
     // ---- Category --------------     
     
     let catgListD = ['INFO','TIPS','QRY','INFO','TIPS','QRY']
     let catgList = ['General Infromation','Important Travel Tips','Any Query','General Infromation','Important Travel Tips','Any Query']
     let catgnum = Math.floor(Math.random() * 5)
     forumData['CATEGORYDIS'] =  catgList[catgnum]
     forumData['CATEGORY'] =  catgListD[catgnum]
 
     forumData['DESC'] =  'We suggest that seawater δ18O may have decreased through time, in contrast to the large increases seen in marine chemical sediments. To explain this possibility, we construct an oxygen isotope exchange model of the geologic water cycle, which suggests that the initiation of continental weathering in the late Archaean, between 3 and 2.5 billion years ago, would have drawn down an 18O-enriched early Archaean ocean to δ18O values similar to those of modern seawater,” say the co-authors in the paper.<br><br>\
                           The co-authors believe that the Panorama has what was the hard, outer shell of the planet. “There are no samples of really ancient ocean water lying around, but we do have rocks that interacted with that seawater and remembered that interaction,” says Johnson. The process, he says, is like analyzing coffee grounds to gather information about the water that poured through it. To do that, the researchers analyzed data from more than 100 rock samples from across the dry terrain.'
     
     // Create Date - Mar 19, 2020
     var month = new Array();
      month[0] = "January";
      month[1] = "February";
      month[2] = "March";
      month[3] = "April";
      month[4] = "May";
      month[5] = "June";
      month[6] = "July";
      month[7] = "August";
      month[8] = "September";
      month[9] = "October";
      month[10] = "November";
      month[11] = "December";

      let monthValue = month[Math.floor(Math.random() * 11)].substring(0, 3)
       
      let dateValue = Math.floor(Math.random() * 30)
      let yearList = ['2018','2019','2020','2018','2019','2020']
      let yearValue = yearList[Math.floor(Math.random() * 5)]

      var date = monthValue + ' ' + dateValue + ', ' + yearValue;


     forumData['DATE'] =  date
     forumData['DATELIST'] =  [monthValue, dateValue , yearValue]
     

     if(updateExistingContentDetails) {
      forumData['CREATEDON'] =  currentData['CREATEDON']
     } else {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      forumData['CREATEDON'] =  timestamp
     }
           
 
     forumData['UNAME'] =  userLoginData['NAME']
     forumData['UPHOTO'] =  userLoginData['PHOTO']
     forumData['UUID'] =  userLoginData['UUID']
 
     forumData['DELETESTATUS'] = false
 
     //forumData['MULTICONFIG'] = ['NA']
 
     forumData['DOCTYPE'] = 'POST'  // Chnage It according to the Item
     forumData['DOCVER'] = 'V1'
     
     forumData['ISMAIN'] = false
     forumData['PAGEID'] = 1
 
     /*
     forumData['EXTRA'] = {
       EXTRA1 : 'NA'
     }
     */

    displayOutput(forumData)


    // Create our initial doc    
    db.collection(getCompPath('FORUM')).add(forumData).then( ref => {   
      displayOutput('Added document with ID: ' +  ref.id);
      updateMyList(forumData,ref.id)     
    }); 

    }

}

// ---------------------------------------

// Open Edit Options Modal
function openEditOptionsModal(control) {

  displayOutput(control) 

  // Click Behaviour Change according to control  
  let content = ''
  if(control == 'LINK') {

    content = '  <!-- edit content -->\
    <form id="edit_single_option_form" class="col s12">\
      <div class="row">\
          <div class="input-field col s12">\
              <!-- <i class="material-icons prefix">message</i> -->\
              <input type="text" id="edit_link_name">\
              <label for="edit_link_name">Link Name</label>\
            </div>\
            <div class="input-field col s12">\
            <!-- <i class="material-icons prefix">message</i> -->\
            <input type="text" id="edit_link_address">\
            <label for="edit_link_address">Link Address</label>\
          </div>\
      </div>\
    </form>'

  } else if(control == 'IMAGE') {

    content = '  <!-- edit content -->\
    <form id="edit_single_option_form" class="col s12">\
      <div class="row">\
          <div class="input-field col s12">\
              <!-- <i class="material-icons prefix">message</i> -->\
              <input type="text" id="image_url">\
              <label for="image_url">Image URL</label>\
              <p class="grey-text">For tutorial. Please visit link!!</p>\
            </div></div>\
    </form>'  

  } else {

    content = '  <!-- edit content -->\
    <form id="edit_single_option_form" class="col s12">\
      <div class="row">\
          <div class="input-field col s12">\
              <!-- <i class="material-icons prefix">message</i> -->\
              <input type="text" id="edit_content">\
              <label for="edit_content">Type Text</label>\
            </div></div>\
    </form>'  

  }
  
  

  var model = '<!-- Modal Structure -->\
  <div id="commentModal" class="modal">\
    <div class="modal-content">\
      <h4> '+ '' + '</h4>\
      <p class="long-text-nor">'+ content + '</p>\
    </div>\
    <div class="modal-footer">\
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>\
      <a href="#!" onclick="editOptionBtn(\'' + control + '\')" class="waves-effect waves-green red btn" style="border-radius: 5px; margin-left: 10px; margin-right: 5px;">ADD</a>\
    </div>\
  </div>'

  var elem = getHTML('commentModal');
  if (elem) { elem.parentNode.removeChild(elem); }


  $(document.body).append(model);

  $(document).ready(function () {
    $('.modal').modal();
  });
 
  $('#commentModal').modal('open');  

  $(document).ready(function() {
    $("#edit_single_option_form").bind("keypress", function(e) {
        if (e.keyCode == 13) {
            return false;
        }
    });
  });

}

// Edit Option Handling
function editOptionBtn(details) {
  displayOutput(details)

  $('#commentModal').modal('close');

  var validateInput =  true

  if(details == 'LINK') {

    // Read Comment Details
   var edit_link_name = getHTMLValue("edit_link_name");
   var edit_link_address = getHTMLValue("edit_link_address");
   if((edit_link_name == '') || (edit_link_address == '')) {
     validateInput = false     
   } 

  } else if(details == 'IMAGE') {

    // Read Comment Details
    var image_url_value= getHTMLValue("image_url");
    displayOutput('image_url_value : ' + image_url_value)
    if(image_url_value == '') {
      validateInput = false     
    } 
 
   } else {

   // Read Comment Details
   var edit_content = getHTMLValue("edit_content");
   displayOutput('edit_content : ' + edit_content)
   if(edit_content == '') {
     validateInput = false     
   } 

  }

   if(validateInput) {

  // Read Current Content and Update it
  var description = getHTMLValue("description");

  switch(details) {

    case 'BOLD' :
      description = description + ' B#'+edit_content+'#B '
      break;

    case 'ITALIC' :
      description = description + ' I#'+edit_content+'#I '
      break;

    case 'UNDERLINE' :
      description = description + ' U#'+edit_content+'#U '
      break;

    case 'LIST' :
      description = description + ' LS#'+edit_content+'#LS '
      break;

    case 'BLOCKLIST' :

      blocklist_content_cnt = blocklist_content_cnt + 1
      blocklist_content['TOTAL@CNT'] = blocklist_content_cnt
      blocklist_content['BLOCKLIST'+blocklist_content_cnt] = '<blockquote>'+edit_content+'</blockquote> '
      description = description + ' @BLOCKLIST' + blocklist_content_cnt + '@ '
      break;

    case 'LINK' :

      all_links_content_cnt = all_links_content_cnt + 1
      //   <a onclick="openNewLink(\'' + edit_link_address + '\')" class="waves-effect waves-light btn blue rcorners"><i class="material-icons left">web</i>'+edit_link_name+'</a>
      //  <a href="'+edit_link_address+'"><b>'+edit_link_name+'</b></a>
      all_links_content['TOTAL@CNT'] = all_links_content_cnt
      all_links_content['LINK'+all_links_content_cnt] = ' <a onclick="openNewLink(\'' + edit_link_address + '\')" href="#!"><b>'+edit_link_name+'</b></a> '

      description = description + ' @LINK' + all_links_content_cnt + '@ '
      break;

    case 'IMAGE' :

      images_content_cnt = images_content_cnt + 1
      images_content['TOTAL@CNT'] = images_content_cnt
      images_content['IMAGE'+images_content_cnt] =  image_url_value
      description = description + ' @IMAGE' + images_content_cnt + '@ '
      break;

    default:
      break;
  }

  setHTMLValue("description",description)
  M.textareaAutoResize($('#description'));

}

}

// Get Complete Description Content
function getCompletDescContent(mode = "NA") {

  let content = nl2br(getHTMLValue("description"))

  if(mode == 'PREVIEW') {

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
      for(each_key in blocklist_content) {
        content = content.replace('@' + each_key + '@', blocklist_content[each_key])
      }

      // Update Link Content  
      for(each_key in all_links_content) {
        content = content.replace('@' + each_key + '@', all_links_content[each_key])
      }

      // Update Image Content  
      for(each_key in images_content) {
        content = content.replace('@' + each_key + '@', '<img class="materialboxed" data-caption=" " width="250" src="'+images_content[each_key]+'">')
      }


  }

  

  return content

}

// ---------------------------------------

// Preview Handling

// Show Preview Section
function showPreviewSection() {
  handleBlockView('main_list_container')
  handleBlockView('preview_container','show')
  handleBlockView('preview_close_fl_btn','show')

  window.scrollTo(0,0)

  setHTML('preview_contant',getCompletDescContent('PREVIEW'))

  $(document).ready(function(){
    $('.materialboxed').materialbox();
  });

}

// Hide Preview Section
function hidePreviewSection() {
  handleBlockView('preview_container')
  handleBlockView('preview_close_fl_btn')
  handleBlockView('main_list_container','show')

  window.scrollTo(0,0)
}

// View Term and Conditions
function termandcondMessage() {
  viewModel('',languageContent['TERM_AND_COND'])
}

// -------------------------

// Update MYLIST Section
function updateMyList(data,docid) { 

  let myListData = {}
  
  myListData['DATE'] = data['DATE']
  myListData['TITLE'] = data['TITLE']
  myListData['CATG'] = selectedCategoryValue
  myListData['CATGCOLOR'] = getCatgGroupDetails('GROUP',selectedCategoryGroupValue).COLOR
  myListData['TYPE'] = main_path
  myListData['CREATEDON'] = data['CREATEDON']
  myListData['SPACE'] = main_path

  var url = 'post/'+main_page+'?pt=' + encodeURIComponent('MYLIST') + '&id=' + encodeURIComponent(docid) + '&fl=' + encodeURIComponent('only'); 
  myListData['LINK'] = url


  db.collection(getCompPath('USER_MYLIST',userLoginData['UUID'],main_path)).doc(docid).set(myListData).then(function() { 
    //toastMsg('Bookmark Added !!')
    hidePleaseWaitModel()
    cancelDetails()
  });  


}

// Update new Post into Database
function updateNewPostIntoDatabase(forumData){

  showPleaseWaitModel()

   // Create our initial doc
   db.collection(getCompPath('FORUM')).add(forumData).then( ref => {   
    displayOutput('Added document with ID: ' +  ref.id);
    updateMyList(forumData,ref.id)     
  }); 

}

// Update Exist Post into Database
function updateExistPostIntoDatabase(forumData){

  showPleaseWaitModel()  

   // Create our initial doc
   db.collection(getCompPath('FORUM')).doc(id).set(forumData).then(function() {    
    hidePleaseWaitModel()
    updateMyList(forumData,id)
    
    //var url = main_page + '?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent(id) + '&fl=' + encodeURIComponent('edit');
    //window.location.href = url
     
  }); 

}

// SHOW/HIDE : Category Section

// Show Category Section
function showCategorySection() {
  handleBlockView('main_list_container')
  handleBlockView('category_list_container','show')
  handleBlockView('catg_close_fl_btn','show')

  window.scrollTo(0,0)

  // Update Category Content
  let catg_content_html = ''

  // Get All Groups Details
  let allGroups = getCatgGroupDetails('GROUPLIST') 

  // Collect Each Group Details
  for(each_group in allGroups) {
    let groupDetails = allGroups[each_group]
    
    catg_content_html += '<ul class="collection" style="border-radius: 10px;"><li class="collection-item">'
    catg_content_html += '<div><b><span class="card-title '+groupDetails.COLOR+'-text"><span style="font-size: 18px;">'+groupDetails.NAME+'</span><i class="material-icons left">'+groupDetails.ICON+'</i></span></b></div>' 

    catg_content_html += '<div style="margin-top: 15px; margin-bottom : 15px; margin-left: 10px;">'

    // Create Each Group List Content 
    let eachGroupCatgList = getCatgGroupDetails('LIST',each_group)   

      for(each_idx in eachGroupCatgList){

        let each_key = eachGroupCatgList[each_idx]
        let catg_name = getCatgDataMapping(each_key)

        if(selectedCategoryValue == each_key +'#' + catg_name) {
          catg_content_html += getBtnHTMLCode(each_key +'#' + catg_name + '@' + each_group,catg_name,true,'catgSelectHandling')
        } else {
          catg_content_html += getBtnHTMLCode(each_key +'#' + catg_name + '@' + each_group,catg_name,false,'catgSelectHandling')
        }
        
      }

      catg_content_html += '</div></li></ul>'

  }

  

  setHTML('category_list_contant',catg_content_html)


}

// Category Selection
function catgSelectHandling(details) { 

  selectedCategoryValue = details.split('@')[0]

  selectedCategoryGroupValue = details.split('@')[1]

  setHTML('category_value',selectedCategoryValue.split('#')[1])

  // Update Icon
  setHTML('catg_icon',getCatgGroupDetails('GROUP',selectedCategoryGroupValue).ICON)
  getHTML("catg_sec").className = getCatgGroupDetails('GROUP',selectedCategoryGroupValue).COLOR + '-text';

  hideCategoryDialog()
}


// Hide Category  Section
function hideCategoryDialog() {
  handleBlockView('category_list_container')
  handleBlockView('catg_close_fl_btn')
  handleBlockView('main_list_container','show')

  window.scrollTo(0,0)
}

// ----------- START UP CALLS ----------------
function startUpCalls() {

  displayOutput('Startup Calls')

  $(document).ready(function () {
    $('.modal').modal();
  });

  $(document).ready(function(){
    $('.datepicker').datepicker();
  });

  $(document).ready(function(){
    $('select').formSelect();
  });

  // Chip 
  $('.chips-placeholder').chips({
    placeholder: 'Enter a Tag',
    secondaryPlaceholder: '+Tag',
  }); 

  $('.chips-autocomplete').chips({
    placeholder: 'Enter a Tag',
    secondaryPlaceholder: '+Tag',

    autocompleteOptions: {
      data: convTagsList(),
      limit: Infinity,
      minLength: 1
    }
  });


  M.textareaAutoResize($('#description'));

  $(document).ready(function(){
    $('.tooltipped').tooltip();
  });


  $(document).ready(function() {
    $('input#title').characterCounter();
  });


}



