/*
  配置文件的入口文件
*/
module.exports = {
    // 网站部署路径，如果你想将你的网站部署到 https://foo.github.io/bar/，那么 base 应该被设置成 "/bar/"
    base: "/e-wordcloud/", 
    // 网站标题
    title: "EWordcloud指南", 
    // 网站描述
    description: "基于wordcloud2.js封装的插件", 
    // 注入到当前页面的 HTML <head> 中的标签
    head: [
      // 增加一个自定义的 favicon(网页标签的图标)
      ["link", { rel: "icon", href: "/favicon.ico" }] 
    ],
    port: "8089", // dev server 的端口
    // 用于离线环境访问（仅在生产环境生效）
    serviceWorker: false, 
    markdown: {
      // 代码块显示行号
      lineNumbers: true, 
      toc: {
        includeLevel: [2, 3]
      }
    },
    themeConfig: {
      // 文档更新时间：每个文件git最后提交的时间
      lastUpdated: "上次更新", 
      //头部导航
      nav: [
        // 下拉列表
        {
          text: "GitHub",
          items: [
            // 外部链接
            { text: "GitHub地址", link: "https://github.com/yokiyokiyoki/ec-wordcloud" }
          ]
        }
      ],
      //将同时提取markdown中h2 和 h3 标题，显示在侧边栏上
      sidebarDepth: 2, 
      sidebar: {
        "/guide/": getGuideSidebar(),
      },
      searchMaxSuggestions: 10 // 搜索框显示的数量
    },
    evergreen: false // 设置成 true，将会禁止 ESNext 到 ES5 的转译以及对 IE 的 polyfills
  };
  
  function getGuideSidebar () {
    return [
      {
        title: "基础",
        collapsable: false,
        children: [
          'base'
        ]
      },
    ]
  }
  
  