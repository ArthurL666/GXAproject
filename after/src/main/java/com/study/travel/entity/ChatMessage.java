package com.study.travel.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;


@Data               // Lombok：自动生成 getter/setter/toString 等
@Entity             // 标记这是一个 JPA 实体类（与数据库表映射）
@Table(name = "chat_messages")  // 指定对应数据库中的表名
public class ChatMessage {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "user_id", nullable = false)
    private Long userId;


    @Column(nullable = false, length = 20)
    private String role;


    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;


    @Column(name = "create_time", updatable = false)
    private LocalDateTime createTime;


    @PrePersist
    protected void onCreate() {
        this.createTime = LocalDateTime.now();
    }
}
