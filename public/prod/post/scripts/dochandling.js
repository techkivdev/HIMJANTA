// *******************************************************************************
// SCRIPT : dochandling.js
//
//
// Author : Vivek Thakur
// Date : 20/4/2020
// *******************************************************************************


// ----- User Profile Handling ------

// Show User Information
function showUserInfromation() {

  if(userSectionCreated) {
    displayOutput('User Section Already Created !!')
  } else {

    scope_list.push('ANY')

  // Read User Information and Display Details
  displayOutput('User Section Created !!')
  db.collection(getCompPath('USER')).doc(useruuid).get()
  .then(doc => {
    if (!doc.exists) {
      displayOutput('No User document!');
      handleBlockView("userinfo_section");
    } else {
      userData = doc.data()

      setHTML('userinfo_section','');

      // Update User Information Section 
      setHTML('userinfo_section',getUserInforHTMLCode(userData));
      handleBlockView("userinfo_section",'show');

      followerHandling()

      userSectionCreated = true

    }
  })
  .catch(err => {   
    displayOutput('Error getting document', err);
  });

}

}

// Get User Section HTML Code
function getUserInforHTMLCode(userData) {

// onclick="viewUserProfile(\'' + 'profile' + '\')"
let htmlContent_mb = '<div class="row" style="margin-top: -100px; margin-left: 0px; margin-right: 0px;">\
\
<div class="col s12 m6">\
  <div class="center-align">\
    <img id="user_profile_image_mb" class="fb-image-profile-mb z-depth-2" src="'+userData['PHOTOURL']+'"/>\
  </div>\
</div>\
\
<div class="col s12 m6">\
<div class="card" style="margin-top: 0px; border-radius: 10px;">\
\
<div class="" style="padding: 5px;">\
<div class=" center-align"><span class="card-title grey-text text-darken-4">'+userData['NAME']+'</span></div>\
  <div class="row">\
  <div id="post_count" class="col s6 m6 center-align" style="font-size : 18px;">0</div>\
  <div id="followers_count" class="col s6 m6 center-align" style="font-size : 18px;">0</div>\
  </div>\
  <div class="row" style="margin-top: -20px;">\
  <div class="col s6 m6 center-align">Posts</div>\
  <div class="col s6 m6 center-align">Followers</div>\
  </div>\
  <div id="follower_section" class="center-align" style="margin-top: 0px;">\
  </div>\
  <div class="right-align" style="margin-top: 0px;">\
     <a onclick="viewUserProfile(\'' + 'profile' + '\')" class="waves-effect waves-teal btn-flat black-text"><b><i class="medium material-icons">more_horiz</i></b></a>\
  </div>\
</div>\
</div>\
\
</div>'

return htmlContent_mb


}

