package com.study.travel.tool;

import com.fasterxml.jackson.annotation.JsonPropertyDescription;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.study.travel.tool.TravelDataService.HotelInfo;
import com.study.travel.tool.TravelDataService.ScenicInfo;
import org.springframework.ai.model.function.FunctionCallback;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Spring AI Tool 注册中心
 * 将所有旅游工具注册为 FunctionCallback Bean，Spring AI ChatClient 自动发现
 */
@Component
public class ToolRegistry {

    private final TravelDataService dataService;
    private static final ObjectMapper mapper = new ObjectMapper();

    public ToolRegistry(TravelDataService dataService) {
        this.dataService = dataService;
    }

    // ==================== 景点查询 Tool ====================

    @Bean
    public FunctionCallback scenicToolCallback() {
        return FunctionCallback.builder()
                .function("getScenicSpots", (Function<ScenicRequest, List<Map<String, Object>>>) req -> {
                    List<ScenicInfo> spots = dataService.getScenicSpots(req.city);
                    if (spots.isEmpty()) return List.of(Map.of("message", "暂无" + req.city + "的景点数据"));
                    return spots.stream().map(s -> {
                        Map<String, Object> m = new LinkedHashMap<>();
                        m.put("name", s.name()); m.put("description", s.description());
                        m.put("price", s.price()); m.put("rating", s.rating());
                        m.put("hours", s.hours()); m.put("category", s.category());
                        return m;
                    }).collect(Collectors.toList());
                })
                .description("根据城市名称查询该城市的景点列表。当用户询问某城市的景点、好玩的地方、必去景点时使用")
                .inputType(ScenicRequest.class)
                .build();
    }

    // ==================== 酒店查询 Tool ====================

    @Bean
    public FunctionCallback hotelToolCallback() {
        return FunctionCallback.builder()
                .function("getHotels", (Function<HotelRequest, List<Map<String, Object>>>) req -> {
                    List<HotelInfo> hotels = dataService.getHotels(req.city);
                    if (hotels.isEmpty()) return List.of(Map.of("message", "暂无" + req.city + "的酒店数据"));
                    var stream = hotels.stream();
                    if (req.budget != null) {
                        stream = switch (req.budget) {
                            case "经济型" -> stream.filter(h -> h.price() <= 250);
                            case "舒适型" -> stream.filter(h -> h.price() > 250 && h.price() <= 500);
                            case "品质型" -> stream.filter(h -> h.price() > 500 && h.price() <= 1500);
                            case "奢华型" -> stream.filter(h -> h.price() > 1500);
                            default -> stream;
                        };
                    }
                    return stream.map(h -> {
                        Map<String, Object> m = new LinkedHashMap<>();
                        m.put("name", h.name()); m.put("level", h.level());
                        m.put("location", h.location()); m.put("price", h.price());
                        m.put("rating", h.rating()); m.put("feature", h.feature());
                        return m;
                    }).collect(Collectors.toList());
                })
                .description("根据城市名称查询酒店推荐列表。当用户询问住宿、酒店、住哪里、民宿时使用")
                .inputType(HotelRequest.class)
                .build();
    }

    // ==================== 天气查询 Tool ====================

    @Bean
    public FunctionCallback weatherToolCallback() {
        return FunctionCallback.builder()
                .function("getWeather", (Function<WeatherRequest, Map<String, Object>>) req -> {
                    String weather = dataService.getWeather(req.city);
                    return Map.of("city", req.city, "weather", weather,
                            "suggestion", weather.contains("雨") ? "建议携带雨具" : "天气适宜出行");
                })
                .description("查询指定城市的当前天气情况。当用户询问天气、气温、是否下雨、出行建议时使用")
                .inputType(WeatherRequest.class)
                .build();
    }

    // ==================== 行程规划 Tool ====================

