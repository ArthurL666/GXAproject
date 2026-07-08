package com.study.travel.tool;

import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 模拟旅游数据服务 — 提供景点、酒店、天气等模拟数据
 */
@Service
public class TravelDataService {

    private static final Map<String, List<ScenicInfo>> scenicData = new LinkedHashMap<>();
    private static final Map<String, List<HotelInfo>> hotelData = new LinkedHashMap<>();
    private static final String[] WEATHER_TYPES = {"晴", "多云", "阴", "小雨", "阵雨"};
    private static final Random RANDOM = new Random();

    static {
        // ===== 北京 =====
        scenicData.put("北京", Arrays.asList(
                new ScenicInfo("故宫博物院", "世界最大的宫殿建筑群，明清两代皇宫", "60元", 4.8, "08:30-17:00", "历史文化"),
                new ScenicInfo("长城（八达岭）", "世界文化遗产，万里长城的精华段落", "40元", 4.7, "07:30-18:00", "历史文化"),
                new ScenicInfo("颐和园", "中国现存最大的皇家园林", "30元", 4.6, "07:00-17:00", "园林自然"),
                new ScenicInfo("天坛公园", "明清皇帝祭天场所，建筑精美", "15元", 4.5, "06:00-21:00", "历史文化"),
                new ScenicInfo("798艺术区", "现代艺术聚集地，文创园区", "免费", 4.4, "全天开放", "艺术文创"),
                new ScenicInfo("南锣鼓巷", "老北京胡同文化代表", "免费", 4.3, "全天开放", "美食购物")
        ));
        hotelData.put("北京", Arrays.asList(
                new HotelInfo("北京王府井希尔顿酒店", "五星级", "王府井商圈", 850, 4.7, "近地铁1号线"),
                new HotelInfo("北京四合院民宿", "特色民宿", "后海/南锣鼓巷", 350, 4.5, "老北京风情"),
                new HotelInfo("如家精选（前门店）", "经济型", "前门大街", 220, 4.2, "干净便捷")
        ));

        // ===== 上海 =====
        scenicData.put("上海", Arrays.asList(
                new ScenicInfo("外滩", "黄浦江畔，万国建筑博览群", "免费", 4.8, "全天开放", "城市景观"),
                new ScenicInfo("东方明珠塔", "上海标志性建筑，360度观景", "199元", 4.5, "08:00-21:30", "城市景观"),
                new ScenicInfo("迪士尼乐园", "中国大陆首座迪士尼主题公园", "475元", 4.7, "08:30-20:30", "主题乐园"),
                new ScenicInfo("豫园", "明代江南古典园林", "40元", 4.4, "08:45-16:45", "园林自然"),
                new ScenicInfo("南京路步行街", "中国最著名的商业街", "免费", 4.5, "全天开放", "美食购物"),
                new ScenicInfo("上海博物馆", "中国古代艺术博物馆", "免费", 4.6, "09:00-17:00", "历史文化")
        ));
        hotelData.put("上海", Arrays.asList(
                new HotelInfo("上海和平饭店", "五星级", "外滩", 1200, 4.8, "百年传奇酒店"),
                new HotelInfo("上海浦东文华东方", "五星级", "陆家嘴", 980, 4.7, "江景房"),
                new HotelInfo("全季酒店（南京路店）", "舒适型", "南京路", 350, 4.4, "位置优越")
        ));

        // ===== 杭州 =====
        scenicData.put("杭州", Arrays.asList(
                new ScenicInfo("西湖", "世界文化遗产，中国十大风景名胜", "免费", 4.9, "全天开放", "园林自然"),
                new ScenicInfo("灵隐寺", "千年古刹，佛教圣地", "75元", 4.6, "07:00-18:00", "历史文化"),
                new ScenicInfo("宋城", "大型宋代文化主题公园", "320元", 4.5, "10:00-21:00", "主题乐园"),
                new ScenicInfo("龙井村", "中国十大名茶龙井茶产地", "免费", 4.4, "全天开放", "自然体验"),
                new ScenicInfo("西溪湿地", "城市湿地公园", "80元", 4.5, "08:00-17:30", "园林自然"),
                new ScenicInfo("河坊街", "杭州历史街区，美食聚集地", "免费", 4.3, "全天开放", "美食购物")
        ));
        hotelData.put("杭州", Arrays.asList(
                new HotelInfo("杭州西湖国宾馆", "五星级", "西湖畔", 1100, 4.8, "湖景园林"),
                new HotelInfo("杭州法云安缦", "奢华度假", "灵隐景区", 3500, 4.9, "禅意体验"),
                new HotelInfo("汉庭（西湖店）", "经济型", "西湖商圈", 180, 4.1, "性价比高")
        ));

        // ===== 成都 =====
        scenicData.put("成都", Arrays.asList(
                new ScenicInfo("大熊猫繁育研究基地", "近距离观看国宝大熊猫", "55元", 4.8, "07:30-18:00", "自然体验"),
                new ScenicInfo("宽窄巷子", "成都三大历史文化保护区之一", "免费", 4.5, "全天开放", "美食购物"),
                new ScenicInfo("武侯祠", "纪念诸葛亮的祠庙", "50元", 4.4, "08:00-18:00", "历史文化"),
                new ScenicInfo("锦里古街", "三国文化与成都民俗街", "免费", 4.4, "全天开放", "美食购物"),
                new ScenicInfo("都江堰", "世界文化遗产，千年水利工程", "80元", 4.6, "08:00-17:30", "历史文化"),
                new ScenicInfo("青城山", "道教名山，世界文化遗产", "90元", 4.5, "08:00-17:00", "园林自然")
        ));
        hotelData.put("成都", Arrays.asList(
                new HotelInfo("成都博舍", "五星级", "太古里", 1200, 4.8, "设计感十足"),
                new HotelInfo("成都院子酒店", "精品民宿", "宽窄巷子", 450, 4.5, "川西风格"),
                new HotelInfo("锦江之星（春熙路店）", "经济型", "春熙路", 160, 4.0, "交通便利")
        ));

        // ===== 三亚 =====
        scenicData.put("三亚", Arrays.asList(
                new ScenicInfo("亚龙湾", "天下第一湾，白沙碧海", "免费", 4.8, "全天开放", "海滨度假"),
                new ScenicInfo("蜈支洲岛", "潜水胜地，海水清澈", "144元", 4.7, "08:00-17:30", "海滨度假"),
                new ScenicInfo("天涯海角", "浪漫海滨景点", "81元", 4.3, "07:30-18:00", "海滨度假"),
                new ScenicInfo("南山文化旅游区", "108米海上观音", "129元", 4.6, "08:00-17:30", "历史文化"),
                new ScenicInfo("三亚湾椰梦长廊", "最美日落观赏地", "免费", 4.5, "全天开放", "海滨度假"),
                new ScenicInfo("亚特兰蒂斯水世界", "大型水上乐园", "358元", 4.6, "10:00-18:00", "主题乐园")
        ));
        hotelData.put("三亚", Arrays.asList(
                new HotelInfo("三亚亚特兰蒂斯", "七星级", "海棠湾", 2200, 4.8, "海底套房"),
                new HotelInfo("三亚艾迪逊酒店", "五星级", "海棠湾", 1500, 4.7, "网红打卡"),
                new HotelInfo("三亚湾海景公寓", "舒适型", "三亚湾", 280, 4.3, "海景阳台")
        ));

        // ===== 西安 =====
        scenicData.put("西安", Arrays.asList(
                new ScenicInfo("兵马俑", "世界第八大奇迹", "120元", 4.8, "08:30-17:00", "历史文化"),
                new ScenicInfo("大雁塔", "唐代古塔，西安地标", "50元", 4.5, "08:00-17:30", "历史文化"),
                new ScenicInfo("回民街", "西安美食天堂", "免费", 4.4, "全天开放", "美食购物"),
                new ScenicInfo("西安城墙", "中国现存最完整的古城墙", "54元", 4.6, "08:00-22:00", "历史文化"),
                new ScenicInfo("华清宫", "唐代皇家温泉行宫", "120元", 4.4, "07:00-18:00", "历史文化"),
                new ScenicInfo("大唐不夜城", "沉浸式唐文化体验", "免费", 4.7, "全天开放", "主题乐园")
        ));
        hotelData.put("西安", Arrays.asList(
                new HotelInfo("西安索菲特传奇酒店", "五星级", "市中心", 900, 4.7, "历史建筑"),
                new HotelInfo("西安W酒店", "五星级", "曲江新区", 750, 4.6, "潮流设计"),
                new HotelInfo("汉庭（钟楼店）", "经济型", "钟楼商圈", 170, 4.1, "位置核心")
        ));

        // ===== 东京 =====
        scenicData.put("东京", Arrays.asList(
                new ScenicInfo("浅草寺", "东京最古老的寺庙", "免费", 4.6, "06:00-17:00", "历史文化"),
                new ScenicInfo("东京塔", "东京地标，城市全景", "1200日元", 4.5, "09:00-23:00", "城市景观"),
                new ScenicInfo("秋叶原", "电器街与动漫天堂", "免费", 4.7, "全天开放", "美食购物"),
                new ScenicInfo("迪士尼乐园", "亚洲第一座迪士尼", "8400日元", 4.8, "08:00-22:00", "主题乐园"),
                new ScenicInfo("涩谷", "时尚潮流发源地", "免费", 4.5, "全天开放", "美食购物"),
                new ScenicInfo("上野公园", "赏樱名所，博物馆聚集地", "免费", 4.4, "全天开放", "园林自然")
        ));
        hotelData.put("东京", Arrays.asList(
                new HotelInfo("东京半岛酒店", "五星级", "银座", 3500, 4.8, "顶级奢华"),
                new HotelInfo("新宿格兰贝尔酒店", "舒适型", "新宿", 800, 4.4, "交通便利"),
                new HotelInfo("东京安心民宿", "民宿", "浅草", 400, 4.3, "日式体验")
        ));

        // ===== 巴黎 =====
        scenicData.put("巴黎", Arrays.asList(
                new ScenicInfo("埃菲尔铁塔", "法国象征，世界最著名地标", "25欧元", 4.8, "09:00-23:45", "城市景观"),
                new ScenicInfo("卢浮宫", "世界最大博物馆", "17欧元", 4.9, "09:00-18:00", "艺术文创"),
                new ScenicInfo("巴黎圣母院", "哥特式建筑杰作", "免费", 4.7, "08:00-18:45", "历史文化"),
                new ScenicInfo("香榭丽舍大街", "世界最美大道", "免费", 4.6, "全天开放", "美食购物"),
                new ScenicInfo("凡尔赛宫", "法国王室宫殿", "20欧元", 4.7, "09:00-17:30", "历史文化"),
                new ScenicInfo("蒙马特高地", "艺术家聚集地", "免费", 4.5, "全天开放", "艺术文创")
        ));
        hotelData.put("巴黎", Arrays.asList(
                new HotelInfo("巴黎丽兹酒店", "五星级", "旺多姆广场", 5000, 4.9, "传奇奢华"),
                new HotelInfo("巴黎铂尔曼（埃菲尔铁塔店）", "四星级", "埃菲尔铁塔附近", 1500, 4.5, "铁塔景观"),
                new HotelInfo("宜必思（蒙马特店）", "经济型", "蒙马特", 500, 4.0, "性价比之选")
        ));

        // ===== 丽江 =====
        scenicData.put("丽江", Arrays.asList(
                new ScenicInfo("丽江古城", "世界文化遗产，纳西族风情", "免费", 4.6, "全天开放", "历史文化"),
                new ScenicInfo("玉龙雪山", "纳西族神山", "100元", 4.8, "07:00-16:00", "园林自然"),
                new ScenicInfo("束河古镇", "茶马古道上的宁静古镇", "免费", 4.4, "全天开放", "历史文化"),
                new ScenicInfo("泸沽湖", "高原明珠，摩梭文化", "100元", 4.7, "全天开放", "园林自然"),
                new ScenicInfo("拉市海", "候鸟栖息湿地", "30元", 4.3, "08:00-17:00", "园林自然"),
                new ScenicInfo("四方街", "古城中心，酒吧与美食", "免费", 4.3, "全天开放", "美食购物")
        ));
        hotelData.put("丽江", Arrays.asList(
                new HotelInfo("丽江悦榕庄", "奢华度假", "束河古镇", 1800, 4.8, "雪山景观"),
                new HotelInfo("丽江古城英迪格", "五星级", "大研古城", 800, 4.6, "茶马古道主题"),
                new HotelInfo("丽江花间堂", "精品民宿", "古城内", 350, 4.5, "纳西庭院")
        ));

        // ===== 厦门 =====
        scenicData.put("厦门", Arrays.asList(
                new ScenicInfo("鼓浪屿", "钢琴之岛，万国建筑博物馆", "35元", 4.7, "全天开放", "历史文化"),
                new ScenicInfo("厦门大学", "中国最美大学", "免费", 4.5, "全天开放", "城市景观"),
                new ScenicInfo("环岛路", "最美马拉松赛道", "免费", 4.6, "全天开放", "海滨度假"),
                new ScenicInfo("曾厝垵", "文创渔村，美食聚集地", "免费", 4.3, "全天开放", "美食购物"),
                new ScenicInfo("南普陀寺", "闽南佛教圣地", "免费", 4.4, "08:00-17:00", "历史文化"),
                new ScenicInfo("中山路步行街", "百年商业街", "免费", 4.3, "全天开放", "美食购物")
        ));
        hotelData.put("厦门", Arrays.asList(
                new HotelInfo("厦门康莱德酒店", "五星级", "思明区", 900, 4.7, "海景超赞"),
                new HotelInfo("厦门鼓浪屿民宿", "特色民宿", "鼓浪屿", 350, 4.5, "老别墅风情"),
                new HotelInfo("如家商旅（中山路店）", "舒适型", "中山路", 200, 4.2, "交通购物方便")
        ));
    }

