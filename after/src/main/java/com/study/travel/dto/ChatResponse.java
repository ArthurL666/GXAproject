package com.study.travel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 聊天响应 DTO（数据传输对象）
 *
 * 当后端处理完用户的聊天请求后，把 AI 的回复封装成这个对象返回给前端。
 * 包含三个字段：角色（是AI还是用户）、回复内容、时间戳。
 *
 * 最终返回给前端的 JSON 格式示例：
 * {
 *   "role": "assistant",
 *   "content": "您好！北京有很多好玩的景点，比如故宫、天安门...",
 *   "timestamp": "2026-07-07T15:30:00"
 * }
 */
@Data               // Lombok 注解：自动生成 getter/setter/toString/equals/hashCode
@AllArgsConstructor  // Lombok 注解：生成一个包含所有字段的构造方法（new ChatResponse(role, content, timestamp)）
@NoArgsConstructor   // Lombok 注解：生成一个无参构造方法（new ChatResponse()），JSON 反序列化时需要
public class ChatResponse {

    /**
     * 消息角色
     * - "user"     → 用户发的消息
     * - "assistant" → AI 助手的回复
     * 在同步聊天接口（POST /api/chat）的返回值中使用，
     * 告诉前端这条消息是谁说的。
     */
    private String role;

    /**
     * 消息内容
     * AI 助手回复的完整文本，可能是纯文字，也可能是 Markdown 格式。
     * 前端收到后会用 marked 库把 Markdown 渲染成漂亮的 HTML 显示给用户。
     */
    private String content;

    /**
     * 时间戳
     * 格式为 ISO 标准时间字符串，例如 "2026-07-07T15:30:00"
     * 表示这条回复是什么时候生成的。
     */
    private String timestamp;
}
