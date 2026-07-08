package com.study.travel.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 旅行计划实体类 — 对应数据库中的 travel_plans 表
 *
 * 当用户和 AI 对话后，AI 会生成一份旅行计划（比如"北京三日游"），
 * 用户点击"保存计划"按钮时，这份计划就被存到这个表里。
 * 之后用户可以在"我的行程"页面查看所有保存过的计划。
 *
 * 数据库表结构：travel_plans
 * ┌──────┬─────────┬──────┬──────┬──────────┬─────────────┬────────────────┐
 * │  id  │ user_id │ city │ days │ content  │ preferences │   create_time   │
 * ├──────┼─────────┼──────┼──────┼──────────┼─────────────┼────────────────┤
 * │  1   │    1    │ 北京 │  3   │ 第一天...│ 美食,文化    │ 2026-07-07 10:00│
 * └──────┴─────────┴──────┴──────┴──────────┴─────────────┴────────────────┘
 */
@Data               // Lombok：自动生成 getter/setter/toString 等
@Entity             // 标记这是一个 JPA 实体类（与数据库表映射）
@Table(name = "travel_plans")   // 指定对应数据库中的表名
public class TravelPlan {

    /**
     * 计划唯一 ID（自增主键）
     * 每个保存的计划有一个唯一的编号。
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 用户 ID（外键关联 user 表）
     * 表示这个旅行计划是哪个用户的。
     * 每个用户只能看到自己的计划列表。
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * 目标城市
     * 例如：北京、上海、成都、东京...
     * length = 50：城市名最长 50 个字符，足够覆盖中文和英文城市名。
     */
    @Column(nullable = false, length = 50)
    private String city;

    /**
     * 旅行天数
     * 例如 3 表示三天游，5 表示五天游。
     * AI 生成计划时根据用户说的天数来分配每天的景点。
     * nullable = false 表示天数必须填写。
     */
    @Column(nullable = false)
    private Integer days;

    /**
     * 完整的行程计划内容（纯文本，Markdown 格式）
     * columnDefinition = "TEXT" → 数据库用 TEXT 类型，不限长度。
     *
     * AI 生成的完整旅行计划，包含每天的行程安排、景点介绍、酒店推荐等。
     * 存储的是原始 Markdown 文本，前端 PlansView 会把它解析并展示成图表。
     *
     * 示例内容格式：
     * ## 🏛️ 第一天：历史文化之旅
     * **上午**：故宫博物院（60元）
     * **下午**：天安门广场（免费）
     * **晚上**：王府井小吃街
     */
    @Column(columnDefinition = "TEXT")
    private String content;

    /**
     * 用户偏好（可选）
     * 例如："美食,文化,自然" —— 用户对这次旅行的兴趣偏好。
     * AI 生成计划时参考这个字段来筛选合适的景点。
     * length = 500：偏好描述最长 500 个字符。
     */
    @Column(length = 500)
    private String preferences;

    /**
     * 计划创建时间
     * updatable = false：一旦保存就不能修改创建时间。
     * 在 @PrePersist 方法中自动赋值。
     */
    @Column(name = "create_time", updatable = false)
    private LocalDateTime createTime;

    /**
     * 保存到数据库之前自动执行
     *
     * @PrePersist 是 JPA 的生命周期注解，
     * 在插入数据库前自动给 createTime 赋值为当前时间。
     * 这样用户在保存计划时不需要手动设置时间。
     */
    @PrePersist
    protected void onCreate() {
        this.createTime = LocalDateTime.now();
    }
}
