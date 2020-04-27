// *******************************************************************************
// SCRIPT : filterhandling.js
//
//
// Author : Vivek Thakur
// Date : 20/4/2020
// *******************************************************************************

// ------------ Filter Handling --------------

// Bookmark Filter Options
function bookmarkFilterOptions() {
  displayOutput('Bookmark Filter Options')

  let validateInput = true
  if(getLoginUserStatus() == 'false') {
    validateInput = false;
    toastMsg('Please login !!')
  }

  if(validateInput) {
   
    let content = '\
    <form id="filter_bookmark_name_form" class="col s12">\
      <div class="row">\
          <div class="input-field col s12">\
              <!-- <i class="material-icons prefix">message</i> -->\
              <input placeholder="Enter Filter Set Name" id="filter_bookmark_name" type="text" data-length="20">\
              <label for="filter_bookmark_name">Name</label>\
              <span class="helper-text" data-error="Wrong" data-success="right">Use only (a-z,A-Z,0-9)</span>\
            </div></div>\
    </form>'  
   
    var model = '<!-- Modal Structure -->\
    <div id="saveFilterOptionModal" class="modal">\
      <div class="modal-content">\
        <div>'+ content + '</div>\
      </div>\
      <div class="modal-footer">\
        <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>\
        <a href="#!" onclick="addbookmarkFilterOptions()" class="waves-effect waves-green blue btn" style="border-radius: 5px; margin-left: 10px; margin-right: 5px;">SAVE</a>\
      </div>\
    </div>'
  
    var elem = getHTML('saveFilterOptionModal');
    if (elem) { elem.parentNode.removeChild(elem); }
  
  
    $(document.body).append(model);
  
    $(document).ready(function () {
      $('.modal').modal();
    });  

    $(document).ready(function() {
      $('input#filter_bookmark_name').characterCounter();
    });

    $(document).ready(function() {
      M.updateTextFields();
    });
    
   $('#saveFilterOptionModal').modal('open');

    
    $(document).ready(function() {
      $("#filter_bookmark_name_form").bind("keypress", function(e) {
          if (e.keyCode == 13) {
              return false;
          }
      });
    });

  } 

}

// Add Into DB Filter Option Name
function addbookmarkFilterOptions() {  

  // Read Comment Details
  var filter_bookmark_name = getHTMLValue("filter_bookmark_name")
  displayOutput('filter_bookmark_name : ' + filter_bookmark_name)
  
  if(isInputStringValid(filter_bookmark_name))
   {  
    
      $('#saveFilterOptionModal').modal('close');

      let filter_bookmark_data = {}

      filter_bookmark_data['SPACE'] = current_space
      filter_bookmark_data['LOCSCOPE'] = location_scope
      filter_bookmark_data['CATG'] = selected_catg
      filter_bookmark_data['TAG'] = selected_tag
      filter_bookmark_data['USERUUID'] = useruuid
      filter_bookmark_data['NAME'] = filter_bookmark_name


    addNewDocument(getCompPath('USER_FILTERBOOKMARK',userLoginData['UUID']),filter_bookmark_data,'Filter Option Saved.')

  }

}

// Open Filter Section
function openFilterSection() {

  // Current Scroll Posstion
  // horizontal scrolling amount
  horizScrollPosition = window.pageXOffset
  // vertical scrolling amount
  vertiScrollPosition = window.pageYOffset

  window.scrollTo(0, 0); 

  handleBlockView("col_section_1");
  handleBlockView("flb_open_filter");
  handleBlockView("main_footer_sec");  

  handleBlockView("flb_close_filter",'show');
  handleBlockView("filter_section",'show');

  if(isUserMode) {
    handleBlockView("top_div_header");
  }

}

// Close Filter Section
function closeFilterSection() {  

  handleBlockView("col_section_1",'show');
  handleBlockView("flb_open_filter",'show');
  //handleBlockView("main_footer_sec",'show');  

  handleBlockView("flb_close_filter");
  handleBlockView("filter_section");

  if(isUserMode) {
    handleBlockView("top_div_header",'show');
  }

  window.scrollTo(horizScrollPosition, vertiScrollPosition);  
  

}

// RESET Filter 
function resetFilter() {
  var url = main_page + '?pt=' + encodeURIComponent(main_path) + '&id=' + encodeURIComponent('NA') + '&fl=' + encodeURIComponent('NA');
  window.location.href = url
}

// Reset Filter - just remove filter Option
function resetFilterSoft() {
 
  saveConfig('tag', [])
  saveConfig('catg','NA')

  hideFullMessageDialog()
  closeFilterSection()
  updateHTMLPage()

}

// Create Filter tags details

// Create Location Scope Section
function createFilterScopeDetails() {

  setHTML('all_Scope_details','');

  let html_line = ''
  for(each_idx in scope_list) {   
    let scope_name = scope_list[each_idx]

    if(scope_name == location_scope) {
      html_line += getBtnHTMLCode(scope_name +'#scope',scope_name,true,'chipClickHandling','green')
    } else {
      html_line += getBtnHTMLCode(scope_name +'#scope',scope_name,false,'chipClickHandling','green')      
    }

    
  }

  setHTML('all_Scope_details',html_line);

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

setHTML('location_details_sec',loc_html)

}

// View each Location Information
function viewEachLocationInfo(docid) {

  displayOutput(docid)

}

// Create Tags Section
function createFilterTagsDetails() {
  setHTML('all_tags_details','');

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

  setHTML('all_tags_details',html_line);

}

// Create Category Section
function createFilterCategoryDetails() {
  setHTML('all_Category_details','');

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

        if(catg_name == getCatgDataMapping(selected_catg)) {
          catg_content_html += getBtnHTMLCode(each_key +'#catg' ,catg_name,true,'chipClickHandling')
        } else {
          catg_content_html += getBtnHTMLCode(each_key +'#catg' ,catg_name,false,'chipClickHandling')
        }
        
      }

      catg_content_html += '</div></li></ul>'

  }

  setHTML('all_Category_details',catg_content_html);

}

// Create chip like card with title and close btn
function createChipLikeCard(name,color,icon_name="close") {

  let card_html = '<div class="">\
  <div class="card hoverable '+color+'" style="border-radius: 10px;">\
    <div style="padding: 10px;" class="white-text">\
      <span class="card-title truncate"><i class="material-icons left" style="margin-top: 5px;">'+icon_name+'</i>'+name+'</span>\
      </div>\
      </div>\
      </div>'
  return card_html

}
