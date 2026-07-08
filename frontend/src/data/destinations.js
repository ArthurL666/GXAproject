/**
 * 目的地深度数据 — 纯前端，不依赖后端 API
 * 数据来源：后端 TravelDataService.java 已有数据 + 真实旅游信息
 */
import { pexels, unsplash } from './images'

// ─── Helpers ─────────────────────────────────
const star = (n) => '⭐'.repeat(Math.round(n))

// ─── 16 Destinations ─────────────────────────
const destinations = [
  // =========================== 京都 ===========================
  {
    name: '京都', slug: 'kyoto', region: 'overseas',
    image: pexels('31409369'),
    gallery: [
      pexels('31409369'), pexels('32213469'), pexels('32597754'),
      unsplash('1504198458649-9f8c2a8a5b1f'), pexels('32763116'), unsplash('1493976040374-85c8e12f0c0e'),
    ],
    emoji: '⛩️', gradient: 'linear-gradient(135deg, #FFF1F2 0%, #FBCFE8 30%, #FDA4AF 100%)',
    themeColor: '#E8796F',
    desc: '樱花与古寺交织，千年的和风雅韵流淌在每一条石板路上',
    longDesc: '京都，日本千年古都，拥有 17 处世界文化遗产。从金阁寺的璀璨到伏见稻荷大社的千本�的，从岚山竹林的幽静到花见小路的艺伎倩影，京都把日本最极致的美浓缩在一方天地里。春樱秋枫、夏绿冬雪，四季皆景。',
    tags: ['文化历史', '城市漫游', '自然风光'], category: ['city', 'culture', 'nature'],
    rating: 4.8, price: 5800, bestSeason: '🌸 春季',
    bestTime: '3月下旬-4月上旬樱花季、11月中旬-12月上旬红叶季为最旺季。避开日本黄金周(4月底-5月初)和盂兰盆节(8月中旬)可享受更宁静的体验。',
    weather: '四季分明，春季 8-20°C，夏季 25-35°C 湿热，秋季 10-22°C，冬季 0-10°C。6-7月梅雨季降雨较多。',
    pref: ['photo', 'culture'],
    highlights: [
      { name: '金阁寺', desc: '京都最具代表性的建筑，金色的舍利殿倒映在镜湖池中，四季皆美', price: '400日元', rating: 4.8, hours: '09:00-17:00', category: '历史文化' },
      { name: '伏见稻荷大社', desc: '京都最古老的神社之一，千本�的连绵不绝的朱色鸟居隧道震撼人心', price: '免费', rating: 4.7, hours: '全天开放', category: '历史文化' },
      { name: '岚山竹林', desc: '高耸入云的竹林小径，风过竹叶沙沙作响，被评為日本最治愈的散步道', price: '免费', rating: 4.6, hours: '全天开放', category: '自然体验' },
      { name: '清水寺', desc: '世界文化遗产，悬空的清水舞台可俯瞰京都全景，春樱秋枫绝美', price: '400日元', rating: 4.7, hours: '06:00-18:00', category: '历史文化' },
      { name: '花见小路', desc: '祇园最著名的花街，保留着江户时期的町家建筑，偶遇行色匆匆的艺伎', price: '免费', rating: 4.5, hours: '全天开放', category: '美食购物' },
    ],
    hotels: [
      { name: '京都丽思卡尔顿酒店', level: '五星级', location: '中京区鸭川畔', price: 3800, rating: 4.9, feature: '鸭川景观，顶级日式服务' },
      { name: '京都祇园赛莱斯廷酒店', level: '四星级', location: '祇园', price: 1200, rating: 4.7, feature: '和风设计，步行至花见小路' },
      { name: '京都和式民宿·枫', level: '民宿', location: '东山区', price: 450, rating: 4.5, feature: '百年町家改造，含抹茶体验' },
    ],
    foods: [
      { name: '怀石料理·菊乃井', desc: '米其林三星，精致至极的京都传统怀石料理', emoji: '🍱', price: '¥1000+' },
      { name: '抹茶甜品·中村藤吉', desc: '京都最古老的抹茶名店，抹茶冰淇淋和生茶冻必尝', emoji: '🍵', price: '¥50-100' },
      { name: '锦市场小吃巡礼', desc: '400年历史的「京都厨房」，各种京味小吃和渍物', emoji: '🍢', price: '¥30-80' },
      { name: '汤豆腐·顺正', desc: '京都最具代表性的素食料理，汤豆腐的清雅之味', emoji: '🥢', price: '¥150-300' },
    ],
    transportTips: '关西国际机场 (KIX) 乘坐 HARUKA 特急列车 75 分钟到京都站。市内推荐购买公交一日券(600日元)，覆盖绝大部分景点。',
    budgetRange: '中等预算 800-1200元/天，舒适预算 1500-2500元/天',
    itineraries: {
      '3日': [
        { day: 1, title: '经典京都·古都初探', activities: [
          { time: '上午', activity: '金阁寺', detail: '欣赏金色建筑与镜湖池的绝美倒影' },
          { time: '下午', activity: '龙安寺', detail: '参观日本最著名的石庭枯山水' },
          { time: '晚上', activity: '锦市场+先斗町', detail: '品尝京都在地美食' },
        ]},
        { day: 2, title: '和风雅韵·文化深度', activities: [
          { time: '上午', activity: '伏见稻荷大社', detail: '徒步千本朱色鸟居隧道' },
          { time: '下午', activity: '清水寺+二年坂', detail: '漫步传统街区，体验和服' },
          { time: '晚上', activity: '祇园', detail: '花见小路散步，品尝怀石料理' },
        ]},
        { day: 3, title: '自然禅意·岚山一日', activities: [
          { time: '上午', activity: '岚山竹林', detail: '清晨竹林天光，游客稀少' },
          { time: '下午', activity: '天龙寺+渡月桥', detail: '世界遗产庭园，桂川畔漫步' },
          { time: '晚上', activity: '抹茶体验', detail: '在中村藤吉品尝正宗抹茶甜品' },
        ]},
      ],
      '5日': [
        { day: 1, title: '经典京都·古都初探', activities: [] },
        { day: 2, title: '和风雅韵·文化深度', activities: [] },
        { day: 3, title: '自然禅意·岚山一日', activities: [] },
        { day: 4, title: '宇治·抹茶之乡', activities: [
          { time: '上午', activity: '平等院凤凰堂', detail: '世界遗产，10日元硬币上的图案' },
          { time: '下午', activity: '中村藤吉本店', detail: '抹茶发源地，品尝抹茶全宴' },
          { time: '晚上', activity: '宇治川畔散步', detail: '紫式部雕像，感受源氏物语氛围' },
        ]},
        { day: 5, title: '奈良·鹿与古寺', activities: [
          { time: '上午', activity: '奈良公园', detail: '喂食可爱的小鹿' },
          { time: '下午', activity: '东大寺', detail: '世界最大的木构建筑' },
          { time: '晚上', activity: '返回京都，自由活动', detail: '最后的京都之夜' },
        ]},
      ],
    },
    reviews: [
      { text: '京都是一座让人想一去再去的城市。春天的樱花、秋天的红叶，每一个角落都像一幅画。在岚山竹林里散步，感觉整个世界都安静下来了。', name: '摄影师Alex', avatarColor: '#7C3AED', destination: '京都' },
      { text: '第一次体验和服走在花见小路上，仿佛穿越到了江户时代。金阁寺的夕阳太震撼了，站在镜湖池前完全说不出话来。', name: '旅行博主小林', avatarColor: '#0EA5E9', destination: '京都' },
      { text: '京都的美食让我念念不忘！锦市场的烤鳗鱼、抹茶冰淇淋、汤豆腐，每一样都精致又美味。一定要试试怀石料理。', name: '美食家老王', avatarColor: '#F59E0B', destination: '京都' },
    ],
  },

  // =========================== 巴厘岛 ===========================
  {
    name: '巴厘岛', slug: 'bali', region: 'overseas',
    image: pexels('33720814'),
    gallery: [
      pexels('33720814'), pexels('32763116'), pexels('32647226'),
      unsplash('1555400038-63f5ba517a47'), pexels('29614950'), unsplash('1537996194471-e657f9e71034'),
    ],
    emoji: '🏝️', gradient: 'linear-gradient(135deg, #D1FAE5 0%, #6EE7B7 50%, #34D399 100%)',
    themeColor: '#34D399',
    desc: '热带天堂，海浪与神庙、梯田与SPA编织出最治愈的假期',
    longDesc: '巴厘岛，印度尼西亚的「众神之岛」，拥有绝美的海滩、翠绿的梯田、神秘的寺庙和浓郁的艺术氛围。从库塔的冲浪天堂到乌布的文化腹地，从海神庙的壮阔日落到德格拉朗的翡翠梯田，巴厘岛用它独特的方式诠释了什么叫做度假天堂。',
    tags: ['海滨度假', '自然风光'], category: ['beach', 'nature'],
    rating: 4.9, price: 4200, bestSeason: '☀️ 夏季',
    bestTime: '4月-10月为旱季，阳光充沛，最适合旅行。7-8月为最旺季，建议提前预订。11月-3月为雨季，但阵雨通常短暂。',
    weather: '热带气候，全年 25-33°C。旱季(4-10月)晴空万里，雨季(11-3月)午后阵雨。',
    pref: ['outdoor', 'luxury'],
    highlights: [
      { name: '海神庙 (Tanah Lot)', desc: '坐落在海中的巨岩之上，退潮时可达，夕阳时分绝美', price: '60,000印尼盾', rating: 4.7, hours: '07:00-19:00', category: '海滨度假' },
      { name: '德格拉朗梯田', desc: '被联合国教科文组织列为世界遗产的翡翠梯田，绿意盎然', price: '50,000印尼盾', rating: 4.6, hours: '08:00-18:00', category: '自然体验' },
      { name: '乌布皇宫', desc: '巴厘岛传统建筑艺术的精华，夜晚有传统舞蹈表演', price: '免费', rating: 4.4, hours: '08:00-19:00', category: '历史文化' },
      { name: '库塔海滩', desc: '巴厘岛最热闹的海滩，冲浪初学者的天堂', price: '免费', rating: 4.5, hours: '全天开放', category: '海滨度假' },
      { name: '圣猴森林', desc: '乌布中心的自然保护区，数百只长尾猕猴栖息其中', price: '80,000印尼盾', rating: 4.3, hours: '08:00-18:00', category: '自然体验' },
    ],
    hotels: [
      { name: '巴厘岛阿雅娜度假村', level: '五星级', location: '金巴兰湾', price: 1800, rating: 4.9, feature: '悬崖无边泳池，网红打卡' },
      { name: '乌布嘉佩乐帐篷酒店', level: '奢华', location: '乌布', price: 3500, rating: 4.8, feature: '丛林野奢帐篷体验' },
      { name: '巴厘岛水明漾舒适民宿', level: '舒适型', location: '水明漾', price: 300, rating: 4.4, feature: '泳池别墅，高性价比' },
    ],
    foods: [
      { name: '烤乳猪饭 (Babi Guling)', desc: '巴厘岛最具代表性的传统美食，外皮酥脆肉质嫩滑', emoji: '🐖', price: '¥20-40' },
      { name: '脏鸭餐 (Bebek Bengil)', desc: '乌布特色，香酥烤鸭配以多种香料', emoji: '🦆', price: '¥30-60' },
      { name: '印尼炒饭 (Nasi Goreng)', desc: '印尼国菜，炒饭配虾片、煎蛋和沙爹串', emoji: '🍚', price: '¥15-30' },
      { name: '金巴兰海鲜烧烤', desc: '在海滩上享用新鲜捕捞的海鲜烧烤，夕阳相伴', emoji: '🦐', price: '¥80-150' },
    ],
    transportTips: '努拉莱伊机场 (DPS) 是主要入境口岸。推荐包车游(约¥200-300/天)或使用 Gojek 网约车。租摩托约¥50/天，但需要注意靠左行驶。',
    budgetRange: '经济预算 500-800元/天，舒适预算 1000-1800元/天，奢华预算 2500+元/天',
    itineraries: {
      '3日': [
        { day: 1, title: '海滩与日落', activities: [
          { time: '上午', activity: '库塔海滩', detail: '冲浪体验或海滩漫步' },
          { time: '下午', activity: '水明漾逛街', detail: '精品店、咖啡馆云集' },
          { time: '晚上', activity: '海神庙日落', detail: '最经典的巴厘岛夕阳景观' },
        ]},
        { day: 2, title: '乌布文化之旅', activities: [
          { time: '上午', activity: '德格拉朗梯田', detail: '晨间梯田云雾缭绕' },
          { time: '下午', activity: '乌布皇宫+市场', detail: '传统建筑和手工艺品' },
          { time: '晚上', activity: '传统舞蹈表演', detail: '在乌布皇宫观看巴厘岛舞蹈' },
        ]},
        { day: 3, title: '海岛探索', activities: [
          { time: '上午', activity: '蓝梦岛浮潜', detail: '水晶般清澈的海水' },
          { time: '下午', activity: '金巴兰海鲜午餐', detail: '海滩上享用海鲜大餐' },
          { time: '晚上', activity: 'SPA体验', detail: '放松身心，结束旅程' },
        ]},
      ],
    },
    reviews: [
      { text: '巴厘岛是我想象中天堂的样子！乌布的梯田太美了，在阿雅娜的无边际泳池看日落是一生难忘的体验。', name: 'SunnyLiu', avatarColor: '#10B981', destination: '巴厘岛' },
      { text: '脏鸭餐出乎意料的好吃，金巴兰的海鲜烧烤配日落堪称完美。酒店服务也超级棒！', name: '美食探险家', avatarColor: '#F59E0B', destination: '巴厘岛' },
    ],
  },

  // =========================== 瑞士 ===========================
  {
    name: '瑞士', slug: 'switzerland', region: 'overseas',
    image: pexels('34606110'),
    gallery: [
      pexels('34606110'), pexels('33705542'), pexels('32597754'),
      unsplash('1531366936336-8f68b7c9e0f0'), unsplash('1506905925346-21bda4d32df4'), unsplash('1500534623284-0bf30a442a86'),
    ],
    emoji: '⛰️', gradient: 'linear-gradient(135deg, #EFF6FF 0%, #93C5FD 50%, #60A5FA 100%)',
    themeColor: '#60A5FA',
    desc: '阿尔卑斯的雪峰与翡翠湖泊，每一帧都是壁纸般的风景',
    longDesc: '瑞士，阿尔卑斯山脚下的童话国度。少女峰的皑皑白雪、日内瓦湖的碧蓝湖面、琉森湖畔的中世纪老城、采尔马特的马特洪峰……瑞士把自然界最美的元素都糅合在了一起，每一个转角都美得像明信片。',
    tags: ['自然风光', '城市漫游'], category: ['nature', 'city'],
    rating: 4.9, price: 12000, bestSeason: '❄️ 冬季',
    bestTime: '6月-8月最适合徒步，12月-3月是滑雪旺季。春秋季(4-5月、9-10月)游客较少，票价优惠。',
    weather: '山地气候多变，夏季 15-25°C，冬季 -5-5°C。海拔每升高1000米温度下降约6°C。',
    pref: ['photo', 'outdoor'],
    highlights: [
      { name: '少女峰 (Jungfraujoch)', desc: '欧洲之巅，海拔3454米，乘坐齿轮火车登顶欣赏阿尔卑斯全景', price: '204.80瑞士法郎', rating: 4.9, hours: '08:00-17:00', category: '自然风光' },
      { name: '马特洪峰 (Matterhorn)', desc: '瑞士标志性的金字塔形山峰，采尔马特小镇是最佳观赏点', price: '缆车往返90CHF', rating: 4.8, hours: '缆车08:00-17:00', category: '自然风光' },
      { name: '琉森湖', desc: '瑞士最美湖泊之一，湖畔的卡佩尔廊桥和水塔是中世纪建筑的瑰宝', price: '免费', rating: 4.7, hours: '全天开放', category: '城市景观' },
      { name: '因特拉肯', desc: '少女峰脚下的美丽小镇，滑翔伞、游船等户外活动丰富', price: '免费', rating: 4.6, hours: '全天开放', category: '自然体验' },
      { name: '西庸城堡', desc: '日内瓦湖畔的中世纪水上城堡，拜伦曾为其写下《西庸的囚徒》', price: '12.50CHF', rating: 4.5, hours: '09:00-18:00', category: '历史文化' },
    ],
    hotels: [
      { name: '采尔马特蒙特凯尔文酒店', level: '五星级', location: '采尔马特', price: 3500, rating: 4.8, feature: '阳台正对马特洪峰' },
      { name: '因特拉肯维多利亚少女峰酒店', level: '四星级', location: '因特拉肯', price: 1800, rating: 4.7, feature: '百年历史酒店，山景房' },
      { name: '琉森青年旅舍', level: '青旅', location: '琉森', price: 350, rating: 4.3, feature: '湖景床位，经济之选' },
    ],
    foods: [
      { name: '芝士火锅 (Fondue)', desc: '瑞士国菜，融化的芝士配以面包块，冬天最暖心', emoji: '🧀', price: '¥150-250' },
      { name: '瑞士巧克力', desc: '瑞士莲、雀巢等世界顶级巧克力品牌的原产地', emoji: '🍫', price: '¥30-100' },
      { name: '烤土豆饼 (Rösti)', desc: '瑞士传统家常菜，香脆土豆丝饼，搭配各种配料', emoji: '🥔', price: '¥80-120' },
      { name: '瑞士奶酪火锅 (Raclette)', desc: '融化的奶酪刮在盘子上，配土豆和腌菜', emoji: '🧀', price: '¥120-200' },
    ],
    transportTips: '苏黎世或日内瓦国际机场入境。瑞士旅行通票(Swiss Travel Pass)3-8天，可无限乘坐火车、公交、游船，并免费进入大部分博物馆。',
    budgetRange: '瑞士消费较高，舒适预算 2000-3500元/天',
    itineraries: {
      '3日': [
        { day: 1, title: '琉森·湖光山色', activities: [
          { time: '上午', activity: '卡佩尔廊桥+水塔', detail: '琉森地标，欧洲最古老的木桥' },
          { time: '下午', activity: '琉森湖游船', detail: '在翡翠湖面上欣赏阿尔卑斯山景' },
          { time: '晚上', activity: '琉森老城漫步', detail: '中世纪建筑与特色餐厅' },
        ]},
        { day: 2, title: '因特拉肯·雪峰之旅', activities: [
          { time: '上午', activity: '少女峰登顶', detail: '欧洲之巅，感受群山之王的壮美' },
          { time: '下午', activity: '格林德瓦', detail: '梦幻山坡，瑞士最美小镇' },
          { time: '晚上', activity: '瑞士火锅晚餐', detail: '品尝正宗芝士火锅' },
        ]},
        { day: 3, title: '采尔马特·马特洪峰', activities: [
          { time: '上午', activity: '马特洪峰冰川天堂', detail: '近距离仰望金字塔山峰' },
          { time: '下午', activity: '采尔马特小镇', detail: '无汽车小镇，纯正的阿尔卑斯风情' },
          { time: '晚上', activity: '返程', detail: '从采尔马特乘火车返程' },
        ]},
      ],
    },
    reviews: [
      { text: '少女峰真的太震撼了！站在欧洲之巅俯瞰阿尔卑斯山脉，那种壮阔无法用语言形容。瑞士的火车旅行本身就是一种享受。', name: '山岳爱好者', avatarColor: '#3B82F6', destination: '瑞士' },
      { text: '马特洪峰的日出是此生见过最美的景色之一。采尔马特小镇安静又美好，每一口呼吸都是纯净的。', name: '旅行摄影师', avatarColor: '#7C3AED', destination: '瑞士' },
    ],
  },

  // =========================== 冰岛 ===========================
  {
    name: '冰岛', slug: 'iceland', region: 'overseas',
    image: pexels('33705542'),
    gallery: [
      pexels('33705542'), pexels('34606110'), pexels('28142481'),
      unsplash('1520769669658-f9b5e1e8c3d6'), unsplash('1504889444496-9b7f43a0f6e7'), unsplash('1531366936336-8f68b7c9e0f0'),
    ],
    emoji: '🌌', gradient: 'linear-gradient(135deg, #F3E8FF 0%, #C4B5FD 50%, #A78BFA 100%)',
    themeColor: '#A78BFA',
    desc: '极光、冰川、火山——地球上最不像人间的地方',
    longDesc: '冰岛，冰与火交织的奇幻国度。极光在夜空中舞动，冰川覆盖了国土的11%，火山喷发塑造了月球表面般的地貌。这里的每一处风景都仿佛来自另一个星球——黄金瀑布的轰鸣、间歇泉的喷发、黑沙滩的苍凉、蓝湖的乳蓝温泉水。',
    tags: ['自然风光'], category: ['nature'],
    rating: 4.7, price: 15000, bestSeason: '🌌 全年',
    bestTime: '9月-3月看极光的最佳季节（需晴朗无云）。6月-8月午夜阳光，适合环岛自驾看冰川、火山。',
    weather: '多变且不可预测，夏季 10-15°C，冬季 -5-5°C。常说"如果你不喜欢现在的天气，等五分钟"。',
    pref: ['photo', 'outdoor'],
    highlights: [
      { name: '黄金圈 (Golden Circle)', desc: '冰岛最经典的路线——辛格维利尔国家公园、黄金瀑布、间歇泉', price: '免费', rating: 4.8, hours: '全天开放', category: '自然风光' },
      { name: '蓝湖温泉 (Blue Lagoon)', desc: '世界闻名的地热温泉，乳蓝色的温泉水富含矿物质', price: '约600元', rating: 4.7, hours: '08:00-22:00', category: '休闲体验' },
      { name: '杰古沙龙冰河湖', desc: '冰川崩解的冰块漂浮在潟湖上，钻石般的冰晶散落在黑沙滩', price: '免费', rating: 4.9, hours: '全天开放', category: '自然风光' },
      { name: '黑沙滩 (Reynisfjara)', desc: '北大西洋的巨浪拍打着纯黑的火山岩沙滩，玄武岩柱群巍峨耸立', price: '免费', rating: 4.7, hours: '全天开放', category: '自然风光' },
      { name: '斯科加瀑布 (Skógafoss)', desc: '冰岛最壮观的瀑布之一，60米高，晴天可见双彩虹', price: '免费', rating: 4.6, hours: '全天开放', category: '自然风光' },
    ],
    hotels: [
      { name: '蓝湖硅土酒店 (Silica Hotel)', level: '五星级', location: '蓝湖', price: 3500, rating: 4.8, feature: '私人蓝湖泡池，极简设计' },
      { name: '冰岛航空维克酒店', level: '四星级', location: '维克镇', price: 1200, rating: 4.5, feature: '靠近黑沙滩，有极光叫醒服务' },
      { name: '雷克雅未克市中心青旅', level: '青旅', location: '雷克雅未克', price: 350, rating: 4.2, feature: '位置便利，含早餐' },
    ],
    foods: [
      { name: '冰岛热狗 (Pylsur)', desc: '用冰岛羊肉制成的热狗，配以炸洋葱和特制酱料，国民小吃', emoji: '🌭', price: '¥30-50' },
      { name: 'Skyr 酸奶', desc: '冰岛传统乳制品，质地浓稠更像奶酪，高蛋白低脂', emoji: '🥛', price: '¥15-25' },
      { name: '烤羊排', desc: '冰岛羊肉肉质鲜嫩，草饲自然放养，毫无膻味', emoji: '🍖', price: '¥200-350' },
      { name: '发酵鲨鱼 (Hákarl)', desc: '冰岛传统特色，挑战性美食，初尝者需勇气的独特风味', emoji: '🦈', price: '¥50-80' },
    ],
    transportTips: '凯夫拉维克国际机场 (KEF) 入境。推荐自驾环岛（1号公路约1300公里），租车约¥500-800/天。冬季不建议自驾，可选当地团。',
    budgetRange: '冰岛消费极高，舒适预算 2500-4000元/天',
    itineraries: {
      '3日': [
        { day: 1, title: '雷克雅未克+黄金圈', activities: [
          { time: '上午', activity: '辛格维利尔国家公园', detail: '欧亚与美洲板块裂缝处' },
          { time: '下午', activity: '黄金瀑布+间歇泉', detail: '冰岛最经典的自然景观' },
          { time: '晚上', activity: '蓝湖温泉', detail: '星空下的地热温泉体验' },
        ]},
        { day: 2, title: '南岸探险', activities: [
          { time: '上午', activity: '斯科加瀑布+塞里雅兰瀑布', detail: '南岸两大代表性瀑布' },
          { time: '下午', activity: '黑沙滩', detail: '世界最美的黑沙滩之一' },
          { time: '晚上', activity: '追逐极光', detail: '9月-3月可尝试极光猎游' },
        ]},
        { day: 3, title: '冰川之旅', activities: [
          { time: '上午', activity: '索尔黑马冰川徒步', detail: '冰川向导带领的冰川徒步体验' },
          { time: '下午', activity: '杰古沙龙冰河湖', detail: '钻石冰沙滩和水陆两栖船' },
          { time: '晚上', activity: '返程雷克雅未克', detail: '途经维克镇稍作停留' },
        ]},
      ],
    },
    reviews: [
      { text: '冰岛是我去过最不像地球的地方！杰古沙龙冰河湖的浮冰在黑沙滩上闪闪发光，就像钻石一样。极光更是此生必看！', name: '极光追逐者', avatarColor: '#EC4899', destination: '冰岛' },
      { text: '自驾环岛12天，每天都像在另一个星球。蓝湖泡温泉的时候还下着小雪，那种冰火两重天的体验太奇妙了。', name: '环岛自驾客', avatarColor: '#0EA5E9', destination: '冰岛' },
    ],
  },

  // =========================== 大理 ===========================
  {
    name: '大理', slug: 'dali', region: 'domestic',
    image: pexels('33970874'),
    gallery: [
      pexels('33970874'), pexels('33003672'), pexels('32660201'),
      unsplash('1506942520564-5a0c1a8f3c51'), unsplash('1528129492986-6a1b0e68211a'), unsplash('1504384308090-c894fdcc538d'),
    ],
    emoji: '☁️', gradient: 'linear-gradient(135deg, #E0F2FE 0%, #7DD3FC 50%, #38BDF8 100%)',
    themeColor: '#38BDF8',
    desc: '苍山洱海间的风花雪月，文艺青年的精神故乡',
    longDesc: '大理，一个让人来了就不想走的地方。苍山十九峰连绵如屏，洱海碧波万顷倒映云天，古城里的民谣和咖啡香飘散在每一个角落。在下关的风、上关的花、苍山的雪、洱海的月中，大理把「风花雪月」四个字诠释得淋漓尽致。',
    tags: ['自然风光', '城市漫游'], category: ['nature', 'city'],
    rating: 4.6, price: 2500, bestSeason: '🌸 春季',
    bestTime: '3月-5月春光明媚，洱海边的油菜花和樱花盛开。9月-11月秋高气爽。夏季(6-8月)为雨季但洱海最美。',
    weather: '高原季风气候，年均温 15°C。昼夜温差大，夏季 18-25°C，冬季 5-15°C。紫外线强，注意防晒。',
    pref: ['photo', 'foodie'],
    highlights: [
      { name: '洱海', desc: '云南第二大高原淡水湖，环湖130公里，骑行是最佳游览方式', price: '免费', rating: 4.8, hours: '全天开放', category: '自然风光' },
      { name: '大理古城', desc: '1200年历史的南诏古都，人民路的酒吧和复兴路的扎染一条街', price: '免费', rating: 4.5, hours: '全天开放', category: '城市景观' },
      { name: '苍山', desc: '十九峰十八溪，乘坐洗马潭索道可登顶俯瞰洱海全景', price: '索道往返120元', rating: 4.6, hours: '08:00-17:00', category: '自然风光' },
      { name: '崇圣寺三塔', desc: '大理的标志和象征，三座古塔历经千年风雨仍巍然屹立', price: '75元', rating: 4.5, hours: '08:00-18:00', category: '历史文化' },
      { name: '喜洲古镇', desc: '白族民居建筑的博物馆，保留完整的老街和转角楼', price: '免费', rating: 4.4, hours: '全天开放', category: '城市景观' },
    ],
    hotels: [
      { name: '大理拾山房精品酒店', level: '精品民宿', location: '古城南门', price: 680, rating: 4.7, feature: '苍山景观，设计感十足' },
      { name: '大理洱海天域英迪格', level: '五星级', location: '洱海畔', price: 1200, rating: 4.6, feature: '洱海全景，无边泳池' },
      { name: '大理古城青旅·驼峰客栈', level: '青旅', location: '古城人民路', price: 60, rating: 4.3, feature: '背包客天堂，氛围极佳' },
    ],
    foods: [
      { name: '大理酸辣鱼', desc: '洱海鲜鱼配以酸木瓜和辣椒，酸辣鲜香', emoji: '🐟', price: '¥40-80' },
      { name: '烤乳扇', desc: '大理特色小吃，牛奶制成的薄片烤至金黄，涂上玫瑰酱', emoji: '🥛', price: '¥5-10' },
      { name: '野生菌火锅', desc: '云南最著名的美食，各种野生菌熬制的鲜美汤底', emoji: '🍄', price: '¥80-150' },
      { name: '大理砂锅鱼', desc: '用洱海鲜鱼、火腿、豆腐等食材炖制的砂锅美味', emoji: '🍲', price: '¥50-90' },
      { name: '喜洲粑粑', desc: '喜洲古镇的传统烤饼，外酥里软，有甜咸两种口味', emoji: '🫓', price: '¥5-10' },
    ],
    transportTips: '大理机场有直达古城的大巴(¥25)。也可飞昆明后乘高铁至大理站(约2小时)。古城内主要靠步行或租电瓶车(¥40-60/天)。',
    budgetRange: '经济预算 300-500元/天，舒适预算 600-1000元/天',
    itineraries: {
      '3日': [
        { day: 1, title: '古城漫游', activities: [
          { time: '上午', activity: '大理古城散步', detail: '人民路、复兴街、洋人街' },
          { time: '下午', activity: '崇圣寺三塔', detail: '大理地标千年古塔' },
          { time: '晚上', activity: '古城民谣酒吧', detail: '听一首《去大理》' },
        ]},
        { day: 2, title: '洱海环湖', activities: [
          { time: '上午', activity: '才村码头日出', detail: '洱海日出美不胜收' },
          { time: '下午', activity: '喜洲古镇', detail: '白族民居建筑群' },
          { time: '晚上', activity: '双廊古镇', detail: '洱海东岸最美小镇' },
        ]},
        { day: 3, title: '苍山·云之旅', activities: [
          { time: '上午', activity: '苍山洗马潭索道', detail: '登顶俯瞰洱海全景' },
          { time: '下午', activity: '寂照庵', detail: '最美尼姑庵，多肉植物花园' },
          { time: '晚上', activity: '大理砂锅鱼晚餐', detail: '品尝地道大理美食' },
        ]},
      ],
    },
    reviews: [
      { text: '在大理住了半个月都不想走。每天骑电瓶车环洱海，风吹过耳边的时候觉得人生太美好了。喜洲的破酥粑粑也太好吃了！', name: '自由旅行者', avatarColor: '#10B981', destination: '大理' },
      { text: '苍山洱海的美不是照片能拍出来的，得亲眼去看。早晨在才村码头看日出，苍山的雪在阳光下闪着金光，美到让人落泪。', name: '追风少女', avatarColor: '#EC4899', destination: '大理' },
    ],
  },

  // =========================== 东京 ===========================
  {
    name: '东京', slug: 'tokyo', region: 'overseas',
    image: pexels('18848537'),
    gallery: [
      pexels('18848537'), pexels('32213469'), pexels('32597754'),
      unsplash('1540959733332-eab44e6b7b9b'), unsplash('1503899036084-c55cdd92da26'), unsplash('1536098561742-ca998e48cbcc'),
    ],
    emoji: '🗼', gradient: 'linear-gradient(135deg, #FCE7F3 0%, #F472B6 50%, #EC4899 100%)',
    themeColor: '#EC4899',
    desc: '赛博朋克与江户风情的碰撞，永不熄灭的城市灯火',
    longDesc: '东京，一座让人永远探索不完的城市。在涩谷的十字路口感受人潮涌动，在浅草寺的香火中触摸江户余韵，在秋叶原的霓虹里看见未来世界。从米其林三星到街角拉面摊，从明治神宫的森严到原宿的奇装异服，东京把所有矛盾都变成了魅力。',
    tags: ['城市漫游', '美食之旅', '文化历史'], category: ['city', 'food', 'culture'],
    rating: 4.8, price: 6500, bestSeason: '🌸 春季',
    bestTime: '3月下旬-4月上旬樱花季最美。秋季(10-11月)红叶季也极佳。夏季(6-8月)炎热潮湿但有花火大会。',
    weather: '四季分明，春季 10-20°C，夏季 25-35°C 湿热，秋季 15-25°C，冬季 0-10°C。',
    pref: ['foodie', 'culture'],
    // 使用后端 TravelDataService 的真实数据
    highlights: [
      { name: '浅草寺', desc: '东京最古老的寺庙，雷门和仲见世商店街是不可错过的体验', price: '免费', rating: 4.6, hours: '06:00-17:00', category: '历史文化' },
      { name: '东京塔', desc: '东京地标建筑，在150米和250米处设有展望台可俯瞰东京全景', price: '1200日元', rating: 4.5, hours: '09:00-23:00', category: '城市景观' },
      { name: '秋叶原', desc: '世界知名的电器街与动漫二次元文化圣地，女仆咖啡厅和动漫店林立', price: '免费', rating: 4.7, hours: '全天开放', category: '美食购物' },
      { name: '东京迪士尼乐园', desc: '亚洲第一座迪士尼主题公园，童话与梦想的王国', price: '8400日元', rating: 4.8, hours: '08:00-22:00', category: '主题乐园' },
      { name: '涩谷', desc: '时尚潮流发源地，世界上最繁忙的十字路口，年轻文化的中心', price: '免费', rating: 4.5, hours: '全天开放', category: '美食购物' },
      { name: '上野公园', desc: '赏樱名所，拥有上野动物园、国立博物馆等众多文化设施', price: '免费', rating: 4.4, hours: '全天开放', category: '园林自然' },
    ],
    hotels: [
      { name: '东京半岛酒店', level: '五星级', location: '银座', price: 3500, rating: 4.8, feature: '顶级奢华' },
      { name: '新宿格兰贝尔酒店', level: '舒适型', location: '新宿', price: 800, rating: 4.4, feature: '交通便利' },
      { name: '东京安心民宿', level: '民宿', location: '浅草', price: 400, rating: 4.3, feature: '日式体验' },
    ],
    foods: [
      { name: '寿司大·银座本店', desc: '东京最负盛名的寿司店之一，新鲜食材搭配匠人技艺', emoji: '🍣', price: '¥300-1000' },
      { name: '一兰拉面', desc: '博多豚骨拉面的代表，个性化定制汤底和面条硬度', emoji: '🍜', price: '¥50-80' },
      { name: '筑地市场海鲜丼', desc: '新鲜捕捞的海鲜盖饭，金枪鱼、海胆、甜虾的盛宴', emoji: '🦐', price: '¥80-150' },
      { name: '天妇罗·深町', desc: '米其林一星天妇罗专门店，酥脆轻盈的炸物艺术', emoji: '🍤', price: '¥200-400' },
      { name: '章鱼烧·银座', desc: '东京街头小吃的代表，外酥内软的章鱼小丸子', emoji: '🐙', price: '¥20-40' },
    ],
    transportTips: '成田(NRT)或羽田(HND)机场。西瓜卡(Suica)可乘坐所有地铁和JR，非常方便。地铁一日券(600日元)经济实惠。',
    budgetRange: '经济预算 600-1000元/天，舒适预算 1500-3000元/天',
    itineraries: {
      '3日': [
        { day: 1, title: '经典东京·古今交错', activities: [
          { time: '上午', activity: '浅草寺+仲见世通', detail: '感受东京的江户风韵' },
          { time: '下午', activity: '天空树', detail: '世界最高电波塔，俯瞰东京全貌' },
          { time: '晚上', activity: '秋叶原', detail: '二次元圣地和电器天堂' },
        ]},
        { day: 2, title: '潮流中心·时尚巡礼', activities: [
          { time: '上午', activity: '明治神宫', detail: '东京最大神社，森林中的宁静' },
          { time: '下午', activity: '涩谷+原宿', detail: '潮流文化发祥地' },
          { time: '晚上', activity: '六本木展望台', detail: '东京塔夜景，一次性尽收眼底' },
        ]},
        { day: 3, title: '美食与休闲', activities: [
          { time: '上午', activity: '筑地市场', detail: '品尝最新鲜的寿司和海鲜丼' },
          { time: '下午', activity: '银座逛街', detail: '高端购物区，建筑本身也是一道风景' },
          { time: '晚上', activity: '新宿歌舞伎町', detail: '东京不夜城，体验居酒屋文化' },
        ]},
      ],
    },
    reviews: [
      { text: '东京是一座让人猝不及防爱上的城市。从浅草寺的古老宁静到涩谷十字路口的人潮涌动，每个转角都有惊喜。筑地市场的海鲜丼是我吃过最新鲜的！', name: '旅行美食家', avatarColor: '#EC4899', destination: '东京' },
      { text: '已经去了三次东京，每次都发现新的惊喜。秋叶原的漫画店能逛一整天，六本木的夜景百看不厌。东京大概是世界上最适合独自旅行的城市。', name: '二次元旅人', avatarColor: '#7C3AED', destination: '东京' },
    ],
  },

  // =========================== 圣托里尼 ===========================
  {
    name: '圣托里尼', slug: 'santorini', region: 'overseas',
    image: pexels('18774900'),
    gallery: [
      pexels('18774900'), pexels('29614950'), pexels('33720814'),
      unsplash('1570077188670-e3a8d69ac5ff'), unsplash('1613395877344-13d4a8e0d49e'), unsplash('1533105079780-92b9be482077'),
    ],
    emoji: '🏘️', gradient: 'linear-gradient(135deg, #F0F9FF 0%, #BAE6FD 50%, #7DD3FC 100%)',
    themeColor: '#7DD3FC',
    desc: '蓝白相间的童话小镇，爱琴海上的一颗明珠',
    longDesc: '圣托里尼，爱琴海上最耀眼的那颗明珠。蓝顶白墙的教堂、悬崖上层层叠叠的小屋、世界上最美的日落——这里的一切都像从明信片里走出来的一样。在伊亚小镇等待日落的那一刻，全世界的情侣都在这里拥抱接吻，因为这里的美值得一个吻。',
    tags: ['海滨度假', '城市漫游'], category: ['beach', 'city'],
    rating: 4.9, price: 9800, bestSeason: '☀️ 夏季',
    bestTime: '6月-9月为最佳旅行季节，天气晴朗，海水温暖。7-8月最旺但物价高。5月和10月人少且气候宜人。',
    weather: '地中海气候，夏季 25-35°C 晴空万里，冬季 10-15°C 温和多雨。',
    pref: ['photo', 'luxury'],
    highlights: [
      { name: '伊亚小镇 (Oia)', desc: '圣托里尼最著名的蓝顶教堂所在地，拥有世界最美日落观景点', price: '免费', rating: 4.9, hours: '全天开放', category: '城市景观' },
      { name: '费拉小镇 (Fira)', desc: '圣托里尼的首府，悬崖步道从费拉一直延伸到伊亚', price: '免费', rating: 4.6, hours: '全天开放', category: '城市景观' },
      { name: '红沙滩', desc: '火山岩形成的独特红色沙滩，碧海红岩形成强烈视觉对比', price: '免费', rating: 4.5, hours: '全天开放', category: '海滨度假' },
      { name: '阿克罗蒂里遗址', desc: '3500年前米诺斯文明的古城遗址，被火山灰掩埋至今保存完好', price: '12欧元', rating: 4.4, hours: '08:00-17:00', category: '历史文化' },
      { name: '火山岛探险', desc: '乘船前往纳亚卡梅尼火山岛，感受活火山的硫磺蒸汽和泥浆温泉', price: '约350元', rating: 4.6, hours: '半日游', category: '自然体验' },
    ],
    hotels: [
      { name: '圣托里尼格雷斯酒店', level: '五星级', location: '伊亚', price: 4500, rating: 4.9, feature: '悬崖泳池，无敌海景' },
      { name: '圣托里尼悬崖洞穴酒店', level: '特色', location: '费拉', price: 1800, rating: 4.7, feature: '传统洞穴改造的精品酒店' },
      { name: '费拉市中心家庭旅馆', level: '民宿', location: '费拉', price: 500, rating: 4.3, feature: '性价比高，位置便利' },
    ],
    foods: [
      { name: '希腊沙拉', desc: '新鲜番茄、黄瓜、橄榄、菲达芝士的经典组合，地中海的味道', emoji: '🥗', price: '¥50-80' },
      { name: '穆萨卡 (Moussaka)', desc: '希腊国菜，以茄子、肉酱和白酱层层叠加烤制', emoji: '🥘', price: '¥80-120' },
      { name: '烤章鱼', desc: '爱琴海的新鲜章鱼在炭火上烤至焦香，配以柠檬和橄榄油', emoji: '🐙', price: '¥100-150' },
      { name: '希腊酸奶配蜂蜜', desc: '浓稠醇厚的希腊酸奶淋上当地蜂蜜和核桃，最健康的甜品', emoji: '🍯', price: '¥30-50' },
    ],
    transportTips: '圣托里尼机场(JTR)有从雅典和欧洲主要城市的直达航班。岛上交通以租车(约¥300-500/天)、ATV或公交为主。建议租ATV游览更自由。',
    budgetRange: '舒适预算 1500-3000元/天，奢华预算 4000+元/天',
    itineraries: {
      '3日': [
        { day: 1, title: '伊亚·蓝色童话', activities: [
          { time: '上午', activity: '伊亚小镇漫步', detail: '探索蓝顶教堂和白色小屋' },
          { time: '下午', activity: '伊亚城堡', detail: '占据最佳日落观景点' },
          { time: '晚上', activity: '伊亚日落', detail: '世界上最美的日落' },
        ]},
        { day: 2, title: '海岛探索', activities: [
          { time: '上午', activity: '火山岛乘船游', detail: '参观活火山和温泉' },
          { time: '下午', activity: '红沙滩+黑沙滩', detail: '独特的火山岩海滩' },
          { time: '晚上', activity: '费拉悬崖晚餐', detail: '悬崖餐厅享受爱琴海美食' },
        ]},
        { day: 3, title: '酒庄与海岸', activities: [
          { time: '上午', activity: '圣托里尼酒庄', detail: '品尝火山土酿造的特色葡萄酒' },
          { time: '下午', activity: '皮尔戈斯小镇', detail: '圣托里尼最高点，全景视野' },
          { time: '晚上', activity: '费拉步道日落散步', detail: '沿着悬崖步道感受最后的海风' },
        ]},
      ],
    },
    reviews: [
      { text: '圣托里尼的日落真的可以让人哭。当太阳沉入爱琴海的那一刻，整个天空变成紫色和金色，伊亚的蓝顶教堂在暮色中美得不真实。', name: '蜜月旅行者', avatarColor: '#EC4899', destination: '圣托里尼' },
      { text: '蓝顶白墙、碧海蓝天，圣托里尼满足了我对浪漫的所有幻想。悬崖酒店的无边泳池看日出，这辈子最奢侈的享受。', name: '海岛控Lisa', avatarColor: '#0EA5E9', destination: '圣托里尼' },
    ],
  },

  // =========================== 清迈 ===========================
  {
    name: '清迈', slug: 'chiangmai', region: 'overseas',
    image: pexels('32763116'),
    gallery: [
      pexels('32763116'), pexels('33720814'), pexels('33202938'),
      unsplash('1596464716836-f1e7e2f5a0f2'), unsplash('1566587495010-e14d0e9eb09c'), unsplash('1541959830-4d7c8d7e7a5d'),
    ],
    emoji: '🛕', gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FCD34D 50%, #FBBF24 100%)',
    themeColor: '#FBBF24',
    desc: '泰北玫瑰，古城寺庙与森林大象的慢生活',
    longDesc: '清迈，泰北的玫瑰之城。古城里300多座寺庙的金色佛塔在阳光下熠熠生辉，素贴山的双龙寺俯瞰着整个清迈盆地。这里没有曼谷的喧嚣，取而代之的是咖啡馆里慵懒的午后、夜市上飘香的烤肉、山林间与大象共处的治愈时光。',
    tags: ['文化历史', '美食之旅', '自然风光'], category: ['culture', 'food', 'nature'],
    rating: 4.7, price: 2800, bestSeason: '☀️ 夏季',
    bestTime: '11月-2月为凉季，气候宜人。4月泼水节是清迈最热闹的时候。3-5月炎热，6-10月为雨季但游客少。',
    weather: '热带气候，凉季 15-30°C，热季 25-40°C，雨季 25-35°C 午后常有阵雨。',
    pref: ['foodie', 'culture'],
    highlights: [
      { name: '双龙寺 (素贴山)', desc: '清迈最著名的寺庙，位于素贴山顶，金色佛塔在阳光中熠熠生辉', price: '免费', rating: 4.7, hours: '06:00-20:00', category: '历史文化' },
      { name: '清迈古城', desc: '四方古城内300多座寺庙，塔佩门、契迪龙寺、帕辛寺是必访之地', price: '免费', rating: 4.6, hours: '全天开放', category: '历史文化' },
      { name: '大象自然公园', desc: '救助受伤和退役大象的庇护所，可以给大象喂食、洗澡', price: '约250元', rating: 4.8, hours: '需预约半日/全日', category: '自然体验' },
      { name: '清迈夜市', desc: '泰国最著名的夜市之一，手工艺品、服饰和美食琳琅满目', price: '免费', rating: 4.5, hours: '17:00-23:00', category: '美食购物' },
      { name: '因他农山国家公园', desc: '泰国最高峰，云雾缭绕的山顶和壮观的瀑布', price: '300泰铢', rating: 4.5, hours: '06:00-18:00', category: '自然风光' },
    ],
    hotels: [
      { name: '清迈四季度假酒店', level: '五星级', location: '湄林谷', price: 2500, rating: 4.8, feature: '稻田景观无边泳池' },
      { name: '清迈古城精品酒店', level: '四星级', location: '古城内', price: 600, rating: 4.6, feature: '兰纳风格，步行至塔佩门' },
      { name: '清迈青旅·绿虎', level: '青旅', location: '古城内', price: 50, rating: 4.4, feature: '背包客首选，社交氛围好' },
    ],
    foods: [
      { name: '泰北咖喱面 (Khao Soi)', desc: '清迈最具代表性的美食，咖喱汤底配以炸脆面和炖鸡肉', emoji: '🍜', price: '¥15-25' },
      { name: '芒果糯米饭', desc: '泰国国民甜品，香甜芒果配以椰奶糯米', emoji: '🥭', price: '¥10-20' },
      { name: '泰式炒河粉 (Pad Thai)', desc: '泰国最著名的街头小吃，酸甜可口', emoji: '🍝', price: '¥10-20' },
      { name: '清迈烤肠 (Sai Ua)', desc: '泰北特色香肠，用多种香料和猪肉制成，烤至外焦里嫩', emoji: '🌭', price: '¥8-15' },
    ],
    transportTips: '清迈国际机场(CNX)有从国内多个城市直达航班。古城内可步行或骑自行车，双条车(红色小巴)在城内统一定价20-30泰铢。',
    budgetRange: '经济预算 200-400元/天，舒适预算 500-1000元/天',
    itineraries: {
      '3日': [
        { day: 1, title: '古城佛寺巡礼', activities: [
          { time: '上午', activity: '契迪龙寺+帕辛寺', detail: '古城内最重要的两座寺庙' },
          { time: '下午', activity: '塔佩门+古城漫步', detail: '喂鸽子，喝咖啡' },
          { time: '晚上', activity: '周日夜市', detail: '世界最大夜市之一（仅周日）' },
        ]},
        { day: 2, title: '山与象的遇见', activities: [
          { time: '上午', activity: '素贴山双龙寺', detail: '俯瞰清迈全景' },
          { time: '下午', activity: '大象自然公园', detail: '与大象亲密互动' },
          { time: '晚上', activity: '清迈夜市', detail: '美食和手工艺品' },
        ]},
        { day: 3, title: '泰北文化体验', activities: [
          { time: '上午', activity: '泰式料理课', detail: '学做三道经典泰国菜' },
          { time: '下午', activity: '清迈艺术村', detail: '文艺创意街区' },
          { time: '晚上', activity: '泰式按摩', detail: '放松身心结束旅程' },
        ]},
      ],
    },
    reviews: [
      { text: '清迈是全世界最适合慢生活的地方。在古城的小巷子里喝咖啡、逛寺庙、做按摩，每一天都过得很慢很舒服。大象自然公园的体验让我哭了三次。', name: '慢生活家', avatarColor: '#10B981', destination: '清迈' },
      { text: '泰北咖喱面太好吃了！为了这碗面我都想留在清迈。周日夜市也太好逛了，从手工艺品到街头美食，三个小时根本不够。', name: '小吃货', avatarColor: '#F59E0B', destination: '清迈' },
    ],
  },

  // =========================== 巴黎 ===========================
  {
    name: '巴黎', slug: 'paris', region: 'overseas',
    image: pexels('32597754'),
    gallery: [
      pexels('32597754'), pexels('18848537'), pexels('29614950'),
      unsplash('1502602898657-3e91760cbb34'), unsplash('1499856871958-5b9627545d1a'), unsplash('1550340499-a6c60fc8287c'),
    ],
    emoji: '🥐', gradient: 'linear-gradient(135deg, #FFF1F2 0%, #FDA4AF 50%, #FB7185 100%)',
    themeColor: '#FB7185',
    desc: '浪漫之都，艺术、时尚与美食的永恒盛宴',
    longDesc: '巴黎，世界上最美妙的城市。埃菲尔铁塔的灯光在每个整点闪烁，卢浮宫里的蒙娜丽莎对每天数万游客微笑，塞纳河畔的旧书摊和咖啡座是这座城市最迷人的风景。从蒙马特高地的画家到香榭丽舍大道的时尚，巴黎把浪漫刻在了每一块石砖里。',
    tags: ['城市漫游', '美食之旅', '文化历史'], category: ['city', 'food', 'culture'],
    rating: 4.8, price: 11000, bestSeason: '🌸 春季',
    bestTime: '4月-6月和9月-10月是巴黎最美的季节。7-8月是旅游旺季但很多巴黎人外出度假。12月的圣诞装饰非常浪漫。',
    weather: '温带海洋性气候，春季 8-18°C，夏季 15-28°C，秋季 8-20°C，冬季 2-8°C。',
    pref: ['foodie', 'luxury', 'photo'],
    highlights: [
      { name: '埃菲尔铁塔', desc: '法国最著名的地标，324米高的钢铁巨人在每个整点闪�的', price: '25欧元', rating: 4.8, hours: '09:00-23:45', category: '城市景观' },
      { name: '卢浮宫', desc: '世界最大的艺术博物馆，收藏了蒙娜丽莎、维纳斯等无数艺术珍宝', price: '17欧元', rating: 4.9, hours: '09:00-18:00', category: '艺术文创' },
      { name: '巴黎圣母院', desc: '哥特式建筑的杰作，雨果笔下钟楼怪人的故事发生地', price: '免费', rating: 4.7, hours: '08:00-18:45', category: '历史文化' },
      { name: '香榭丽舍大街', desc: '被誉为世界最美的大道，从凯旋门延伸到协和广场', price: '免费', rating: 4.6, hours: '全天开放', category: '美食购物' },
      { name: '凡尔赛宫', desc: '法国王室宫殿的巅峰之作，镜厅和后花园极尽奢华', price: '20欧元', rating: 4.7, hours: '09:00-17:30', category: '历史文化' },
      { name: '蒙马特高地', desc: '艺术家聚集地，圣心大教堂前俯瞰巴黎全景', price: '免费', rating: 4.5, hours: '全天开放', category: '艺术文创' },
    ],
    hotels: [
      { name: '巴黎丽兹酒店', level: '五星级', location: '旺多姆广场', price: 5000, rating: 4.9, feature: '传奇奢华' },
      { name: '巴黎铂尔曼埃菲尔铁塔店', level: '四星级', location: '埃菲尔铁塔附近', price: 1500, rating: 4.5, feature: '铁塔景观' },
      { name: '宜必思蒙马特店', level: '经济型', location: '蒙马特', price: 500, rating: 4.0, feature: '性价比之选' },
    ],
    foods: [
      { name: '可颂面包', desc: '巴黎人早餐的灵魂，外层酥脆内层柔软，配一杯咖啡就是完美的早晨', emoji: '🥐', price: '¥10-20' },
      { name: '法式焗蜗牛', desc: '法餐的经典前菜，蜗牛配以蒜香黄油和欧芹', emoji: '🐌', price: '¥80-150' },
      { name: '鹅肝', desc: '法餐最奢华的前菜，细腻柔滑入口即化', emoji: '🦆', price: '¥150-300' },
      { name: '马卡龙', desc: '巴黎最具代表性的甜点，Ladurée和Pierre Hermé是最知名的品牌', emoji: '🍪', price: '¥15-25/个' },
      { name: '塞纳河畔小酒馆', desc: '在塞纳河畔的小酒馆里品尝红酒和奶酪拼盘，巴黎人的日常', emoji: '🍷', price: '¥150-300' },
    ],
    transportTips: '戴高乐机场(CDG)乘坐RER B线到市中心。巴黎地铁系统覆盖全城，单程1.90欧元。推荐10次卡(carnet)更划算。',
    budgetRange: '舒适预算 2000-4000元/天，奢华预算 5000+元/天',
    itineraries: {
      '3日': [
        { day: 1, title: '经典巴黎·城市地标', activities: [
          { time: '上午', activity: '埃菲尔铁塔', detail: '登顶俯瞰巴黎' },
          { time: '下午', activity: '香榭丽舍大街+凯旋门', detail: '漫步最美大道' },
          { time: '晚上', activity: '塞纳河游船', detail: '夜游巴黎，桥梁灯光璀璨' },
        ]},
        { day: 2, title: '艺术与历史', activities: [
          { time: '上午', activity: '卢浮宫', detail: '世界最大博物馆' },
          { time: '下午', activity: '巴黎圣母院+拉丁区', detail: '哥特建筑和左岸文化' },
          { time: '晚上', activity: '蒙马特高地', detail: '圣心大教堂前看日落' },
        ]},
        { day: 3, title: '皇家奢华', activities: [
          { time: '上午', activity: '凡尔赛宫', detail: '法国王室的极致奢华' },
          { time: '下午', activity: '玛黑区逛街', detail: '巴黎最潮街区' },
          { time: '晚上', activity: '红磨坊表演', detail: '巴黎夜生活的标志' },
        ]},
      ],
    },
    reviews: [
      { text: '巴黎是我心中永远不会厌倦的城市。在蒙马特看日落的时候，整个城市笼罩在金色的光芒里，圣心大教堂在夕阳下像一座白色的城堡。', name: '浪漫旅人', avatarColor: '#FB7185', destination: '巴黎' },
      { text: '卢浮宫待了一整天还是不够，蒙娜丽莎前排满了人。不过最让我惊喜的是巴黎街头的可颂，每一个都酥脆得掉渣。', name: '艺术爱好者', avatarColor: '#7C3AED', destination: '巴黎' },
    ],
  },

  // =========================== 马尔代夫 ===========================
  {
    name: '马尔代夫', slug: 'maldives', region: 'overseas',
    image: pexels('29614950'),
    gallery: [
      pexels('29614950'), pexels('33720814'), pexels('18774900'),
      unsplash('1573843981267-be1999ffa1b0'), unsplash('1514282401047-d79a71a590e8'), unsplash('1560185890-c8b9c3daf3db'),
    ],
    emoji: '🌊', gradient: 'linear-gradient(135deg, #CCFBF1 0%, #5EEAD4 50%, #2DD4BF 100%)',
    themeColor: '#2DD4BF',
    desc: '印度洋上的天堂，水屋、珊瑚礁与无尽蔚蓝',
    longDesc: '马尔代夫，地球上最后的天堂。1190个珊瑚岛像珍珠一样散落在印度洋上，海水清透到可以看到海底的珊瑚和游鱼。住在水屋里推门就能跳入碧蓝的海水，在私人沙滩上享用早餐，在星空下的甲板上入眠。这里是全世界最接近天堂的地方。',
    tags: ['海滨度假', '自然风光'], category: ['beach', 'nature'],
    rating: 4.9, price: 15000, bestSeason: '☀️ 夏季',
    bestTime: '11月-4月为干季，阳光充沛，是最佳季节。5月-10月为雨季，但雨量不大且价格更优惠。',
    weather: '热带海洋性气候，全年 26-32°C，湿度较大。',
    pref: ['luxury', 'outdoor'],
    highlights: [
      { name: '水上别墅体验', desc: '马尔代夫最具特色的住宿体验，从房间直接跳入清澈的海水', price: '包含在房费', rating: 4.9, hours: '全天', category: '休闲体验' },
      { name: '珊瑚礁浮潜', desc: '在马尔代夫的水下世界与五彩缤纷的热带鱼和珊瑚共游', price: '约300元', rating: 4.8, hours: '全天', category: '海滨度假' },
      { name: '出海观海豚', desc: '乘船出海追踪野生海豚群，看它们在夕阳中跃出水面', price: '约500元', rating: 4.7, hours: '傍晚', category: '自然体验' },
      { name: '落日垂钓', desc: '传统的马尔代夫夜钓体验，钓上来的鱼可以做成晚餐', price: '约400元', rating: 4.5, hours: '傍晚', category: '休闲体验' },
      { name: '马累探索', desc: '马尔代夫首都，参观古清真寺、鱼市场和当地市集', price: '免费', rating: 4.3, hours: '半日', category: '城市景观' },
    ],
    hotels: [
      { name: 'Soneva Jani 水上度假村', level: '奢华', location: 'Noonu Atoll', price: 8000, rating: 4.9, feature: '水上滑梯别墅，星空天窗' },
      { name: '马尔代夫安纳塔拉', level: '五星级', location: '南马累环礁', price: 3500, rating: 4.7, feature: '水屋与沙屋可选，SPA一流' },
      { name: '居民岛经济民宿', level: '民宿', location: 'Maafushi岛', price: 300, rating: 4.2, feature: '体验当地生活，超平价' },
    ],
    foods: [
      { name: '马尔代夫鱼汤 (Garudhiya)', desc: '当地传统鱼汤，用新鲜金枪鱼熬制，配以椰子、辣椒和青柠', emoji: '🐟', price: '包含在餐费' },
      { name: '马尔代夫烧烤', desc: '在沙滩上享用现烤的海鲜和肉类，星空下的晚餐', emoji: '🔥', price: '约¥200-400' },
      { name: '椰子糯米饭', desc: '用椰奶蒸制的糯米，香甜软糯，当地传统主食', emoji: '🥥', price: '约¥30-50' },
      { name: '印度洋龙虾', desc: '马尔代夫海域的龙虾肉质鲜甜，最简单的炭烤就足够美味', emoji: '🦞', price: '约¥300-600' },
    ],
    transportTips: '马累国际机场(MLE)是唯一入境口岸。从机场到度假村需乘坐快艇(20-60分钟)或水上飞机(15-45分钟)，由度假村安排接送。',
    budgetRange: '奢华度假 4000-15000元/天（含全包），经济民宿 500-1000元/天',
    itineraries: {
      '3日': [
        { day: 1, title: '抵达天堂', activities: [
          { time: '上午', activity: '抵达马累+上岛', detail: '快艇或水上飞机前往度假村' },
          { time: '下午', activity: '水上别墅入住', detail: '安顿下来，享受房间的海景' },
          { time: '晚上', activity: '沙滩日落鸡尾酒', detail: '马尔代夫的第一天' },
        ]},
        { day: 2, title: '海洋探索', activities: [
          { time: '上午', activity: '珊瑚礁浮潜', detail: '探索马尔代夫的海底世界' },
          { time: '下午', activity: '出海观海豚', detail: '追寻海豚的踪迹' },
          { time: '晚上', activity: '沙滩BBQ晚餐', detail: '星光下的烧烤大餐' },
        ]},
        { day: 3, title: '最后的时光', activities: [
          { time: '上午', activity: 'SPA水疗', detail: '放松身心' },
          { time: '下午', activity: '水上活动', detail: '皮划艇、帆板等' },
          { time: '晚上', activity: '返程', detail: '带着最美的回忆离开' },
        ]},
      ],
    },
    reviews: [
      { text: '马尔代夫的水上别墅是我住过最震撼的酒店！早上醒来推开窗户就是碧蓝的海水，直接跳下去浮潜。晚上的星空更是美到窒息。', name: '海岛女王', avatarColor: '#2DD4BF', destination: '马尔代夫' },
      { text: '在马尔代夫看了一场海上日落，整个人都被治愈了。沙滩细腻得像面粉，海水清透得像玻璃。虽然贵但一生必去一次。', name: '蜜月新娘', avatarColor: '#EC4899', destination: '马尔代夫' },
    ],
  },

  // =========================== 成都 ===========================
  {
    name: '成都', slug: 'chengdu', region: 'domestic',
    image: pexels('33855530'),
    gallery: [
      pexels('33855530'), pexels('32660201'), pexels('33003672'),
      unsplash('1600181853882-f4b6ee3ada15'), unsplash('1583206398261-48b3b4fa5f32'), unsplash('1617195735954-5ed3e1befec2'),
    ],
    emoji: '🐼', gradient: 'linear-gradient(135deg, #FEE2E2 0%, #FCA5A5 50%, #F87171 100%)',
    themeColor: '#F87171',
    desc: '火锅飘香的城市，熊猫故乡的巴适生活',
    longDesc: '成都，一座来了就不想走的城市。火锅的香气弥漫在每一个角落，熊猫在繁育基地里慵懒地啃竹子，宽窄巷子的茶馆里摆龙门阵的声音此起彼伏。成都人把「巴适」这种生活态度发挥到了极致——慢悠悠地喝茶、搓麻将、吃火锅，日子过得比蜜还甜。',
    tags: ['美食之旅', '城市漫游', '文化历史'], category: ['food', 'city', 'culture'],
    rating: 4.7, price: 2000, bestSeason: '🍂 秋季',
    bestTime: '3月-5月和9月-11月气候最舒适。冬季不冷(5-10°C)，夏季较热(25-35°C)但室内有空调。',
    weather: '亚热带季风气候，年均温 16°C。夏季湿热，冬季阴冷多雾。',
    pref: ['foodie', 'culture'],
    highlights: [
      { name: '大熊猫繁育研究基地', desc: '近距离观看国宝大熊猫，看它们吃竹子、爬树、打滚', price: '55元', rating: 4.8, hours: '07:30-18:00', category: '自然体验' },
      { name: '宽窄巷子', desc: '成都三大历史文化保护区之一，青砖黛瓦的川西民居', price: '免费', rating: 4.5, hours: '全天开放', category: '美食购物' },
      { name: '武侯祠', desc: '纪念诸葛亮的祠庙，三国文化爱好者的朝圣之地', price: '50元', rating: 4.4, hours: '08:00-18:00', category: '历史文化' },
      { name: '锦里古街', desc: '三国文化与成都民俗的缩影，小吃和手工艺品的聚集地', price: '免费', rating: 4.4, hours: '全天开放', category: '美食购物' },
      { name: '都江堰', desc: '世界文化遗产，两千年前的水利工程至今仍在发挥作用', price: '80元', rating: 4.6, hours: '08:00-17:30', category: '历史文化' },
      { name: '青城山', desc: '道教发源地之一，清幽秀丽的山林是夏日避暑的好去处', price: '90元', rating: 4.5, hours: '08:00-17:00', category: '园林自然' },
    ],
    hotels: [
      { name: '成都博舍', level: '五星级', location: '太古里', price: 1200, rating: 4.8, feature: '设计感十足' },
      { name: '成都院子酒店', level: '精品民宿', location: '宽窄巷子', price: 450, rating: 4.5, feature: '川西风格' },
      { name: '锦江之星春熙路店', level: '经济型', location: '春熙路', price: 160, rating: 4.0, feature: '交通便利' },
    ],
    foods: [
      { name: '成都火锅', desc: '成都的灵魂美食，麻辣鲜香的牛油锅底是成都人的骄傲', emoji: '🫕', price: '¥60-120/人' },
      { name: '担担面', desc: '成都最具代表性的面食，芝麻酱、肉末和辣椒油的完美组合', emoji: '🍜', price: '¥8-15' },
      { name: '钵钵鸡', desc: '冷串串的经典吃法，各种食材浸泡在红油和芝麻的料汁中', emoji: '🍢', price: '¥20-40' },
      { name: '夫妻肺片', desc: '成都名菜，牛杂切片配以红油、花椒和芝麻的凉菜', emoji: '🥩', price: '¥30-50' },
      { name: '冰粉', desc: '成都人的夏日甜品，冰凉滑嫩的冰粉配以红糖和水果', emoji: '🧊', price: '¥5-10' },
    ],
    transportTips: '双流机场(CTF)或天府机场(TFU)。地铁网络发达，覆盖大部分景点。市区内出租车起步价¥8。去都江堰可坐快铁(约30分钟)。',
    budgetRange: '经济实惠，普通 200-350元/天，舒适 400-700元/天',
    itineraries: {
      '3日': [
        { day: 1, title: '熊猫与古街', activities: [
          { time: '上午', activity: '大熊猫繁育基地', detail: '看萌萌的国宝大熊猫' },
          { time: '下午', activity: '宽窄巷子', detail: '感受成都的慢生活' },
          { time: '晚上', activity: '锦里古街+火锅', detail: '品尝正宗的成都火锅' },
        ]},
        { day: 2, title: '三国文化与美食', activities: [
          { time: '上午', activity: '武侯祠', detail: '三国文化圣地' },
          { time: '下午', activity: '杜甫草堂', detail: '诗圣的故居' },
          { time: '晚上', activity: '建设路小吃街', detail: '成都最火的夜市' },
        ]},
        { day: 3, title: '自然与休闲', activities: [
          { time: '上午', activity: '人民公园鹤鸣茶社', detail: '体验成都人的盖碗茶' },
          { time: '下午', activity: '太古里逛街', detail: '时尚与传统的碰撞' },
          { time: '晚上', activity: '九眼桥酒吧街', detail: '成都的夜生活' },
        ]},
      ],
    },
    reviews: [
      { text: '成都的火锅让我这个湖南人都甘拜下风！不过越吃越上瘾，配上一碗冰粉简直是绝配。大熊猫太可爱了，看它们吃竹子我能看一整天。', name: '辣味挑战者', avatarColor: '#F87171', destination: '成都' },
      { text: '在人民公园的鹤鸣茶社喝了一下午的茶，看着成都人打麻将、掏耳朵，突然觉得这才是生活该有的样子。成都的巴适果然名不虚传。', name: '慢生活爱好者', avatarColor: '#0EA5E9', destination: '成都' },
    ],
  },

  // =========================== 北海道 ===========================
  {
    name: '北海道', slug: 'hokkaido', region: 'overseas',
    image: pexels('29914279'),
    gallery: [
      pexels('29914279'), pexels('31409369'), pexels('33705542'),
      unsplash('1578272142724-10e5bf674e94'), unsplash('1506199369484-43e6a6f8e12b'), unsplash('1600353587927-4b2c640e8b0a'),
    ],
    emoji: '❄️', gradient: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 50%, #CBD5E1 100%)',
    themeColor: '#CBD5E1',
    desc: '薰衣草花田与粉雪天堂，四季分明的北国风光',
    longDesc: '北海道，日本最北端的岛屿，四季分明的自然天堂。冬天的粉雪吸引了全世界的滑雪爱好者，夏天的薰衣草花田把富良野染成紫色，秋天的红叶倒映在洞爷湖的湖面上。旭川的动物园、小樽的运河、函馆的夜景——北海道的每一个角落都充满惊喜。',
    tags: ['自然风光', '美食之旅'], category: ['nature', 'food'],
    rating: 4.8, price: 7500, bestSeason: '❄️ 冬季',
    bestTime: '1月-2月滑雪季，7月-8月薰衣草和花海，9月-10月红叶季。每个季节都有不同的魅力。',
    weather: '冬季 -5~-15°C 大雪纷飞，夏季 15-25°C 凉爽舒适，秋季 5-18°C。',
    pref: ['photo', 'foodie', 'outdoor'],
    highlights: [
      { name: '富良野花田', desc: '夏季的薰衣草、向日葵、罂粟花织成彩虹色的花海地毯', price: '免费', rating: 4.7, hours: '全天(花田)08:00-18:00(农场)', category: '自然风光' },
      { name: '小樽运河', desc: '北海道最浪漫的景点之一，雪灯节时的雪地烛光如梦如幻', price: '免费', rating: 4.6, hours: '全天开放', category: '城市景观' },
      { name: '函馆山夜景', desc: '世界三大夜景之一，百万美元的璀璨灯火', price: '缆车往返1200日元', rating: 4.8, hours: '10:00-22:00', category: '城市景观' },
      { name: '旭川动物园', desc: '日本最北的动物园，企鹅漫步是冬季最受欢迎��节目', price: '820日元', rating: 4.6, hours: '09:30-16:30', category: '主题乐园' },
      { name: '登别地狱谷', desc: '火山活动形成的独特地貌，温泉蒸汽弥漫宛如地狱', price: '免费', rating: 4.5, hours: '全天开放', category: '自然风光' },
    ],
    hotels: [
      { name: '北海道星野度假村', level: '五星级', location: '占冠村', price: 2500, rating: 4.8, feature: '云海观景台，顶级滑雪度假' },
      { name: '登别温泉酒店·泷本', level: '四星级', location: '登别', price: 800, rating: 4.6, feature: '地狱谷温泉，传统和式房间' },
      { name: '小樽运河民宿', level: '民宿', location: '小樽', price: 350, rating: 4.4, feature: '运河景观，欧式建筑' },
    ],
    foods: [
      { name: '北海道海鲜丼', desc: '北海道三大蟹、海胆、三文鱼籽的奢华海鲜盖饭', emoji: '🦀', price: '¥100-200' },
      { name: '札幌味增拉面', desc: '北海道最具代表性的拉面，浓郁的味增汤底配以黄油和玉米', emoji: '🍜', price: '¥50-80' },
      { name: '北海道牛奶冰淇淋', desc: '北海道鲜奶制作的冰淇淋，奶香浓郁口感丝滑', emoji: '🍦', price: '¥20-35' },
      { name: '汤咖喱 (Soup Curry)', desc: '札幌特色美食，清爽的咖喱汤配以大量蔬菜和鸡腿', emoji: '🍛', price: '¥60-100' },
      { name: '白色恋人巧克力', desc: '北海道最著名的伴手礼，白巧克力夹心的猫舌饼干', emoji: '🍪', price: '¥50-80' },
    ],
    transportTips: '新千岁机场(CTS)是主要门户。北海道JR铁路周游券非常适合长距离移动。冬天自驾需注意积雪，建议使用JR+巴士。',
    budgetRange: '舒适预算 1000-2000元/天，滑雪季更高',
    itineraries: {
      '3日': [
        { day: 1, title: '札幌·北国初印象', activities: [
          { time: '上午', activity: '白色恋人公园', detail: '参观巧克力工厂和花园' },
          { time: '下午', activity: '札幌大通公园+电视塔', detail: '城市地标漫步' },
          { time: '晚上', activity: '札幌拉面横丁', detail: '品尝各种北海道拉面' },
        ]},
        { day: 2, title: '小樽·运河浪漫', activities: [
          { time: '上午', activity: '小樽运河漫步', detail: '拍照打卡，感受浪漫氛围' },
          { time: '下午', activity: '小樽玻璃工坊', detail: '体验玻璃制作' },
          { time: '晚上', activity: '小樽寿司', detail: '小樽是日本最好的寿司产地之一' },
        ]},
        { day: 3, title: '温泉与自然', activities: [
          { time: '上午', activity: '登别地狱谷', detail: '感受火山的震撼力' },
          { time: '下午', activity: '登别温泉泡汤', detail: '在天然温泉中放松' },
          { time: '晚上', activity: '返程', detail: '品尝北海道海鲜丼' },
        ]},
      ],
    },
    reviews: [
      { text: '冬天的北海道真的就是童话世界！小樽运河的雪景让我感动到说不出话，晚上点灯的时候美得不像真的。螃蟹海鲜丼是我吃过最奢侈的一顿饭。', name: '雪国爱好者', avatarColor: '#CBD5E1', destination: '北海道' },
      { text: '夏天的富良野花田像彩虹一样铺在山坡上，薰衣草的香味随风飘散。函馆山的夜景名不虚传，百万美元的风景值回票价。', name: '花田漫游者', avatarColor: '#7DD3FC', destination: '北海道' },
    ],
  },

  // =========================== 重庆 ===========================
  {
    name: '重庆', slug: 'chongqing', region: 'domestic',
    image: pexels('32660201'),
    gallery: [
      pexels('32660201'), pexels('33855530'), pexels('33970874'),
      unsplash('1600205263627-a4239b8cc549'), unsplash('1602678874621-4f8d4b7b5cfb'), unsplash('1595841696677-282e7d11d7e3'),
    ],
    emoji: '🌶️', gradient: 'linear-gradient(135deg, #FED7AA 0%, #FB923C 50%, #F97316 100%)',
    themeColor: '#F97316',
    desc: '8D魔幻山城，火锅与夜景的麻辣诱惑',
    longDesc: '重庆，一座你永远搞不清自己在几楼的城市。轻轨穿楼而过，长江索道飞渡两岸，洪崖洞的千与千寻同款夜景让无数人流连忘返。空气中弥漫着火锅的麻辣香气，整座城市像一首立体的诗，充满了魔幻现实主义的魅力。',
    tags: ['美食之旅', '城市漫游'], category: ['food', 'city'],
    rating: 4.6, price: 1800, bestSeason: '🍂 秋季',
    bestTime: '3月-5月和9月-11月为最佳。夏季(6-8月)是著名火炉，气温可达40°C。冬季(12-2月)多雾但不太冷。',
    weather: '亚热带季风气候，夏季炎热(35-40°C)，冬季多雾(5-12°C)，有「雾都」之称。',
    pref: ['foodie'],
    highlights: [
      { name: '洪崖洞', desc: '重庆最著名的景点，千与千寻同款吊脚楼夜景，层层叠叠的灯火璀璨', price: '免费', rating: 4.7, hours: '全天开放(夜景佳)', category: '城市景观' },
      { name: '解放碑', desc: '重庆地标，中国唯一一座纪念抗战胜利的纪念碑', price: '免费', rating: 4.5, hours: '全天开放', category: '城市景观' },
      { name: '长江索道', desc: '飞越长江的空中巴士，从空中俯瞰山城和两江交汇', price: '单程20元', rating: 4.6, hours: '07:30-22:00', category: '城市景观' },
      { name: '磁器口古镇', desc: '千年古镇，青石板路的两旁是各种小吃和手工艺品店', price: '免费', rating: 4.4, hours: '全天开放', category: '美食购物' },
      { name: '武隆天生三桥', desc: '世界自然遗产，三座天然石桥气势恢宏，《变形金刚4》取景地', price: '135元', rating: 4.6, hours: '08:00-17:00', category: '自然风光' },
    ],
    hotels: [
      { name: '重庆来福士洲际酒店', level: '五星级', location: '朝天门', price: 1500, rating: 4.7, feature: '250米空中大堂，两江交汇景观' },
      { name: '重庆解放碑威斯汀', level: '五星级', location: '解放碑', price: 800, rating: 4.6, feature: '高空夜景酒吧' },
      { name: '重庆南山民宿', level: '民宿', location: '南山', price: 280, rating: 4.4, feature: '可以看到重庆全景' },
    ],
    foods: [
      { name: '重庆老火锅', desc: '重庆的灵魂！九宫格火锅、牛油锅底、毛肚黄喉的麻辣盛宴', emoji: '🫕', price: '¥50-100/人' },
      { name: '重庆小面', desc: '重庆人的早餐首选，麻辣鲜香的碱水面', emoji: '🍜', price: '¥6-12' },
      { name: '酸辣粉', desc: '红薯粉条配以酸辣汤底，开胃又过瘾', emoji: '🍝', price: '¥8-15' },
      { name: '毛血旺', desc: '重庆江湖菜的代表，鸭血、毛肚、午餐肉在各种麻辣中沸腾', emoji: '🥘', price: '¥40-70' },
      { name: '烤脑花', desc: '重庆烧烤摊上的隐藏美味，麻辣鲜嫩入口即化', emoji: '🧠', price: '¥10-15' },
    ],
    transportTips: '江北机场(CKG)有地铁直达市区。轻轨是最佳出行方式，穿楼过江非常有特色。打车起步价¥10。导航在重庆经常失灵，建议问当地人。',
    budgetRange: '物价友好，普通 150-300元/天，舒适 400-600元/天',
    itineraries: {
      '3日': [
        { day: 1, title: '魔幻山城初体验', activities: [
          { time: '上午', activity: '解放碑+八一好吃街', detail: '地标打卡，小吃巡礼' },
          { time: '下午', activity: '长江索道', detail: '飞渡长江，空中看山城' },
          { time: '晚上', activity: '洪崖洞夜景', detail: '千与千寻的现实版' },
        ]},
        { day: 2, title: '古镇与火锅', activities: [
          { time: '上午', activity: '磁器口古镇', detail: '千年古镇，陈麻花和毛血旺' },
          { time: '下午', activity: '鹅岭二厂', detail: '从你的全世界路过取景地' },
          { time: '晚上', activity: '老火锅体验', detail: '找一家本地人推荐的火锅店' },
        ]},
        { day: 3, title: '震撼山水', activities: [
          { time: '上午', activity: '武隆天生三桥', detail: '世界遗产的鬼斧神工' },
          { time: '下午', activity: '仙女山', detail: '高山草原，放松心情' },
          { time: '晚上', activity: '南山一棵树观景台', detail: '俯瞰重庆全景夜景' },
        ]},
      ],
    },
    reviews: [
      { text: '重庆是一座让我全程「哇塞」的城市！洪崖洞的夜景像走进了宫崎骏的动画，火锅好吃到让我想移民。导航确实不好用，但重庆人的热情指引比导航更靠谱。', name: '山城探险家', avatarColor: '#F97316', destination: '重庆' },
      { text: '重庆小面和火锅是我心中永远的神！轻轨穿楼的场景亲自看了还是觉得不可思议。武隆的天生三桥更是大自然的鬼斧神工。', name: '美食博主小李', avatarColor: '#F59E0B', destination: '重庆' },
    ],
  },

  // =========================== 三亚 ===========================
  {
    name: '三亚', slug: 'sanya', region: 'domestic',
    image: pexels('32030703'),
    gallery: [
      pexels('32030703'), pexels('29614950'), pexels('33720814'),
      unsplash('1596709417506-8fbc90c8a1a4'), unsplash('1552084117-3d3f97fb1d3c'), unsplash('1582719478250-0d3174f2e7c3'),
    ],
    emoji: '🌴', gradient: 'linear-gradient(135deg, #D1FAE5 0%, #34D399 50%, #10B981 100%)',
    themeColor: '#10B981',
    desc: '椰风海韵，中国最好的海滨度假天堂',
    longDesc: '三亚，中国最南端的热带海滨城市。亚龙湾的沙滩白如银沙，蜈支洲岛的海水清如翡翠，大东海的海浪轻拍着海岸。南山寺的108米海上观音像庄严慈悲，天涯海角的巨石见证着无数情侣的誓言。三亚是国人心中的马尔代夫。',
    tags: ['海滨度假', '自然风光'], category: ['beach', 'nature'],
    rating: 4.5, price: 3500, bestSeason: '☀️ 夏季',
    bestTime: '10月-次年4月为最佳旅行季节，气候凉爽少雨。5-9月较热但海水温暖，适合水上活动。',
    weather: '热带海洋性气候，年平均气温 25°C。夏季 28-35°C，冬季 20-28°C，阳光充足。',
    pref: ['outdoor', 'luxury'],
    highlights: [
      { name: '亚龙湾', desc: '天下第一湾，7公里的银白沙滩和清澈海水是三亚的骄傲', price: '免费', rating: 4.8, hours: '全天开放', category: '海滨度假' },
      { name: '蜈支洲岛', desc: '中国版马尔代夫，潜水胜地，海水清澈见底', price: '144元', rating: 4.7, hours: '08:00-17:30', category: '海滨度假' },
      { name: '南山文化旅游区', desc: '108米海上观音像巍然矗立在南海上，庄严震撼', price: '129元', rating: 4.6, hours: '08:00-17:30', category: '历史文化' },
      { name: '天涯海角', desc: '海南最具象征意义的景点，碧海蓝天下的巨石群', price: '81元', rating: 4.3, hours: '07:30-18:00', category: '海滨度假' },
      { name: '三亚湾椰梦长廊', desc: '三亚最美日落观赏地，20公里的椰林海岸线', price: '免费', rating: 4.5, hours: '全天开放', category: '海滨度假' },
      { name: '亚特兰蒂斯水世界', desc: '大型水上乐园，极速滑道和水族馆适合全家游玩', price: '358元', rating: 4.6, hours: '10:00-18:00', category: '主题乐园' },
    ],
    hotels: [
      { name: '三亚亚特兰蒂斯', level: '七星级', location: '海棠湾', price: 2200, rating: 4.8, feature: '海底套房' },
      { name: '三亚艾迪逊酒店', level: '五星级', location: '海棠湾', price: 1500, rating: 4.7, feature: '网红打卡' },
      { name: '三亚湾海景公寓', level: '舒适型', location: '三亚湾', price: 280, rating: 4.3, feature: '海景阳台' },
    ],
    foods: [
      { name: '文昌鸡', desc: '海南四大名菜之首，皮薄肉嫩，蘸以蒜蓉辣椒酱', emoji: '🐔', price: '¥40-80' },
      { name: '和乐蟹', desc: '海南四大名菜之一，蟹黄饱满，清蒸最鲜美', emoji: '🦀', price: '¥80-150' },
      { name: '椰子鸡火锅', desc: '用新鲜椰汁做汤底的火锅，清甜鲜香', emoji: '🥥', price: '¥60-120' },
      { name: '清补凉', desc: '海南特色糖水，椰奶配以各种豆类、水果和芋圆', emoji: '🥣', price: '¥10-20' },
    ],
    transportTips: '三亚凤凰机场(SYX)有全国各大城市直达航班。市内可乘公交或打车。租车自驾最方便(约¥100-200/天)。海棠湾和亚龙湾离市区较远。',
    budgetRange: '经济预算 300-500元/天，舒适预算 800-1500元/天，奢华度假 2000+元/天',
    itineraries: {
      '3日': [
        { day: 1, title: '海滩时光', activities: [
          { time: '上午', activity: '亚龙湾沙滩', detail: '天下第一湾的碧海白沙' },
          { time: '下午', activity: '亚龙湾热带天堂森林公园', detail: '过江龙索桥，俯瞰亚龙湾' },
          { time: '晚上', activity: '三亚湾日落', detail: '椰梦长廊看最美日落' },
        ]},
        { day: 2, title: '海岛探索', activities: [
          { time: '上午', activity: '蜈支洲岛', detail: '潜水、水上项目' },
          { time: '下午', activity: '后海村冲浪', detail: '初学者的冲浪天堂' },
          { time: '晚上', activity: '海鲜大餐', detail: '第一市场吃海鲜' },
        ]},
        { day: 3, title: '文化与休闲', activities: [
          { time: '上午', activity: '南山文化旅游区', detail: '108米海上观音' },
          { time: '下午', activity: '亚特兰蒂斯水世界', detail: '水上乐园狂欢' },
          { time: '晚上', activity: '返程', detail: '带着三亚的阳光回家' },
        ]},
      ],
    },
    reviews: [
      { text: '三亚的海完全不输国外！蜈支洲岛的水清得像玻璃一样，亚龙湾的沙滩细腻柔软。亚特兰蒂斯的水世界太好玩了，带全家来绝对不会失望。', name: '亲子旅行家', avatarColor: '#10B981', destination: '三亚' },
      { text: '在三亚湾的椰梦长廊看了一场橘子色的日落，美到窒息。海鲜市场的海鲜又便宜又新鲜，加工一下就是人间美味。', name: '海岛少女', avatarColor: '#EC4899', destination: '三亚' },
    ],
  },

  // =========================== 西安 ===========================
  {
    name: '西安', slug: 'xian', region: 'domestic',
    image: pexels('30737851'),
    gallery: [
      pexels('30737851'), pexels('33855530'), pexels('32660201'),
      unsplash('1603276892280-8793af79f257'), unsplash('1588341287868-6b1c0186e7c6'), unsplash('1566663795784-cb6769765b86'),
    ],
    emoji: '🏯', gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FCD34D 50%, #F59E0B 100%)',
    themeColor: '#F59E0B',
    desc: '十三朝古都，兵马俑与大雁塔的历史回响',
    longDesc: '西安，中国历史的缩影。秦始皇的地下兵团——兵马俑让整个世界为之震撼，大雁塔见证了玄奘取经的传奇，明城墙是中国保存最完整的古城垣。回民街的香气飘荡着千年丝路的余韵，大唐不夜城的灯火重现了盛唐的辉煌。在西安，每一步都踩在历史的脉搏上。',
    tags: ['文化历史', '城市漫游'], category: ['culture', 'city'],
    rating: 4.7, price: 2200, bestSeason: '🌸 春季',
    bestTime: '3月-5月和9月-11月气候最舒适。夏季炎热(30-38°C)，冬季干冷(0-8°C)。',
    weather: '温带季风气候，春季 10-22°C，夏季 25-38°C，秋季 10-25°C，冬季 -5-8°C。',
    pref: ['culture', 'photo'],
    highlights: [
      { name: '兵马俑博物馆', desc: '世界第八大奇迹，秦始皇的地下军团，数千尊真人大小的陶俑', price: '120元', rating: 4.8, hours: '08:30-17:00', category: '历史文化' },
      { name: '西安城墙', desc: '中国现存最完整的古城墙，可骑行一圈(14公里)俯瞰古城全貌', price: '54元', rating: 4.6, hours: '08:00-22:00', category: '历史文化' },
      { name: '大雁塔', desc: '唐代古塔，玄奘为保存佛经而建，西安的标志性建筑', price: '50元', rating: 4.5, hours: '08:00-17:30', category: '历史文化' },
      { name: '回民街', desc: '西安最著名的小吃街，牛羊肉泡馍、凉皮、肉夹馍的天堂', price: '免费', rating: 4.4, hours: '全天开放', category: '美食购物' },
      { name: '华清宫', desc: '唐代皇家温泉行宫，杨贵妃「温泉水滑洗凝脂」的所在地', price: '120元', rating: 4.4, hours: '07:00-18:00', category: '历史文化' },
      { name: '大唐不夜城', desc: '沉浸式唐文化体验步行街，华服游行的光影盛宴', price: '免费', rating: 4.7, hours: '全天开放(夜景佳)', category: '主题乐园' },
    ],
    hotels: [
      { name: '西安索菲特传奇酒店', level: '五星级', location: '市中心', price: 900, rating: 4.7, feature: '历史建筑' },
      { name: '西安W酒店', level: '五星级', location: '曲江新区', price: 750, rating: 4.6, feature: '潮流设计' },
      { name: '汉庭钟楼店', level: '经济型', location: '钟楼商圈', price: 170, rating: 4.1, feature: '位置核心' },
    ],
    foods: [
      { name: '牛羊肉泡馍', desc: '西安最具代表性的美食，亲手掰馍入汤，肉烂汤浓', emoji: '🥩', price: '¥20-40' },
      { name: '肉夹馍', desc: '西安的汉堡，酥脆的馍夹着炖得软烂的腊汁肉', emoji: '🥙', price: '¥8-15' },
      { name: '凉皮', desc: '陕西特色小吃，爽滑的米皮配以辣椒油和醋', emoji: '🍝', price: '¥6-12' },
      { name: '葫芦鸡', desc: '陕西名菜，整鸡蒸至酥烂再油炸，外酥里嫩', emoji: '🐔', price: '¥40-70' },
      { name: '甑糕', desc: '西安传统甜食，糯米和红枣蒸制的香甜糕点', emoji: '🍚', price: '¥5-10' },
    ],
    transportTips: '咸阳国际机场(XIY)有地铁14号线直达市区。市内景点集中，地铁+公交即可。去兵马俑可在火车站坐游5(306路)直达(¥7)。',
    budgetRange: '经济实惠，普通 200-350元/天，舒适 400-700元/天',
    itineraries: {
      '3日': [
        { day: 1, title: '帝国的奇迹', activities: [
          { time: '上午', activity: '兵马俑博物馆', detail: '世界第八大奇迹' },
          { time: '下午', activity: '华清宫', detail: '杨贵妃的温泉行宫' },
          { time: '晚上', activity: '长恨歌表演', detail: '震撼的实景历史舞剧' },
        ]},
        { day: 2, title: '古城漫步', activities: [
          { time: '上午', activity: '西安城墙骑行', detail: '完整的古城骑一圈' },
          { time: '下午', activity: '回民街美食', detail: '泡馍、肉夹馍、凉皮' },
          { time: '晚上', activity: '钟鼓楼夜景', detail: '西安中心的璀璨灯火' },
        ]},
        { day: 3, title: '大唐盛世', activities: [
          { time: '上午', activity: '陕西历史博物馆', detail: '给我一天，还你万年' },
          { time: '下午', activity: '大雁塔+大唐不夜城', detail: '盛唐文化的现代演绎' },
          { time: '晚上', activity: '大唐不夜城夜景', detail: '沉浸式唐文化体验' },
        ]},
      ],
    },
    reviews: [
      { text: '看到兵马俑的那一刻，我被震撼得说不出话来。两千年前的陶俑每一个都不一样，那种历史的厚重感让人热泪盈眶。', name: '历史爱好者', avatarColor: '#F59E0B', destination: '西安' },
      { text: '西安城墙骑行是我做过最酷的事之一！夕阳下在城墙上骑车，俯瞰这座千年古都的市井生活。回民街的泡馍和肉夹馍也太好吃了吧！', name: '骑行旅人', avatarColor: '#0EA5E9', destination: '西安' },
    ],
  },

  // =========================== 杭州 ===========================
  {
    name: '杭州', slug: 'hangzhou', region: 'domestic',
    image: pexels('33003672'),
    gallery: [
      pexels('33003672'), pexels('33970874'), pexels('32660201'),
      unsplash('1599665011577-9b9c7b4f8c3a'), unsplash('1576466217466-1ca0bf3b70ad'), unsplash('1528129492986-6a1b0e68211a'),
    ],
    emoji: '🌊', gradient: 'linear-gradient(135deg, #E0F2FE 0%, #93C5FD 50%, #60A5FA 100%)',
    themeColor: '#60A5FA',
    desc: '西湖烟雨与龙井茶香，人间天堂的诗意画卷',
    longDesc: '杭州，马可波罗笔下「世界上最美丽华贵之天城」。西湖的水光潋滟晴方好，山色空蒙雨亦奇，断桥残雪、苏堤春晓、雷峰夕照——每一景都是一首宋词。龙井村的茶香飘满山谷，灵隐寺的钟声回荡千年。在杭州，生活就是一首诗。',
    tags: ['自然风光', '城市漫游', '美食之旅'], category: ['nature', 'city', 'food'],
    rating: 4.6, price: 2800, bestSeason: '🌸 春季',
    bestTime: '3月-5月西湖春色，苏堤春晓和满城花开。9月-11月秋高气爽，满陇桂雨。6-8月夏日荷花别有风味。',
    weather: '亚热带季风气候，春季 10-22°C，夏季 25-38°C 湿热，秋季 15-28°C，冬季 0-10°C。',
    pref: ['photo', 'foodie'],
    highlights: [
      { name: '西湖', desc: '世界文化遗产，中国最著名的湖泊，十景各有风情', price: '免费', rating: 4.9, hours: '全天开放', category: '园林自然' },
      { name: '灵隐寺', desc: '千年古刹，济公出家的地方，飞来峰的佛教石窟造像精美绝伦', price: '75元', rating: 4.6, hours: '07:00-18:00', category: '历史文化' },
      { name: '西溪湿地', desc: '城市中的绿色明珠，乘船穿行在水网交错的芦苇荡中', price: '80元', rating: 4.5, hours: '08:00-17:30', category: '园林自然' },
      { name: '龙井村', desc: '中国十大名茶之首龙井茶的原产地，茶园风光如画', price: '免费', rating: 4.4, hours: '全天开放', category: '自然体验' },
      { name: '宋城', desc: '大型宋代文化主题公园，给我一天还你千年', price: '320元', rating: 4.5, hours: '10:00-21:00', category: '主题乐园' },
      { name: '河坊街', desc: '杭州历史街区，南宋御街的繁华延续至今', price: '免费', rating: 4.3, hours: '全天开放', category: '美食购物' },
    ],
    hotels: [
      { name: '杭州西湖国宾馆', level: '五星级', location: '西湖畔', price: 1100, rating: 4.8, feature: '湖景园林' },
      { name: '杭州法云安缦', level: '奢华度假', location: '灵隐景区', price: 3500, rating: 4.9, feature: '禅意体验' },
      { name: '汉庭西湖店', level: '经济型', location: '西湖商圈', price: 180, rating: 4.1, feature: '性价比高' },
    ],
    foods: [
      { name: '西湖醋鱼', desc: '杭州第一名菜，草鱼烹制后浇以糖醋芡汁，酸甜鲜嫩', emoji: '🐟', price: '¥80-120' },
      { name: '龙井虾仁', desc: '杭州特色名菜，虾仁配以龙井新茶，清香爽滑', emoji: '🦐', price: '¥80-150' },
      { name: '东坡肉', desc: '苏东坡发明的传世名菜，五花肉炖至酥烂入口即化', emoji: '🥩', price: '¥50-80' },
      { name: '片儿川', desc: '杭州市井面食的代表，雪菜笋片肉丝汤面', emoji: '🍜', price: '¥15-25' },
      { name: '定胜糕', desc: '杭州传统点心，米粉制作的甜糕，松软香甜', emoji: '🍡', price: '¥5-10' },
    ],
    transportTips: '萧山机场(HGH)有地铁直达市区。杭州是支付宝发源地，移动支付全覆盖。西湖周边建议骑行或步行，可以租共享单车。',
    budgetRange: '舒适预算 400-800元/天',
    itineraries: {
      '3日': [
        { day: 1, title: '西湖精华一日', activities: [
          { time: '上午', activity: '断桥残雪+白堤', detail: '从断桥开始西湖之旅' },
          { time: '下午', activity: '苏堤春晓+花港观鱼', detail: '泛舟西湖，看三潭印月' },
          { time: '晚上', activity: '湖滨银泰+音乐喷泉', detail: '西湖的现代之夜' },
        ]},
        { day: 2, title: '禅茶一味', activities: [
          { time: '上午', activity: '灵隐寺+飞来峰', detail: '千年古刹，佛教艺术' },
          { time: '下午', activity: '龙井村', detail: '品茗龙井，茶园漫步' },
          { time: '晚上', activity: '河坊街', detail: '南宋御街的美食与风情' },
        ]},
        { day: 3, title: '自然与人文', activities: [
          { time: '上午', activity: '西溪湿地', detail: '城市绿肺，泛舟芦苇荡' },
          { time: '下午', activity: '拱宸桥+小河直街', detail: '运河文化的历史街区' },
          { time: '晚上', activity: '楼外楼晚餐', detail: '品尝正宗杭州名菜' },
        ]},
      ],
    },
    reviews: [
      { text: '西湖的美是不需要滤镜的。在苏堤上骑车，春风拂面，杨柳依依，远处的山和近处的水组成了一幅天然的水墨画。龙井虾仁也太精致了！', name: '江南客', avatarColor: '#60A5FA', destination: '杭州' },
      { text: '灵隐寺的禅意让我整个人都安静了。在龙井村的茶园里喝了一杯明前龙井，那种清甜的回甘至今难忘。杭州不愧是人间的天堂。', name: '茶文化爱好者', avatarColor: '#10B981', destination: '杭州' },
    ],
  },
]

export default destinations

export function getDestination(name) {
  return destinations.find(d => d.name === name || d.slug === name)
}

export function getDestinationsByRegion(region) {
  return destinations.filter(d => d.region === region)
}

export function getRelatedDestinations(dest, count = 4) {
  return destinations
    .filter(d => d.name !== dest.name && d.tags.some(t => dest.tags.includes(t)))
    .slice(0, count)
}
