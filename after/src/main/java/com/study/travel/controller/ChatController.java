package com.study.travel.controller;

import com.study.travel.dto.ApiResult;
import com.study.travel.dto.ChatRequest;
import com.study.travel.dto.ChatResponse;
import com.study.travel.dto.PlanSaveRequest;
import com.study.travel.entity.ChatMessage;
import com.study.travel.entity.TravelPlan;
import com.study.travel.entity.User;
import com.study.travel.repository.ChatMessageRepository;
import com.study.travel.repository.TravelPlanRepository;
import com.study.travel.repository.UserRepository;
import com.study.travel.service.AgentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 聊天控制器 — 项目最核心的控制器
 *
 * 处理所有 AI 对话相关的 HTTP 请求，主要分为三块功能：
 * 1. 历史消息管理（查看/删除聊天记录）
 * 2. 旅行计划管理（保存/查看/删除行程）
 * 3. AI 聊天（流式对话 + 同步对话）
 *
 * 基础 URL：所有接口都以 /api/chat 开头
 * 需要在请求头带 JWT Token（除 history/plan 的删除操作）
 */
@RestController         // 标记为 REST 控制器，所有方法返回 JSON
@RequestMapping("/api/chat")   // 这个控制器的所有接口都以 /api/chat 开头
public class ChatController {

    // ==================== 依赖注入 ====================

    /**
     * AI 智能体服务
     * 负责调用 DeepSeek 大模型进行对话，是聊天功能的核心。
     */
    @Autowired
    private AgentService agentService;

    /**
     * 聊天消息数据访问层
     * 负责把聊天记录（用户消息 + AI 回复）保存到 H2 数据库，
     * 以及从数据库查询历史消息。
     */
    @Autowired
    private ChatMessageRepository chatMessageRepository;

    /**
     * 旅行计划数据访问层
     * 负责把用户保存的旅行计划存到数据库，
     * 以及查询/删除已保存的计划。
     */
    @Autowired
    private TravelPlanRepository travelPlanRepository;

    /**
     * 用户数据访问层
     * 通过用户名查询用户信息，用来获取当前登录用户的 ID。
     */
    @Autowired
    private UserRepository userRepository;

    // ==================== 工具方法 ====================

    /**
     * 从 Spring Security 的认证对象中获取当前用户的 ID
     *
     * Authentication 对象保存了当前登录用户的信息，
     * 它是 Spring Security 自动注入的，不需要我们自己创建。
     *
     * @param auth Spring Security 自动注入的认证对象
     * @return 当前用户的 ID，如果未登录则默认返回 1
     *
     * 处理逻辑：
     * 1. 如果 auth 为 null（用户未登录），返回默认用户 ID 1
     * 2. 从 auth 中拿到用户名（auth.getName()）
     * 3. 根据用户名从数据库查到完整的 User 对象
     * 4. 返回用户的 ID
     * 5. 如果查不到（理论上不会发生），也返回默认 ID 1
     */
    private Long getUserId(Authentication auth) {
        // 未登录状态 → 使用默认用户（方便调试）
        if (auth == null) return 1L;

        // 已登录 → 从数据库查出用户 ID
        return userRepository.findByUsername(auth.getName())
                .map(User::getId)         // 只取 ID 字段
                .orElse(1L);              // 查不到也用默认值
    }


    // ==================== 1️⃣ 历史消息管理 ====================

    /**
     * 获取当前用户的全部聊天历史记录
     *
     * 请求方式：GET /api/chat/history
     * 是否需要登录：是
     *
     * 前端调用时机：
     * - 用户打开聊天页面时，加载之前的聊天记录
     * - 用户从其他页面切回聊天页面时
     *
     * @param auth Spring Security 自动注入的认证信息
     * @return 包含消息列表的响应，按时间从早到晚排序
     *
     * 数据示例：
     * [
     *   { "id":1, "userId":1, "role":"user", "content":"你好", "createTime":"..." },
     *   { "id":2, "userId":1, "role":"assistant", "content":"您好！", "createTime":"..." }
     * ]
     */
    @GetMapping("/history")
    public ResponseEntity<ApiResult<List<ChatMessage>>> getHistory(Authentication auth) {
        // 1. 拿到当前用户的 ID
        Long userId = getUserId(auth);

        // 2. 从数据库查这个用户的所有消息，按时间升序排列（最早的在前）
        List<ChatMessage> messages = chatMessageRepository.findByUserIdOrderByCreateTimeAsc(userId);

        // 3. 包装成统一格式返回（ApiResult 是项目的标准响应包装）
        return ResponseEntity.ok(ApiResult.success(messages));
    }

