// 切换标签页
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const targetTab = btn.dataset.tab;
        // 清除激活
        tabBtns.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));
        // 激活当前
        btn.classList.add("active");
        document.getElementById(targetTab).classList.add("active");
    })
})

// 灵签数据库
const signList = [
    { level: "上吉签", title: "春风得意", text: "万事顺遂，所求皆得，贵人相助，前路光明。事业步步高升，姻缘美满，财运亨通。" },
    { level: "上吉签", title: "金玉满堂", text: "财星高照，正财稳定，偏财有喜。家中和睦，感情甜蜜，心中所想不久便能如愿。" },
    { level: "中吉签", title: "苦尽甘来", text: "前期略有阻滞，坚持下去自有转机。待人真诚可得贵人扶持，感情平稳，财运缓慢上升。" },
    { level: "中吉签", title: "平步轻云", text: "运势平稳无大灾，稳步发展为宜。不可急于求成，循序渐进方能长久，感情少有波澜。" },
    { level: "下吉签", title: "静待时机", text: "当下时机未到，不宜贸然行动。收敛心性，沉淀自我，耐心等待转机，切勿冲动投资。" },
    { level: "凶签", title: "守静避祸", text: "近期运势低迷，凡事谨慎。减少大额支出，避免与人争执，低调行事可化解灾祸，静待转运。" }
]

// 摇签功能
const shakeBtn = document.getElementById("shake-btn");
const signTextDom = document.getElementById("sign-text");
shakeBtn.addEventListener("click", () => {
    shakeBtn.disabled = true;
    signTextDom.innerHTML = "<p>摇签中...</p>";
    // 模拟摇签延迟
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * signList.length);
        const sign = signList[randomIndex];
        signTextDom.innerHTML = `
            <h3 style="color:#912c18;margin-bottom:12px;">${sign.level} · ${sign.title}</h3>
            <p>${sign.text}</p>
        `;
        shakeBtn.disabled = false;
    }, 1200)
})

// 姻缘、事业测算逻辑【修复undefined bug】
const calcBtns = document.querySelectorAll(".calc-btn");
calcBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const box = btn.closest(".input-box");
        const inputDom = box.querySelector("input");
        const resDom = box.querySelector(".result-text");
        const name = inputDom.value.trim();

        if (!name) {
            resDom.innerText = "请输入姓名再进行测算";
            return;
        }

        // 姻缘文案库
        const loveTexts = [
            `${name}，你的姻缘运势：正缘将近，近期容易遇见温柔契合之人，多出门社交提升遇见良缘概率。`,
            `${name}，你的姻缘运势：感情平稳顺遂，伴侣体贴包容，若单身则需耐心等待，勿将就烂桃花。`,
            `${name}，你的姻缘运势：近期感情易有小矛盾，多换位思考沟通，单身者暂时不适合仓促恋爱。`
        ];
        // 事业财运文案库
        const careerTexts = [
            `${name}，事业财运测算：工作机遇将至，认真做事可得领导赏识，正财稳定，小额理财可有收益。`,
            `${name}，事业财运测算：近期事业平稳无起伏，不宜跳槽、大额投资，守成为主，厚积薄发。`,
            `${name}，事业财运测算：工作压力稍大，容易劳累，财运普通，减少冲动消费，静待转运。`
        ];

        let randomText = "";
        // 判断当前是姻缘还是财运面板
        const parentTab = box.closest(".tab-content");
        if (parentTab.id === "love") {
            randomText = loveTexts[Math.floor(Math.random() * loveTexts.length)];
        } else if (parentTab.id === "career") {
            randomText = careerTexts[Math.floor(Math.random() * careerTexts.length)];
        }

        resDom.innerText = randomText;
    })
})

