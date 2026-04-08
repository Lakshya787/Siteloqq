import { useState, useEffect } from "react";

const WORDS = [
  "focus", "work", "discipline", "effort", "time", "grind", 
  "success", "future", "mindset", "goal", "achieve", 
  "unblock", "stop", "distraction", "energy", "progress"
];

const generateWords = (count) => {
  let arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return arr.join(" ");
};

export default function Popup() {
  const [site, setSite] = useState("");
  const [days, setDays] = useState(1);
  const [sites, setSites] = useState([]);
  
  const [unlockingDomain, setUnlockingDomain] = useState(null);
  const [targetText, setTargetText] = useState("");
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_SITES" }, (res) => {
      if (res) setSites(res);
    });
  }, []);

  const addSite = () => {
    let clean = site.trim().toLowerCase();
    
    clean = clean.replace(/^(https?:\/\/)/, '');
    clean = clean.replace(/^www\./, '');
    clean = clean.split('/')[0];

    if (!clean) return;

    chrome.runtime.sendMessage(
      { type: "ADD_SITE", payload: { domain: clean, days: Number(days) || 1 } },
      (updated) => {
        if (updated) setSites(updated);
      }
    );

    setSite("");
  };

  const startUnlock = (domain) => {
    setUnlockingDomain(domain);
    setTargetText(generateWords(500));
    setUserInput("");
  };

  const processUnlock = () => {
    chrome.runtime.sendMessage(
      { type: "REMOVE_SITE", payload: unlockingDomain },
      (updated) => {
        if (updated) setSites(updated);
        setUnlockingDomain(null);
        setTargetText("");
        setUserInput("");
      }
    );
  };

  const handleTyping = (e) => {
    const val = e.target.value;
    setUserInput(val);
    
    if (val === targetText) {
       processUnlock();
    }
  };
  
  const getDaysRemaining = (blockUntil) => {
    const diff = blockUntil - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // -------------------------------------------------------------
  // TYPING GAME VIEW
  // -------------------------------------------------------------
  if (unlockingDomain) {
    const targetWords = targetText.split(" ");
    let userWords = userInput.split(/\s+/);
    
    if (userInput === "") {
        userWords = [""];
    }

    return (
      <div className="w-[600px] min-h-[600px] bg-neo-bg text-neo-text p-8 flex flex-col font-sans transition-all duration-300">
        <div className="flex justify-between items-center mb-6 px-2">
          <h1 className="text-2xl font-extrabold text-neo-text tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 shadow-neo-inset rounded-full flex justify-center items-center">
                 <img src="/icon.svg" alt="Logo" className="w-5 h-5 opacity-80" />
             </div>
             Unlocking {unlockingDomain}
          </h1>
          <button 
            onClick={() => setUnlockingDomain(null)} 
            className="text-neo-text font-bold shadow-neo hover:shadow-neo-hover active:shadow-neo-inset-sm px-5 py-2 rounded-2xl hover:-translate-y-[1px] transition-all"
          >
            Cancel
          </button>
        </div>

        <div className="shadow-neo rounded-[32px] p-8 flex-1 flex flex-col gap-6">
            <div className="flex bg-neo-bg shadow-neo-inset-sm rounded-2xl p-4 gap-3 text-sm text-neo-text font-medium items-center">
                <span className="text-neo-alert font-extrabold text-xl">!</span>
                <p className="flex-1 leading-relaxed">
                    Type exactly 500 words to force an emergency unlock. Copy-pasting is strictly disabled.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto leading-relaxed font-sans font-medium text-[15px] p-6 shadow-neo-inset-deep rounded-3xl h-64 overflow-hidden">
            {targetWords.map((word, i) => {
                let color = "text-neo-muted";
                if (i < userWords.length - 1) {
                    color = userWords[i] === word ? "text-neo-success font-bold" : "text-neo-alert line-through decoration-neo-alert/50";
                } else if (i === userWords.length - 1 && userWords[i] !== "") {
                    color = word.startsWith(userWords[i]) ? "text-neo-accent font-bold" : "text-neo-alert";
                } else if (i === userWords.length - 1 && userWords[i] === "") {
                    color = "text-neo-text font-bold underline underline-offset-4 decoration-neo-accent/50";
                }
                return <span key={i} className={`mr-2.5 inline-block transition-colors duration-150 ${color}`}>{word}</span>;
            })}
            </div>

            <textarea
                value={userInput}
                onChange={handleTyping}
                onPaste={(e) => e.preventDefault()}
                spellCheck={false}
                className="w-full h-32 p-6 shadow-neo-inset-deep bg-neo-bg text-neo-text font-sans font-medium text-[15px] rounded-3xl outline-none focus:ring-2 focus:ring-neo-accent focus:ring-offset-2 focus:ring-offset-neo-bg resize-none transition-shadow duration-300"
                placeholder="Start typing..."
                autoFocus
            />
            
            <div className="flex justify-between items-center px-2">
                <span className="text-neo-muted text-xs font-bold uppercase tracking-widest">Progress</span>
                <div className="text-neo-text font-extrabold text-lg tracking-tight">
                    {userInput === "" ? 0 : Math.max(0, userWords.length - (userInput.endsWith(' ') ? 1 : 0))} <span className="text-neo-muted text-sm font-medium">/ 500 words</span>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // NORMAL BLOCK VIEW
  // -------------------------------------------------------------
  return (
    <div className="w-[360px] min-h-[500px] bg-neo-bg text-neo-text p-6 flex flex-col font-sans transition-all duration-300">
      <div className="flex justify-center items-center gap-3 mb-8 mt-4">
        <div className="w-12 h-12 shadow-neo-inset rounded-full flex justify-center items-center">
            <img src="/icon.svg" alt="Logo" className="w-6 h-6 opacity-80" />
        </div>
        <h1 className="text-3xl font-extrabold text-neo-text tracking-tighter">
          Siteloqq
        </h1>
      </div>

      <div className="shadow-neo rounded-[32px] p-6 mb-8 flex flex-col gap-4">
        <div>
            <label className="text-xs font-bold text-neo-muted uppercase tracking-widest block mb-2 px-1">Domain</label>
            <input
            value={site}
            onChange={(e) => setSite(e.target.value)}
            placeholder="e.g. reddit.com"
            className="w-full p-4 rounded-2xl bg-neo-bg shadow-neo-inset-deep outline-none focus:ring-2 focus:ring-neo-accent focus:ring-offset-2 focus:ring-offset-neo-bg transition-shadow text-sm font-medium placeholder-neo-muted"
            />
        </div>
        
        <div>
            <label className="text-xs font-bold text-neo-muted uppercase tracking-widest block mb-2 px-1">Block Duration</label>
            <div className="flex gap-4">
            <div className="relative flex-1">
                <input
                type="number"
                value={days}
                onChange={(e) => setDays(Math.max(1, e.target.value))}
                className="w-full p-4 pl-5 rounded-2xl bg-neo-bg shadow-neo-inset-deep outline-none focus:ring-2 focus:ring-neo-accent focus:ring-offset-2 focus:ring-offset-neo-bg transition-shadow text-sm font-medium"
                min="1"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neo-muted font-bold text-xs uppercase tracking-widest pointer-events-none">days</span>
            </div>
            <button
                onClick={addSite}
                className="bg-neo-accent text-white shadow-neo hover:shadow-neo-hover active:shadow-neo-inset hover:-translate-y-[1px] active:translate-y-[1px] font-bold px-6 rounded-2xl transition-all duration-300"
            >
                Lock
            </button>
            </div>
        </div>
      </div>

      <div className="text-xs font-bold text-neo-muted uppercase tracking-widest mb-4 px-2 flex justify-between items-center">
          <span>Active Blocks</span>
          <span className="bg-neo-bg shadow-neo-inset-sm px-2 py-1 rounded-full">{sites.length}</span>
      </div>

      <div className="flex-1 space-y-4 px-1 pb-4">
        {sites.length === 0 ? (
          <div className="shadow-neo-inset-sm rounded-[24px] flex flex-col items-center justify-center p-8 mt-2 opacity-80">
              <div className="w-16 h-16 shadow-neo rounded-full flex justify-center items-center mb-4 text-2xl text-neo-accent">
                 🛡️
              </div>
              <p className="text-neo-text font-bold text-sm">
                No active blocks. <br/> <span className="text-neo-muted font-medium">Time to focus!</span>
              </p>
          </div>
        ) : (
          sites.map((s, i) => (
            <div
              key={i}
              className="group flex justify-between items-center bg-neo-bg shadow-neo-sm hover:shadow-neo hover:-translate-y-[1px] transition-all duration-300 p-4 rounded-2xl"
            >
              <div className="flex flex-col overflow-hidden max-w-[170px]">
                <span className="text-[15px] font-extrabold truncate text-neo-text">
                  {s.domain || s}
                </span>
                <span className="text-xs font-bold text-neo-muted tracking-wide mt-1">
                  {s.blockUntil ? `${getDaysRemaining(s.blockUntil)} days left` : 'Legacy block'}
                </span>
              </div>
              <button
                onClick={() => startUnlock(s.domain || s)}
                className="px-4 py-2 text-xs font-extrabold uppercase tracking-widest bg-neo-bg shadow-neo text-neo-accent hover:shadow-neo-hover active:shadow-neo-inset-sm active:translate-y-[1px] rounded-xl transition-all duration-300 flex-shrink-0"
              >
                Unlock
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}