// Initialize your app 
var $$ = Dom7;
var app = new Framework7({  
  root: '#app', // App root element
  pushState: true, 
  //popupCloseByOutside:true,
  name: 'Sabzibolo -Delivery',// App Name 
  //id: 'com.phonegap.sgl', // App id //
  id: 'com.phonegap.sabzibolo_delivery', // App id //
  panel: {
    //swipe: 'left', // Enable swipe panel //
    closeByBackdropClick : true,    
  },  
  input: {
    scrollIntoViewOnFocus: true,
    scrollIntoViewCentered: true,
  },
  animateNavBackIcon:true,  
  dynamicNavbar: true,  
  //theme:'material',
  //material: true, //enable Material theme
  //materialRipple: false,
  routes: routes, 
  clicks: { 
    externalLinks: '.external',
  },
  navbar: {     
    hideOnPageScroll: false,
    iosCenterTitle: false,
    closeByBackdropClick: true,
  },
  picker: {
    rotateEffect: true,
    //openIn: 'popover', 
  },
  popover: {
    closeByBackdropClick: true,
  },  
  on:{
    pageInit: function(e, page) {    
      //console.log(e+"-----"+page); 
    }
  },
  // Hide and show indicator during ajax requests
  onAjaxStart: function (xhr) {
    app.preloader.show();
  },
  onAjaxComplete: function (xhr) {
    app.preloader.hide(); 
  }
}); 
var base_url = 'https://sabzibolo.com/App/Appcontroller_delivery';
var img_url = 'https://sabzibolo.com/';
//var mainView = app.views.create('.view-main');

document.addEventListener("deviceready", checkStorage, false); 
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("backbutton", onBackKeyDown, false);

function onDeviceReady() {
} 
function onBackKeyDown() {
  checkConnection(); 
  //alert(app.views.main.router.history.length==2);
  if(app.views.main.router.history.length==2 || app.views.main.router.url=='/'){
    app.dialog.confirm('Do you want to Exit ?', function () {
      navigator.app.clearHistory(); navigator.app.exitApp();
    });
  }else{ 
    $$(".back").click();
  } 
}
function checkStorage(){
  checkConnection();   
  var mobile = window.localStorage.getItem("mobile");
  var uid = window.localStorage.getItem("uid");
  if(uid!=null){
    //mainView.router.navigate("/dashboard/");
    var mainView = app.view.main;
    mainView.router.navigate({ name: 'dashboard' });
  }else{
    //mainView.router.navigate("/"); 
    var mainView = app.view.main;
    mainView.router.navigate({ name: 'index' });
  }
}
// --------------------- C H E C K  I N T E R N E T  C O N N E C T I O N --------------------- //
function checkConnection(){ 
  /*var version='1.0';  
  $.ajax({
    url: base_url+'APP/Appcontroller/chk_version/'+version, 
    success: function(result){ 
    //alert(result);
      if(result==0 && result!=""){
        app.dialog.confirm('A new update is available for Sabarmati Gas Limited.Please update your app.', function () { 
          navigator.app.clearHistory(); 
          navigator.app.exitApp();
        });  
      }
  }});*/
  var networkState = navigator.connection.type;
  if(networkState=='none'){  
    var mainView = app.view.main;
    // mainView.router.navigate('/internet/');  
    mainView.router.navigate({ name: 'internet' }); 
  }  
}

function getlogin(){
  checkConnection();    
  var lform = $(".fromLogin").serialize();
  //alert(lform);
  var mobile_num = $(".mobile_no").val();
  var pass = $(".pass_val").val();
  //alert(mobile_num+"=="+pass);  
  if(mobile_num==''){
    $(".passerror").html("");
    $(".mobileerror").html("Mobile number is required.");
    app.preloader.hide();
    return false;
  }else if(pass==''){
    $(".mobileerror").html("");
    $(".passerror").html("Password is required.");
    app.preloader.hide();
    return false;
  }else{    
    $(".mobileerror").html("");
    $(".passerror").html("");
    app.preloader.show(); 
    $.ajax({
      type:'POST', 
      url:base_url+'/login',
      data:lform,  
      success:function(html){        
        var result = $.parseJSON(html);
        ///alert(result+" result");       
        var msg = result.msg; 
        //alert(msg);        
         if(msg=='success'){ 
                
          var uid = result.user[0].id;   
          var user_name = result.user[0].user_name;
          var ucode = String("0000"+uid).slice(-4);           
          window.localStorage.setItem("mobile", mobile_num);
          window.localStorage.setItem("uid", uid);
          window.localStorage.setItem("user_name", user_name);
          window.localStorage.setItem("ucode", "DL"+ucode);
          //app.router.navigate("/dashboard/");
          // mainView.router.navigate('/dashboard/');           
          var mainView = app.view.main;
          mainView.router.navigate({ name: 'dashboard' });
          //mainView.loadPage("dashboard.html"); 
         }else {
          var notificationClickToClose = app.notification.create({
            //icon: '<i class="f7-icons">xmark_circle</i>',
            //title: 'Framework7',
            //titleRightText: 'now',
            subtitle: '<i class="f7-icons fs-16">xmark_circle_fill</i>  Login unsuccessful!',
            text: 'Click me to close',
            closeOnClick: true,
          });
          notificationClickToClose.open();
        }
        app.preloader.hide();
      }
    });
  }
}
// -------------------------------- L O G O U T -------------------------------- //
function logOut(){
  checkConnection();
  app.preloader.show();
  var mobile = window.localStorage.getItem("mobile");
  var uid = window.localStorage.getItem("uid");
  $.ajax({
    type:'POST',  
    url:base_url+'/update_logout',
    data:{'uid':uid},
    success:function(res){
      //var parseRes = $.parseJSON.res;
      //var msg = parseRes.msg;
      console.log(res);
      if(res=='success'){  
        window.localStorage.removeItem("mobile"); 
        window.localStorage.removeItem("uid"); 
        window.localStorage.removeItem("user_name"); 
        window.localStorage.removeItem("ucode"); 
        var mainView = app.view.main;
        //mainView.router.navigate('/');  
         mainView.router.navigate({ name: 'index' });  
      }else if(res=='fail'){
        app.dialog.alert("Error exiting from app");
        return false;
      }
      app.preloader.hide();
    }    
  });
}