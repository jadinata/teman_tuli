import { useState, useEffect } from 'react';
import { Play, Download, Share2, BookOpen, Users, MessageSquare, Loader2, Volume2, VolumeX, Heart, Star } from 'lucide-react';

// Types
interface VideoData {
  id: string;
  url: string;
  duration: number;
  terms_translated: number;
  confidence: number;
  originalText: string;
  timestamp: string;
}

interface FinancialCategory {
  title: string;
  icon: string;
  topics: string[];
}

interface BisindoTerm {
  gesture: string;
  description: string;
}

// Mock API function - replace with actual sign language API
const generateSignVideo = async (text: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock video response - in real implementation, this would call actual API
  return {
    url: `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`,
    duration: 30,
    terms_translated: text.split(' ').length,
    confidence: 0.95
  };
};

// Financial topics database
const financialTopics: Record<string, FinancialCategory> = {
  'basic_banking': {
    title: 'Perbankan Dasar',
    icon: '🏦',
    topics: [
      'Cara membuka rekening bank',
      'Menggunakan ATM dengan aman',
      'Daftar mobile banking',
      'Cek saldo rekening',
      'Transfer uang antar bank'
    ]
  },
  'saving_tips': {
    title: 'Tips Menabung',
    icon: '💰',
    topics: [
      'Membuat dana darurat',
      'Cara budgeting bulanan',
      'Investasi untuk pemula',
      'Menabung untuk masa depan',
      'Mengatur pengeluaran harian'
    ]
  },
  'loan_education': {
    title: 'Edukasi Kredit',
    icon: '📋',
    topics: [
      'Pengajuan kredit pribadi',
      'Memahami bunga kredit',
      'Tips kredit rumah (KPR)',
      'Cara meningkatkan credit score',
      'Mengelola cicilan dengan baik'
    ]
  },
  'digital_banking': {
    title: 'Banking Digital',
    icon: '📱',
    topics: [
      'Keamanan internet banking',
      'Menggunakan e-wallet',
      'Transfer via QR code',
      'Pembayaran tagihan online',
      'Investasi digital'
    ]
  }
};

// BISINDO financial terms glossary
const bisindoGlossary: Record<string, BisindoTerm> = {
  'bank': { gesture: '🏦', description: 'Gerakan menunjuk gedung dengan kedua tangan' },
  'uang': { gesture: '💰', description: 'Gerakan menggosok jari seperti menghitung uang' },
  'menabung': { gesture: '📦', description: 'Gerakan memasukkan sesuatu ke wadah' },
  'kredit': { gesture: '🤝', description: 'Gerakan memberi dan menerima' },
  'investasi': { gesture: '📈', description: 'Gerakan naik dengan tangan' },
  'bunga': { gesture: '🌸', description: 'Gerakan mekar dengan jari-jari' },
  'transfer': { gesture: '➡️', description: 'Gerakan memindahkan dari kiri ke kanan' },
  'saldo': { gesture: '⚖️', description: 'Gerakan menimbang dengan kedua tangan' }
};

