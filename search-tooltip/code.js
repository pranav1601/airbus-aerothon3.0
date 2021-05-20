const rp = require('request-promise');
const url = 'https://www.airbus.com/';

rp(url)
  .then(function(html){
    //success!
    someText = html.replace(/(\r\n|\n|\r)/gm, "");
    // final=someText.replace(/\s/g,'')
    // finalfinal=final.replace( /(<([^>]+)>)/ig, '')
    // console.log(finalfinal);
    text=html.replace(/<style[^>]*>.*<\/style>/gm, 'xhsjsj').replace(/<script[^>]*>.*<\/script>/gm, 'xhsjsj').replace(/<[^>]+>/gm, 'xhsjsj').replace(/([\r\n]+ +)+/gm, 'xhsjsj');
    
    var res = text.split("xhsjsj");
    
    var reg_name_lastname = /^[a-zA-Z\s]*$/;
    let finalres = res.filter(function (temp) {
        return reg_name_lastname.test(temp) && temp.length>3 && !temp.includes('\n') && !temp.includes('\r')})
    let uniqueArray = [...new Set(finalres)];
    console.log(uniqueArray)
    
  })
  .catch(function(err){
    //handle error
  });