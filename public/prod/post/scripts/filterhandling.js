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
              <input placeholder="Enter Filter Set Name" id="filter_bookmark_name" type="text" data-length="10">\
              <label for="filter_bookmark_name">Name</label>\
              <span class="helper-text" data-error="Wrong : We consider only 10 Charecter." data-success="right"></span>\
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
    
    setHTML('saveFilterOptionModal').modal('open');

    
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

  setHTML('saveFilterOptionModal').modal('close');

  let validateInput =  true

  // Read Comment Details
  var filter_bookmark_name = getHTMLValue("filter_bookmark_name")
  displayOutput('filter_bookmark_name : ' + filter_bookmark_name)
  if(filter_bookmark_name == '') {
    validateInput = false
    toastMsg('Please provide valid Name !!')
  } 

  //validateInput = false

  if(validateInput) {

    filter_bookmark_name = filter_bookmark_name.substring(1, 11);
    displayOutput('filter_bookmark_name : ' + filter_bookmark_name)

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
   let catDropValue = getHTMLValue("catg_options")
   let cateData = ''  

   if(catDropValue == '') {
    filter_selection_status['CATG'] = false
   } else {
    filter_selection_status['CATG'] = true
     cateData = catgOption[catDropValue]     
     filter_selection_data['CATG'] = cateData
   } 
  


  var tagDetails = getHTMLValue("autocomplete-input") 
  if(tagDetails == '') {
    filter_selection_status['TAG'] = false
  } else {
    filter_selection_status['TAG'] = true
    filter_selection_data['TAG'] = tagDetails
  }

  var topic_date = getHTMLValue("topic_date")
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
  let selected_date = getHTMLChecked("selected_date_chkbx")
  if(selected_date) {
    filter_selection_status['MONTH'] = false
    filter_selection_status['YEAR'] = false
  } else {
    filter_selection_status['MONTH'] = getHTMLChecked("selected_month_chkbx")
    filter_selection_status['YEAR'] = getHTMLChecked("selected_year_chkbx")
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

   handleBlockView("main_filter_section",'show');
   setHTML('main_filter_section_value',chip_html)

   
    setHTML('message_content','Filter Applied !!')
   

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

  setHTML('all_Scope_details','');

  let html_line = ''
  for(each_idx in scope_list) {   
    let scope_name = scope_list[each_idx]

    if(scope_name == location_scope) {
      html_line += '<a class="waves-effect waves-light blue btn z-depth-2" onclick="chipClickHandling(\'' + scope_name +'#scope' + '\')" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px;">' + scope_name + '</a>'
    } else {
      html_line += '<a class="waves-effect waves-light grey btn" onclick="chipClickHandling(\'' + scope_name +'#scope' + '\')" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px;">' + scope_name + '</a>'
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

  let catg_list = getCatgDataMapping('LIST')

  let html_line = ''
  for(each_idx in catg_list) {
    if(each_idx == 0) {continue}

    let catg_name = catg_list[each_idx]

    if(getCatgDataMapping(catg_name) == getCatgDataMapping(selected_catg)) {
      html_line += '<a class="waves-effect waves-light '+color+' btn z-depth-2" onclick="chipClickHandling(\'' + catg_name +'#catg' + '\')" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px;">' + getCatgDataMapping(catg_name) + '</a>'
    } else {
      html_line += '<a class="waves-effect waves-light grey btn" onclick="chipClickHandling(\'' + catg_name +'#catg' + '\')" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px;">' + getCatgDataMapping(catg_name) + '</a>'  
    }

    }

  setHTML('all_Category_details',html_line);

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
