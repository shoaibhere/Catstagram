import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/themeContext';
import { User } from 'lucide-react';
import { format } from 'date-fns';

const CommentSection = ({ postId, userId, onCommentCountChange }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
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

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/comment/add-comment/${postId}/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newComment }),
      });
      if (!response.ok) throw new Error('Failed to add comment');
      setNewComment('');
      await fetchComments();
      onCommentCountChange(comments.length + 1);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEditComment = async (commentId, newText) => {
    try {
      const response = await fetch(`http://localhost:8000/api/comment/edit-comment/${commentId}/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newText }),
      });
      if (!response.ok) throw new Error('Failed to edit comment');
      setEditingComment(null);
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

  return (
    <div className={`flex flex-col h-[350px] ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} rounded-lg overflow-hidden`}>
      <form onSubmit={handleAddComment} className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className={`w-full p-3 border rounded-lg ${
            isDarkTheme
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 placeholder-gray-400'
          }`}
        />
        <button
          type="submit"
          className={`w-full mt-2 p-3 ${
            isDarkTheme
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-semibold rounded-lg transition duration-300`}
        >
          Add Comment
        </button>
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
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <p className={`font-semibold ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>{comment.user.name}</p>
                  <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                    {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
                {editingComment === comment._id ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleEditComment(comment._id, e.target.text.value);
                  }}>
                    <input
                      name="text"
                      defaultValue={comment.text}
                      className={`w-full p-2 mt-2 border rounded ${isDarkTheme ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                    <div className="mt-2 flex justify-end space-x-2">
                      <button type="submit" className={`px-3 py-1 rounded ${isDarkTheme ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>Save</button>
                      <button onClick={() => setEditingComment(null)} className={`px-3 py-1 rounded ${isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'}`}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="mt-1">{comment.text}</p>
                    {comment.user._id === userId && (
                      <div className="mt-2 text-sm">
                        <button
                          onClick={() => setEditingComment(comment._id)}
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
                  </>
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

