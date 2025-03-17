import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, Avatar, Button, TextField, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  comments: { 
    id: string; 
    content: string; 
    createdAt: Date;
    user: { 
      id: string;
      name: string | null; 
      image: string | null;
    } 
  }[];
  postId: string;
  onAddComment: (postId: string, content: string) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ open, onClose, comments, onAddComment, postId }) => {
  const [commentInput, setCommentInput] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!open) return null;

  const handleCommentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCommentInput(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (commentInput.trim()) {
      onAddComment(postId, commentInput.trim());
      setCommentInput("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleCommentSubmit();
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <Box
        ref={modalRef}
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          padding: 2,
          width: '400px',
          boxShadow: 3,
        }}
      >
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Comments
        </Typography>
        {comments.length === 0 ? (
          <Typography sx={{ textAlign: 'center', my: 2, color: 'text.secondary' }}>
            Zatiaľ žiadne komentáre.
          </Typography>
        ) : (
          <Box sx={{ maxHeight: '300px', overflowY: 'auto', my: 2 }}>
            {comments.map((comment) => (
              <Box key={comment.id} sx={{ display: 'flex', mb: 2, gap: 1.5 }}>
                <Avatar 
                  src={comment.user.image || '/default-avatar.png'} 
                  alt={comment.user.name || 'User'}
                  sx={{ width: 36, height: 36 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {comment.user.name || 'Anonymný používateľ'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleString('sk-SK', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{comment.content}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={commentInput}
            onChange={handleCommentInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Pridaj komentár..."
            multiline
            rows={2}
            sx={{ mb: 1 }}
          />
          <Button 
            variant="contained" 
            onClick={handleCommentSubmit}
            disabled={!commentInput.trim()}
            sx={{ 
              bgcolor: '#D32F2F', 
              '&:hover': { bgcolor: '#B71C1C' },
              '&.Mui-disabled': { bgcolor: '#f5f5f5', color: '#bdbdbd' }
            }}
          >
            Pridať komentár
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CommentModal; 