    /**
     * 删除单条聊天记录
     *
     * 请求方式：DELETE /api/chat/history/{id}
     * 是否需要登录：否（直接根据 ID 删除）
     *
     * @param id 要删除的消息的 ID（从 URL 路径中获取）
     * @return 操作结果（成功或失败）
     */
    @DeleteMapping("/history/{id}")
    public ResponseEntity<ApiResult<Void>> deleteHistory(@PathVariable Long id) {
        // 直接按 ID 删除，不管是谁的消息（简化设计）
        chatMessageRepository.deleteById(id);
        return ResponseEntity.ok(ApiResult.success("删除成功", null));
    }

    /**
     * 清空当前用户的全部聊天记录
     *
     * 请求方式：DELETE /api/chat/history
     * 是否需要登录：是
     *
     * 用户点击"清空聊天记录"按钮时调用，
     * 会一次性删除这个用户的所有消息，谨慎操作！
     *
     * @param auth Spring Security 自动注入的认证信息
     * @return 操作结果
     */
    @DeleteMapping("/history")
    public ResponseEntity<ApiResult<Void>> clearHistory(Authentication auth) {
        // 1. 拿到当前用户的 ID
        Long userId = getUserId(auth);

        // 2. 删除这个用户的所有聊天消息
        chatMessageRepository.deleteByUserId(userId);

        return ResponseEntity.ok(ApiResult.success("已清空", null));
    }


    // ==================== 2️⃣ 旅行计划管理 ====================

    /**
     * 保存 AI 生成的旅行计划
     *
     * 请求方式：POST /api/chat/plan/save
     * 是否需要登录：是
     *
     * 用户在聊天界面看到 AI 生成的旅行计划后，
     * 点击"保存计划"按钮，前端会把计划内容 POST 到这个接口。
     *
     * @param auth    Spring Security 自动注入的认证信息
     * @param request 前端传来的计划数据，包含城市、天数、详细内容等
     * @return 保存成功后的计划对象（含自动生成的 ID 和时间）
     */
    @PostMapping("/plan/save")
    public ResponseEntity<ApiResult<TravelPlan>> savePlan(Authentication auth,
                                                          @Valid @RequestBody PlanSaveRequest request) {
        // 1. 拿到当前用户的 ID
        Long userId = getUserId(auth);

        // 2. 创建一个新的 TravelPlan 对象，把前端传来的数据填进去
        TravelPlan plan = new TravelPlan();
        plan.setUserId(userId);                 // 计划属于谁
        plan.setCity(request.getCity());        // 目标城市（如"北京"）
        plan.setDays(request.getDays());        // 旅行天数（如 3）
        plan.setContent(request.getContent());  // 完整的计划内容（Markdown 文本）
        plan.setPreferences(request.getPreferences());  // 用户偏好（如"美食,文化"）

        // 3. 保存到数据库（createTime 由实体类的 @PrePersist 自动生成）
        travelPlanRepository.save(plan);

        // 4. 返回保存后的计划（前端可以用返回的 ID 做后续操作）
        return ResponseEntity.ok(ApiResult.success("保存成功", plan));
    }

    /**
     * 获取当前用户的所有已保存计划
     *
     * 请求方式：GET /api/chat/plan/list
     * 是否需要登录：是
     *
     * 用户打开"我的行程"页面时调用，
     * 返回这个用户保存过的所有旅行计划，最新的排在最前面。
     *
     * @param auth Spring Security 自动注入的认证信息
     * @return 旅行计划列表，按创建时间倒序（最新在前）
     */
    @GetMapping("/plan/list")
    public ResponseEntity<ApiResult<List<TravelPlan>>> listPlans(Authentication auth) {
        // 1. 拿到当前用户的 ID
        Long userId = getUserId(auth);

        // 2. 从数据库查这个用户的所有计划，按时间倒序排列（最新的在前）
        List<TravelPlan> plans = travelPlanRepository.findByUserIdOrderByCreateTimeDesc(userId);

        // 3. 返回列表
        return ResponseEntity.ok(ApiResult.success(plans));
    }

