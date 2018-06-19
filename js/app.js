// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Notification', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {

    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
});

// Init/Create views
var mainView = app.views.create('.view-main');

var homeView = app.views.create('#view-home', {
  url: '/'
});
var catalogView = app.views.create('#view-catalog', {
  url: '/catalog/'
});
var settingsView = app.views.create('#view-settings', {
  url: '/settings/'
});

//easyweb: login thành công, thiết lập accesstoken vào header
// var apibackend = 'http://103.199.18.44:2990/api';
// axios.defaults.baseURL = apibackend;
var pixUrl = 'https://mobile.app.webdigital.vn/demo/CAMBODIA_YAK_BIZ/CODE';
axios.defaults.baseURL = pixUrl;
//axios.defaults.headers.common['Authorization'] = localStorage.access_token;

app.on('pageInit', function (page) {
  console.log('localStorage', localStorage);
  // localStorage.isAuthenticated = 'false'  ; //để debug
  if (localStorage.isAuthenticated == 'true') {
    //đã đăng nhập

  } else {
    //chưa đăng nhập: có thể hiện ra login
    //app.loginScreen.open('#my-login-screen');
  }

});

//home button
$$('#home_button').on('click', function (e) {
  app.views.main.router.navigate('/');
})

$$('#reload-button').on('click', function (e) {
  location.reload()
})

function clearData() {
  localStorage.isAuthenticated = 'false';
  localStorage.removeItem("user");
  localStorage.removeItem("access_token");
  localStorage.removeItem("f7form-form-request");
  localStorage.removeItem("user_type");
  localStorage.removeItem("f7form-my-form-edit-product");
}

//clear data
$$('#clear-button').on('click', function (e) {
  console.log('localStorage', localStorage);
  clearData();
  // localStorage.isAuthenticated = 'false';
  // localStorage.removeItem("user");
  // localStorage.removeItem("access_token");
  // localStorage.removeItem("f7form-form-request");
  // localStorage.removeItem("user_type");
  // localStorage.removeItem("f7form-my-form-edit-product");

});

//seller login button
$$('#seller-button').on('click', function (e) {
  console.log('Login screen open');
  if (localStorage.user_type == '1') {
    clearData();
    app.loginScreen.open('#my-login-screen');
  } else if (localStorage.isAuthenticated === 'true')
    app.views.main.router.navigate('/seller-list/');
  else {
    app.loginScreen.open('#my-login-screen');

  }

});

$$('#my-login-screen .login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();

  login();

});


function login() {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();

  let type = "username";
  let user_type = "2"; //buyer = 1, seller = 2

  var credentials = {
    username: username,
    password: password,
    type: type,
    user_type: user_type
  };
  //console.log('credentials', credentials);

  var notificationClickToClose = app.notification.create({
    // icon: '<i class="icon demo-icon">7</i>',
    title: 'Notification',
    titleRightText: 'now',
    subtitle: 'Login failed wrong username or password',
    // text: 'Click me to close',
    closeOnClick: true,
    closeTimeout: 2000
  })

  var successNotification = app.notification.create({
    // icon: '<i class="icon demo-icon">7</i>',
    title: 'Notification',
    titleRightText: 'now',
    subtitle: 'Login successfully!',
    // text: 'Click me to close',
    closeOnClick: true,
    closeTimeout: 2000
  })

  axios.post('api/v1/auth/login', credentials).then(function (response) {
    console.log('response', response);
    console.log('response.data', response.data);
    if (response.data) {
      var data = response.data.data; //dữ liệu trả về bởi loopback3
      localStorage.isAuthenticated = 'true'; //là string, ko phải bool
      localStorage.access_token = data.access_token;
      localStorage.user = data.user_data.username;
      localStorage.user_type = "2"; //buyer =1 , seller = 2
      //localStorage.ttl = data.ttl; //ttl: time to lease, thời gian mà accesstoken hết hạn
      //axios.defaults.headers.common['Authorization'] = localStorage.access_token;

      var token = data.access_token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      //getUserInfo();
      console.log('local storage', localStorage);
      // Close login screen
      app.loginScreen.close('#my-login-screen');
      successNotification.open();
    }
  }).catch(function (error) {
    console.log('err', error);
    notificationClickToClose.open();
  });
}

//buyer
$$('#buyer_button').on('click', function () {
  console.log('BUYER | localStorage', localStorage);
  if (localStorage.user_type == '2') {
    clearData();
    app.views.main.router.navigate('/buyer-login/');
  } else if (localStorage.isAuthenticated === 'false')
    app.views.main.router.navigate('/buyer-login/');
  else
    app.views.main.router.navigate('/buyer-main/');

})

// function getUserInfo() {
//   console.log('getUserInfo()')
//   if (localStorage.isAuthenticated !== 'true') {
//     //lấy thông tin đầy đủ của user
//     axios.get('/Users/' + localStorage.userId)
//       .then(function (response) {
//         console.log(response.data)
//         var data = response.data;
//         localStorage.username = data.username;
//         localStorage.email = data.email;
//         localStorage.isAuthenticated = 'true'
//       })
//       .catch(function (error) {
//         localStorage.userId = '';
//         localStorage.isAuthenticated = 'false';
//       })
//     return true;
//   } else {
//     return false;
//   }
// }

// function getNews() {
//   axios.get('/BaiViets', {
//       params: {
//         trangThai: PUBLISHED
//       }
//     })
//     .then(function (response) {
//       console.log('get news', response);
//     })
//     .catch(function (error) {
//       console.log('get news', error);
//     });
// }