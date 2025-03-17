'use client';

import { useEffect, useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CommentModal from '@/prispevok/CommentModal';
import CircularProgress from '@mui/material/CircularProgress';

interface SavedPost {
  post: {
    id: string;
    userId: string;
    imageUrl: string;
    caption?: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
      name: string | null;
    };
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

export default function SavedPostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [openModal, setOpenModal] = useState<{ [key: string]: boolean }>({});
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const fetchCommentsForPost = useCallback(async (postId: string): Promise<Comment[]> => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`, {
        cache: 'no-store',
        next: { revalidate: 60 }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data: { comments: Comment[] } = await response.json();
      setComments(prev => ({
        ...prev,
        [postId]: data.comments || []
      }));
      return data.comments || [];
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId}:`, error);
      return [];
    }
  }, []);

  const fetchSavedPosts = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/saved-posts', {
        cache: 'no-store',
        next: { revalidate: 60 }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch saved posts');
      }
      const data: { savedPosts: SavedPost[] } = await response.json();
      setSavedPosts(data.savedPosts || []);

      if (data.savedPosts && data.savedPosts.length > 0) {
        const postIds = data.savedPosts.map((savedPost: SavedPost) => savedPost.post.id);
        await Promise.all(postIds.map(fetchCommentsForPost));
      }
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchCommentsForPost]);

  const unsavePost = async (postId: string) => {
    try {
      const response = await fetch('/api/saved-posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        setSavedPosts(prev => prev.filter(item => item.post.id !== postId));
      }
    } catch (error) {
      console.error('Failed to unsave post:', error);
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

  const handleAddComment = async (postId: string, content: string): Promise<void> => {
    if (!content.trim()) return;
    try {
      const optimisticComment = {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add comment');
      }
      await fetchCommentsForPost(postId);
    } catch (error) {
      console.error('Failed to add comment:', error);
      setComments(prev => {
        const filtered = prev[postId]?.filter(c => !c.id.startsWith('temp-')) || [];
        return { ...prev, [postId]: filtered };
      });
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/prihlasenie');
    } else if (status === 'authenticated') {
      fetchSavedPosts();
    }
  }, [status, router, fetchSavedPosts]);

  if (status === 'loading' || loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress color="error" />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 10 }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        Uložené príspevky
      </Typography>
      
      {savedPosts.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1">
            Nemáte žiadne uložené príspevky.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {savedPosts.map((savedPost) => (
            <Grid item xs={12} key={savedPost.post.id}>
              <Card sx={{ borderRadius: 2, boxShadow: 2, overflow: "hidden", height: "auto", maxWidth: "100%" }}>
                <CardMedia
                  component="img"
                  image={savedPost.post.imageUrl}
                  alt={savedPost.post.caption || "Príspevok bez popisu"}
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
                  <Typography variant="body2" fontWeight="bold" sx={{ color: '#424242' }}>
                    {savedPost.post.user.name || "Neznámy používateľ"}
                  </Typography>
                  {savedPost.post.caption && (
                    <Typography variant="body2" sx={{ mb: 1, color: '#757575' }}>
                      {savedPost.post.caption}
                    </Typography>
                  )}
                  <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1, mb: 1 }}>
                    <Box display="flex" alignItems="center">
                      <IconButton 
                        size="small" 
                        onClick={() => toggleLike(savedPost.post.id)}
                        sx={{
                          transition: 'transform 0.2s',
                          '&:hover': { 
                            transform: 'scale(1.1)',
                            bgcolor: 'rgba(211, 47, 47, 0.04)'
                          }
                        }}
                      >
                        {likedPosts.has(savedPost.post.id) ? (
                          <FavoriteIcon sx={{ fontSize: 28, color: "#D32F2F" }} />
                        ) : (
                          <FavoriteBorderIcon sx={{ fontSize: 28, color: "#757575" }} />
                        )}
                      </IconButton>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          color: likedPosts.has(savedPost.post.id) ? '#D32F2F' : '#757575',
                          minWidth: '30px'
                        }}
                      >
                        {likedPosts.has(savedPost.post.id) ? 1 : 0}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <IconButton 
                        size="small" 
                        onClick={() => openCommentsModal(savedPost.post.id)}
                        sx={{
                          transition: 'transform 0.2s',
                          '&:hover': { 
                            transform: 'scale(1.1)',
                            bgcolor: 'rgba(211, 47, 47, 0.04)'
                          }
                        }}
                      >
                        <ChatBubbleOutlineIcon
                          sx={{ fontSize: 28, color: "#757575" }}
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
                        {(comments[savedPost.post.id]?.length || 0)}
                      </Typography>
                    </Box>
                    <Box sx={{ marginLeft: 'auto' }}>
                      <IconButton
                        size="small"
                        onClick={() => unsavePost(savedPost.post.id)}
                        sx={{
                          transition: 'transform 0.2s',
                          '&:hover': { 
                            transform: 'scale(1.1)',
                            bgcolor: 'rgba(211, 47, 47, 0.04)'
                          }
                        }}
                      >
                        <BookmarkIcon sx={{ fontSize: 28, color: "#D32F2F" }} />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box mt={1}>
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
                      onClick={() => openCommentsModal(savedPost.post.id)}
                    >
                      <ChatBubbleOutlineIcon sx={{ fontSize: 20 }} /> Pridať komentár
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              <CommentModal
                open={openModal[savedPost.post.id] || false}
                onClose={closeCommentsModal}
                comments={comments[savedPost.post.id] || []}
                onAddComment={(content) => handleAddComment(savedPost.post.id, content)}
                postId={savedPost.post.id}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
