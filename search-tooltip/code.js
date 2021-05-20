const rp = require('request-promise');
const url = 'https://www.airbus.com/';

rp(url)
  .then(function(html){
    //success!
    t=" title="
    titlearray=[]
    for (let i = 0; i < html.length-7; i++) {
        if(html.slice(i,i+7)===t){
            var j=i
            var count=0
            var init=-1
            var final=-1
            while(j<html.length && count<2){
                if(html.charAt(j)==="\""){
                    count=count+1
                    if(count===1){
                        init=j
                    }
                    else{
                        final=j
                    }
                }
                j=j+1
            }
            titlearray.push(html.slice(init+1,final))
        }
      }
    // console.log(titlearray)
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

    var finalArray=titlearray.concat(uniqueArray)
    if(finalArray.length<25){
        finalArray=finalArray.slice(0,finalArray.length)
    }else{
        finalArray=finalArray.slice(0,25)
    }
    console.log(finalArray)
    
  })
  .catch(function(err){
  });