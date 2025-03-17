"use client";

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import CommentModal from "@/prispevok/CommentModal";
import { useSession } from "next-auth/react";

import { fetchPosts } from "@/app/actions/posts";

interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
  };
}

interface Comment {
  id: string;
  postId: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

// User data will come from the session

const PostsView = () => {
  const { data: session } = useSession();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [openModal, setOpenModal] = useState<{ [key: string]: boolean }>({});
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showCommentField, setShowCommentField] = useState<{ [key: string]: boolean }>({});
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newLikes = new Set(prev);
      if (newLikes.has(postId)) {
        newLikes.delete(postId);
      } else {
        newLikes.add(postId);
      }
      return newLikes;
    });
  };

  const addComment = async (postId: string, content: string) => {
    if (!content.trim()) return;

    try {
      // Add optimistic comment immediately for better UX
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        postId,
        content,
        createdAt: new Date(),
        user: {
          id: session?.user?.id || '',
          name: session?.user?.name || 'You',
          image: session?.user?.image || null
        }
      };
      
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), optimisticComment]
      }));

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add comment');
      }

      // Fetch the updated comments list
      await fetchCommentsForPost(postId);
    } catch (error) {
      console.error('Failed to add comment:', error);
      // Remove optimistic comment if there was an error
      setComments(prev => {
        const filtered = prev[postId]?.filter(c => !c.id.startsWith('temp-')) || [];
        return { ...prev, [postId]: filtered };
      });
    }
  };

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts: Post[] = await fetchPosts();
        setPosts(fetchedPosts);
        
        // Fetch comments for all posts in parallel
        if (fetchedPosts.length > 0) {
          await Promise.all(fetchedPosts.map(post => fetchCommentsForPost(post.id)));
        }

        // Fetch saved posts
        if (session?.user) {
          const response = await fetch('/api/saved-posts', {
            cache: 'no-store',
            next: { revalidate: 60 } // Revalidate every 60 seconds
          });
          if (response.ok) {
            const data = await response.json();
            const savedPostIds = new Set<string>(
              data.savedPosts?.map((sp: { post: { id: string } }) => 
                sp.post.id
              ).filter(Boolean) || []
            );
            setSavedPosts(savedPostIds);
          }
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    loadPosts();
  }, [session]);
  
  const fetchCommentsForPost = async (postId: string): Promise<Comment[]> => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`, {
        cache: 'no-store',
        next: { revalidate: 60 } // Revalidate every 60 seconds
      });
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      setComments(prev => ({
        ...prev,
        [postId]: data.comments || []
      }));
      return data.comments || [];
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId}:`, error);
      return [];
    }
  };

  const openCommentsModal = (postId: string) => {
    setSelectedPostId(postId);
    setOpenModal((prev) => ({ ...prev, [postId]: true }));
  };

  const closeCommentsModal = () => {
    setOpenModal((prev) => ({ ...prev, [selectedPostId!]: false }));
    setSelectedPostId(null);
  };

  const handleAddComment = async (postId: string, content: string): Promise<void> => {
    if (postId && content.trim()) {
      await addComment(postId, content);
      setCommentText(prev => ({ ...prev, [postId]: '' }));
    }
  };

  const toggleSave = async (postId: string) => {
    if (!session?.user) return;
    
    try {
      // Optimistically update UI first for better UX
      setSavedPosts((prev) => {
        const newSaved = new Set(prev);
        if (newSaved.has(postId)) {
          newSaved.delete(postId);
        } else {
          newSaved.add(postId);
        }
        return newSaved;
      });

      const method = savedPosts.has(postId) ? 'DELETE' : 'POST';
      const response = await fetch('/api/saved-posts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle save');
      }
    } catch (error) {
      console.error('Failed to toggle save:', error);
      
      // Rollback on error
      setSavedPosts((prev) => {
        const newSaved = new Set(prev);
        if (savedPosts.has(postId)) {
          newSaved.add(postId);
        } else {
          newSaved.delete(postId);
        }
        return newSaved;
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        Príspevky
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 2, overflow: "hidden", height: "auto", maxWidth: "100%" }}>
              <CardMedia
                component="img"
                image={post.imageUrl}
                alt={post.caption || "Príspevok bez popisu"}
                loading="lazy"
                sx={{ 
                  width: "100%", 
                  objectFit: "cover", 
                  aspectRatio: "1 / 1",
                  height: "auto",
                  maxHeight: "500px"
                }}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
              />
              <CardContent sx={{ p: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  {post.user.name || "Neznámy používateľ"}
                </Typography>
                {post.caption && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {post.caption}
                  </Typography>
                )}
                <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1, mb: 1 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => toggleLike(post.id)}
                    sx={{
                      transition: 'transform 0.2s',
                      '&:hover': { 
                        transform: 'scale(1.1)',
                        bgcolor: 'rgba(211, 47, 47, 0.04)'
                      }
                    }}
                  >
                    {likedPosts.has(post.id) ? (
                      <FavoriteIcon sx={{ fontSize: 28, color: "#D32F2F" }} />
                    ) : (
                      <FavoriteBorderIcon
                        sx={{ fontSize: 28, color: "#757575" }}
                      />
                    )}
                  </IconButton>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      color: likedPosts.has(post.id) ? '#D32F2F' : '#757575',
                      minWidth: '30px'
                    }}
                  >
                    {likedPosts.has(post.id) ? 1 : 0}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <IconButton 
                      size="small" 
                      onClick={() => openCommentsModal(post.id)}
                      sx={{
                        transition: 'transform 0.2s',
                        '&:hover': { 
                          transform: 'scale(1.1)',
                          bgcolor: 'rgba(211, 47, 47, 0.04)'
                        }
                      }}
                    >
                      <ChatBubbleOutlineIcon
                        sx={{ fontSize: 24, color: "#757575" }}
                      />
                    </IconButton>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        color: '#757575',
                        minWidth: '30px'
                      }}
                    >
                      {(comments[post.id]?.length || 0)}
                    </Typography>
                  </Box>
                  <Box sx={{ marginLeft: 'auto' }}>
                    <IconButton
                      size="small"
                      onClick={() => toggleSave(post.id)}
                      sx={{
                        transition: 'transform 0.2s',
                        '&:hover': { 
                          transform: 'scale(1.1)',
                          bgcolor: 'rgba(211, 47, 47, 0.04)'
                        }
                      }}
                    >
                      {savedPosts.has(post.id) ? (
                        <BookmarkIcon sx={{ fontSize: 24, color: "#D32F2F" }} />
                      ) : (
                        <BookmarkBorderIcon sx={{ fontSize: 24, color: "#757575" }} />
                      )}
                    </IconButton>
                  </Box>
                </Box>
                <Box mt={1}>
                  {!showCommentField[post.id] ? (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        cursor: 'pointer',
                        color: '#757575',
                        '&:hover': { 
                          color: '#D32F2F',
                          textDecoration: 'underline'
                        },
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onClick={() => {
                        setShowCommentField(prev => ({ ...prev, [post.id]: true }));
                        setCommentText(prev => ({ ...prev, [post.id]: '' }));
                      }}
                    >
                      <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} /> Pridať komentár
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Napíš komentár..."
                        value={commentText[post.id] || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyPress={(e: React.KeyboardEvent<HTMLDivElement>) => {
                          if (e.key === 'Enter' && commentText[post.id]?.trim()) {
                            handleAddComment(post.id, commentText[post.id]);
                            setShowCommentField(prev => ({ ...prev, [post.id]: false }));
                            setCommentText(prev => ({ ...prev, [post.id]: '' }));
                          }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#757575',
                            },
                            '&:hover fieldset': {
                              borderColor: '#D32F2F',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#D32F2F',
                            },
                          },
                        }}
                      />
                      <IconButton 
                        size="small"
                        onClick={() => {
                          if (commentText[post.id]?.trim()) {
                            handleAddComment(post.id, commentText[post.id]);
                            setShowCommentField(prev => ({ ...prev, [post.id]: false }));
                            setCommentText(prev => ({ ...prev, [post.id]: '' }));
                          }
                        }}
                        sx={{
                          color: commentText[post.id]?.trim() ? '#D32F2F' : '#757575',
                          '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.04)' },
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
            <CommentModal
              open={openModal[post.id] || false}
              onClose={closeCommentsModal}
              comments={comments[post.id] || []}
              onAddComment={handleAddComment}
              postId={post.id}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PostsView;
