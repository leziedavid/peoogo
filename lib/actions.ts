'use server'

import { auth } from "@clerk/nextjs/server";
import { CreatePostInput } from "./types";
import prisma from "./db";

export async function createPost(data: CreatePostInput) {
  try {
    const { userId } = await auth();

    if(!userId) {
      return { success: false, message: 'Unauthorized' };
    }

    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: userId
      }
    })
    return { success: true, data: post };

  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, message: "Failed to create post" };
  }
}

export async function getPostForEdit(postId: string) {
  try {
    const { userId } = await auth();

    if(!userId) {
      return { success: false, message: 'Unauthorized' };
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true
      }
    });

    if(!post) {
      return { success: false, message: 'Post not found' };
    }

    if(post.authorId !== userId) {
      return { success: false, message: "You don't have permission to edit this post" };
    }

    return { success: true, data: post };

  } catch (error) {
    console.error("Error fetching post for edit:", error);
    return { success: false, message: "Failed to fetch post" };
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      include: {
        author: true
      }
    });
    if(!post) {
      return { success: false, message: 'Post not found' };
    }

    return { success: true, data: post };

  } catch (error) {
    console.error("Database Error", error);
    return null;
  }
}

// Edit post
export async function updatePost(postId: string, data: CreatePostInput) {
  try {
    const { userId } = await auth();

    if(!userId) {
      return { success: false, message: 'Unauthorized' };
    }

    // Verify ownership before updating
    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      select: {
        authorId: true
      }
    });

    if(!post) {
      return { success: false, message: 'Post not found' };
    }

    if(post.authorId !== userId) {
      return { success: false, message: "You don't have permission to edit this post" };
    }
    
    // Update the post
    await prisma.post.update({
      where: {
        id: postId
      },
      data: {
        title: data.title,
        content: data.content,
        updatedAt: new Date()
      }
    });
    return { success: true };

  } catch (error) {
    console.error("Error updating post:", error);
    return { success: false, message: "Failed to update post" };
  }
}

// Delete post
export async function deletePost(postId: string) {
  try {
    const { userId } = await auth();

    if(!userId) {
      return { success: false, message: 'Unauthorized' };
    }

    // Verify ownership before deleting
    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      select: {
        authorId: true
      }
    });

    if(!post) {
      return { success: false, message: 'Post not found' };
    }

    if(post.authorId !== userId) {
      return { success: false, message: "You don't have permission to edit this post" };
    }
    
    // Delete the post
    await prisma.post.delete({
      where: {
        id: postId
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, message: "Failed to delete post" };
  }
}