export default {
  pages: [//主包只放tabbar页面
    'pages/index/index',
    'pages/menu/index',
  ],
  "subpackages": [
    {
      "root": "pages/detail",
      "pages": [
        "index"
      ]
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom',
    disableScroll: true,
  },
  tabBar: {
    color: "#333",
    selectedColor: "#A4D67C",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "./assets/tabbar/home.png",
        selectedIconPath: "./assets/tabbar/home_a.png"
      },
      {
        pagePath: "pages/menu/index",
        text: "点餐",
        iconPath: "./assets/tabbar/menu.png",
        selectedIconPath: "./assets/tabbar/menu_a.png"
      },
    ]
  },
}
