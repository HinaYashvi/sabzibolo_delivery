// Initialize your app 
var $$ = Dom7;
var app = new Framework7({  
  root: '#app', // App root element
  pushState: true, 
  //popupCloseByOutside:true,
  name: 'Sabzibolo - delivery',// App Name 
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
    app.showIndicator();
  },
  onAjaxComplete: function (xhr) {
    app.hideIndicator(); 
  }
}); 
var base_url = 'https://sabzibolo.com/App/Appcontroller_delivery';
var img_url = 'https://sabzibolo.com/';
var mainView = app.views.create('.view-main'); 
//var mainView = app.addView('.view-main');
document.addEventListener("deviceready", checkStorage, false); 
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("backbutton", onBackKeyDown, false);
function onDeviceReady() { }
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
  //var session_uid = window.localStorage.getItem("session_uid");
  var mobile = window.localStorage.getItem("mobile");
  var uid = window.localStorage.getItem("uid");
  //alert(mobile);
  if(uid!=null){
    mainView.router.navigate("/dashboard/");
    //app.views.main.router.navigate("/dashboard/");
  }else{
    mainView.router.navigate("/"); 
    //app.views.main.router.navigate("/")
  }
}
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
      mainView.router.navigate('/internet/');   
  }  
}
function getlogin(){ 
  checkConnection(); 
  var reg = $(".fromLogin").serialize();
  var mobile=$('.mobile_no').val();
  var password=$('.pass_val').val();
  //alert(reg);
  alert(mobile+"==="+password); 
  app.preloader.show();
  if ((mobile=='') && (password=='')){ 
    $('.mobileerror').html('Enter Mobile No');
    $('.passerror').html('Enter Password');   
    app.preloader.hide();   
  }else if (mobile==''){ 
    $('.mobileerror').html('Enter Mobile No');
    $('.passerror').html('');      
    app.preloader.hide();
  }else if (password==''){ 
    $('.mobileerror').html('');
    $('.passerror').html('Enter Password'); 
    app.preloader.hide();
  }else{    
    $.ajax({
      type: "POST",
      url:base_url+"/login", 
      data: reg,
      success: function(html) {              
        //alert(html);
        var result = $.parseJSON(html);
        ///alert(result+" result");       
        var msg = result.msg; 
        //alert(msg);        
         if(msg=='success'){         
          var uid = result.user[0].id;   
          var user_name = result.user[0].user_name;
          var ucode = String("0000"+uid).slice(-4);           
          window.localStorage.setItem("mobile", mobile);
          window.localStorage.setItem("uid", uid);
          window.localStorage.setItem("user_name", user_name);
          window.localStorage.setItem("ucode", "DL"+ucode);
          //app.router.navigate("/dashboard/");
          mainView.router.navigate('/dashboard/');  
          //mainView.loadPage("dashboard.html"); 
         }/*else if(html=='Noverify'){
             window.localStorage.setItem("login", mobile);
             window.localStorage.setItem("totalcartqty", 0);
             //mainView.loadPage("verfiy.html");
             mainView.router.navigate("/verfiy/");
         }*/else{
          /*app.addNotification({
            message: html
          });*/
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
        mainView.router.navigate('/');   
      }else if(res=='fail'){
        app.dialog.alert("Error exiting from app");
        return false;
      }
      app.preloader.hide();
    }    
  });
}