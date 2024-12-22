import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/themeContext';
import { User } from 'lucide-react';
import { format } from 'date-fns';
import CommentButton from './commentButton';

const CommentSection = ({ postId, userId, onCommentCountChange }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const { theme } = useTheme();

  const isDarkTheme = theme === 'dark';

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/comment/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data.comments);
      onCommentCountChange(data.comments.length);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCommentId) {
      await handleEditComment();
    } else {
      await handleAddComment();
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/comment/add-comment/${postId}/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: commentText }),
      });
      if (!response.ok) throw new Error('Failed to add comment');
      setCommentText('');
      await fetchComments();
      onCommentCountChange(comments.length + 1);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEditComment = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/comment/edit-comment/${editingCommentId}/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: commentText }),
      });
      if (!response.ok) throw new Error('Failed to edit comment');
      setCommentText('');
      setEditingCommentId(null);
      await fetchComments();
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleRemoveComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/comment/remove-comment/${commentId}/${userId}`, {
        method: 'GET',
      });
      if (!response.ok) throw new Error('Failed to remove comment');
      await fetchComments();
      onCommentCountChange(comments.length - 1);
    } catch (error) {
      console.error('Error removing comment:', error);
    }
  };

  const startEditing = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/comment/get-one/${commentId}`);
      if (!response.ok) throw new Error('Failed to fetch comment');
      const data = await response.json();
      setCommentText(data.comment.text);
      setEditingCommentId(commentId);
    } catch (error) {
      console.error('Error fetching comment for edit:', error);
    }
  };

  const cancelEditing = () => {
    setCommentText('');
    setEditingCommentId(null);
  };

  return (
    
    <div className={`flex flex-col h-[350px] ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} rounded-lg overflow-hidden`}>
      <form onSubmit={handleSubmit} className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col justify-center items-center">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={editingCommentId ? "Edit your comment..." : "Add a comment..."}
          className={`w-full h-20 p-3 border rounded-lg mb-2 resize-none ${
            isDarkTheme
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 placeholder-gray-400'
          }`}
          rows="3"
        />
        <div className="flex justify-between gap-2 items-center">
          {editingCommentId && (
            <button
              type="button"
              onClick={cancelEditing}
              className={`px-4 py-2 rounded-lg ${
                isDarkTheme ? 'bg-red-700 hover:bg-red-600' : 'bg-red-200 hover:bg-red-300'
              } transition duration-300`}
            >
              Cancel
            </button>
          )}
          <div className={editingCommentId ? '' : 'ml-auto'}>
            <CommentButton onClick={handleSubmit} text={editingCommentId ? 'Update' : 'Comment'} />
          </div>
        </div>
      </form>
      <ul className="space-y-4 mb-4 overflow-y-auto flex-grow p-4">
        {comments.map((comment) => (
          <li key={comment._id} className={`p-4 rounded-lg ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {comment.user.profileImage ? (
                  <img
                    src={comment.user.profileImage}
                    alt={`${comment.user.name}'s profile`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-300'}`}>
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-grow overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-semibold ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>{comment.user.name}</p>
                  <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                    {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
                <p className="mt-1 break-words">{comment.text}</p>
                {comment.user._id === userId && (
                  <div className="mt-2 text-sm">
                    <button
                      onClick={() => startEditing(comment._id)}
                      className={`mr-2 ${isDarkTheme ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveComment(comment._id)}
                      className={`${isDarkTheme ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default CommentSection;
