var cheerio = require('cheerio');
var request = require('request');


var superCategory = [];
var category = [];
var subCategory = [];

var urbanladderTemplate ={
    superCategoryArray: '.navigation_wrapper nav.main-navigation #topnav_wrapper ul li.topnav_item',
    superCategory: 'span.topnav_itemname',
    categoryArray: '.subnavlist .subnavlist_wrapper ul li.sublist_item',
    category: '.taxontype a',
    subCategoryArray: '.navigation_wrapper nav.main-navigation #topnav_wrapper ul li .subnavlist .subnavlist_wrapper ul li.sublist_item ul.taxonslist li.subnav_item',
    subCategory: 'a',
    name: 'urabanladder'
};
var pepperfryTemplate ={
    superCategoryArray: '.menu_wrapper ul li',
    superCategory: 'a.level-top',
    categoryArray: '#megamenu .megamenu_panel.clearfix .menu_body .menu_list_wrap ul li.menu_list_item_1',
    category: 'a',
    subCategoryArray: '#megamenu .megamenu_panel .menu_body .menu_list_wrap ul li.menu_list_item_2',
    subCategory: 'a',
    name: 'pepperfry'
};


var getSuperCategory = function(callback,body, template){
  var $ = cheerio.load(body);
  if(template.name=='pepperfry')
  {
    $(template.superCategoryArray).each(function(){
      var data = $(this);
      if (data.find(template.superCategory).text()!='')
        superCategory.push(data.find(template.superCategory).text());
    });  
  }
  else
  {
    $(template.superCategoryArray).each(function(){
      var data = $(this);
      if(data.find(template.superCategory).text()!='')
        superCategory.push(data.find(template.superCategory).text());
      else
        superCategory.push(data.find('a.topnav_itemname').text());
  });
  }
  callback(body, template)
}

//TODO getting urbanladder output only
var getCategory = function(body, template){
  var $ = cheerio.load(body);
  var length = $(template.categoryArray).length;
  var array = $(template.categoryArray).text();
  $(template.categoryArray).each(function(){
    var data = $(this);
    category.push({
              link: data.find(template.category).attr('href'),
              name: data.find(template.category).text()        
            });
  });
  getSubCategory(body, template)
}


//TODO getting urbanladder output only
var getSubCategory = function(body, template){
  var $ = cheerio.load(body);
  var length = $(template.subCategoryArray).length;
  $(template.subCategoryArray).each(function(){
    var data = $(this);
    subCategory.push({
            link: data.find(template.subCategory).attr('href'),
            name: data.find(template.subCategory).text()
          });
  });
  storeData()
}

var storeData = function(){
  console.log("solution: "+JSON.stringify(category));
  //console.log("solution: "+JSON.stringify(subCategory))
}

var crawlUrbanladder = function(){
  request.get("https://www.urbanladder.com/",function(err, request, body){
    if (err) return (err);
    getSuperCategory(getCategory,body,urbanladderTemplate);
  });
}

var crawlPepperfry = function(){
  request.get("http://www.pepperfry.com",function(err, request, body){
    if (err) return (err);
    getSuperCategory(getCategory,body,pepperfryTemplate);
  });
}

exports.getCrawlData = function(req, res, next){
//  crawlUrbanladder();
  crawlPepperfry();
  res.send(200);
}

