/**
 * 防止劫持
 */

const whiteList = [
  'zhugao.net',
  'zhugao.cn',
]

const whileListMatch = (whileList, value) => {
  for (let i = 0; i < whileList.length; i++) {
    const reg = new RegExp(whiteList[i], 'i')
    if (reg.test(value)) {
      return true
    }
  }
  return false
}

const interceptionStaticScript = () => {
  // MutationObserver 的不同兼容性写法
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

  // Mutation 观察者对象能监听在某个范围内的 DOM 树变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // 返回被添加的节点, 或者为null.
      const nodes = mutation.addedNodes

      // 逐个遍历
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        // 拦截
        if (node.tagName === 'SCRIPT' || node.tagName === 'IFRAME') {
          if (!whileListMatch(whiteList, node.src)) {
            node.parentNode.removeChild(node)
          }
        }
      }
    })
  })

  observer.observe(document, {
    subtree: true,
    childList: true
  })
}

export const httpHijack = () => {
  interceptionStaticScript()
}
