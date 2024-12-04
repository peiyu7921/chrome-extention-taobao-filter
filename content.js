let container;

// 获取并过滤宝贝列表的函数
function filterItems(target = container) {
    chrome.storage.local.get("keywords", function (data) {
        const keywords = data.keywords || [];

        function searchChildren(node) {
            const findKeyWord = keywords.some(keyword => node.innerText && node.innerText.includes(keyword));
            if (findKeyWord) {
                // 缓存数据
                if (!node.dataset.taobaofilter) {
                    node.dataset.taobaofilter = true
                    node.dataset.defaultDisplay = node.style.display;
                    node.dataset.defaultWidth = node.style.width;
                    node.dataset.defaultTransition = node.style.transition;
                }
                // 添加动画效果
                node.style.transition = 'width 0.5s ease'; // 动画过渡
                node.style.width = '0'; // 设置透明度为0
                // 延迟隐藏元素
                setTimeout(() => {
                    node.style.display = 'none'; // 动画结束后隐藏元素
                }, 500);
            } else if (node.dataset.taobaofilter) {
                node.style.transition = node.dataset.defaultTransition || ''
                node.style.display = node.dataset.defaultDisplay || ''; // 恢复原有display
                node.style.width = node.dataset.defaultWidth || ''; // 恢复原有display
            }
        }

        // 遍历子节点，执行删除操作
        target.childNodes.forEach(node => searchChildren(node));
    });
}

// 使用 MutationObserver 监听页面 DOM 的变化
const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        const target = mutation.target;
        if (target.childNodes.length > 10 && target.tagName !== 'BODY') {
            container = target;
            filterItems(target);
        }
    });
});

// 配置 MutationObserver，监听 DOM 树的变化
observer.observe(document.body, {
    childList: true,  // 监听子节点的变化
    subtree: true     // 监听整个页面的变化（包括嵌套的元素）
});

// 监听关键词变化并立即过滤页面上的宝贝
chrome.storage.onChanged.addListener(function (changes, areaName) {
    if (areaName === 'local' && changes.keywords) {
        // 页面上已有容器时，立即过滤
        if (container) {
            filterItems(container);
        } else {
            // 如果容器尚未加载，等待 MutationObserver 处理
            console.log('等待容器加载...');
        }
    }
});
