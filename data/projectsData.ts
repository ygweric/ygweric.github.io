interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: '微信小程序源码 - 北漂开车指南',
    description: `同名微信小程序北漂开车指南外地车线路规划源码，移除线上接口，改为本地mock。
      智能规划线路，不收费，不限次数，显示进京证摄像头信息，规避摄像头。
      技术栈： Taro3 + Webpack5 + Vue3 + NutUI + TailwindCSS + Husky + json-server + 高德LBS接口`,
    imgSrc: '/static/images/pages/jinjing_wx_search.png',
    href: 'https://github.com/ygweric/jinjing-route-plan-mp-opensource',
  },
  {
    title: 'Chrome插件 - URL Block',
    description: `上班摸鱼时候，总喜欢看一下微博、观网、新闻网站，但自己觉得很无聊，但忍不住会打开。所以我开发了这个网站，能够屏蔽一些网站。
      主要功能如下：根据域名屏蔽，根据地址屏蔽，根据正则表达式屏蔽，暂停工作一会，划个水`,
    imgSrc: '/static/images/pages/chrome_url_block.png',
    href: 'https://github.com/ygweric/chrome-url-block',
  },
]

export default projectsData
