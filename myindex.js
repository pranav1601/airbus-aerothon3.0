var list = document.getElementById("box1 button")
var a = 0
list.addEventListener("click",function () {
    if(a===0) {
    a=1
    document.getElementById("container").style.marginLeft="30%"
    document.getElementById("container").style.width= "700px"
    document.getElementById("container").style.height= "500px"
    }
    else {
      a=0  
      document.getElementById("container").style.marginLeft=""
      document.getElementById("container").style.width= "0px"
      document.getElementById("container").style.height= "0px"
    }
})
if (a===0)    {
    document.getElementById("container").style.width= "0px"
    document.getElementById("container").style.height= "0px"
}
anychart.onDocumentReady( function() {
// Get Navigation Timing entries:
console.log(a)
const navigationEntries = performance.getEntriesByType("navigation")[0]// returns an array of a single object by default so we're directly getting that out.
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
    chart.container("container")

    // initiate drawing the chart
    chart.draw()
    console.log(resourceListEntries)
    var data1 = []
    resourceListEntries.forEach(resource => {
          data1.push({x: resource.initiatorType, value: resource.responseEnd - resource.startTime})
          console.info(`Time taken to load ${resource.name}: `, resource.responseEnd - resource.startTime)
    })
    for(var i=0;i<data1.length;i++) {
       for(var j=0;j< (data1.length-i-1);j++) {
        if(data1[j].value > data1[j+1].value){
            var temp = data1[j]
            data1[j] = data1[j+1]
            data1[j+1] = temp
          }
       }
    }
    data1.reverse()
    var data2 = []
    for(var i=0;i<10;i++) {
        data2.push(data1[i])
    }
    console.log(data1)
    console.log(data2)
    var chart1 = anychart.column()
    var series1 = chart1.column(data2)
    series1.normal().stroke("0066cc", 0.3);
    chart1.title("Resource timing")
    //chart1.barGroupsPadding(0)
    chart1.xAxis().title("Resource parameters")
    chart1.yAxis().title("In milliseconds, ms")
    chart1.container("container")
    chart1.draw()
})



