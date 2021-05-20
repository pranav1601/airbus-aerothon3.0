
//basic global setup
$('#chatBotWidget').attr("style","display:none !important");
$('#chatresult').hide();
$('#loaders').hide();

var counter=1;
var scrolled = false;

//chatbot function

function chatBot()
{


	

	var search=$('#inptext').val();

	

	search= search.trim();
var curdate=getTime();

//user content
$('#contentx').append('<div class="d-flex justify-content-end mb-4"> <div class="msg_cotainer_send"> '+search+' <span class="msg_time_send" >'+curdate+'</span> </div> <div class="img_cont_msg bg-success"> <i class="fa fa-user fa-1x"></i> </div> </div>');

    $('#inp-grp').hide();
    $('#chatresult').hide();
    $('#loaders').delay("fast").fadeIn();

	updateScroll();


    
counter++;
  
$('#chtcount').text(counter); 
   

   var search='http://google.com/search?q='+search;

  var searchText='';

   $('#texturl').val(search);
  
   
   setTimeout(function(){
    $('#loaders').hide();
    $('#inptext').val('');
	
    $('#inp-grp').delay(200).fadeIn();
	curdate=getTime();
	searchText='<a href="'+search+'" target="_blank">You can find solution to your query Here</a>';

	//generate google search result
	$('#contentx').append('<div class="d-flex justify-content-start mb-4" id="chatcard'+counter+'" style="display:none;"> <div class="img_cont_msg bg-info"> <i class="fa fa-user fa-1x"></i> </div> <div class="msg_cotainer"> '+searchText+' <span class="msg_time">'+curdate+'</span> </div> </div>');

	$('#chatcard'+counter).delay(200).fadeIn(); 
	$('#chtcount').text(counter+1); 
	updateScroll();

  },3000);
   
 

       return false; // Stop the form submitting
    
}

//triggers when page loaded then
function openModal(){
	$('#myModal').modal('show');
    var ctime=getTime();
$('#chattmt').text(ctime);


if(counter==1){

	$('#chatBotWidget').delay('slow').fadeIn(); 
	$('#chtcount').text(counter); 

}
}

//get current time

function getTime(){

	var curdate=new Date().toLocaleString();
	return curdate;
}

//update scroll

function updateScroll(){
  
        var element = document.getElementById("contentx");
        element.scrollTop = element.scrollHeight;
 

	console.log(scrolled);
}

