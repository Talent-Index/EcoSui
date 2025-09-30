import React, { useEffect, useMemo, useState } from 'react';
import { suiIntegration, formatSuiAddress } from '../utils/suiIntegration';

const WalletPanel: React.FC = () => {
  const [address, setAddress] = useState<string | null>(suiIntegration.getAddress());
  const [message, setMessage] = useState<string>('Hello from EcoSui!');
  const [signature, setSignature] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedId, setSelectedId] = useState<string>('');

  // Discover wallets on mount
  useEffect(() => {
    const list = suiIntegration.listWalletProviders().map(p => ({ id: p.id, name: p.name }));
    setProviders(list);
    // Prefer Sui Wallet if present, else first
    const preferred = list.find(p => p.id === 'suiWallet' || p.id === 'sui') || list[0];
    if (preferred) setSelectedId(preferred.id);
  }, []);

  const noWalletDetected = useMemo(() => providers.length === 0, [providers]);

  const onConnect = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await suiIntegration.connectWallet(selectedId || undefined);
      setAddress(res?.address || null);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const onDisconnect = async () => {
    setError(null);
    setBusy(true);
    try {
      await suiIntegration.disconnect();
      setAddress(null);
      setSignature(null);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const onSign = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await suiIntegration.signMessage(message);
      // Many wallets return { bytes, signature, address }. Render compactly.
      const sig = res?.signature || res?.sig || JSON.stringify(res);
      setSignature(typeof sig === 'string' ? sig : JSON.stringify(sig));
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const connected = suiIntegration.isConnected();

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 rounded-xl border bg-white/90 backdrop-blur p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Sui Wallet</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${connected ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="text-xs text-gray-600">
          Address: <span className="font-mono">{address ? formatSuiAddress(address) : '—'}</span>
        </div>
        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-xs text-gray-600">Wallet</label>
        {noWalletDetected ? (
          <div className="text-xs text-gray-700 bg-yellow-50 border border-yellow-200 rounded p-2">
            No Sui wallets detected. Install
            {' '}<a className="text-blue-600 underline" href="https://chromewebstore.google.com/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil" target="_blank" rel="noreferrer">Sui Wallet</a>
            {' '}or another Sui-compatible wallet, then refresh the page.
          </div>
        ) : (
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        {!connected ? (
          <button onClick={onConnect} disabled={busy || noWalletDetected} className="px-3 py-1.5 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
            {busy ? 'Connecting…' : (noWalletDetected ? 'Install Wallet' : 'Connect')}
          </button>
        ) : (
          <button onClick={onDisconnect} disabled={busy} className="px-3 py-1.5 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
            {busy ? '…' : 'Disconnect'}
          </button>
        )}
        <a
          href="https://docs.sui.io/extend/wallets/wallet-standard"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-blue-600 hover:underline"
          title="Sui Wallet Standard Documentation"
        >
          Docs
        </a>
      </div>

      <div className="space-y-2">
        <label className="block text-xs text-gray-600">Message to sign</label>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm"
          placeholder="Type a message"
        />
        <button onClick={onSign} disabled={!connected || busy} className="w-full px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
          {busy ? 'Signing…' : 'Sign Message'}
        </button>
      </div>

      {signature && (
        <div className="mt-3">
          <div className="text-xs text-gray-600 mb-1">Signature</div>
          <textarea readOnly value={signature} className="w-full h-20 border rounded p-2 text-[10px] font-mono" />
        </div>
      )}
    </div>
  );
};

export default WalletPanel;