function App() {
  const [activeTab, setActiveTab] = useState<string>('generate');
  const [inputText, setInputText] = useState<string>('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<VideoData[]>([]);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [history, setHistory] = useState<VideoData[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('teman-tuli-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedHistory = localStorage.getItem('teman-tuli-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleGenerateVideo = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const video = await generateSignVideo(inputText);
      const newVideoData = {
        ...video,
        originalText: inputText,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      };
      
      setVideoData(newVideoData);
      
      // Add to history
      const newHistory = [newVideoData, ...history.slice(0, 9)]; // Keep last 10
      setHistory(newHistory);
      localStorage.setItem('teman-tuli-history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Terjadi kesalahan saat membuat video. Silakan coba lagi.');
    }
    setLoading(false);
  };

  const handleTopicSelect = (topic: string) => {
    setInputText(topic);
  };

  const toggleFavorite = (videoData: VideoData) => {
    const newFavorites = favorites.some(fav => fav.id === videoData.id)
      ? favorites.filter(fav => fav.id !== videoData.id)
      : [...favorites, videoData];
    
    setFavorites(newFavorites);
    localStorage.setItem('teman-tuli-favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (videoData: VideoData | null) => {
    return favorites.some(fav => fav.id === videoData?.id);
  };

  const shareVideo = async (videoData: VideoData) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Teman Tuli - Video Bahasa Isyarat',
          text: `Video bahasa isyarat untuk: "${videoData.originalText}"`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`Video bahasa isyarat: "${videoData.originalText}" - ${window.location.href}`);
      alert('Link berhasil disalin ke clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">🤟</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Teman Tuli</h1>
                <p className="text-sm text-gray-600">Financial Literacy with Sign Language</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <div className="text-sm text-gray-600">
                Bank Saqu Initiative
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm">
          {[
            { id: 'generate', label: 'Generate Video', icon: Play },
            { id: 'topics', label: 'Financial Topics', icon: BookOpen },
            { id: 'glossary', label: 'BISINDO Glossary', icon: MessageSquare },
            { id: 'community', label: 'Community', icon: Users }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {activeTab === 'generate' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                🎯 Generate Sign Language Video
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ketik pertanyaan atau topik keuangan:
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Contoh: Bagaimana cara membuka rekening bank?"
                    className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleGenerateVideo}
                    disabled={loading || !inputText.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Generate Video</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Topics */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">💡 Quick Topics:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Cara buka rekening',
                    'Transfer uang',
                    'Menabung rutin',
                    'Investasi aman'
                  ].map(topic => (
                    <button
                      key={topic}
                      onClick={() => handleTopicSelect(topic)}
                      className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Video Output Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  🎬 Sign Language Video
                </h2>
                {videoData && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleFavorite(videoData)}
                      className={`p-2 rounded-lg transition-colors ${
                        isFavorite(videoData) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite(videoData) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => shareVideo(videoData)}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {!videoData && !loading && (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Video akan muncul di sini</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="aspect-video bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
                    <p className="text-gray-600">Generating sign language video...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                  </div>
                </div>
              )}

              {videoData && (
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      controls
                      className="w-full h-full"
                      poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' font-family='Arial' font-size='16' fill='%236b7280'%3ESign Language Video%3C/text%3E%3C/svg%3E"
                    >
                      <source src={videoData.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Original Text:</span>
                        <p className="font-medium">{videoData.originalText}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <p className="font-medium">{videoData.duration}s</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Terms Translated:</span>
                        <p className="font-medium">{videoData.terms_translated}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Accuracy:</span>
                        <p className="font-medium">{(videoData.confidence * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button 
                      onClick={() => shareVideo(videoData)}
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'topics' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {Object.entries(financialTopics).map(([key, category]) => (
              <div key={key} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-3xl">{category.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
                </div>
                
                <div className="space-y-2">
                  {category.topics.map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleTopicSelect(topic);
                        setActiveTab('generate');
                      }}
                      className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'glossary' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              📚 BISINDO Financial Terms Glossary
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(bisindoGlossary).map(([term, data]) => (
                <div key={term} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl">{data.gesture}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 capitalize">{term}</h3>
                      <p className="text-sm text-gray-600 mt-1">{data.description}</p>
                      <button 
                        onClick={() => {
                          setInputText(`Jelaskan tentang ${term}`);
                          setActiveTab('generate');
                        }}
                        className="mt-2 text-blue-500 hover:text-blue-700 text-sm font-medium"
                      >
                        Generate Video →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-2xl font-bold text-blue-500">1,247</div>
                <div className="text-gray-600">Videos Generated</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-2xl font-bold text-green-500">856</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-2xl font-bold text-purple-500">423</div>
                <div className="text-gray-600">Terms Learned</div>
              </div>
            </div>

            {/* Recent Videos */}
            {history.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">📺 Your Recent Videos</h3>
                <div className="space-y-3">
                  {history.slice(0, 5).map((video) => (
                    <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{video.originalText}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(video.timestamp).toLocaleDateString('id-ID')} • {video.duration}s
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setVideoData(video);
                          setActiveTab('generate');
                        }}
                        className="text-blue-500 hover:text-blue-700 font-medium"
                      >
                        View →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorites */}
            {favorites.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">❤️ Your Favorites</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {favorites.map((video) => (
                    <div key={video.id} className="border border-gray-200 rounded-lg p-4">
                      <p className="font-medium text-gray-800">{video.originalText}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(video.timestamp).toLocaleDateString('id-ID')}
                      </p>
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => {
                            setVideoData(video);
                            setActiveTab('generate');
                          }}
                          className="flex-1 bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => toggleFavorite(video)}
                          className="px-3 py-1 text-red-500 border border-red-200 rounded text-sm hover:bg-red-50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Community Features */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">🤝 Join Our Community</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <Users className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-800">Discord Community</h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Connect with other deaf community members learning financial literacy
                  </p>
                  <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Join Discord
                  </button>
                </div>
                <div className="text-center">
                  <Star className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-800">Request New Terms</h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Suggest financial terms you'd like to see in sign language
                  </p>
                  <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                    Make Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              <strong>Teman Tuli</strong> - Financial Literacy Initiative by Bank Saqu
            </p>
            <p className="text-sm">
              Empowering the deaf community through accessible financial education 🤟❤️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