// ====================== 新增八字五行测算逻辑 ======================
// 天干、地支、五行对应关系
const tianGan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const diZhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
// 天干五行
const ganWuxing = {
    "甲": "木", "乙": "木",
    "丙": "火", "丁": "火",
    "戊": "土", "己": "土",
    "庚": "金", "辛": "金",
    "壬": "水", "癸": "水"
};
// 地支五行
const zhiWuxing = {
    "子": "水", "丑": "土", "寅": "木", "卯": "木",
    "辰": "土", "巳": "火", "午": "火", "未": "土",
    "申": "金", "酉": "金", "戌": "土", "亥": "水"
};
// 时辰对应地支
const shiChenMap = {
    23: "子", 0: "子",
    1: "丑", 2: "丑",
    3: "寅", 4: "寅",
    5: "卯", 6: "卯",
    7: "辰", 8: "辰",
    9: "巳", 10: "巳",
    11: "午", 12: "午",
    13: "未", 14: "未",
    15: "申", 16: "申",
    17: "酉", 18: "酉",
    19: "戌", 20: "戌",
    21: "亥", 22: "亥"
};
// 五行运势批语
const wuxingComment = {
    "木": "木主仁，木旺之人性格温柔善良，富有同情心，创意十足；木弱则优柔寡断，缺乏主见。",
    "火": "火主礼，火旺之人热情开朗，行动力强，积极上进；火弱则内向胆怯，做事缺乏动力。",
    "土": "土主信，土旺之人忠厚踏实，诚实守信，包容心强；土弱则浮躁焦虑，没有安全感。",
    "金": "金主义，金旺之人刚毅果断，做事自律，有决断力；金弱则软弱犹豫，容易受人影响。",
    "水": "水主智，水旺之人聪慧通透，思维灵活，善于变通；水弱则思维迟钝，遇事钻牛角尖。"
};

// 八字测算点击事件
document.getElementById("baziCalc").addEventListener("click", function(){
    const year = document.getElementById("year").value.trim();
    const month = document.getElementById("month").value.trim();
    const day = document.getElementById("day").value.trim();
    const hour = document.getElementById("hour").value.trim();
    const resBox = document.getElementById("baziResult");

    // 校验输入
    if(!year || !month || !day || hour === ""){
        resBox.innerText = "请完整填写出生年月日、时辰";
        return;
    }
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);
    const h = parseInt(hour);
    if(y < 1900 || y > 2030 || m <1 || m>12 || d<1 || d>31 || h<0 || h>23){
        resBox.innerText = "时间格式错误，请检查数字范围";
        return;
    }

    // 模拟计算年干、年支（简易随机模拟，娱乐用，非专业历法）
    const ganIndex = y % 10;
    const zhiIndex = y % 12;
    const yearGan = tianGan[ganIndex];
    const yearZhi = diZhi[zhiIndex];
    const shiChenZhi = shiChenMap[h];

    // 统计五行
    let wuxingCount = {木:0,火:0,土:0,金:0,水:0};
    wuxingCount[ganWuxing[yearGan]]++;
    wuxingCount[zhiWuxing[yearZhi]]++;
    wuxingCount[zhiWuxing[shiChenZhi]]++;

    // 找出旺、弱五行
    const sortWuxing = Object.entries(wuxingCount).sort((a,b)=>b[1]-a[1]);
    const wang = sortWuxing[0][0];
    const ruo = sortWuxing[sortWuxing.length-1][0];

    // 输出测算结果
    let html = `
【简易生辰八字】
年柱：${yearGan}${yearZhi}
出生时辰地支：${shiChenZhi}

【五行统计】
木：${wuxingCount.木} ｜ 火：${wuxingCount.火}
土：${wuxingCount.土} ｜ 金：${wuxingCount.金}
水：${wuxingCount.水}

五行偏旺：${wang}
五行偏弱：${ruo}

【五行性格解析】
${wuxingComment[wang]}

【简易建议】
五行旺${wang}，日常可多平衡${ruo}属性事物调和运势；本测算仅简易模拟，仅供娱乐参考，切勿当真。
    `;
    resBox.innerText = html;
})