    /**
     * 获取支持的城市列表
     */
    public List<String> getSupportedCities() {
        return new ArrayList<>(scenicData.keySet());
    }

    /**
     * 根据城市获取景点列表
     */
    public List<ScenicInfo> getScenicSpots(String city) {
        return scenicData.getOrDefault(city, Collections.emptyList());
    }

    /**
     * 根据城市获取酒店列表
     */
    public List<HotelInfo> getHotels(String city) {
        return hotelData.getOrDefault(city, Collections.emptyList());
    }

    /**
     * 根据城市获取模拟天气
     */
    public String getWeather(String city) {
        if (!scenicData.containsKey(city)) {
            return city + " 暂时没有天气数据";
        }
        String weather = WEATHER_TYPES[RANDOM.nextInt(WEATHER_TYPES.length)];
        int tempHigh = 20 + RANDOM.nextInt(18);
        int tempLow = tempHigh - 5 - RANDOM.nextInt(8);
        return String.format("%s 今日天气：%s  气温 %d°C ~ %d°C  适宜出行指数：%s",
                city, weather, tempLow, tempHigh,
                weather.contains("雨") ? "建议带伞" : "非常适合旅行");
    }

    /**
     * 搜索城市（模糊匹配）
     */
    public String findCity(String query) {
        for (String city : scenicData.keySet()) {
            if (query.contains(city) || city.contains(query)) {
                return city;
            }
        }
        // 模糊包含
        for (String city : scenicData.keySet()) {
            for (int i = 0; i < city.length(); i++) {
                if (query.contains(city.substring(i, Math.min(i + 2, city.length())))) {
                    return city;
                }
            }
        }
        return null;
    }

    // 内部数据类
    public record ScenicInfo(String name, String description, String price, double rating, String hours, String category) {}
    public record HotelInfo(String name, String level, String location, int price, double rating, String feature) {}
}
