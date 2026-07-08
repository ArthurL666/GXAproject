package com.study.travel.repository;

import com.study.travel.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByUserIdOrderByCreateTimeAsc(Long userId);
    void deleteByUserId(Long userId);
}
