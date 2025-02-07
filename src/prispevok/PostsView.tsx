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
import Box from "@mui/material/Box";

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

const PostsView = () => {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

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

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts: Post[] = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    loadPosts();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}> {/* Slightly smaller container width */}
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
                sx={{ width: "100%", objectFit: "cover", aspectRatio: "1 / 1" }}
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
                {/* Like & Comment buttons */}
                <Box display="flex" gap={1} sx={{ mt: 0, mb: 0 }}>
                  <IconButton size="small" onClick={() => toggleLike(post.id)}>
                    {likedPosts.has(post.id) ? (
                      <FavoriteIcon sx={{ fontSize: 24, color: "red" }} />
                    ) : (
                      <FavoriteBorderIcon
                        sx={{ fontSize: 24, color: "black" }}
                      />
                    )}
                  </IconButton>
                  <IconButton size="small">
                    <ChatBubbleOutlineIcon
                      sx={{ fontSize: 24, color: "black" }}
                    />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PostsView;
