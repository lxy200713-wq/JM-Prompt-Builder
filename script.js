// =====================
// 默认关键词库（可被上传文件覆盖）
// =====================
let keywordDB = {
    "整体描述": [
        "现代奶油风卧室",
        "小户型紧凑空间",
        "床在画面中心"
    ],
    "核心家具": [
        "1.8米白色床",
        "白色床头柜",
        "白色奶油风梳妆桌",
        "白色短绒梳妆椅"
    ],
    "附属软装": [
        "白色床上浅色记忆棉枕头",
        "浅蓝色条纹冬天厚棉被",
        "桌上异形化妆镜",
        "化妆品收纳盒摆放整齐",
        "白色亚光地板",
        "奶油风浅色地毯",
        "浅蓝色玻璃罩床头台灯",
        "墙上抽象画面挂画",
        "奶油风生活感摆件（抱枕、衣物）"
    ],
    "整体硬装构造": [
        "巨大飘窗",
        "白透纱窗帘",
        "厚奶油色窗帘",
        "白色飘窗坐垫",
        "飘窗抱枕和收纳箱",
        "中央空调通风口",
        "定制贴合的大衣柜"
    ],
    "拍摄调性": [
        "写实摄影风格",
        "平视视角拍摄",
        "CCD风格",
        "realistic photo",
        "cozy minimalist desk setup",
        "静物摄影",
        "真实镜头感",
        "浅景深",
        "真实照片像素感"
    ],
    "氛围调性": [
        "干净整洁空间",
        "柔和阳影",
        "温馨家居场景",
        "轻奢治愈感",
        "小红书家居种草图",
        "暖黄色调",
        "冬季晚上场景"
    ],
    "排除": [
        "人物",
        "变形",
        "透视错误",
        "HDR",
        "曝光过度",
        "奇怪阴影",
        "不真实反射",
        "杂物",
        "AI痕迹"
    ]
};

// =====================
// 已选的关键词（从 LocalStorage 读取）
// =====================
let selected = JSON.parse(localStorage.getItem("selectedTags") || "[]");

// =====================
// 渲染分类和标签
// =====================
function loadCategories() {
    const container = document.getElementById("categories");
    container.innerHTML = "";

    Object.keys(keywordDB).forEach(category => {
        const div = document.createElement("div");
        div.className = "category";

        let html = `<h3>${category}</h3>`;

        keywordDB[category].forEach(item => {
            const active = selected.includes(item) ? "active" : "";
            html += `<span class="tag ${active}" onclick="toggleTag(this)">${item}</span>`;
        });

        div.innerHTML = html;
        container.appendChild(div);
    });

    updateOutput();
}

// =====================
// 点击标签
// =====================
function toggleTag(el) {
    const text = el.innerText;

    if (el.classList.contains("active")) {
        selected = selected.filter(x => x !== text);
    } else {
        selected.push(text);
    }

    el.classList.toggle("active");
    localStorage.setItem("selectedTags", JSON.stringify(selected));
    updateOutput();
}

// =====================
// 搜索关键词（高亮）
// =====================
function searchKeywords() {
    const keyword = document.getElementById("search").value.trim();

    document.querySelectorAll(".tag").forEach(tag => {
        if (keyword !== "" && tag.innerText.includes(keyword)) {
            tag.style.background = "#ffeeba";
        } else {
            tag.style.background = tag.classList.contains("active") ? "#000" : "#fff";
            tag.style.color = tag.classList.contains("active") ? "#fff" : "#000";
        }
    });
}

// =====================
// 输出格式：分类标题 + 内容（图2格式）
// =====================
function updateOutput() {
    let outputText = "";

    Object.keys(keywordDB).forEach(category => {
        const selectedInCategory = selected.filter(
            item => keywordDB[category].includes(item)
        );

        if (selectedInCategory.length > 0) {
            outputText += `${category}：\n${selectedInCategory.join("，")}\n\n`;
        }
    });

    document.getElementById("output").value = outputText.trim();
}

// =====================
// 一键复制
// =====================
function copyPrompt() {
    const out = document.getElementById("output");
    out.select();
    document.execCommand("copy");
    alert("复制成功！");
}

// =====================
// 上传 JSON / CSV 文件
// =====================
document.getElementById("fileInput").addEventListener("change", e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        // JSON 解析
        if (file.name.endsWith(".json")) {
            keywordDB = JSON.parse(reader.result);
            selected = [];
            localStorage.removeItem("selectedTags");
            loadCategories();
            alert("JSON 关键词库加载成功！");
        }

        // CSV 解析
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
                    localStorage.removeItem("selectedTags");
                    loadCategories();
                    alert("CSV 关键词库加载成功！");
                }
            });
        }
    };

    reader.readAsText(file);
});

// =====================
// 初始化
// =====================
loadCategories();
