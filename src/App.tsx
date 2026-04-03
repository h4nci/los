import React, { useState, useEffect } from 'react';
import { Home, Image, Shield, Menu, X, Plus, Trash2, ExternalLink, Users, Calendar, Heart, ChevronDown } from 'lucide-react';

interface Memory {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
}

type Page = 'home' | 'memories' | 'admin';

const defaultMemories: Memory[] = [
  {
    id: 1,
    title: 'İlk Toplantı',
    description: 'Takımın ilk kuruluş günü, her şeyin başladığı an...',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600&h=400',
    date: '2024-01-15'
  },
  {
    id: 2,
    title: 'Oyun Gecesi',
    description: 'Harika bir Among Us ve Valorant gecesi geçirdik!',
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=600&h=400',
    date: '2024-02-20'
  },
  {
    id: 3,
    title: 'Doğa Yürüyüşü',
    description: 'Gerçek hayatta da buluşup güzel bir yürüyüş yaptık.',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=600&h=400',
    date: '2024-03-10'
  }
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem('losangaras_memories');
    return saved ? JSON.parse(saved) : defaultMemories;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    description: '',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('losangaras_memories', JSON.stringify(memories));
  }, [memories]);

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      setShowLogin(false);
      setCurrentPage('admin');
    }
  };

  const handleAddMemory = () => {
    if (!newMemory.title || !newMemory.description) return;
    const imageUrl = newMemory.imageUrl || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600&h=400';
    const memory: Memory = {
      id: Date.now(),
      title: newMemory.title,
      description: newMemory.description,
      imageUrl: imageUrl,
      date: newMemory.date
    };
    setMemories([memory, ...memories]);
    setNewMemory({ title: '', description: '', imageUrl: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleDeleteMemory = (id: number) => {
    setMemories(memories.filter(m => m.id !== id));
    setDeleteConfirm(null);
  };

  const navItems = [
    { id: 'home' as Page, label: 'Ana Sayfa', icon: Home },
    { id: 'memories' as Page, label: 'Anılar', icon: Image },
  ];

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">LA</span>
            </div>
            <span className="text-xl font-bold text-white">Los Angaras</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
            <button
              onClick={() => isAdmin ? setCurrentPage('admin') : setShowLogin(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentPage === 'admin'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Shield size={18} />
              Admin
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
                currentPage === item.id
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { isAdmin ? setCurrentPage('admin') : setShowLogin(true); setMobileMenuOpen(false); }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
              currentPage === 'admin'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Shield size={20} />
            Admin
          </button>
        </div>
      )}
    </nav>
  );

  const HomePage = () => (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/30" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/25 mb-6">
              <span className="text-white font-bold text-5xl">LA</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Los Angaras
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
              En eğlenceli Discord topluluğu! Oyun, sohbet ve daha fazlası burada seni bekliyor.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://discord.gg/example"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/>
              </svg>
              Discord'a Katıl
              <ExternalLink size={18} />
            </a>
            <button
              onClick={() => setCurrentPage('memories')}
              className="inline-flex items-center justify-center gap-3 bg-slate-700/50 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition-all border border-slate-600"
            >
              <Image size={22} />
              Anıları Görüntüle
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-slate-400" size={32} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-8 text-center border border-slate-700">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-emerald-400" size={32} />
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">500+</h3>
              <p className="text-slate-400">Aktif Üye</p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-8 text-center border border-slate-700">
              <div className="w-16 h-16 bg-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="text-teal-400" size={32} />
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">1000+</h3>
              <p className="text-slate-400">Günlük Mesaj</p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-8 text-center border border-slate-700">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-cyan-400" size={32} />
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">1+</h3>
              <p className="text-slate-400">Yıllık Deneyim</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Neden Biz?</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Los Angaras ailesi olarak sunduğumuz olanaklarla en iyi deneyimi yaşatıyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Oyun Sunucuları', desc: 'Valormant, Minecraft, Among Us ve daha fazlası için özel sunucularımız var.', color: 'from-indigo-500 to-purple-600' },
              { title: 'Yetkili Ekip', desc: 'Dost canlısı ve yardımsever yetkililerimiz her zaman yanında.', color: 'from-emerald-500 to-teal-600' },
              { title: 'Etkinlikler', desc: 'Her hafta düzenlenen turnuvalar ve etkinliklerle ödüller kazanın.', color: 'from-orange-500 to-red-600' },
              { title: 'Sohbet Kanalları', desc: 'Farklı konularda sohbet edebileceğin özel kanallar.', color: 'from-pink-500 to-rose-600' },
              { title: 'Bot Entegrasyonları', desc: 'Müzik, seviye sistemi ve daha fazla özel botumuz.', color: 'from-cyan-500 to-blue-600' },
              { title: 'Güvenli Ortam', desc: 'Kurallara uygun, güvenli ve eğlenceli bir ortam.', color: 'from-yellow-500 to-orange-600' },
            ].map((item, index) => (
              <div key={index} className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all group">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">LA</span>
            </div>
            <span className="text-xl font-bold text-white">Los Angaras</span>
          </div>
          <p className="text-slate-400 mb-4">© 2024 Los Angaras. Tüm hakları saklıdır.</p>
          <a
            href="https://discord.gg/example"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/>
            </svg>
            Discord Sunucumuza Katılın
          </a>
        </div>
      </footer>
    </div>
  );

  const MemoriesPage = () => (
    <div className="pt-24 pb-16 min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Anılar</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Los Angaras ailesi olarak biriktirdiğimiz güzel anılar.
          </p>
        </div>

        {memories.length === 0 ? (
          <div className="text-center py-20">
            <Image className="mx-auto text-slate-600 mb-4" size={64} />
            <p className="text-slate-400 text-lg">Henüz anı eklenmemiş.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory) => (
              <div
                key={memory.id}
                className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-emerald-500/5"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={memory.imageUrl}
                    alt={memory.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm mb-3">
                    <Calendar size={14} />
                    {new Date(memory.date).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{memory.title}</h3>
                  <p className="text-slate-400">{memory.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const AdminPage = () => (
    <div className="pt-24 pb-16 min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Paneli</h1>
            <p className="text-slate-400">Anıları yönetin ve ekleyin.</p>
          </div>
          <button
            onClick={() => { setIsAdmin(false); setCurrentPage('home'); }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Çıkış Yap
          </button>
        </div>

        {/* Add New Memory */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Plus className="text-emerald-400" size={24} />
            Yeni Anı Ekle
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm mb-2">Başlık *</label>
              <input
                type="text"
                value={newMemory.title}
                onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Anı başlığını girin"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-2">Tarih</label>
              <input
                type="date"
                value={newMemory.date}
                onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm mb-2">Açıklama *</label>
              <textarea
                value={newMemory.description}
                onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                placeholder="Anıyı açıklayın"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm mb-2">Görsel URL (isteğe bağlı)</label>
              <input
                type="url"
                value={newMemory.imageUrl}
                onChange={(e) => setNewMemory({ ...newMemory, imageUrl: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="https://example.com/image.jpg"
              />
              {newMemory.imageUrl && (
                <div className="mt-3">
                  <img
                    src={newMemory.imageUrl}
                    alt="Preview"
                    className="w-40 h-24 object-cover rounded-lg border border-slate-700"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleAddMemory}
            disabled={!newMemory.title || !newMemory.description}
            className="mt-6 flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            <Plus size={20} />
            Anı Ekle
          </button>
        </div>

        {/* Memory List */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Image className="text-emerald-400" size={24} />
            Mevcut Anılar ({memories.length})
          </h2>

          {memories.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Henüz anı eklenmemiş.</p>
          ) : (
            <div className="space-y-4">
              {memories.map((memory) => (
                <div
                  key={memory.id}
                  className="flex flex-col sm:flex-row gap-4 bg-slate-800/50 rounded-xl p-4 border border-slate-700"
                >
                  <img
                    src={memory.imageUrl}
                    alt={memory.title}
                    className="w-full sm:w-32 h-32 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate">{memory.title}</h3>
                        <p className="text-slate-400 text-sm mt-1 line-clamp-2">{memory.description}</p>
                        <p className="text-slate-500 text-xs mt-2 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(memory.date).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {deleteConfirm === memory.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteMemory(memory.id)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm rounded-lg transition-colors"
                            >
                              Sil
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg transition-colors"
                            >
                              İptal
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(memory.id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Login Modal
  const LoginModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl p-8 w-full max-w-md border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Admin Girişi</h2>
          <button
            onClick={() => { setShowLogin(false); setAdminPassword(''); }}
            className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mb-6">
          <label className="block text-slate-300 text-sm mb-2">Şifre</label>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Şifrenizi girin"
          />
          <p className="text-slate-500 text-xs mt-2">Varsayılan şifre: admin123</p>
        </div>
        <button
          onClick={handleAdminLogin}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold py-3 rounded-xl transition-all"
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      {showLogin && <LoginModal />}
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'memories' && <MemoriesPage />}
      {currentPage === 'admin' && (isAdmin ? <AdminPage /> : <HomePage />)}
    </div>
  );
};

export default App;