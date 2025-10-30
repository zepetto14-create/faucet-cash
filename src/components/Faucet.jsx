import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Faucet() {
  const COOLDOWN_MS = 5000; // 5 sekund cooldown
  const [balance, setBalance] = useState(10);
  const [displayBalance, setDisplayBalance] = useState(10);
  const [canClaim, setCanClaim] = useState(true);
  const [address, setAddress] = useState("0xDEMOADDRESS123456");
  const [history, setHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [copied, setCopied] = useState(false);
  const [animateToken, setAnimateToken] = useState(false);
  const [toast, setToast] = useState(null);
  const [copyEffect, setCopyEffect] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("faucet_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("faucet_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    let interval;
    if (!canClaim) {
      setTimeLeft(COOLDOWN_MS / 1000);
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanClaim(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [canClaim]);

  const handleClaim = () => {
    if (!canClaim || balance < 0.1) return;

    const amount = (Math.random() * 0.9 + 0.1).toFixed(2);
    const tx = {
      id: Math.random().toString(36).substring(2, 9),
      to: address,
      amount,
      time: new Date().toLocaleTimeString(),
    };

    setAnimateToken(true);
    setTimeout(() => setAnimateToken(false), 1000);

    setCanClaim(false);
    setBalance((b) => (parseFloat(b) - parseFloat(amount)).toFixed(2));

    const increment = parseFloat(amount) / 20;
    let steps = 0;
    const animInterval = setInterval(() => {
      setDisplayBalance((prev) => (parseFloat(prev) + increment).toFixed(2));
      steps++;
      if (steps >= 20) clearInterval(animInterval);
    }, 50);

    setHistory((h) => [tx, ...h].slice(0, 20));

    const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
    audio.play();

    setToast(`Odebrano ${amount} TOK!`);
    setTimeout(() => setToast(null), 2000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setCopyEffect(true);

      const audio = new Audio("https://www.soundjay.com/button/beep-07.mp3");
      audio.play();

      setTimeout(() => {
        setCopied(false);
        setCopyEffect(false);
      }, 1500);
    } catch (e) {
      console.error("Kopiowanie nie powiodło się", e);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 max-w-md mx-auto mt-10 text-center text-white shadow-2xl relative overflow-hidden">
      <h1 className="text-2xl font-bold mb-4">Faucet-Cash Demo</h1>

      <div className="mb-4">
        <label className="text-sm text-slate-300">Adres odbiorcy:</label>
        <div className="flex mt-2 gap-2 relative">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1 p-3 rounded-xl text-black font-mono focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
          <motion.button
            onClick={handleCopy}
            whileTap={{ scale: 0.9 }}
            animate={copyEffect ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="px-4 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-semibold shadow-md"
          >
            {copied ? "Skopiowano!" : "Kopiuj"}
          </motion.button>
        </div>
      </div>

      <p className="mb-4">
        Twój balans: <span className="font-mono">{displayBalance} TOK</span>
      </p>

      <motion.button
        onClick={handleClaim}
        disabled={!canClaim || balance < 0.1}
        whileTap={{ scale: 0.95 }}
        className={`px-6 py-3 rounded-xl font-semibold mb-4 w-full text-white transition-colors ${
          canClaim && balance >= 0.1
            ? "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-lg"
            : "bg-gray-700 cursor-not-allowed"
        }`}
      >
        {canClaim && balance >= 0.1 ? "Odbierz" : `Odczekaj... (${timeLeft}s)`}
      </motion.button>

      {animateToken && (
        <motion.div
          initial={{ y: 0, opacity: 1, scale: 1 }}
          animate={{ y: -100, opacity: 0, scale: 1.5 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute left-1/2 transform -translate-x-1/2 top-36 bg-yellow-400 w-6 h-6 rounded-full shadow-lg"
        />
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-lg font-semibold mb-2 mt-4">Historia transakcji</h2>
      <div className="max-h-48 overflow-y-auto">
        <AnimatePresence>
          {history.length === 0 && (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-slate-400"
            >
              Brak transakcji
            </motion.p>
          )}
          {history.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.3)" }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-white/20 backdrop-blur-md border border-white/10 rounded-2xl p-3 mb-2 text-sm font-mono shadow-inner cursor-pointer"
            >
              <div>To: {tx.to}</div>
              <div>Kwota: {tx.amount} TOK</div>
              <div className="text-xs text-slate-300">Czas: {tx.time}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
