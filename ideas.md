# 水浒传：梁山风云录 - 设计方案

## 设计方案一：水墨江湖·沉浸叙事
**Design Movement**: 新水墨主义（Neo-Ink Wash）
**Core Principles**: 
1. 水墨质感与数字界面的融合——用CSS滤镜和纹理模拟宣纸与墨迹
2. 深色底色（墨黑）为主，英雄红为点缀，金黄为高光
3. 文字排版融入竖排汉字美学，标题使用书法风格字体
4. 信息层次通过「浓淡干湿」的墨色变化来表达

**Color Philosophy**: 
- 背景：#0D0D0D（浓墨）到 #1A1A1A（淡墨）
- 主色：#C0392B（英雄红）
- 强调：#F39C12（金黄）
- 辅助：#2C3E50（青灰）

**Layout Paradigm**: 非对称分割布局，左侧为叙事区域（宽），右侧为数据区域（窄），模拟古籍卷轴的视觉感

**Signature Elements**: 
1. 水墨晕染边框（box-shadow + blur）
2. 竹简纹理背景
3. 印章式标签和徽章

**Interaction Philosophy**: 点击触发「墨迹扩散」动画，滑动有「卷轴展开」效果

**Animation**: 
- 进场：fade + scale（0.95→1.0），模拟墨迹渐显
- 数据更新：数字滚动动画
- 战斗：shake + flash

**Typography System**: 
- 标题：Noto Serif SC（思源宋体）
- 正文：Noto Sans SC（思源黑体）
- 数字：Orbitron（科技感数字）

---

<response>
<text>方案一：水墨江湖·沉浸叙事</text>
<probability>0.08</probability>
</response>

<response>
<text>方案二：赛博宋朝·霓虹江湖（深色赛博朋克 + 水浒元素）</text>
<probability>0.05</probability>
</response>

<response>
<text>方案三：古典卷轴·现代数据（古典卷轴美学 + 现代数据可视化）</text>
<probability>0.07</probability>
</response>

## 最终选择：方案一「水墨江湖·沉浸叙事」

深色水墨底色，英雄红点缀，金黄高光，思源宋体标题，营造沉浸式江湖叙事体验。
