/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Heart, 
  MessageCircle, 
  Instagram, 
  Share2, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  Send,
  X
} from "lucide-react";
import { INSTAGRAM_POSTS } from "../data";
import { InstagramPost } from "../types";

export default function InstagramGrid() {
  const [posts, setPosts] = useState<InstagramPost[]>(INSTAGRAM_POSTS);
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  
  // Simulated comments list kept in state for interactive posting
  const [postComments, setPostComments] = useState<Record<string, { author: string; text: string; time: string }[]>>({
    "inst-1": [
      { author: "Felipe_L", text: "Parabéns à M2 pela bela estrutura corporativa e governança!", time: "Hoje" },
      { author: "G_Ribeiro.Tax", text: "Excelente matéria sobre o recolhimento de impostos na importação.", time: "Ontem" }
    ],
    "inst-2": [
      { author: "Ana_Salles", text: "O painel de tecnologia fiscal foi realmente de altíssimo nível.", time: "Ontem" }
    ],
    "inst-3": [
      { author: "MarcioTrainee", text: "Desejo muito ingressar nessa equipe! Empresa diferenciada.", time: "2 dias atrás" }
    ],
    "inst-4": [
      { author: "CFO_Insights", text: "O Advisor mensal é leitura obrigatória para planejamento estratégico.", time: "3 dias atrás" }
    ]
  });

  const [inputComment, setInputComment] = useState("");

  const handleLike = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const wasLiked = likedPosts[postId];
    setLikedPosts((prev) => ({ ...prev, [postId]: !wasLiked }));
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            likes: wasLiked ? p.likes - 1 : p.likes + 1
          };
        }
        return p;
      })
    );

    // Also update selected post state if open
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          likes: wasLiked ? prev.likes - 1 : prev.likes + 1
        };
      });
    }
  };

  const submitComment = (postId: string) => {
    if (!inputComment.trim()) return;
    
    const newComment = {
      author: "visitante_m2",
      text: inputComment.trim(),
      time: "Agora mesmo"
    };

    setPostComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));
    
    // Increment comments count for visual card representation
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          return { ...p, comments: p.comments + 1 };
        }
        return p;
      })
    );

    setInputComment("");
  };

  return (
    <div className="w-full bg-stone-50 border-t border-stone-200 py-16 px-4 md:px-12" id="instagram-integration-section">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mb-5 shadow-sm text-white">
            <Instagram size={24} className="text-[#C5A059]" />
          </div>
          <h2 className="text-xl md:text-3xl font-bold tracking-tight text-stone-900 mb-3" style={{ fontFamily: "Montserrat" }}>
            Acompanhe nosso dia a dia
          </h2>
          <p className="text-sm md:text-base text-stone-600 max-w-2xl leading-relaxed">
            Siga a M2 Intelligence Tax nas redes sociais para insights de mercado em constante atualização, novidades regulatórias e coberturas exclusivas dos bastidores de nossa operação.
          </p>
        </div>

        {/* Instagrid list layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12" id="instagram-photos-grid">
          {posts.map((post) => {
            const isLiked = !!likedPosts[post.id];
            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group relative aspect-square bg-stone-200 rounded overflow-hidden cursor-pointer shadow-sm border border-stone-150 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                id={`instagram-card-${post.id}`}
              >
                <img
                  src={post.imageUrl}
                  alt="Post M2 Instagram"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />

                {/* Dark blur overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-4 text-white p-3 text-center">
                  <Instagram size={20} className="text-[#C5A059] absolute top-3 right-3 opacity-80" />
                  
                  <div className="flex items-center gap-5">
                    <button 
                      onClick={(e) => handleLike(post.id, e)}
                      className="flex items-center gap-1.5 hover:text-[#C5A059] transition-all"
                      id={`instagram-btn-cardlike-${post.id}`}
                    >
                      <Heart size={18} className={isLiked ? "fill-[#C5A059] text-[#C5A059]" : ""} />
                      <span className="font-mono text-sm font-semibold">{post.likes}</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-stone-100">
                      <MessageCircle size={18} />
                      <span className="font-mono text-sm font-semibold">{post.comments}</span>
                    </div>
                  </div>

                  <p className="text-[10px] md:text-xs leading-snug line-clamp-2 px-1 text-stone-200 italic font-light">
                    "{post.caption}"
                  </p>
                  
                  <span className="text-[10px] tracking-wider font-mono text-[#C5A059] uppercase font-bold border-t border-[#C5A059]/30 pt-1.5 w-11/12">
                    Ver Comentários
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Centralized Instagram external redirect banner */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-3.5 text-xs font-semibold tracking-widest uppercase hover:bg-[#C5A059] duration-300 transition-colors rounded-sm"
            style={{ letterSpacing: "0.15em" }}
            id="instagram-siga-btn"
          >
            <Instagram size={16} />
            SIGA NO INSTAGRAM
            <ExternalLink size={13} className="opacity-60" />
          </a>
          
          <button 
            onClick={() => {
              // Simulates direct messaging pop or a nice advisory recruitment dialogue
              alert("Direcionando canal de atendimento integrado M2 Intelligence no WhatsApp corporativo @m2_intelligence.");
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-stone-300 hover:border-black text-stone-700 hover:text-black px-8 py-3.5 text-xs font-semibold tracking-widest uppercase duration-200 transition-all rounded-sm bg-white"
            style={{ letterSpacing: "0.15em" }}
            id="instagram-chat-btn"
          >
            Fale Conosco
          </button>
        </div>
      </div>

      {/* Embedded interactive Instagram lightbox dialog for checking comments & likes inside standard browser modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="instagram-modal-backdrop">
          <div className="bg-white max-w-4xl w-full rounded shadow-2xl flex flex-col md:flex-row overflow-hidden border border-stone-200 animate-scale-up max-h-[90vh] md:max-h-[80vh]">
            
            {/* Post Image Left */}
            <div className="relative md:w-1/2 bg-stone-900 flex items-center justify-center aspect-video md:aspect-auto">
              <img
                src={selectedPost.imageUrl}
                alt="Instagram Feed Detailed"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover max-h-[40vh] md:max-h-full"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-[#C5A059] text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded border border-[#C5A059]/20 flex items-center gap-1">
                <Instagram size={10} />
                <span>M2 INSTAGRAM</span>
              </div>
            </div>

            {/* Post details & Interaction Right */}
            <div className="md:w-1/2 flex flex-col justify-between p-5 md:p-6 bg-white overflow-hidden">
              <div className="flex flex-col flex-grow overflow-y-auto">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-stone-900 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] text-xs font-bold">
                      M2
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 font-mono tracking-wider">m2_intelligence</h4>
                      <p className="text-[10px] text-stone-400 font-mono">São Paulo, Brasil</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-1 rounded-full text-stone-400 hover:text-black hover:bg-stone-100 transition-colors"
                    id="instagram-modal-close"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Caption scroll area */}
                <div className="text-xs text-stone-700 leading-relaxed font-light mb-4 bg-stone-50 p-3 rounded border border-stone-100">
                  <p className="font-normal text-stone-900 mb-1">m2_intelligence</p>
                  {selectedPost.caption}
                  <div className="mt-2 text-[10px] text-stone-400 font-mono">Postado {selectedPost.date}</div>
                </div>

                {/* Subheading comments */}
                <div className="flex items-center gap-1.5 text-stone-900 font-bold text-[11px] uppercase tracking-wider mb-2">
                  <MessageCircle size={13} className="text-[#C5A059]" />
                  <span>Comentários Interativos ({postComments[selectedPost.id]?.length || 0})</span>
                </div>

                {/* Comments List */}
                <div className="space-y-3 pr-1 overflow-y-auto max-h-[160px] md:max-h-[220px] mb-3">
                  {(postComments[selectedPost.id] || []).map((comm, idx) => (
                    <div key={idx} className="bg-stone-50/50 p-2.5 rounded border border-stone-100/40 text-xs">
                      <div className="flex items-center justify-between font-mono text-[10px] text-[#C5A059] mb-1 font-bold">
                        <span>@{comm.author}</span>
                        <span className="text-stone-400 font-normal">{comm.time}</span>
                      </div>
                      <p className="text-stone-700 text-[11px] leading-snug">{comm.text}</p>
                    </div>
                  ))}
                  
                  {(!postComments[selectedPost.id] || postComments[selectedPost.id].length === 0) && (
                    <p className="text-stone-400 text-xs italic text-center py-4">Seja o primeiro a comentar sobre este post corporativo.</p>
                  )}
                </div>
              </div>

              {/* Interaction Panel */}
              <div className="border-t border-stone-100 pt-4 mt-auto">
                <div className="flex items-center justify-between mb-3 text-stone-900">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(selectedPost.id)}
                      className="flex items-center gap-1.5 hover:text-red-500 text-stone-700 transition-colors"
                      id="instagram-modal-like-btn"
                    >
                      <Heart size={20} className={likedPosts[selectedPost.id] ? "fill-red-500 text-red-500 animate-pulse" : ""} />
                      <span className="font-mono text-xs font-bold text-stone-800">{selectedPost.likes} curtidas</span>
                    </button>
                    
                    <span className="flex items-center gap-1 text-xs text-stone-500 font-mono">
                      <Sparkles size={12} className="text-[#C5A059]" />
                      Tax Intelligence
                    </span>
                  </div>

                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(selectedPost.caption);
                      alert("Legenda copiada para a área de transferência!");
                    }}
                    className="p-1 text-stone-400 hover:text-black"
                    title="Copiar Legenda"
                    id="instagram-modal-share"
                  >
                    <Share2 size={16} />
                  </button>
                </div>

                {/* Custom comment input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputComment}
                    onChange={(e) => setInputComment(e.target.value)}
                    placeholder="Escreva um comentário público..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        submitComment(selectedPost.id);
                      }
                    }}
                    className="flex-grow p-2 text-xs border border-stone-200 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none rounded-sm font-sans"
                    id="instagram-comment-input"
                  />
                  
                  <button
                    onClick={() => submitComment(selectedPost.id)}
                    className="bg-[#C5A059] hover:bg-[#b08d48] text-white p-2 rounded-sm transition-colors cursor-pointer flex items-center justify-center shrink-0 w-9 h-9"
                    title="Enviar Comentário"
                    id="instagram-comment-send"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
