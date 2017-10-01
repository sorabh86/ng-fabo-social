'use strict';

angular.module('fbApp.facebook', ['ngRoute', 'ngFacebook'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/facebook', {
      templateUrl:'facebook/facebook.html',
      controller:'FacebookCtrl'
    })
}])

.config(['$facebookProvider', function($facebookProvider){
  $facebookProvider.setAppId('1524257504303217');
  $facebookProvider.setPermissions("email, public_profile, user_posts, publish_actions, user_photos");
}])

.run(function($rootScope){
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
})

.controller('FacebookCtrl',['$scope', '$facebook', function($scope, $facebook) {
  $scope.isLoggedIn = false;
  
  $scope.login = function () {
    $facebook.login().then(function(){
      $scope.isLoggedIn = true;
      refresh();
    });
  };

  $scope.logout = function () {
    $facebook.logout().then(function(){
      $scope.isLoggedIn = false;
      refresh();
    });
  };
  $scope.postStatus = function() {
    if($scope.myPost) var myPost = $scope.myPost; else var myPost = null;

    console.log($scope.myPost);
    $facebook.api('/me/feed', 'post',{message:myPost}).then(function(res){
      console.log(res);
      $scope.msg = 'Thanks for Posting!!!';
      $scope.myPost = undefined;
      refresh();
    });
  };

  function refresh() {
    $facebook.api("/me", {
      fields:'id,name,first_name,last_name,email,gender,locale,picture,link'
    }).then(function(res){
      $scope.welcomeMsg = 'Welcome '+res.name;
      $scope.isLoggedIn = true;
      $scope.userInfo = res;
      $scope.picture = res.picture.data.url;

      $facebook.api('/me/permissions').then(function(res){
        $scope.permissions= res.data;
        console.log('permissions:', $scope.permissions);

        $facebook.api('/me/posts').then(function(res){
          $scope.posts = res.data;
        });
      });
      console.log('userInfo',$scope.userInfo);
    }, function(err){
      $scope.welcomeMsg = 'Please Login';
    });
  }

  refresh();
}]);