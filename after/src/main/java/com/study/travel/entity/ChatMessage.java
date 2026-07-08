package com.study.travel.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 聊天消息实体类 — 对应数据库中的 chat_messages 表
 *
 * 每次用户和 AI 对话时，产生两条消息（用户发一条、AI 回一条），
 * 每条消息都会作为一个 ChatMessage 记录存到数据库里。
 * 这样用户刷新页面后，之前的聊天记录还能从数据库加载回来。
 *
 * 数据库表结构：chat_messages
 * ┌──────┬─────────┬───────┬─────────────┬────────────────┐
 * │  id  │ user_id │ role  │   content   │   create_time   │
 * ├──────┼─────────┼───────┼─────────────┼────────────────┤
 * │  1   │    1    │ user  │ 我想去北京   │ 2026-07-07 10:00│
 * │  2   │    1    │assist.│ 推荐故宫...  │ 2026-07-07 10:01│
 * └──────┴─────────┴───────┴─────────────┴────────────────┘
 */
@Data               // Lombok：自动生成 getter/setter/toString 等
@Entity             // 标记这是一个 JPA 实体类（与数据库表映射）
@Table(name = "chat_messages")  // 指定对应数据库中的表名
public class ChatMessage {

    /**
     * 消息唯一 ID（自增主键）
     * 每条消息有一个唯一的编号，用于删除指定消息等操作。
     * GenerationType.IDENTITY 表示由数据库自动生成（自增）。
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 用户 ID（外键关联 user 表）
     * 表示这条消息是谁发的/谁收到的。
     * nullable = false 表示这个字段不能为空，每条消息必须属于某个用户。
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * 消息角色
     * - "user"     → 用户发送的消息
     * - "assistant" → AI 助手回复的消息
     * length = 20 表示数据库里这个字段最长 20 个字符，够用了。
     */
    @Column(nullable = false, length = 20)
    private String role;

    /**
     * 消息内容（纯文本，支持 Markdown 格式）
     * columnDefinition = "TEXT" 表示数据库用 TEXT 类型存储，
     * 不像普通字段有 255 字符限制，可以存很长的内容。
     * AI 的一次完整回复可能包含多段文字和 Markdown 格式，都会存在这里。
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    /**
     * 消息创建时间
     * updatable = false 表示这个字段一旦写入就不能再修改（防止篡改时间戳）。
     * 在 @PrePersist 方法中自动赋值。
     */
    @Column(name = "create_time", updatable = false)
    private LocalDateTime createTime;

    /**
     * 在保存到数据库之前自动执行
     *
     * @PrePersist 是 JPA 的生命周期注解，
     * 意思是"在插入数据库之前，先执行这个方法"。
     * 这里用来给 createTime 自动填上当前时间，这样代码里就不用手动 set 了。
     */
    @PrePersist
    protected void onCreate() {
        this.createTime = LocalDateTime.now();
    }
}
