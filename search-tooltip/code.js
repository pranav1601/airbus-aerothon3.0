const rp = require('request-promise');
const anychart=require('anychart')
// const url = 'https://www.airbus.com/';

document.addEventListener('DOMContentLoaded',function(){
    const navigation=document.querySelector('.navigation')
    document.querySelector('.toggle').onclick=function(){
        this.classList.toggle('active')
        navigation.classList.toggle('active')
    }

    var tooltipsToggle=false
    var performanceToggle=false

    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;


        var performanceEle=document.getElementById("container")
        performanceEle.style.display="none"
        // tooltip
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
            text=html.replace(/<style[^>]*>.*<\/style>/gm, 'xhsjsj').replace(/<script[^>]*>.*<\/script>/gm, 'xhsjsj').replace(/<[^>]+>/gm, 'xhsjsj').replace(/([\r\n]+ +)+/gm, 'xhsjsj');
            
            var res = text.split("xhsjsj");
            
            var reg_name_lastname = /^[a-zA-Z\s]*$/;
            let finalres = res.filter(function (temp) {
                return reg_name_lastname.test(temp) && temp.length>3 && !temp.includes('\n') && !temp.includes('\r')})
            let uniqueArray = [...new Set(finalres)];
            
            
            let finalTitleArray = titlearray.filter(function (temp) {
                return reg_name_lastname.test(temp) && temp.length>3 && !temp.includes('\n') && !temp.includes('\r')})
            let uniqueTitleArray = [...new Set(finalTitleArray)];

            var finalArray=uniqueTitleArray.concat(uniqueArray)
            if(finalArray.length<25){
                finalArray=finalArray.slice(0,finalArray.length)
            }else{
                finalArray=finalArray.slice(0,25)
            }


            document.getElementById("tooltips").onclick=function(){
                document.getElementById("tooltipsEle").classList.toggle("scroll");
                if(!tooltipsToggle){
                    performanceToggle=false
                    performanceEle.style.display="none"
                    document.getElementById("container1").classList.remove("graph");
                    document.getElementById("container2").classList.remove("graph")



                    finalArray.forEach(function(item,index){
                        var p2 = document.createElement('li');
                        p2.innerHTML =item;
                        document.getElementById("tooltipsEle").appendChild(p2)
                    })
                    tooltipsToggle=!tooltipsToggle
                }else{
                    document.getElementById("tooltipsEle").innerHTML=''
                    tooltipsToggle=!tooltipsToggle
                }
            }
            
            // console.log(finalArray)
            
            })
            .catch(function(err){
                console.log('not working',err)
            });



            // performance

            anychart.onDocumentReady( function() {
                // Get Navigation Timing entries:
                // console.log(a)
                const navigationEntries = performance.getEntriesByType('navigation')[0]// returns an array of a single object by default so we're directly getting that out.
                const resourceListEntries = performance.getEntriesByType("resource")
                const fetchTime = navigationEntries.responseEnd - navigationEntries.fetchStart//response time with cache seek
                const dnsTime = navigationEntries.domainLookupEnd - navigationEntries.domainLookupStart// dns time
                console.log(navigationEntries)
                    // set the data
                var y = performance.now()
                console.log(y)
                var data = [
                       {x:"Performance", value: y},
                       {x:"ResponseTime", value: fetchTime},
                       {x:"dnsTime", value: dnsTime},
                       {x:"domTime", value: navigationEntries.domContentLoadedEventEnd - navigationEntries.domContentLoadedEventStart},
                       {x:"domInteractive", value: navigationEntries.domInteractive}
                ]
                    // create the chart
                    var chart = anychart.bar()
                
                    // add the data
                    var series = chart.bar(data)
                
                    series.normal().stroke("#0066cc", 0.3);
                  
                    // set the chart title
                    chart.title("Navigation timing")
                
                    // set the padding between bar groups
                    chart.barGroupsPadding(0)
                
                    // set the titles of the axes
                    chart.xAxis().title("Navigation parameters")
                    chart.yAxis().title("In milliseconds, ms")
                  
                    // set the container id
                    
                
                    // initiate drawing the chart
                    console.log(resourceListEntries)
                    var data1 = []
                    resourceListEntries.forEach(resource => {
                          data1.push({x: resource.initiatorType, value: resource.responseEnd - resource.startTime})
                          console.info(`Time taken to load ${resource.name}: `, resource.responseEnd - resource.startTime)
                    })
                    for(var i=0;i<data1.length;i++) {
                       for(var j=0;j<(data1.length-i-1);j++) {
                        if(data1[j].value > data1[j+1].value){
                            var temp = data1[j]
                            data1[j] = data1[j+1]
                            data1[j+1] = temp
                          }
                       }
                    }
                    data1.reverse()
                    var data2 = []
                    for(var i=0;i<data1.length;i++) {
                        if(i===10)
                        break
                        data2.push(data1[i])
                    }
                    console.log("Data 1")
                    console.log(data1)
                    console.log("Data 2")
                    console.log(data2)
                    var chart1 = anychart.column()
                    var series1 = chart1.column(data2)
                    series1.normal().stroke("0066cc", 0.3);
                    chart1.title("Resource timing")
                    //chart1.barGroupsPadding(0)
                    chart1.xAxis().title("Resource parameters")
                    chart1.yAxis().title("In milliseconds, ms")
                    
                    chart.container("container1")
                    chart1.container("container2")
                    chart.draw()
                    chart1.draw()
                    document.getElementById("performance").onclick=function(){
                        document.getElementById("container1").classList.toggle("graph");
                        document.getElementById("container2").classList.toggle("graph");
                        if(!performanceToggle){
                            
                            performanceEle.style.display="block"

                            document.getElementById("tooltipsEle").innerHTML=''
                            document.getElementById("tooltipsEle").classList.remove("scroll");
                            tooltipsToggle=false
                        }else{
                            performanceEle.style.display="none"
                        }
                        performanceToggle=!performanceToggle
                        
                    }
                    
                })
    });
    
    
  })