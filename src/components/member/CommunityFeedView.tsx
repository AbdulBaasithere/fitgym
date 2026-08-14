import React, { useState } from 'react';
import { MessageSquare, Flame, Heart, Send, Sparkles, Award, Dumbbell, ThumbsUp, UserCheck } from 'lucide-react';
import { CommunityPost, Member } from '../../types';
import { storageService } from '../../services/storageService';

interface CommunityFeedViewProps {
  posts: CommunityPost[];
  currentMember: Member;
}

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({ posts, currentMember }) => {
  const [newContent, setNewContent] = useState('');
  const [postType, setPostType] = useState<CommunityPost['type']>('general');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    storageService.addCommunityPost(newContent.trim(), postType);
    setNewContent('');
  };

  const handleReact = (postId: string, reaction: 'like' | 'fistBump' | 'fire') => {
    storageService.reactToPost(postId, reaction);
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    storageService.addComment(postId, text);
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-emerald-400" />
          <span>FitPulse Gym Community & Hype Feed</span>
        </h2>
        <p className="text-xs text-slate-400">
          Cheer on your gym peers, celebrate personal records, and earn social XP
        </p>
      </div>

      {/* Create Post Card */}
      <div className="p-5 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <img src={currentMember.avatar} alt={currentMember.name} className="w-10 h-10 rounded-2xl object-cover border border-slate-700" />
          <div>
            <div className="text-xs font-bold text-white">{currentMember.name}</div>
            <div className="text-[10px] text-emerald-400 font-semibold">Share a milestone or shoutout</div>
          </div>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={2}
            placeholder="Crushed a new PR or 10-day streak? Share with the FitPulse gym community..."
            className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 resize-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs">
              {(['general', 'workout_pr', 'streak_milestone'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPostType(t)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    postType === t
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              id="btn-submit-community-post"
              type="submit"
              disabled={!newContent.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Update</span>
            </button>
          </div>
        </form>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-6 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
            {/* Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-2xl object-cover border border-slate-700" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{post.authorName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-semibold">{post.authorTier}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{post.timestamp}</span>
                </div>
              </div>

              {post.type === 'streak_milestone' && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-amber-400" />
                  Streak Milestone
                </span>
              )}
              {post.type === 'workout_pr' && (
                <span className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  New PR
                </span>
              )}
            </div>

            {/* Content */}
            {post.title && <div className="text-sm font-bold text-white">{post.title}</div>}
            <p className="text-xs text-slate-200 leading-relaxed">{post.content}</p>

            {/* Reaction Bar */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => handleReact(post.id, 'fire')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  post.userFired ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${post.userFired ? 'fill-amber-400' : ''}`} />
                <span>{post.fires}</span>
              </button>

              <button
                onClick={() => handleReact(post.id, 'fistBump')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  post.userFistBumped ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                }`}
              >
                <span>🙌</span>
                <span>{post.fistBumps} Fist Bumps</span>
              </button>

              <button
                onClick={() => handleReact(post.id, 'like')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  post.userLiked ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${post.userLiked ? 'fill-rose-400' : ''}`} />
                <span>{post.likes}</span>
              </button>
            </div>

            {/* Comments List */}
            {post.comments.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                {post.comments.map((comm) => (
                  <div key={comm.id} className="p-2.5 rounded-xl bg-slate-900/60 text-xs flex items-start gap-2.5">
                    <img src={comm.authorAvatar} alt={comm.authorName} className="w-6 h-6 rounded-lg object-cover" />
                    <div>
                      <div className="font-bold text-white text-[11px]">{comm.authorName}</div>
                      <p className="text-slate-300 text-[11px]">{comm.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={commentInputs[post.id] || ''}
                onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                placeholder="Write a congratulatory message..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleAddComment(post.id)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
