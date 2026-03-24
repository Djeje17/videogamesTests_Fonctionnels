import { Globe, ShieldCheck, Target, Users, Zap } from "lucide-react";
import "./infos.css";
const InfosPage = () => {
  const stats = [
    { label: "Employés", value: "450+", icon: <Users className="w-5 h-5" /> },
    { label: "Pays", value: "3", icon: <Globe className="w-5 h-5" /> },
    { label: "Projets finis", value: "12", icon: <Zap className="w-5 h-5" /> },
    {
      label: "Brevets Tech",
      value: "5",
      icon: <ShieldCheck className="w-5 h-5" />,
    },
  ];

  return (
    <div className="info">
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-8">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto mb-16 text-center">
          <div className="flex justify-center mb-4">
            <Target className="w-16 h-16 text-orange-500" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-white mb-4">
            À PROPOS D'<span className="text-orange-500">ARBALÈTE</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Depuis 2018, nous transformons l'énergie brute en expériences
            numériques millimétrées.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center hover:border-orange-500 transition-colors"
            >
              <div className="flex justify-center text-orange-500 mb-2">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-orange-500 pl-4">
              Notre Manifeste
            </h2>
            <p className="text-lg leading-relaxed text-slate-400">
              Le nom <strong>Arbalète</strong> n'a pas été choisi au hasard. Il
              symbolise la tension nécessaire avant la libération de la
              créativité. Nos studios ne se contentent pas de coder des jeux ;
              nous forgeons des mondes où la physique et l'émotion se
              rencontrent. Chaque ligne de code du <em>Quarrel Engine</em> est
              optimisée pour garantir une immersion totale.
            </p>
          </section>

          <section className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">
              Informations Légales
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-sm">
              <div>
                <h3 className="text-orange-500 font-semibold mb-2 italic">
                  Siège Social
                </h3>
                <p>Arbalète Studios SAS</p>
                <p>12 Rue du Carreau</p>
                <p>69003 Lyon, France</p>
                <p className="mt-2 text-slate-500">SIRET : 842 000 XXX 00012</p>
              </div>
              <div>
                <h3 className="text-orange-500 font-semibold mb-2 italic">
                  Contact Presse
                </h3>
                <p>media@arbalete-studios.com</p>
                <p>Relations Publiques : Marc Vigny</p>
                <p className="mt-4 text-slate-500">
                  © 2026 Arbalète Studios. Tous droits réservés.
                </p>
              </div>
            </div>
          </section>
        </main>

        <p className="max-w-6xl mx-auto mt-20 pt-8 border-t border-slate-900 text-center text-slate-600 text-xs">
          Propulsé par le Quarrel Engine v4.2.0-stable
        </p>
      </div>
    </div>
  );
};

export default InfosPage;