    /**
     * 删除已保存的旅行计划
     *
     * 请求方式：DELETE /api/chat/plan/{id}
     * 是否需要登录：否（直接根据 ID 删除）
     *
     * 用户在"我的行程"页面点击删除按钮时调用。
     *
     * @param id 要删除的计划 ID（从 URL 路径中获取）
     * @return 操作结果
     */
    @DeleteMapping("/plan/{id}")
    public ResponseEntity<ApiResult<Void>> deletePlan(@PathVariable Long id) {
        // 直接按 ID 删除
        travelPlanRepository.deleteById(id);
        return ResponseEntity.ok(ApiResult.success("删除成功", null));
    }


    // ==================== 3️⃣ AI 聊天核心 ====================

    /**
     * 流式聊天（SSE 技术）— 项目最核心的接口
     *
     * 请求方式：POST /api/chat/stream
     * 是否需要登录：是
     * 返回格式：text/event-stream（SSE，Server-Sent Events）
     *
     * 什么是 SSE？
     * 传统 HTTP 请求：客户端发请求 → 等服务器算完 → 一次返回完整结果
     * SSE 流式请求：客户端发请求 → 服务器边算边返回（一个字一个字地返回）
     *
     * 为什么用 SSE？
     * AI 生成回复需要几秒钟，如果等全部生成完再返回，用户体验很差。
     * SSE 可以让 AI 每生成一个字就立即推送到前端，
     * 前端配合"打字机效果"，逐字显示给用户看，体验很流畅。
     *
     * 数据传输流程：
     * 用户输入 → ChatController → AgentService
     *   → Spring AI ChatClient → DeepSeek API（大模型）
     *   → 流式返回文字片段 → AgentService 包装成 Flux<String>
     *   → SSE 推送给前端 → 打字机效果逐字显示
     *
     * @param request 前端传来的聊天请求（包含用户消息文本）
     * @param auth    Spring Security 自动注入的认证信息
     * @return Flux<String> 响应式流，每个 String 是 AI 回复的一个片段
     *
     * Flux 是什么？
     * Flux 是 Spring WebFlux 中的响应式类型，代表"一个可以持续产生数据的流"。
     * 在这里，每个元素是 AI 回复的一小段文本。
     * Spring 会自动把 Flux 转换成 SSE 格式推送给前端。
     */
    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chatStream(@Valid @RequestBody ChatRequest request,
                                   Authentication auth) {
        // 1. 拿到当前用户的 ID
        Long userId = getUserId(auth);

        // 2. 获取用户名（用于创建对话 ID，区分不同用户的对话）
        String username = auth != null ? auth.getName() : "anonymous";

        // 3. 创建对话 ID（每个用户一个独立的对话会话）
        //    这个 ID 用于 Spring AI 的 ChatMemory 功能，
        //    让 AI 能记住之前聊过什么，实现多轮对话。
        String conversationId = "conv_" + username;

        // 4. 调用 AI 服务进行流式对话
        //    agentService.chatStream() 返回一个 Flux<String>
        //    Spring 会自动把 Flux 的每个元素逐条推送给前端
        return agentService.chatStream(request.getMessage(), userId, conversationId);
    }

    /**
     * 同步聊天（非流式，一次性返回完整回复）
     *
     * 请求方式：POST /api/chat
     * 是否需要登录：是
     * 返回格式：普通 JSON
     *
     * 和上面的流式接口不同，这个接口会等 AI 生成完整回复后才返回。
     * 适合不需要打字机效果的场景，比如后端内部调用。
     *
     * @param request 前端传来的聊天请求（包含用户消息）
     * @param auth    Spring Security 自动注入的认证信息
     * @return 包含 AI 完整回复的 ChatResponse 对象
     */
    @PostMapping
    public ResponseEntity<ApiResult<ChatResponse>> chat(@Valid @RequestBody ChatRequest request,
                                                        Authentication auth) {
        // 1. 拿到当前用户的 ID
        Long userId = getUserId(auth);

        // 2. 获取用户名（用于创建对话 ID）
        String username = auth != null ? auth.getName() : "anonymous";

        // 3. 创建对话 ID（保持和流式接口一致）
        String conversationId = "conv_" + username;

        // 4. 调用 AI 服务进行同步对话，等待完整回复
        String response = agentService.chat(request.getMessage(), userId, conversationId);

        // 5. 把回复包装成 ChatResponse DTO
        ChatResponse chatResp = new ChatResponse(
                "assistant",                                // 角色：AI 助手
                response,                                   // AI 回复的完整文本
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)  // 当前时间
        );

        // 6. 返回给前端
        return ResponseEntity.ok(ApiResult.success(chatResp));
    }
}
