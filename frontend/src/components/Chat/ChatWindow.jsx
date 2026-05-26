import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
} from "@mui/material";
import {
  Send as SendIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { chatAPI } from "../../api/apiService";
import useAuthStore from "../../store/authStore";

export default function ChatWindow({ open, onClose, onNewMessage }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(null); // Track tin nhắn cuối
  const [isPolling, setIsPolling] = useState(false); // Control polling
  
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Smart polling - chỉ check tin nhắn mới, không reload tất cả
  const checkForNewMessages = async () => {
    try {
      console.log("🔍 Checking for new messages...");
      const data = await chatAPI.getMessages({ limit: 20 });
      const serverMessages = data.messages || [];
      
      if (serverMessages.length === 0) {
        console.log("📭 No messages from server");
        return;
      }
      
      const serverLatestId = serverMessages[serverMessages.length - 1]._id;
      console.log("📨 Server latest message ID:", serverLatestId);
      console.log("📌 Current last message ID:", lastMessageId);
      
      // Nếu chưa có lastMessageId hoặc có tin nhắn mới
      if (!lastMessageId || serverLatestId !== lastMessageId) {
        console.log("🔔 New messages detected! Updating...");
        
        // So sánh số lượng tin nhắn
        const currentCount = messages.length;
        const serverCount = serverMessages.length;
        console.log(`📊 Messages count: Current ${currentCount}, Server ${serverCount}`);
        
        // Update messages và lastMessageId
        setMessages(serverMessages);
        setLastMessageId(serverLatestId);
        
        // Notify parent nếu có tin nhắn mới không phải của mình
        const hasNewFromOthers = serverMessages.some(msg => 
          msg.sender?._id !== user?._id && 
          (!lastMessageId || msg._id !== lastMessageId)
        );
        
        if (hasNewFromOthers && !open) {
          console.log("🔔 Notifying parent of new messages");
          onNewMessage?.();
        }
        
        console.log("✅ Messages updated successfully");
      } else {
        console.log("📝 No new messages");
      }
    } catch (error) {
      console.error("❌ Error checking new messages:", error);
      // Không dừng polling khi có lỗi, chỉ log
    }
  };

  // Start/stop polling
  const startPolling = () => {
    if (pollingIntervalRef.current) {
      console.log("⚠️ Polling already running");
      return; // Already polling
    }
    
    console.log("🔄 Starting smart polling every 2 seconds...");
    setIsPolling(true);
    
    // Chạy check ngay lập tức
    checkForNewMessages();
    
    // Sau đó check mỗi 2 giây
    pollingIntervalRef.current = setInterval(() => {
      console.log("⏰ Polling interval triggered");
      checkForNewMessages();
    }, 2000); // Giảm xuống 2 giây để responsive hơn
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      console.log("⏹️ Stopping polling...");
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
  };

  // Load messages khi mở chat và start polling
  useEffect(() => {
    if (open) {
      // Debug user hiện tại
      console.log("🔍 Chat opened - Current user:", user);
      console.log("🔍 User name:", user?.name);
      console.log("🔍 User email:", user?.email);
      console.log("🔍 User role:", user?.role?.role_name);
      
      // Load messages và participants
      const initializeChat = async () => {
        await loadMessages();
        await loadParticipants();
        
        // Start polling ngay sau khi load xong
        console.log("🚀 Starting polling after initial load...");
        startPolling();
      };
      
      initializeChat();
      
      // Focus vào input
      setTimeout(() => {
        messageInputRef.current?.focus();
      }, 100);
      
    } else {
      // Stop polling khi đóng chat
      console.log("🔒 Chat closed, stopping polling");
      stopPolling();
    }
    
    // Cleanup khi component unmount
    return () => {
      console.log("🧹 Cleanup: stopping polling");
      stopPolling();
    };
  }, [open]);

  // Scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading messages...");
      const data = await chatAPI.getMessages({ limit: 50 });
      console.log("✅ Messages loaded:", data);
      const newMessages = data.messages || [];
      setMessages(newMessages);
      
      // Set last message ID để track tin nhắn mới
      if (newMessages.length > 0) {
        const latestId = newMessages[newMessages.length - 1]._id;
        setLastMessageId(latestId);
        console.log("📌 Set last message ID:", latestId);
      }
    } catch (error) {
      console.error("❌ Error loading messages:", error);
      // Hiển thị thông báo lỗi cho user
      if (error.response?.status === 403) {
        console.error("User không có quyền truy cập chat");
      } else if (error.response?.status === 401) {
        console.error("User chưa đăng nhập");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadParticipants = async () => {
    try {
      console.log("🔄 Loading participants...");
      const data = await chatAPI.getParticipants();
      console.log("✅ Participants loaded:", data);
      setParticipants(data || []);
    } catch (error) {
      console.error("❌ Error loading participants:", error);
      if (error.response?.status === 403) {
        console.error("User không có quyền truy cập chat");
      }
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      console.log("🔄 Sending message:", newMessage.trim());
      console.log("👤 Current user:", user);
      
      const messageData = {
        content: newMessage.trim(),
        replyTo: replyTo?._id || null,
      };

      const sentMessage = await chatAPI.sendMessage(messageData);
      console.log("✅ Message sent:", sentMessage);
      
      // Đảm bảo tin nhắn có đầy đủ thông tin sender từ server response
      if (sentMessage && sentMessage.sender) {
        // Thêm tin nhắn mới vào danh sách với thông tin từ server
        setMessages(prev => [...prev, sentMessage]);
        
        // Update last message ID
        setLastMessageId(sentMessage._id);
        console.log("📌 Updated last message ID:", sentMessage._id);
      } else {
        // Fallback: reload messages nếu response không có đầy đủ thông tin
        console.log("⚠️ Message response incomplete, reloading messages");
        loadMessages();
      }
      
      // Reset form
      setNewMessage("");
      setReplyTo(null);
      
      // Notify parent component
      onNewMessage?.();
      
    } catch (error) {
      console.error("❌ Error sending message:", error);
      if (error.response?.status === 403) {
        alert("Bạn không có quyền gửi tin nhắn trong chat này");
      } else if (error.response?.status === 401) {
        alert("Vui lòng đăng nhập lại");
      } else {
        alert("Có lỗi xảy ra khi gửi tin nhắn");
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await chatAPI.deleteMessage(messageId);
      // Reload messages
      loadMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getRoleColor = (roleName) => {
    switch (roleName) {
      case "HAMLET LEADER": return "#f44336";
      case "ACCOUNTANT": return "#2196f3";
      default: return "#4caf50";
    }
  };

  const getRoleLabel = (roleName) => {
    switch (roleName) {
      case "HAMLET LEADER": return "Admin";
      case "ACCOUNTANT": return "Kế toán";
      default: return "Chủ hộ";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          height: "600px",
          maxHeight: "80vh",
          position: "fixed",
          bottom: 20,
          right: 20,
          top: "auto",
          left: "auto",
          margin: 0,
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          backgroundColor: "#1976d2",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6">Chat Cộng Đồng</Typography>
          <Chip
            size="small"
            label={`${participants.length} người`}
            sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
          />
          {isPolling && (
            <Chip
              size="small"
              label="🔄 Live"
              sx={{ 
                backgroundColor: "rgba(76, 175, 80, 0.8)", 
                color: "white",
                fontSize: "0.7rem",
                height: 20
              }}
            />
          )}
        </Box>
        <Box>
          <IconButton
            size="small"
            onClick={checkForNewMessages}
            sx={{ color: "white", mr: 1 }}
            title="Test check messages"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </IconButton>
          <IconButton
            size="small"
            onClick={isPolling ? stopPolling : startPolling}
            sx={{ color: "white", mr: 1 }}
            title={isPolling ? "Tắt auto-refresh" : "Bật auto-refresh"}
          >
            {isPolling ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </IconButton>
          <IconButton
            size="small"
            onClick={loadMessages}
            sx={{ color: "white", mr: 1 }}
            title="Refresh tin nhắn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setShowParticipants(!showParticipants)}
            sx={{ color: "white", mr: 1 }}
          >
            <PeopleIcon />
          </IconButton>
          <IconButton size="small" onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Participants Panel */}
        {showParticipants && (
          <Paper sx={{ p: 2, m: 1, maxHeight: "150px", overflow: "auto" }}>
            <Typography variant="subtitle2" gutterBottom>
              Người tham gia ({participants.length})
            </Typography>
            <List dense>
              {participants.map((participant) => (
                <ListItem key={participant._id} sx={{ py: 0.5 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem" }}>
                      {participant.user?.name?.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={participant.user?.name}
                    secondary={getRoleLabel(participant.user?.role?.role_name)}
                    primaryTypographyProps={{ fontSize: "0.875rem" }}
                    secondaryTypographyProps={{ fontSize: "0.75rem" }}
                  />
                  <Chip
                    size="small"
                    label={getRoleLabel(participant.user?.role?.role_name)}
                    sx={{
                      backgroundColor: getRoleColor(participant.user?.role?.role_name),
                      color: "white",
                      fontSize: "0.7rem",
                      height: 20,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Messages Area */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 1,
            backgroundColor: "#f5f5f5",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {messages.map((message) => {
                const isOwn = message.sender?._id === user?._id;
                return (
                  <Box
                    key={message._id}
                    sx={{
                      display: "flex",
                      justifyContent: isOwn ? "flex-end" : "flex-start",
                      mb: 1,
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1.5,
                        maxWidth: "70%",
                        backgroundColor: isOwn ? "#1976d2" : "white",
                        color: isOwn ? "white" : "black",
                        borderRadius: 2,
                        position: "relative",
                      }}
                    >
                      {/* Reply indicator */}
                      {message.replyTo && (
                        <Box
                          sx={{
                            p: 1,
                            mb: 1,
                            backgroundColor: "rgba(0,0,0,0.1)",
                            borderRadius: 1,
                            borderLeft: "3px solid",
                            borderLeftColor: isOwn ? "white" : "#1976d2",
                          }}
                        >
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            Trả lời: {message.replyTo.sender?.name}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                            {message.replyTo.content}
                          </Typography>
                        </Box>
                      )}

                      {/* Sender info */}
                      {!isOwn && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          <Typography variant="caption" fontWeight={600}>
                            {message.sender?.name}
                          </Typography>
                          <Chip
                            size="small"
                            label={getRoleLabel(message.sender?.role?.role_name)}
                            sx={{
                              backgroundColor: getRoleColor(message.sender?.role?.role_name),
                              color: "white",
                              fontSize: "0.6rem",
                              height: 16,
                            }}
                          />
                        </Box>
                      )}

                      {/* Message content */}
                      <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                        {message.content}
                      </Typography>

                      {/* Time and actions */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ opacity: 0.7, fontSize: "0.7rem" }}
                        >
                          {formatTime(message.createdAt)}
                        </Typography>
                        
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => setReplyTo(message)}
                            sx={{ 
                              color: isOwn ? "white" : "inherit",
                              opacity: 0.7,
                              "&:hover": { opacity: 1 }
                            }}
                          >
                            <ReplyIcon fontSize="small" />
                          </IconButton>
                          
                          {(isOwn || user?.role?.role_name === "HAMLET LEADER") && (
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteMessage(message._id)}
                              sx={{ 
                                color: isOwn ? "white" : "inherit",
                                opacity: 0.7,
                                "&:hover": { opacity: 1 }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </Box>

        {/* Reply indicator */}
        {replyTo && (
          <Box sx={{ p: 1, backgroundColor: "#e3f2fd", borderTop: "1px solid #ddd" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="caption" color="primary">
                  Đang trả lời: {replyTo.sender?.name}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {replyTo.content}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => setReplyTo(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        )}

        {/* Input Area */}
        <Box sx={{ p: 1, backgroundColor: "white", borderTop: "1px solid #ddd" }}>
          <TextField
            ref={messageInputRef}
            fullWidth
            multiline
            maxRows={3}
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    color="primary"
                  >
                    {sending ? <CircularProgress size={20} /> : <SendIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}