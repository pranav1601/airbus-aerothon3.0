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
    var chatToggle=false
    var reportToggle=false

    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;


        var performanceEle=document.getElementById("container")
        performanceEle.style.display="none"

        var chatEle=document.getElementById("chat")
        document.getElementById("main").style.display="none"

        var reportEle=document.getElementById("reportbug")
        reportEle.style.display="none"
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
                    chatToggle=false
                    document.getElementById("main").style.display="none"


                    reportToggle=false
                    reportEle.style.display="none"


                    performanceToggle=false
                    performanceEle.style.display="none"
                    document.getElementById("container1").classList.remove("graph");
                    document.getElementById("container2").classList.remove("graph")



                    finalArray.forEach(function(item,index){
                        var p2 = document.createElement('li');
                        p2.innerHTML =item;
                        p2.classList.add("tooltipsele")
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




            // Chatbot
            const inputField = document.getElementById("input")
            inputField.addEventListener("keydown", function(e) {
                if (e.code === "Enter") {
                    let input = inputField.value;
                    // document.getElementById("user").innerHTML = input;
                    output(input);
                }
            });
            const trigger = [
                //0 
                ["hi", "hey", "hello"],
                //1
                ["how are you", "how are things"],
                //2
                ["what is going on", "what is up"],
                //3
                ["happy", "good", "well", "fantastic", "cool"],
                //4
                ["bad", "bored", "tired", "sad"],
                //5
                ["tell me story", "tell me joke"],
                //6
                ["thanks", "thank you"],
                //7
                ["bye", "good bye", "goodbye"]
            ];
                
                const reply = [
                //0 
                ["Hello!", "Hi!", "Hey!", "Hi there!"], 
                //1
                [
                    "Fine... how are you?",
                    "Pretty well, how are you?",
                    "Fantastic, how are you?"
                    ],
                //2
                [
                    "Nothing much",
                    "Exciting things!"
                    ],
                //3
                ["Glad to hear it"],
                //4
                ["Why?", "Cheer up buddy"],
                //5
                ["What about?", "Once upon a time..."],
                //6
                ["You're welcome", "No problem"],
                //7
                ["Goodbye", "See you later"],
            ];
                
            const alternative = [
                "Same",
                "Go on...",
                "Try again",
                "I'm listening...",
                "Bro..."
            ];

            function compare(triggerArray, replyArray, text) {
                let item;
                for (let x = 0; x < triggerArray.length; x++) {
                  for (let y = 0; y < replyArray.length; y++) {
                    if (triggerArray[x][y] == text) {
                      items = replyArray[x];
                      item = items[Math.floor(Math.random() * items.length)];
                    }
                  }
                }
                return item;
            }

            function output(input) {
                let product;
                let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");
                text = text
                  .replace(/ a /g, " ")
                  .replace(/i feel /g, "")
                  .replace(/whats/g, "what is")
                  .replace(/please /g, "")
                  .replace(/ please/g, "");
              
              //compare arrays
              //then search keyword
              //then random alternative
              
                if (compare(trigger, reply, text)) {
                  product = compare(trigger, reply, text);
                } else if (text.match(/robot/gi)) {
                  product = robot[Math.floor(Math.random() * robot.length)];
                } else {
                  product = alternative[Math.floor(Math.random() * alternative.length)];
                }
                
                //update DOM
                addChat(input, product);

                // document.getElementById("chatbot").innerHTML = product;
                // speak(product);

                //clear input value
                document.getElementById("input").value = "";
              }
            
              const robot = ["How do you do, fellow human", "I am not a bot"];

              function addChat(input, product) {
                const mainDiv = document.getElementById("main");
                let userDiv = document.createElement("div");
                userDiv.id = "user";
                userDiv.innerHTML = `<span class="green">You:</span> <span id="user-response">${input}</span>`;
                mainDiv.appendChild(userDiv);
              
                let botDiv = document.createElement("div");
                botDiv.id = "bot";
                botDiv.innerHTML = `<span class="red">Chatbot:</span> <span id="bot-response"><em>${product}</em></span>`;
                mainDiv.appendChild(botDiv);
                speak(product);
              }

              function speak(string) {
                const u = new SpeechSynthesisUtterance();
                allVoices = speechSynthesis.getVoices();
                u.voice = allVoices.filter(voice => voice.name === "Alex")[0];
                u.text = string;
                u.lang = "en-US";
                u.volume = 1; //0-1 interval
                u.rate = 1;
                u.pitch = 2; //0-2 interval
                speechSynthesis.speak(u);
              }
              

              chatEle.onclick=function(){
                if(!chatToggle){
                    document.getElementById("tooltipsEle").innerHTML=''
                    document.getElementById("tooltipsEle").classList.remove("scroll");
                    tooltipsToggle=false


                    reportToggle=false
                    reportEle.style.display="none"



                    performanceToggle=false
                    performanceEle.style.display="none"
                    document.getElementById("container1").classList.remove("graph");
                    document.getElementById("container2").classList.remove("graph")


                    document.getElementById("main").style.display="block"
                }else{
                    document.getElementById("main").style.display="none"
                }
                chatToggle=!chatToggle
              }


            


            // report a bug.
            document.getElementById("reportbugbutton").onclick=function(){
                if(!reportToggle){

                    reportEle.style.display="block"


                    chatToggle=false
                    document.getElementById("main").style.display="none"

                    document.getElementById("tooltipsEle").innerHTML=''
                    document.getElementById("tooltipsEle").classList.remove("scroll");
                    tooltipsToggle=false

                    performanceToggle=false
                    performanceEle.style.display="none"
                    document.getElementById("container1").classList.remove("graph");
                    document.getElementById("container2").classList.remove("graph")


                    document.getElementById("submitbug").onclick=async function(){
                        var subject = document.getElementById("subject").value;
                        var description = document.getElementById("description").value;
                        var email = document.getElementById("email").value;
                        var jsonRequest = {};
                        document.getElementById("subject").value=''
                        document.getElementById("description").value='';
                        document.getElementById("email").value='';
                        jsonRequest.subject = subject
                        jsonRequest.description = description
                        jsonRequest.email = email
                        jsonRequest.url = url
                        // console.log(`jsonRequest: ${JSON.stringify(jsonRequest)}`);
                        let result = await fetch("http://34.229.15.195:8080/bugs", {
                            method: "POST",
                            headers: { "content-type": "application/json" },
                            body: JSON.stringify(jsonRequest),
                        });
                        result = await result.json();
                        console.log('result',result)
                        document.getElementById("reporthead").innerHTML=`<span class="green">Submit another bug?</span>`
                        if (!result.success) alert("FAILED! ");
                    }

                    
                }else{
                    reportEle.style.display="none"
                }
                reportToggle=!reportToggle
            }
            






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
                    
                    chart.container("container1")
                    chart1.container("container2")
                    chart.draw()
                    chart1.draw()
                    document.getElementById("performance").onclick=function(){
                        document.getElementById("container1").classList.toggle("graph");
                        document.getElementById("container2").classList.toggle("graph");
                        if(!performanceToggle){
                            
                            performanceEle.style.display="block"


                            reportToggle=false
                            reportEle.style.display="none"


                            chatToggle=false
                            document.getElementById("main").style.display="none"

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