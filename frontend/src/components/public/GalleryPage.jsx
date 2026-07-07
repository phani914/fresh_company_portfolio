import React, { useState } from 'react';
import { Camera, Video, Calendar, Eye, X } from 'lucide-react';

export default function GalleryPage({ gallery = [] }) {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = ["All", "Headquarters", "Events", "Hackathons", "Milestones"];

  const filteredAlbums = gallery.filter((album) =>
    activeTab === "All" || album.category === activeTab
  );

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-rose-400 block mb-2">Corporate Culture & Media</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
          Inside Micro Infoweb
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          Step into our state-of-the-art Silicon Valley engineering labs, annual AI hackathons, and global technology leadership summits.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === cat
                ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md shadow-rose-500/30 scale-105'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Albums Grid */}
      {filteredAlbums.length === 0 ? (
        <div className="glass-card text-center py-16">
          <Camera className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-300 text-base">No media albums found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAlbums.map((album) => (
            <div
              key={album.id}
              onClick={() => setSelectedItem(album)}
              className="glass-card !p-0 overflow-hidden flex flex-col group cursor-pointer border-slate-800 hover:border-rose-500/50"
            >
              <div className="relative h-64 overflow-hidden bg-slate-950">
                <img
                  src={album.cover_image_url}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <span className="absolute top-4 left-4 badge badge-rose !text-[10px] bg-slate-900/90 backdrop-blur-md">
                  {album.category}
                </span>

                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-lg">
                    <Eye className="w-6 h-6" />
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between -mt-4 relative z-10 bg-slate-900/95 backdrop-blur-xl rounded-t-2xl border-t border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    <span>{album.date_taken}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">
                    {album.title}
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
                    {album.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-rose-400">
                  <span>View Album Preview</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content !max-w-4xl !p-0 overflow-hidden bg-slate-950 border-slate-800" onClick={(e) => e.stopPropagation()}>
            <div className="relative max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedItem.cover_image_url}
                alt={selectedItem.title}
                className="w-full h-full object-contain max-h-[70vh]"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 bg-slate-900 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="badge badge-rose !text-xs">{selectedItem.category}</span>
                <span className="text-xs text-slate-400 font-mono">{selectedItem.date_taken}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
