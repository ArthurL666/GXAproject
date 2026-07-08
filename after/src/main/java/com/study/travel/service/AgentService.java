package com.study.travel.service;

import com.study.travel.entity.ChatMessage;
import com.study.travel.repository.ChatMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

/**
 * 智能体核心服务 — Spring AI ChatClient 驱动
 *
 * 架构：ChatClient = LLM + SystemPrompt + Tools + ChatMemory
 * AI 根据用户输入自主决策调用哪些 Tool，整合结果后生成回复
 * 仅支持真实 LLM 调用，无模拟回答
 */
@Service
public class AgentService {

    private static final Logger log = LoggerFactory.getLogger(AgentService.class);

    @Autowired
    private ChatClient chatClient;

    @Autowired
    private ChatMemory chatMemory;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    /**
     * Spring AI 流式对话 — Flux<SSE>
     * AI 自主决策 Tool Calling 链：分析意图 → 调用工具 → 整合结果 → 流式输出
     */
    public Flux<String> chatStream(String userMessage, Long userId, String conversationId) {
        // 保存用户消息
        saveMessage(userId, "user", userMessage);

        StringBuilder fullResponse = new StringBuilder();
        return chatClient.prompt()
                .user(userMessage)
                .advisors(a -> a.param("chat_memory_conversation_id", conversationId))
                .stream()
                .content()
                .doOnNext(chunk -> {
                    fullResponse.append(chunk);
                    log.debug("AI stream chunk: {}", chunk);
                })
                .doOnComplete(() -> {
                    String content = fullResponse.toString();
                    if (!content.isEmpty()) {
                        saveMessage(userId, "assistant", content);
                        log.info("AI response saved ({} chars)", content.length());
                    }
                })
                .doOnError(e -> log.error("Spring AI streaming error", e));
    }

    /**
     * 同步对话
     */
    public String chat(String userMessage, Long userId, String conversationId) {
        saveMessage(userId, "user", userMessage);

        String content = chatClient.prompt()
                .user(userMessage)
                .advisors(a -> a.param("chat_memory_conversation_id", conversationId))
                .call()
                .content();
        if (content != null && !content.isEmpty()) {
            saveMessage(userId, "assistant", content);
        }
        return content;
    }

    private void saveMessage(Long userId, String role, String content) {
        ChatMessage msg = new ChatMessage();
        msg.setUserId(userId);
        msg.setRole(role);
        msg.setContent(content);
        chatMessageRepository.save(msg);
    }
}
