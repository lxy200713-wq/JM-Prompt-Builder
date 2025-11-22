let keywordDB = {
    "场景": ["客厅", "卧室", "书房", "街道"],
    "人物": ["少女", "侧脸男性", "背影人物"],
    "风格": ["原木风", "日式极简", "电影氛围"],
    "光影": ["柔光", "自然光", "背光"],
    "摄影": ["35mm 镜头", "大景深", "平视构图"]
};

let selected = JSON.parse(localStorage.getItem("selectedTags") || "[]");

// 渲染分类与标签
function loadCategories() {
    const container = document.getElementById("categories");
    container.innerHTML = "";

    Object.keys(keywordDB).forEach(cat => {
        const div = document.createElement("div");
        div.className = "category";

        let html = `<h3>${cat}</h3>`;

        keywordDB[cat].forEach(item => {
            const active = selected.includes(item) ? "active" : "";
            html += `<span class="tag ${active}" onclick="toggleTag(this)">${item}</span>`;
        });

        div.innerHTML = html;
        container.appendChild(div);
    });

    function updateOutput() {
    let outputText = "";

    // 遍历数据库的分类顺序
    Object.keys(keywordDB).forEach(category => {
        // 找出该分类中被选中的词
        const selectedInCategory = selected.filter(
            item => keywordDB[category].includes(item)
        );

        // 若该分类有被选中，则写入标题+内容
        if (selectedInCategory.length > 0) {
            outputText += `${category}：\n${selectedInCategory.join("，")}\n\n`;
        }
    });

    document.getElementById("output").value = outputText.trim();
}

// 搜索关键词
function searchKeywords() {
    const keyword = document.getElementById("search").value.trim();

    document.querySelectorAll(".tag").forEach(tag => {
        if (tag.innerText.includes(keyword)) {
            tag.style.background = "#ffeeba";
        } else {
            tag.style.background = tag.classList.contains("active") ? "#000" : "#fff";
            tag.style.color = tag.classList.contains("active") ? "#fff" : "#000";
        }
    });
}

// 输出 prompt
function updateOutput() {
    document.getElementById("output").value = selected.join("，");
}

// 复制
function copyPrompt() {
    const out = document.getElementById("output");
    out.select();
    document.execCommand("copy");
    alert("复制成功！");
}

// 上传 JSON / CSV
document.getElementById("fileInput").addEventListener("change", e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        if (file.name.endsWith(".json")) {
            keywordDB = JSON.parse(reader.result);
            selected = [];
            loadCategories();
            alert("JSON 关键词库加载成功！");
        }

        if (file.name.endsWith(".csv")) {
            Papa.parse(reader.result, {
                header: true,
                complete: results => {
                    const rows = results.data;
                    let db = {};

                    rows.forEach(r => {
                        const cat = r.category || "未分类";
                        if (!db[cat]) db[cat] = [];
                        db[cat].push(r.keyword);
                    });

                    keywordDB = db;
                    selected = [];
                    loadCategories();
                    alert("CSV 关键词库加载成功！");
                }
            });
        }
    };

    reader.readAsText(file);
});

// 初始化
loadCategories();
