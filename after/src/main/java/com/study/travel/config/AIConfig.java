package com.study.travel.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Spring AI 配置 — ChatClient + ChatMemory + Tool Calling
 *
 * 架构：ChatClient = LLM + SystemPrompt + ChatMemoryAdvisor + Tools(自动发现FunctionCallback)
 */
@Configuration
public class AIConfig {

    /**
     * 对话记忆 — 存储多轮对话上下文
     * 生产环境可替换为 RedisChatMemory / CassandraChatMemory
     */
    @Bean
    public ChatMemory chatMemory() {
        return new InMemoryChatMemory();
    }

    /**
     * ChatMemory Advisor — 将记忆注入到每次对话中
     */
    @Bean
    public MessageChatMemoryAdvisor chatMemoryAdvisor(ChatMemory chatMemory) {
        return new MessageChatMemoryAdvisor(chatMemory);
    }

    /**
     * ChatClient — Spring AI 核心入口
     *
     * 配置：
     * - System Prompt：定义旅游助手角色和行为
     * - ChatMemory Advisor：自动管理多轮对话上下文
     * - Tools：Spring AI 自动发现所有 FunctionCallback Bean
     */
    @Bean
    @Primary
    public ChatClient chatClient(OpenAiChatModel chatModel, MessageChatMemoryAdvisor memoryAdvisor) {
        return ChatClient.builder(chatModel)
                .defaultSystem("""
                    你是专业的AI旅游规划助手 ✈️🌍，名字叫"旅行小助手"。

                    【核心能力】
                    1. 规划旅行路线，推荐景点和酒店
                    2. 根据用户偏好（预算、兴趣、出行天数）个性化调整行程
                    3. 调用工具获取实时数据（景点信息、酒店推荐、天气查询、行程生成）
                    4. 保持自然、友好、热情、专业的对话风格

                    【行为准则】
                    - 当用户提到目的地+天数时，主动调用 generateTravelPlan 工具
                    - 当用户问天气时，调用 getWeather 工具
                    - 当用户问景点时，调用 getScenicSpots 工具
                    - 当用户问酒店时，调用 getHotels 工具
                    - 回复中使用适当的emoji和Markdown格式增强可读性
                    - 如果用户没有明确目的地，主动提供热门城市推荐
                    - 记住用户之前的偏好（预算、兴趣等），在多轮对话中保持一致
                    """)
                .defaultAdvisors(memoryAdvisor)
                .build();
    }
}
