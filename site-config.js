module.exports = {
  nav: [
    { text: 'Home', link: '/' },
    { text: '导航', link: '/guide/design' },
    { text: '组件', link: '/component/' },
    { text: '资源', link: '/resource/' }
    // {
    //   text: '语言',
    //   items: [
    //     { text: 'Chinese', link: '/language/chinese/' },
    //     { text: 'Japanese', link: '/language/japanese/' },
    //     { text: 'Spnanish', link: '/language/spanish/' },
    //   ]
    // }
  ],
  sidebar: {
    '/guide': {
      children: [
        'design',
        'nav'
      ]
    },
    '/component': {
      children: [
        'changelog',
        'installation',
        // 'https://elemefe.github.io/element-react/',
        // 'https://element-angular.faas.ele.me/'
        'installation',
        'quickstart',
        'i18n',
        'custom-theme',
        'transition',
        // 组件
        'layout',
        'container',
        'color',
        'typography',
        'icon',
        'button',
        'radio',
        'checkbox',
        'input',
        'input-number',
        'select',
        'cascader',
        'switch',
        'slider',
        'time-picker',
        'date-picker',
        'datetime-picker',
        'upload',
        'rate',
        'color-picker',
        'transfer',
        'form',
        'table',
        'tag',
        'progress',
        'tree',
        'pagination',
        'badge',
        'alert',
        'loading',
        'message',
        'message-box',
        'notification',
        'menu',
        'tabs',
        'breadcrumb',
        'dropdown',
        'steps',
        'dialog',
        'tooltip',
        'popover',
        'card',
        'carousel',
        'collapse'
      ]
    }
  }
}