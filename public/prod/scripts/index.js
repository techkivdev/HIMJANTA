// *******************************************************************************
// SCRIPT : index.js
//
//
// Author : Vivek Thakur
// Date : 16/3/2020
// *******************************************************************************

checkUserDetailsAndSTART()



// ===== Functions =========

// Check Session Data is Correct or Not
function checkLoginData(){

  // Check Session Data
  let status = getLoginUserStatus()
  displayOutput('Check Session Data ...')
  displayOutput(status)
  
  if(status == 'true') {
    userLoginData = getLoginUserData()
    //displayOutput(userLoginData)    

    // Display Other Options also   
    document.getElementById("my_list_menu").style.display = 'block';
    document.getElementById("my_bookmark_menu").style.display = 'block';
    
    document.getElementById("my_list_menu_mb").style.display = 'block';
    document.getElementById("my_bookmark_menu_mb").style.display = 'block';    

  } 

  

}

// Modify Page style according to the browser
function modifyPageStyle() {
  // Check for mobile browser
  if (isMobileBrowser()) {
    displayOutput('Mobile Browser found!')     
    document.getElementById('main_section').className = "container-fluid";  
    document.getElementById('main_section').style.margin = "5px"; 

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

// Open Space Page
function openSpacePage(dbPath){
  var url = 'post/showpost.html?pt=' + encodeURIComponent(dbPath) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
  window.location.href = url
}

// ========== POST Section ===============
// Read Post Details and Update HTML Page
function updatePostSection() {

  $("#show_post_section").html('');
  document.getElementById("show_post_progress").style.display = "block";

   // Read details   
   let collectionRef = db.collection(getCompPath('FORUM_P')+'/POST')
   let queryRef = collectionRef.where('DELETESTATUS', '==', false)
    .orderBy('CREATEDON', 'desc'); 
 
  queryRef.limit(5).get()
   .then(snapshot => {
 
     if (snapshot.size == 0) {
       // ------ No Details Present -------------  
       displayOutput('No Record Found !!') 
       document.getElementById("show_post_progress").style.display = "none";
       document.getElementById("post_message_section").style.display = "none";

     } else {    
 
     snapshot.forEach(doc => {       

       createEachDocumentCard(doc.data(),doc.id)

     });

     document.getElementById("show_post_progress").style.display = "none";
     document.getElementById("show_post_view_more").style.display = "block";

   }
   })
   .catch(err => {
     console.log('Error getting documents', err);
   }); 

  
}

// Create single card with Data
function createEachDocumentCard(data,docid) {

    let htmlContent  = ' <div class="">\
    <div class="" style="border-radius: 5px;">\
      <div>\
\
          <!-- Content -->\
          <div class="card-content" style="margin-top: 0px;">\
          <p class="long-text-nor"><p style="font-size: 25px;">'+data['TITLE']+'</p></p>\
          <p class="long-text grey-text" style="margin-top: -10px;">'+data['DESC']+'</p>\
            <div  style="margin-top: 0px; z-index: -1">\
              '+getChipWithBorderFromListLoc(data['TAGS'])+'\
            </div>\
             <div id="reach_content_btn" class="right-align" style="margin-top: 5px;">\
            <a onclick="viewEachPost(\'' + docid + '\')" class="waves-effect waves-teal btn-flat blue-text">Read More</a>\
          </div>\
            </div> </div>  </div></div>\
            <li class="divider" tabindex="-1"></li>'



let block_to_insert = document.createElement( 'div' );
block_to_insert.innerHTML = htmlContent ;

let container_block = document.getElementById( 'show_post_section' );
container_block.appendChild( block_to_insert );

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
    let start = '<a><div class="chip-outline grey-text" style="margin-right: 5px; margin-top: 5px;">'
    let end = '</div></a>'

    html_line += start + name + end
  }

  return html_line

}

// View Each Post
function viewEachPost(details){
  var url = 'post/showpost.html?pt=' + encodeURIComponent('POST') + '&id=' + encodeURIComponent(details) + '&fl=' + encodeURIComponent('only');
  window.location.href = url
}

// ==========================================

// ----------------------------------
// ---- Uodate HTML Page ------------
// ----------------------------------

function updateHTMLPage() {

  checkLoginData()

  modifyPageStyle()  

   // Update Post Section
   updatePostSection()

}

function checkUserDetailsAndSTART() {
 
  if(getLoginUserStatus() == 'true') {
    // No Need to update Document Again
    displayOutput('User Data Already Present !!')

    updateHTMLPage()

  } else {
    displayOutput('User Data Not Present !!')

  firebase.auth().onAuthStateChanged(function (user) {

    // Is user login or not
    if (user) {
      displayOutput('User login !!')
      let uuid = user.uid;

      // Check User Doc Exist or Not
      let ref = db.collection(getCompPath('USER')).doc(uuid);
      let getDoc = ref.get()
        .then(doc => {

          if (!doc.exists) {
            displayOutput('No such document!');
            validationFailed()

          } else {
            displayOutput('User Data already present.');
            let userData = doc.data()

            // Update Session Data
            updateSessionData(userData)
            
            updateHTMLPage()
           
          }

        })
        .catch(err => {
          displayOutput('Error getting document', err);
          validationFailed()
        });

    } else {
      // User is signed out.
      displayOutput('User logout !!')
      validationFailed()
    }
  }, function (error) {
    displayOutput(error);
    validationFailed()
  });

  }

}

function validationFailed() {
  displayOutput('Validation Failed !!')
  localStorageData('ISUSER', false)
  updateHTMLPage()
}

