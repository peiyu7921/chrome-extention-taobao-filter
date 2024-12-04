document.addEventListener('DOMContentLoaded', function () {
    const keywordInput = document.getElementById('keyword-input');
    const addBtn = document.getElementById('add-btn');
    const keywordsList = document.getElementById('keywords-list');

    // 加载保存的关键词并显示
    function loadKeywords() {
        chrome.storage.local.get('keywords', function (data) {
            const keywords = data.keywords || [];
            keywordsList.innerHTML = ''; // 清空当前列表
            keywords.forEach((keyword, index) => {
                // 创建关键词项
                const li = document.createElement('li');
                li.textContent = keyword;
                li.addEventListener('click', function () {
                    removeKeyword(index);
                });
                keywordsList.appendChild(li);
            });
        });
    }

    // 添加新关键词
    addBtn.addEventListener('click', function () {
        const newKeyword = keywordInput.value;
        if (newKeyword) {
            chrome.storage.local.get('keywords', function (data) {
                const keywords = data.keywords || [];
                keywords.push(newKeyword); // 将新关键词添加到列表
                chrome.storage.local.set({keywords: keywords}, function () {
                    loadKeywords(); // 更新显示的关键词
                    keywordInput.value = ''; // 清空输入框
                });
            });
        }
    });

    // 删除关键词
    function removeKeyword(index) {
        chrome.storage.local.get('keywords', function (data) {
            let keywords = data.keywords || [];
            keywords.splice(index, 1); // 删除对应的关键词
            chrome.storage.local.set({keywords: keywords}, function () {
                loadKeywords(); // 更新显示的关键词
            });
        });
    }

    loadKeywords(); // 初次加载时显示已保存的关键词
});