    @Bean
    public FunctionCallback planToolCallback() {
        return FunctionCallback.builder()
                .function("generateTravelPlan", (Function<PlanRequest, Map<String, Object>>) req -> {
                    List<ScenicInfo> allSpots = dataService.getScenicSpots(req.city);
                    List<HotelInfo> hotels = dataService.getHotels(req.city);

                    if (allSpots.isEmpty()) {
                        return Map.of("city", req.city, "message",
                                "暂不支持该城市。支持：北京、上海、杭州、成都、三亚、西安、丽江、厦门、东京、巴黎");
                    }

                    List<ScenicInfo> selected = filterByPreference(allSpots, req.preferences);
                    if (selected.size() < req.days) selected = new ArrayList<>(allSpots);

                    List<Map<String, Object>> dailyPlans = new ArrayList<>();
                    int spotIdx = 0;
                    String[] times = {"上午", "下午", "晚上"};

                    for (int d = 1; d <= req.days; d++) {
                        List<Map<String, String>> activities = new ArrayList<>();
                        for (int s = 0; s < Math.min(times.length, Math.max(2, selected.size() / req.days)); s++) {
                            if (s < 2 && spotIdx < selected.size()) {
                                ScenicInfo spot = selected.get(spotIdx % selected.size());
                                activities.add(Map.of("time", times[s], "activity", spot.name(),
                                        "detail", spot.description(), "price", spot.price()));
                            }
                            spotIdx++;
                        }
                        if (activities.stream().noneMatch(a -> a.get("time").equals("晚上"))) {
                            activities.add(Map.of("time", "晚上", "activity", "美食自由探索", "detail", "品尝当地美食"));
                        }
                        Map<String, Object> day = new LinkedHashMap<>();
                        day.put("day", d); day.put("activities", activities);
                        dailyPlans.add(day);
                        spotIdx = (d * 2) % selected.size();
                    }

                    List<Map<String, Object>> hotelRecs = hotels.stream().limit(2).map(h -> {
                        Map<String, Object> m = new LinkedHashMap<>();
                        m.put("name", h.name()); m.put("level", h.level());
                        m.put("price", h.price()); m.put("location", h.location());
                        return m;
                    }).collect(Collectors.toList());

                    Map<String, Object> result = new LinkedHashMap<>();
                    result.put("city", req.city); result.put("days", req.days);
                    result.put("preferences", req.preferences != null ? req.preferences : "综合体验");
                    result.put("weather", dataService.getWeather(req.city));
                    result.put("dailyPlans", dailyPlans);
                    result.put("hotels", hotelRecs);
                    return result;
                })
                .description("根据目的地城市、旅行天数、用户偏好，生成详细的每日行程计划")
                .inputType(PlanRequest.class)
                .build();
    }

    // ==================== 偏好过滤 ====================

    private List<ScenicInfo> filterByPreference(List<ScenicInfo> spots, String preferences) {
        if (preferences == null || preferences.isEmpty()) return spots;
        Set<String> prefs = new HashSet<>(Arrays.asList(preferences.split("[,，]")));
        List<ScenicInfo> filtered = spots.stream().filter(s -> {
            for (String p : prefs) {
                String pt = p.trim();
                if ((pt.contains("美食") || pt.contains("购物")) && s.category().equals("美食购物")) return true;
                if ((pt.contains("自然") || pt.contains("风景") || pt.contains("海滨")) &&
                        (s.category().equals("园林自然") || s.category().equals("自然体验") || s.category().equals("海滨度假"))) return true;
                if ((pt.contains("文化") || pt.contains("历史")) && s.category().equals("历史文化")) return true;
                if ((pt.contains("艺术") || pt.contains("文创")) && s.category().equals("艺术文创")) return true;
                if (pt.contains("亲子") || pt.contains("家庭")) return true;
            }
            return false;
        }).collect(Collectors.toList());
        return filtered.isEmpty() ? spots : new ArrayList<>(new LinkedHashSet<>(filtered));
    }

    // ==================== Request DTOs ====================

    public record ScenicRequest(@JsonPropertyDescription("城市名称，如北京、上海、杭州") String city) {}

    public record HotelRequest(
            @JsonPropertyDescription("城市名称") String city,
            @JsonPropertyDescription("预算：经济型/舒适型/品质型/奢华型") String budget) {}

    public record WeatherRequest(@JsonPropertyDescription("城市名称") String city) {}

    public record PlanRequest(
            @JsonPropertyDescription("目的地城市名称") String city,
            @JsonPropertyDescription("旅行天数") int days,
            @JsonPropertyDescription("旅行偏好：美食/自然风光/历史文化/购物/艺术文创/亲子/浪漫") String preferences) {}
}