// Follower Handling
function followerHandling() {

  // Check Is Document Exist or Not 
  user_follower_status = false  

  showPleaseWaitModel()

   // Update Total Count message
   queryRef.get().then(function(querySnapshot) {
    setHTML('post_count',querySnapshot.size)
  });

  db.collection(getCompPath('USER_FOLLOWER',useruuid)).get().then(function(querySnapshot) {  
    
    setHTML('followers_count',querySnapshot.size)    
 
   let follow_btn_name = 'FOLLOW' 

  if(getLoginUserStatus() == 'true') {

      db.collection(getCompPath('USER_FOLLOWER',useruuid)).doc(userLoginData['UUID']).get()
      .then(doc => {

        if (doc.exists) {
          follow_btn_name = 'UNFOLLOW'   
          user_follower_status = true
        }

        let html_line = '<a id="follow_btn" onclick="updateFollower()" class="waves-effect waves-light btn blue rcorners">'+follow_btn_name+'</a>'   

        setHTML('follower_section',html_line)

        hidePleaseWaitModel()

      })
      .catch(err => {
        console.log('Error getting document', err);
      });

  } else {

    let html_line = '<a id="follow_btn" onclick="updateFollower()" class="waves-effect waves-light btn blue rcorners">'+follow_btn_name+'</a><br>'       

    setHTML('follower_section',html_line)

    hidePleaseWaitModel()

  }

});


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
        <b id="profile_name_mb" style="font-size: 30px;">'+userData['NAME']+'</b><br>\
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

// Update Follower Handling
function updateFollower() {

  
  let validateInput = true
  if(getLoginUserStatus() == 'false') {
    validateInput = false;
    toastMsg('Please login to follow !!')
  }

  if(validateInput) {

    if(user_follower_status) {

       // ------------ UNFOLLOW ---------------------

       deleteDocument(getCompPath('USER_FOLLOWER',useruuid)+'/'+userLoginData['UUID'],'UNFOLLOW!!')

       // Update UI
      setHTML('follow_btn','FOLLOW')
      if(user_follower_count == 0) {
        user_follower_count = 0
      } else {
        user_follower_count = user_follower_count - 1
      }
      
      setHTML('followers_count',user_follower_count)  

      user_follower_status = false

    } else {

      // ----------- FOLLOW ----------------------

      let login_user_data = {}

      login_user_data['UUID'] = userLoginData['UUID']
      login_user_data['NAME'] = userLoginData['NAME']
      login_user_data['EMAIL'] = userLoginData['EMAIL']
      login_user_data['PHOTO'] = userLoginData['PHOTO'] 
      
      setNewDocument(getCompPath('USER_FOLLOWER',useruuid),userLoginData['UUID'],login_user_data,'Following')
  
      // Update UI
      setHTML('follow_btn','UNFOLLOW')
      user_follower_count = user_follower_count + 1
      setHTML('followers_count',user_follower_count) 
      
      user_follower_status = true

    }

   

  }

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
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>\
      <a href="#!" onclick="'+onclick_html+'" class="waves-effect waves-green purple btn" style="border-radius: 5px; margin-left: 10px; margin-right: 5px;">Add Comment</a>\
    </div>\
  </div>'

  var elem = getHTML('commentModal');
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

  
 
  var validateInput =  true

  // Read Comment Details
  var comment = getHTMLValue("comment")
  displayOutput('comment : ' + comment)
  if(comment == '') {
    validateInput = false
    toastMsg('Comment is empty!!')
  } 

  if(validateInput) {
       // Update Comment into Comment Section

       $('#commentModal').modal('close');

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
   db.collection(getCompPath('FORUM_COMMENT')).add(forumData).then(function() {    
    hidePleaseWaitModel()    
    setHTMLValue("comment",'')
    toastMsg('Comment Added !!')
    viewAllComments()     
  }); 
  }

}

// View all comments
function viewAllComments() {

  handleBlockView("all_user_comments",'show');
  handleBlockView("viewallcomments");

  setHTML('all_user_comments','<p>Loading .... </p>');

  currentTopicCommentsStatus = true

  // Update Comment Message
  updateCommentMessage('SECOND')
  
   let htmlContent = '<div class="row">'

   let queryRef = db.collection(getCompPath('FORUM_COMMENT')).orderBy('CREATEDON', 'desc');
 
   queryRef.limit(commentquerySize).get()
    .then(snapshot => {
  
      if (snapshot.size == 0) {
        // ------ No Details Present -------------  
        displayOutput('No Record Found !!') 
        //handleBlockView("ratings_sec"); 
        setHTML('all_user_comments','<p>No Comment !!</p>');

        handleBlockView("viewmorecomments");

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


      setHTML('all_user_comments',htmlContent);    
      
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

   // Update Total Count message
   db.collection(getCompPath('FORUM_COMMENT')).get().then(function(querySnapshot) {   

    if(querySnapshot.size == 0) {
      setHTML('comment_message','Comment (' + querySnapshot.size + ')')
      handleBlockView("viewallcomments");

      handleBlockView("all_user_comments",'show');
      setHTML('all_user_comments','<p>No Comment !!</p>');

    } else {

      if(commentquerySize >= querySnapshot.size) {
        handleBlockView("viewmorecomments");
        commentquerySize = querySnapshot.size
      } else {
        handleBlockView("viewmorecomments",'show');
      }

      if(mode == 'FIRST') {
        setHTML('comment_message','Comment (' + querySnapshot.size + ')')
        handleBlockView("viewmorecomments");
        handleBlockView("viewallcomments",'show');
        handleBlockView("all_user_comments");

      } else {
        setHTML('comment_message','Comment (' + commentquerySize + ' / '+ querySnapshot.size + ')')
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



  var elem = getHTML('askmodel');
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
  handleBlockView(details); 

  //showPleaseWaitModel()
  db.doc(getCompPath('FORUM_COMMENT') + '/' + details).delete().then(function () {
    //hidePleaseWaitModel()
    toastMsg('Comment Deleted !!') 

    /*
    // ---------------------------------------------------
  // Update Reply counter 
  let topicPath = getCompPath('FORUM_ID')

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

  if(getLoginUserStatus() == 'true') {

  if(currentTopicLikeStatus) {

    db.collection(getCompPath('FORUM_LIKE')).doc(userLoginData['UUID']).delete().then(function() { 
      setHTML('fav_btn_icon','favorite_border');
      if(each_doc_fav_count == 0) {
        each_doc_fav_count = 0
      } else {
        each_doc_fav_count = each_doc_fav_count - 1
      }
      setHTML('fav_btn_count',each_doc_fav_count);
      currentTopicLikeStatus = false
    }); 

  } else {

    db.collection(getCompPath('FORUM_LIKE')).doc(userLoginData['UUID']).set({LIKE : 'YES'}).then(function() { 
      setHTML('fav_btn_icon','favorite');
      each_doc_fav_count = each_doc_fav_count + 1
      setHTML('fav_btn_count',each_doc_fav_count);
      currentTopicLikeStatus = true
    }); 

  }

} else {
  toastMsg('Please login !!')
}

}

// Like btn handling
function likeBtnHandling() {
  setHTML('like_btn','favorite_border');
  currentTopicLikeStatus = false

  if(getLoginUserStatus() == 'true') {

  db.collection(getCompPath('FORUM_LIKE')).doc(userLoginData['UUID']).get()
  .then(doc => {
    if (!doc.exists) {      
      setHTML('fav_btn_icon','favorite_border');
      currentTopicLikeStatus = false
    } else {     
      setHTML('fav_btn_icon','favorite');
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

  if(getLoginUserStatus() == 'true') {
  
  if(currentTopicBookmarkStatus) {

    db.collection(getCompPath('USER_BOOKMARK',userLoginData['UUID'],main_path)).doc(currentTopicID).delete().then(function() { 
      setHTML('bookmark_btn','bookmark_border');
      currentTopicBookmarkStatus = false
      toastMsg('Bookmark Removed !!')
    }); 

  } else {

    let data = allForumTopics[currentTopicID]

    let bookmarkData = {}
    
    bookmarkData['UPHOTO'] = data['UPHOTO']
    bookmarkData['UNAME'] = data['UNAME']
    bookmarkData['DATE'] = data['DATE']
    bookmarkData['CATG'] = data['CATEGORY']+'#'+data['CATEGORYDIS']
    bookmarkData['CATGCOLOR'] =  getCatgGroupDetails('GROUP',data['CATEGORYGROUP']).COLOR
    bookmarkData['TITLE'] = data['TITLE']
    bookmarkData['TYPE'] = main_path
    bookmarkData['SPACE'] = main_path


    var url = 'post/' + main_page +'?pt=' + encodeURIComponent('BOOKMARK') + '&id=' + encodeURIComponent(currentTopicID) + '&fl=' + encodeURIComponent('only'); 
    bookmarkData['LINK'] = url


    db.collection(getCompPath('USER_BOOKMARK',userLoginData['UUID'],main_path)).doc(currentTopicID).set(bookmarkData).then(function() { 
      setHTML('bookmark_btn','bookmark');
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
  setHTML('bookmark_btn','bookmark_border');
  currentTopicBookmarkStatus = false

  if(getLoginUserStatus() == 'true') {
    db.collection(getCompPath('USER_BOOKMARK',userLoginData['UUID'],main_path)).doc(currentTopicID).get()
    .then(doc => {
      if (!doc.exists) {
        setHTML('bookmark_btn','bookmark_border');
        currentTopicBookmarkStatus = false
      } else {
        setHTML('bookmark_btn','bookmark');
        currentTopicBookmarkStatus = true
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });

  }

}