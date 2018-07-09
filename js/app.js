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
      // apibackend: 'http://103.199.18.44:2990/api',
      // user: {
      //   firstName: 'John',
      //   lastName: 'Doe',
      // },
      // // Demo products for Catalog section
      // products: [{
      //     id: '1',
      //     title: 'Apple iPhone 8',
      //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
      //   },
      //   {
      //     id: '2',
      //     title: 'Apple iPhone 8 Plus',
      //     description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
      //   },
      //   {
      //     id: '3',
      //     title: 'Apple iPhone X',
      //     description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
      //   },
      // ]
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
axios.defaults.headers.common['Authorization'] = localStorage.accessToken;

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

$$('#seller-button').on('click', function (e) {
  console.log('Login screen open');
  if (localStorage.isAuthenticated === 'true')
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
  console.log('credentials', credentials);

  axios.post('api/v1/auth/login', credentials).then(function (response) {
    console.log('response', response);
    console.log('response.data', response.data);
    if (response.data) {
      var data = response.data.data; //dữ liệu trả về bởi loopback3
      localStorage.isAuthenticated = 'true'; //là string, ko phải bool
      localStorage.access_token = data.access_token;
      localStorage.user = data.user_data.username;
      //localStorage.ttl = data.ttl; //ttl: time to lease, thời gian mà accesstoken hết hạn
      axios.defaults.headers.common['Authorization'] = localStorage.access_token;

      //getUserInfo();
      console.log('local storage', localStorage);
      // Close login screen
      app.loginScreen.close('#my-login-screen');
    }
  }).catch(function (error) {
    console.log('err', error);
  });
}

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